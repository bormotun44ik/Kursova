"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import FadeIn from "./FadeIn";
import SectionHeader from "./SectionHeader";
import Block from "./Block";
import Crosshairs from "./Crosshairs";

const KB = [
  { id: 1, text: "Лилит използва sqlite-vec за векторно търсене с Gemini Embedding (4096 измерения). Базата съдържа 16,500 записа. Hybrid search комбинира BM25 fulltext и cosine similarity.", tags: ["memory", "vector-db"] },
  { id: 2, text: "Knowledge Graph съдържа 3,376 ентитети и 8,085 връзки с 16 типа релации. BFS обходът позволява многостъпкови заявки.", tags: ["kg", "graph"] },
  { id: 3, text: "Plugin v3.2 автоматично инжектира top-8 резултата в промпта на LLM. Score threshold е 0.005. Budget-aware truncation.", tags: ["plugin"] },
  { id: 4, text: "Obsidian Vault е L2 cold storage, синхронизирано чрез Syncthing P2P. Git-версиониран с PARA структура. inotify watcher за 7ms.", tags: ["storage"] },
  { id: 5, text: "OpenClaw Gateway (порт 18789) е agent runtime на TypeScript/Node.js. Bootstrap configs: AGENTS.md, SOUL.md, IDENTITY.md.", tags: ["runtime"] },
  { id: 6, text: "Тристепенна архитектура: L0 (hot) — RAM, <30ms. L1 (warm) — sqlite-vec, 16.5K записа, hybrid BM25+cosine. L2 (cold) — Obsidian vault.", tags: ["architecture"] },
  { id: 7, text: "RAG (Retrieval-Augmented Generation) — подход при който LLM се свързва с външни знания. Lewis et al. (2020). Pipeline: Retrieve → Augment → Generate.", tags: ["rag"] },
  { id: 8, text: "BM25 е алгоритъм за пълнотекстово търсене базиран на TF-IDF с нормализация. k1=1.5, b=0.75. За точно съвпадение на думи.", tags: ["bm25"] },
  { id: 9, text: "Cosine similarity: sim(A,B) = (A·B)/(|A|×|B|). 1.0 = идентични, 0.0 = ортогонални. За семантично търсене и парафрази.", tags: ["cosine"] },
  { id: 10, text: "MMR (Maximal Marginal Relevance): MMR = λ·Sim(doc,query) − (1−λ)·max(Sim(doc,selected)). Балансира релевантност и разнообразие.", tags: ["mmr"] },
  { id: 11, text: "Embedding модел: Google Gemini-2-preview, 4096 измерения. ~$0.03 за 4,000 записа. Поддържа руски и български.", tags: ["embedding"] },
  { id: 12, text: "Chunking: фиксиран размер (N токена + overlap), семантично (параграфи), рекурсивно (глави → параграфи → изречения).", tags: ["chunking"] },
  { id: 13, text: "Graph RAG комбинира knowledge graphs с векторно търсене. Microsoft Research (2024). Hybrid vector+graph — стандарт.", tags: ["graph-rag"] },
  { id: 14, text: "Telegram бот е основният UI на Лилит. Streaming режим активен. 291 стикера. Конфигурация в openclaw.json.", tags: ["telegram"] },
  { id: 15, text: "Heartbeat рутини: idle consolidation (3h), reflection cycle (4h), deep harvest (24h). Proactive learning неактивен.", tags: ["heartbeat"] },
];

function bm25Score(query: string, text: string): number {
  const terms = query.toLowerCase().split(/\s+/).filter(t => t.length > 2);
  if (terms.length === 0) return 0;
  const N = KB.length;
  const avgDl = KB.reduce((s, d) => s + d.text.length, 0) / N;
  const dl = text.length;
  let score = 0;
  terms.forEach(t => {
    const df = KB.filter(d => d.text.toLowerCase().includes(t)).length;
    const tf = (text.toLowerCase().match(new RegExp(t, "g")) || []).length;
    const idf = Math.log((N - df + 0.5) / (df + 0.5) + 1);
    score += idf * (tf * 2.5) / (tf + 1.5 * (1 - 0.75 + 0.75 * dl / avgDl));
  });
  return score;
}

