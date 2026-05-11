"use client";
import { useState, useEffect, useRef } from "react";
import FadeIn from "./FadeIn";
import SectionHeader from "./SectionHeader";

const chunks = [
  { id: 1, text: "Лилит използва sqlite-vec за векторно търсене с Gemini Embedding (4096 измерения). Hybrid search комбинира BM25 fulltext и cosine similarity.", tags: ["memory", "search"], embedding: [0.82, 0.15, 0.73] },
  { id: 2, text: "Knowledge Graph съдържа 3,376 ентитети и 8,085 връзки с 16 типа релации. BFS обходът позволява многостъпкови заявки.", tags: ["kg", "graph"], embedding: [0.45, 0.88, 0.32] },
  { id: 3, text: "Plugin v3.2 автоматично инжектира top-8 резултата в промпта на LLM с budget-aware truncation при score > 0.005.", tags: ["plugin", "retrieval"], embedding: [0.71, 0.22, 0.91] },
  { id: 4, text: "Obsidian Vault е L2 cold storage, синхронизиран чрез Syncthing P2P. Git-версиониран, PARA структура с inotify watcher.", tags: ["obsidian", "storage"], embedding: [0.12, 0.67, 0.54] },
  { id: 5, text: "OpenClaw Gateway (:18789) е agent runtime. Bootstrap configs: AGENTS.md, SOUL.md, IDENTITY.md, HEARTBEAT.md.", tags: ["runtime", "config"], embedding: [0.55, 0.41, 0.28] },
  { id: 6, text: "Telegram бот е основният потребителски интерфейс. Streaming режим е активиран. Стикери от 3 пакета (291 file_id).", tags: ["telegram", "ui"], embedding: [0.33, 0.59, 0.77] },
  { id: 7, text: "Embedding модел: Gemini-2-preview (4096d) чрез OpenAI-compatible endpoint. Цена: ~$0.03 за 4K записа.", tags: ["embedding", "cost"], embedding: [0.88, 0.11, 0.65] },
  { id: 8, text: "Heartbeat рутини: idle consolidation (3h), reflection cycle (4h), deep harvest (24h). Proactive learning неактивен от 12 април.", tags: ["heartbeat", "maintenance"], embedding: [0.21, 0.74, 0.43] },
];

const presetQueries = [
  "Как работи търсенето в Лилит?",
  "Какво е Knowledge Graph?",
  "Какъв embedding модел се използва?",
  "Как се синхронизира Obsidian vault?",
];

function cosineSim(a: number[], b: number[]): number {
  const dot = a.reduce((s, v, i) => s + v * b[i], 0);
  const magA = Math.sqrt(a.reduce((s, v) => s + v * v, 0));
  const magB = Math.sqrt(b.reduce((s, v) => s + v * v, 0));
  return dot / (magA * magB);
}

const queryEmbeddings: Record<string, number[]> = {
  "Как работи търсенето в Лилит?": [0.80, 0.18, 0.75],
  "Какво е Knowledge Graph?": [0.43, 0.90, 0.35],
  "Какъв embedding модел се използва?": [0.85, 0.13, 0.68],
  "Как се синхронизира Obsidian vault?": [0.14, 0.65, 0.58],
};

const llmResponses: Record<string, string> = {
  "Как работи търсенето в Лилит?":
    "Лилит използва hybrid search подход, комбиниращ BM25 fulltext търсене и cosine similarity върху 4096-измерни Gemini Embedding вектори в sqlite-vec база данни. Plugin v3.2 автоматично извлича top-8 резултата и ги инжектира в промпта на Claude Sonnet.",
  "Какво е Knowledge Graph?":
    "Knowledge Graph в Лилит е структурирано хранилище от 3,376 ентитети и 8,085 връзки с 16 типа релации (uses, imports, depends_on и др.). Поддържа BFS обход за многостъпкови заявки — например, от ентитет «Лилит» до конкретни технологии.",
  "Какъв embedding модел се използва?":
    "Системата използва Google Gemini-2-preview embedding модел с 4096 измерения, достъпен чрез OpenAI-compatible endpoint. Цената е ~$0.03 за обработка на 4,000 записа при 1,500 req/min rate limit.",
  "Как се синхронизира Obsidian vault?":
    "Obsidian Vault (L2 cold storage) се синхронизира чрез Syncthing — peer-to-peer протокол без централен сървър. Vault-ът е git-версиониран и следва PARA структура. inotify watcher засича промени и тригерира re-indexing в agentmemory.",
};

