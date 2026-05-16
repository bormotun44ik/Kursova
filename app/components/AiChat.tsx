"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import FadeIn from "./FadeIn";
import SectionHeader from "./SectionHeader";
import Block from "./Block";
import Crosshairs from "./Crosshairs";
import { KB, bm25Search, type KBDoc } from "../lib/kb";
import { getGroqKey, setGroqKey } from "../lib/groq";

interface ScanItem {
  doc: KBDoc;
  score: number;
  state: "pending" | "scanning" | "hit" | "miss";
}

interface Message {
  role: "user" | "assistant";
  content: string;
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
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const k = getGroqKey();
    if (k) setApiKey(k);
  }, []);

  useEffect(() => {
    const container = chatContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages, streaming]);

  const saveKey = (k: string) => {
    setApiKey(k);
    setGroqKey(k);
  };

  const send = useCallback(async () => {
    const q = input.trim();
    if (!q || loading || !apiKey) return;
    setInput("");
    setLoading(true);
    setStreaming("");
    setPhase("scanning");
    setTopDocs([]);

    const userMsg: Message = { role: "user", content: q };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);

    // Animated scan
    const allScored: ScanItem[] = KB.map(doc => {
      const results = bm25Search(q, [doc]);
      return { doc, score: results.length > 0 ? results[0].score : 0, state: "pending" as const };
    });
    setScanItems(allScored);

    for (let i = 0; i < allScored.length; i++) {
      await new Promise(r => setTimeout(r, 60));
      setScanItems(prev => prev.map((item, j) => ({
        ...item,
        state: j < i ? (item.score > 0.3 ? "hit" : "miss") : j === i ? "scanning" : "pending",
      })));
    }
    const final = allScored.map(item => ({
      ...item,
      state: (item.score > 0.3 ? "hit" : "miss") as "hit" | "miss",
    }));
    setScanItems(final);

    setPhase("ranking");
    await new Promise(r => setTimeout(r, 300));

    const top = [...final].filter(s => s.state === "hit").sort((a, b) => b.score - a.score).slice(0, 5);
    setTopDocs(top);
    setPhase("generating");

    const context = top.length > 0
      ? top.map((r, i) => `[DOC ${i + 1}, score=${r.score.toFixed(2)}] ${r.doc.text}`).join("\n\n")
      : "No relevant documents found.";

    const systemPrompt = `You are a RAG demo assistant. Answer ONLY based on provided context.
KB has info about "Лилит" (a real RAG system) and RAG concepts.
Cite docs as [DOC N]. Answer in the question's language. Be concise.
If context lacks the answer, say so.

CONTEXT:
${context}`;

    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
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
        for (const line of decoder.decode(value).split("\n").filter(l => l.startsWith("data: "))) {
          const data = line.slice(6);
          if (data === "[DONE]") break;
          try {
            const delta = JSON.parse(data).choices?.[0]?.delta?.content;
            if (delta) { full += delta; setStreaming(full); }
          } catch { /* skip */ }
        }
      }

      setMessages(prev => [...prev, { role: "assistant", content: full }]);
      setStreaming("");
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Network error" }]);
    }
    setLoading(false);
    setPhase("done");
  }, [input, loading, messages, apiKey]);

  return (
    <section id="ai-chat" className="relative py-20 md:py-28 px-8 md:px-14">
      <Crosshairs />
      <div className="max-w-6xl mx-auto">
        <SectionHeader number="05.5" title="<strong>AI Chat</strong> — RAG в действие" sheet="—" />

        <FadeIn>
          <p className="text-bl-ink-3 text-sm mb-6 max-w-2xl leading-relaxed">
            Задай въпрос. Вдясно виж в реално време как системата сканира
            {KB.length} документа, ранжира резултатите и подава контекст
            към LLM (Llama 3.3 70B via Groq).
          </p>

          {!apiKey && (
            <div className="mb-6 flex gap-2 items-center flex-wrap">
              <span className="meta text-[9px] text-bl-ink-4 shrink-0">GROQ API KEY</span>
              <input
                type="password"
                placeholder="gsk_..."
                onBlur={e => { if (e.target.value.startsWith("gsk_")) saveKey(e.target.value); }}
                onKeyDown={e => { if (e.key === "Enter" && (e.target as HTMLInputElement).value.startsWith("gsk_")) saveKey((e.target as HTMLInputElement).value); }}
                className="flex-1 max-w-sm bg-bl-paper-deep border border-bl-cyan-ghost text-bl-ink text-xs px-3 py-2 outline-none focus:border-bl-cyan"
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
                  phase === "generating" ? "text-bl-warn" : phase === "done" ? "text-bl-ok" : "text-bl-ink-5"
                }`}>
                  {phase === "idle" ? "READY" : phase === "scanning" ? "SCANNING..." : phase === "ranking" ? "RANKING..." : phase === "generating" ? "GENERATING..." : "COMPLETE"}
                </span>
              </div>

              <div ref={chatContainerRef} className="min-h-[320px] max-h-[420px] overflow-y-auto mb-4 space-y-4">
                {messages.length === 0 && !streaming && (
                  <div className="text-bl-ink-5 text-xs text-center py-16">
                    {apiKey ? "Задай въпрос за RAG или системата Лилит." : "Въведи API ключ за да започнеш."}
                  </div>
                )}
                {messages.map((m, i) => (
                  <div key={i} className="flex gap-3">
                    <span className={`meta text-[9px] shrink-0 w-6 pt-0.5 ${m.role === "user" ? "text-bl-ink-4" : "text-bl-cyan"}`}>
                      {m.role === "user" ? "Q" : "A"}
                    </span>
                    <p className={`text-xs leading-relaxed flex-1 ${m.role === "user" ? "text-bl-ink" : "text-bl-ink-2"}`}>{m.content}</p>
                  </div>
                ))}
                {streaming && (
                  <div className="flex gap-3">
                    <span className="meta text-[9px] text-bl-cyan shrink-0 w-6 pt-0.5">A</span>
                    <p className="text-bl-ink-2 text-xs leading-relaxed flex-1">{streaming}<span className="text-bl-cyan">▮</span></p>
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
                  placeholder={apiKey ? "Въведи заявка..." : "Нужен API ключ"}
                  disabled={loading || !apiKey}
                  className="flex-1 bg-bl-paper-deep border border-bl-cyan-ghost text-bl-ink text-xs px-3 py-2.5 outline-none focus:border-bl-cyan transition-colors placeholder:text-bl-ink-5 disabled:opacity-40"
                  style={{ fontFamily: "var(--font-display)" }}
                />
                <button onClick={send} disabled={loading || !input.trim() || !apiKey} className="bl-cta !py-2.5 !text-[10px] disabled:opacity-30">send</button>
              </div>
            </div>

            {/* RIGHT — Live retrieval */}
            <div className="bg-bl-paper-edge p-5">
              <div className="flex items-center justify-between mb-4">
                <span className="meta text-[9px] text-bl-ink-4">SMART SEARCH · REAL-TIME</span>
                <span className="meta text-[9px] text-bl-ink-5">KB: {KB.length} docs</span>
              </div>

              {phase === "idle" ? (
                <div className="text-bl-ink-5 text-xs text-center py-16">Очакване на заявка...</div>
              ) : (
                <>
                  <div className="max-h-[260px] overflow-y-auto mb-4 space-y-0">
                    {scanItems.map((item, i) => (
                      <div
                        key={item.doc.id}
                        className={`flex items-center gap-2 py-1 px-2 text-[10px] border-b border-bl-cyan-trace transition-all duration-150 ${item.state === "scanning" ? "bg-bl-cyan/5" : ""}`}
                        style={{ fontFamily: "var(--font-meta)" }}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                          item.state === "pending" ? "bg-bl-ink-5" : item.state === "scanning" ? "bg-bl-warn animate-pulse" : item.state === "hit" ? "bg-bl-ok" : "bg-bl-ink-5/30"
                        }`} />
                        <span className={`w-4 shrink-0 ${item.state === "hit" ? "text-bl-cyan" : "text-bl-ink-5"}`}>{String(i + 1).padStart(2, "0")}</span>
                        <span className={`w-20 shrink-0 truncate ${item.state === "hit" ? "text-bl-ink-3" : "text-bl-ink-5/50"}`}>{item.doc.tags[0]}</span>
                        <div className="flex-1 h-1 bg-bl-cyan-trace rounded-full overflow-hidden">
                          <div className={`h-full rounded-full transition-all duration-300 ${item.state === "hit" ? "bg-bl-cyan" : item.state === "miss" ? "bg-bl-ink-5/20" : "bg-bl-cyan/30"}`} style={{ width: item.state !== "pending" ? `${Math.min(100, item.score * 25)}%` : "0%" }} />
                        </div>
                        <span className={`w-10 text-right shrink-0 ${item.state === "hit" ? "text-bl-cyan" : "text-bl-ink-5/40"}`}>{item.state !== "pending" ? item.score.toFixed(2) : "—"}</span>
                      </div>
                    ))}
                  </div>

                  {topDocs.length > 0 && (
                    <div className="border-t border-bl-cyan-ghost pt-3 mb-3">
                      <span className="meta text-[9px] text-bl-cyan block mb-2">TOP {topDocs.length} → CONTEXT</span>
                      {topDocs.map((d, i) => (
                        <div key={d.doc.id} className="text-[10px] mb-2" style={{ fontFamily: "var(--font-meta)" }}>
                          <span className="text-bl-cyan">DOC {i + 1}</span> <span className="text-bl-ink-4">{d.doc.tags.join(", ")}</span> <span className="text-bl-cyan float-right">{d.score.toFixed(3)}</span>
                          <p className="text-bl-ink-3 line-clamp-2 leading-relaxed mt-0.5">{d.doc.text}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="border-t border-bl-cyan-ghost pt-3">
                    <div className="flex gap-4 text-[9px]" style={{ fontFamily: "var(--font-meta)" }}>
                      {[
                        { id: "scan", label: "SCAN", active: ["scanning", "ranking", "generating", "done"] },
                        { id: "rank", label: "RANK", active: ["ranking", "generating", "done"] },
                        { id: "gen", label: "GEN", active: ["generating", "done"] },
                        { id: "ok", label: "OK", active: ["done"] },
                      ].map(step => (
                        <div key={step.id} className="flex items-center gap-1.5">
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            step.id === phase.slice(0, step.id.length) ? "bg-bl-warn animate-pulse" :
                            step.active.includes(phase) ? "bg-bl-ok" : "bg-bl-ink-5"
                          }`} />
                          <span className={step.active.includes(phase) ? "text-bl-ink-3" : "text-bl-ink-5"}>{step.label}</span>
                        </div>
                      ))}
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