interface ScanItem {
  doc: typeof KB[0];
  score: number;
  state: "pending" | "scanning" | "hit" | "miss";
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

function getGroqKey(): string {
  if (typeof window === "undefined") return "";
  const params = new URLSearchParams(window.location.search);
  return params.get("k") || localStorage.getItem("groq_key") || "";
}


export default function AiChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState("");
  const [scanItems, setScanItems] = useState<ScanItem[]>([]);
  const [phase, setPhase] = useState<"idle" | "scanning" | "ranking" | "generating" | "done">("idle");
  const [topDocs, setTopDocs] = useState<ScanItem[]>([]);
  const [apiKey, setApiKey] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const scanRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const k = getGroqKey();
    if (k) { setApiKey(k); localStorage.setItem("groq_key", k); }
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streaming]);

  const send = useCallback(async () => {
    const q = input.trim();
    if (!q || loading) return;
    setInput("");
    setLoading(true);
    setStreaming("");
    setPhase("scanning");
    setTopDocs([]);

    const userMsg: Message = { role: "user", content: q };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);

    // Animated scan — score each doc with delay
    const scored: ScanItem[] = KB.map(doc => ({
      doc,
      score: bm25Score(q, doc.text),
      state: "pending" as const,
    }));
    setScanItems(scored);

    // Animate scanning
    for (let i = 0; i < scored.length; i++) {
      await new Promise(r => setTimeout(r, 80));
      setScanItems(prev => prev.map((item, j) => ({
        ...item,
        state: j < i ? (item.score > 0.3 ? "hit" : "miss") : j === i ? "scanning" : "pending",
      })));
    }
    // Final state
    const final = scored.map(item => ({
      ...item,
      state: (item.score > 0.3 ? "hit" : "miss") as "hit" | "miss",
    }));
    setScanItems(final);

    // Ranking phase
    setPhase("ranking");
    await new Promise(r => setTimeout(r, 400));

    const top = [...final]
      .filter(s => s.state === "hit")
      .sort((a, b) => b.score - a.score)
      .slice(0, 4);
    setTopDocs(top);

    // Generate
    setPhase("generating");

    const context = top.length > 0
      ? top.map((r, i) => `[DOC ${i + 1}, score=${r.score.toFixed(2)}] ${r.doc.text}`).join("\n\n")
      : "No relevant documents found.";

    const systemPrompt = `You are a RAG demonstration assistant. Answer based ONLY on the provided context.
The knowledge base contains info about "Лилит" (a real RAG system) and general RAG concepts.
Cite which document(s) you used ([DOC N]). Answer in the same language as the question. Be concise.
If context doesn't contain the answer, say so.

RETRIEVED CONTEXT:
${context}`;

    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: systemPrompt },
            ...newMessages.map(m => ({ role: m.role, content: m.content })),
          ],
          stream: true,
          max_tokens: 800,
          temperature: 0.3,
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        setMessages(prev => [...prev, { role: "assistant", content: `Error: ${res.status}` }]);
        setLoading(false);
        setPhase("done");
        return;
      }

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let full = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        const lines = chunk.split("\n").filter(l => l.startsWith("data: "));
        for (const line of lines) {
          const data = line.slice(6);
          if (data === "[DONE]") break;
          try {
            const parsed = JSON.parse(data);
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) { full += delta; setStreaming(full); }
          } catch { /* skip */ }
        }
      }

      setMessages(prev => [...prev, { role: "assistant", content: full }]);
      setStreaming("");
    } catch (err) {
      setMessages(prev => [...prev, { role: "assistant", content: `Network error` }]);
    }
    setLoading(false);
    setPhase("done");
  }, [input, loading, messages, apiKey]);

  return (
    <section id="ai-chat" className="relative py-20 md:py-28 px-8 md:px-14 bg-bl-paper-edge">
      <Crosshairs />
      <div className="max-w-6xl mx-auto">
        <SectionHeader number="05.5" title="<strong>AI Chat</strong> — RAG в действие" sheet="—" />

        <FadeIn>
          <p className="text-bl-ink-3 text-sm mb-8 max-w-2xl leading-relaxed">
            Задай въпрос. Вдясно виж в реално време как системата сканира
            knowledge base (15 документа), ранжира резултатите и подава контекст
            към LLM (Llama 3.3 70B via Groq).
          </p>

          {/* API key input */}
          {!apiKey && (
            <div className="mb-6 flex gap-2 items-center">
              <span className="meta text-[9px] text-bl-ink-4 shrink-0">GROQ API KEY</span>
              <input
                type="password"
                placeholder="gsk_..."
                onChange={e => {
                  const v = e.target.value.trim();
                  if (v.startsWith("gsk_")) { setApiKey(v); localStorage.setItem("groq_key", v); }
                }}
                className="flex-1 max-w-md bg-bl-paper-deep border border-bl-cyan-ghost text-bl-ink text-xs px-3 py-2 outline-none focus:border-bl-cyan"
                style={{ fontFamily: "var(--font-display)" }}
              />
              <span className="text-bl-ink-5 text-[10px]" style={{ fontFamily: "var(--font-meta)" }}>
                or pass ?k=gsk_... in URL
              </span>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-px bg-bl-cyan-ghost">
            {/* LEFT — Chat */}
            <div className="bg-bl-paper-edge p-5">
              <div className="flex items-center justify-between mb-4">
                <span className="meta text-[9px] text-bl-ink-4">CHAT · LLAMA-3.3-70B</span>
                <span className={`meta text-[9px] ${
                  phase === "generating" ? "text-bl-warn" :
                  phase === "done" ? "text-bl-ok" : "text-bl-ink-5"
                }`}>
                  {phase === "idle" ? "READY" :
                   phase === "scanning" ? "SCANNING KB..." :
                   phase === "ranking" ? "RANKING..." :
                   phase === "generating" ? "GENERATING..." : "COMPLETE"}
                </span>
              </div>

              <div className="min-h-[320px] max-h-[420px] overflow-y-auto mb-4 space-y-4">
                {messages.length === 0 && !streaming && (
                  <div className="text-bl-ink-5 text-xs text-center py-16 leading-relaxed">
                    Задай въпрос за RAG, Лилит,<br />или компонентите на системата.
                  </div>
                )}

                {messages.map((m, i) => (
                  <div key={i} className="flex gap-3">
                    <span className={`meta text-[9px] shrink-0 w-6 pt-0.5 ${
                      m.role === "user" ? "text-bl-ink-4" : "text-bl-cyan"
                    }`}>
                      {m.role === "user" ? "Q" : "A"}
                    </span>
                    <p className={`text-xs leading-relaxed flex-1 ${
                      m.role === "user" ? "text-bl-ink" : "text-bl-ink-2"
                    }`}>
                      {m.content}
                    </p>
                  </div>
                ))}

                {streaming && (
                  <div className="flex gap-3">
                    <span className="meta text-[9px] text-bl-cyan shrink-0 w-6 pt-0.5">A</span>
                    <p className="text-bl-ink-2 text-xs leading-relaxed flex-1">
                      {streaming}<span className="text-bl-cyan">▮</span>
                    </p>
                  </div>
                )}

                {loading && !streaming && phase === "generating" && (
                  <div className="flex gap-3">
                    <span className="meta text-[9px] text-bl-cyan shrink-0 w-6 pt-0.5">A</span>
                    <span className="pulse-dot" />
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              <div className="flex gap-2 border-t border-bl-cyan-ghost pt-3">
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && send()}
                  placeholder="Въведи заявка..."
                  disabled={loading}
                  className="flex-1 bg-bl-paper-deep border border-bl-cyan-ghost text-bl-ink text-xs px-3 py-2.5 outline-none focus:border-bl-cyan transition-colors placeholder:text-bl-ink-5 disabled:opacity-50"
                  style={{ fontFamily: "var(--font-display)" }}
                />
                <button
                  onClick={send}
                  disabled={loading || !input.trim()}
                  className="bl-cta !py-2.5 !text-[10px] disabled:opacity-30"
                >
                  send
                </button>
              </div>
            </div>

            {/* RIGHT — Live retrieval */}
            <div className="bg-bl-paper-edge p-5" ref={scanRef}>
              <div className="flex items-center justify-between mb-4">
                <span className="meta text-[9px] text-bl-ink-4">SMART SEARCH · REAL-TIME</span>
                <span className="meta text-[9px] text-bl-ink-5">
                  KB: {KB.length} docs
                </span>
              </div>

              {phase === "idle" ? (
                <div className="text-bl-ink-5 text-xs text-center py-16">
                  Очакване на заявка...
                </div>
              ) : (
                <>
                  {/* Scan visualization */}
                  <div className="max-h-[260px] overflow-y-auto mb-4 space-y-0">
                    {scanItems.map((item, i) => (
                      <div
                        key={item.doc.id}
                        className={`flex items-center gap-2 py-1 px-2 text-[10px] border-b border-bl-cyan-trace transition-all duration-200 ${
                          item.state === "scanning" ? "bg-bl-cyan/5" : ""
                        }`}
                        style={{ fontFamily: "var(--font-meta)" }}
                      >
                        {/* Status indicator */}
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 transition-colors ${
                          item.state === "pending" ? "bg-bl-ink-5" :
                          item.state === "scanning" ? "bg-bl-warn animate-pulse" :
                          item.state === "hit" ? "bg-bl-ok" : "bg-bl-ink-5/30"
                        }`} />

                        {/* Doc ID */}
                        <span className={`w-4 shrink-0 ${
                          item.state === "hit" ? "text-bl-cyan" : "text-bl-ink-5"
                        }`}>
                          {String(i + 1).padStart(2, "0")}
                        </span>

                        {/* Tags */}
                        <span className={`w-16 shrink-0 truncate ${
                          item.state === "hit" ? "text-bl-ink-3" : "text-bl-ink-5/50"
                        }`}>
                          {item.doc.tags[0]}
                        </span>

                        {/* Score bar */}
                        <div className="flex-1 h-1 bg-bl-cyan-trace rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              item.state === "hit" ? "bg-bl-cyan" :
                              item.state === "miss" ? "bg-bl-ink-5/20" : "bg-bl-cyan/30"
                            }`}
                            style={{ width: item.state !== "pending" ? `${Math.min(100, item.score * 30)}%` : "0%" }}
                          />
                        </div>

                        {/* Score number */}
                        <span className={`w-10 text-right shrink-0 ${
                          item.state === "hit" ? "text-bl-cyan" : "text-bl-ink-5/40"
                        }`}>
                          {item.state !== "pending" ? item.score.toFixed(2) : "—"}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Top results */}
                  {topDocs.length > 0 && (
                    <div className="border-t border-bl-cyan-ghost pt-3">
                      <span className="meta text-[9px] text-bl-cyan block mb-2">
                        TOP {topDocs.length} → INJECTED INTO PROMPT
                      </span>
                      <div className="space-y-2">
                        {topDocs.map((d, i) => (
                          <div key={d.doc.id} className="text-[10px]" style={{ fontFamily: "var(--font-meta)" }}>
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="text-bl-cyan">DOC {i + 1}</span>
                              <span className="text-bl-ink-4">{d.doc.tags.join(", ")}</span>
                              <span className="text-bl-cyan ml-auto">{d.score.toFixed(3)}</span>
                            </div>
                            <p className="text-bl-ink-3 line-clamp-2 leading-relaxed">
                              {d.doc.text}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Pipeline status */}
                  <div className="border-t border-bl-cyan-ghost pt-3 mt-3">
                    <div className="flex gap-4 text-[9px]" style={{ fontFamily: "var(--font-meta)" }}>
                      {[
                        { id: "scan", label: "SCAN", phases: ["scanning", "ranking", "generating", "done"] },
                        { id: "rank", label: "RANK", phases: ["ranking", "generating", "done"] },
                        { id: "gen", label: "GEN", phases: ["generating", "done"] },
                        { id: "done", label: "OK", phases: ["done"] },
                      ].map(step => {
                        const active = step.phases.includes(phase);
                        const current = step.id === "scan" && phase === "scanning" ||
                                       step.id === "rank" && phase === "ranking" ||
                                       step.id === "gen" && phase === "generating" ||
                                       step.id === "done" && phase === "done";
                        return (
                          <div key={step.id} className="flex items-center gap-1.5">
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              current ? "bg-bl-warn animate-pulse" :
                              active ? "bg-bl-ok" : "bg-bl-ink-5"
                            }`} />
                            <span className={active ? "text-bl-ink-3" : "text-bl-ink-5"}>
                              {step.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