export default function RagPlayground() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<
    { chunk: (typeof chunks)[0]; score: number }[]
  >([]);
  const [response, setResponse] = useState("");
  const [phase, setPhase] = useState<"idle" | "searching" | "augmenting" | "generating" | "done">("idle");
  const [typedResponse, setTypedResponse] = useState("");
  const responseRef = useRef("");

  const runSearch = (q: string) => {
    setQuery(q);
    setResults([]);
    setResponse("");
    setTypedResponse("");
    setPhase("searching");

    const qEmbed = queryEmbeddings[q] || [
      Math.random(),
      Math.random(),
      Math.random(),
    ];

    setTimeout(() => {
      const scored = chunks
        .map((c) => ({ chunk: c, score: cosineSim(qEmbed, c.embedding) }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);
      setResults(scored);
      setPhase("augmenting");

      setTimeout(() => {
        setPhase("generating");
        const fullResponse =
          llmResponses[q] ||
          `Базирайки се на извлечените ${scored.length} документа, системата комбинира информация от паметта за генериране на точен отговор. Hybrid search (BM25 + cosine) осигурява високо качество на резултатите.`;
        responseRef.current = fullResponse;

        let i = 0;
        const typeInterval = setInterval(() => {
          i++;
          setTypedResponse(fullResponse.slice(0, i));
          if (i >= fullResponse.length) {
            clearInterval(typeInterval);
            setPhase("done");
          }
        }, 15);
      }, 800);
    }, 1000);
  };

  return (
    <section id="playground" className="py-28 px-6">
      <div className="max-w-5xl mx-auto">
        <SectionHeader number="04.5" title="RAG Playground — Демонстрация" />

        <FadeIn>
          <p className="text-text-muted mb-8 max-w-2xl">
            Интерактивна демонстрация на RAG процеса. Избери въпрос или напиши
            свой — и наблюдавай как системата извлича, обогатява и генерира
            отговор.
          </p>

          {/* Query input */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2 mb-4">
              {presetQueries.map((q) => (
                <button
                  key={q}
                  onClick={() => runSearch(q)}
                  className={`text-sm px-4 py-2 rounded-full border transition-all ${
                    query === q
                      ? "bg-accent text-white border-accent"
                      : "border-border text-text-muted hover:border-accent/50 hover:text-text"
                  }`}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Pipeline status */}
          {phase !== "idle" && (
            <div className="flex items-center gap-3 mb-8">
              {(["searching", "augmenting", "generating"] as const).map(
                (p, i) => (
                  <div key={p} className="flex items-center gap-2">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                        phase === p
                          ? "bg-accent text-white animate-pulse"
                          : ["searching", "augmenting", "generating"].indexOf(phase) > i ||
                            phase === "done"
                          ? "bg-accent/20 text-accent"
                          : "bg-surface text-text-dim border border-border"
                      }`}
                    >
                      {i + 1}
                    </div>
                    <span
                      className={`text-sm hidden sm:inline ${
                        phase === p ? "text-accent font-medium" : "text-text-dim"
                      }`}
                    >
                      {p === "searching"
                        ? "Извличане"
                        : p === "augmenting"
                        ? "Обогатяване"
                        : "Генериране"}
                    </span>
                    {i < 2 && (
                      <div className="w-8 h-px bg-border mx-1 hidden sm:block" />
                    )}
                  </div>
                )
              )}
            </div>
          )}

          {/* Results grid */}
          {results.length > 0 && (
            <div className="grid md:grid-cols-2 gap-6">
              {/* Retrieved chunks */}
              <div>
                <h4 className="text-sm font-semibold text-accent mb-3 uppercase tracking-wider">
                  Извлечени документи
                </h4>
                <div className="space-y-3">
                  {results.map((r, i) => (
                    <div
                      key={r.chunk.id}
                      className="bg-surface border border-border rounded-xl p-4 transition-all duration-500"
                      style={{
                        opacity: phase !== "searching" ? 1 : 0,
                        transform:
                          phase !== "searching"
                            ? "translateY(0)"
                            : "translateY(10px)",
                        transitionDelay: `${i * 150}ms`,
                      }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex gap-1.5">
                          {r.chunk.tags.map((t) => (
                            <span
                              key={t}
                              className="text-[0.65rem] px-2 py-0.5 bg-accent/10 text-accent rounded font-mono"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                        <span className="text-sm font-mono font-bold text-green">
                          {(r.score * 100).toFixed(1)}%
                        </span>
                      </div>
                      <p className="text-sm text-text-muted leading-relaxed">
                        {r.chunk.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* LLM Response */}
              <div>
                <h4 className="text-sm font-semibold text-green mb-3 uppercase tracking-wider">
                  Генериран отговор
                </h4>
                <div className="bg-surface border border-border rounded-xl p-5 min-h-[200px]">
                  {phase === "generating" || phase === "done" ? (
                    <p className="text-text-muted leading-relaxed text-sm">
                      {typedResponse}
                      {phase === "generating" && (
                        <span className="inline-block w-[2px] h-[1em] bg-accent ml-0.5 animate-pulse" />
                      )}
                    </p>
                  ) : (
                    <div className="flex items-center justify-center h-full min-h-[160px]">
                      <div className="text-text-dim text-sm flex items-center gap-2">
                        <div className="w-2 h-2 bg-accent rounded-full animate-bounce" />
                        <div
                          className="w-2 h-2 bg-accent-2 rounded-full animate-bounce"
                          style={{ animationDelay: "150ms" }}
                        />
                        <div
                          className="w-2 h-2 bg-green rounded-full animate-bounce"
                          style={{ animationDelay: "300ms" }}
                        />
                        <span className="ml-2">Очакване на контекст...</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </FadeIn>
      </div>
    </section>
  );
}
