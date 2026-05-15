"use client";
import { useState, useRef, useCallback } from "react";
import FadeIn from "./FadeIn";
import SectionHeader from "./SectionHeader";
import Block from "./Block";
import Crosshairs from "./Crosshairs";

const KB = [
  { id: 1, text: "Лилит използва sqlite-vec за векторно търсене с Gemini Embedding (4096 измерения). Базата съдържа 16,500 записа. Hybrid search комбинира BM25 fulltext и cosine similarity с настройваеми тегла (50/50 по подразбиране).", tags: ["memory", "vector-db"] },
  { id: 2, text: "Knowledge Graph съдържа 3,376 ентитети и 8,085 връзки с 16 типа релации (uses, imports, modifies, causes, fixes, depends_on, related_to, works_at, prefers, blocked_by, caused_by, optimizes_for, rejected, avoids, located_in, succeeded_by). BFS обходът позволява многостъпкови заявки.", tags: ["knowledge-graph"] },
  { id: 3, text: "Plugin v3.2 (agentmemory/index.js) автоматично инжектира top-8 резултата в промпта на LLM. Score threshold е 0.005 (BM25 scale). Budget-aware truncation спазва token лимита. Работи на hook message_received.", tags: ["plugin", "retrieval"] },
  { id: 4, text: "Obsidian Vault е L2 cold storage ниво, синхронизирано чрез Syncthing P2P (peer-to-peer, без централен сървър). Git-версиониран с PARA структура. inotify watcher засича промени и тригерира re-indexing в agentmemory за 7ms.", tags: ["obsidian", "storage"] },
  { id: 5, text: "OpenClaw Gateway (порт 18789) е agent runtime написан на TypeScript/Node.js. Bootstrap configs: AGENTS.md (правила), SOUL.md (личност), IDENTITY.md, HEARTBEAT.md (cron). Процес: Telegram → Gateway → Agent Runtime → LLM/Memory/Tools.", tags: ["runtime", "openclaw"] },
  { id: 6, text: "Telegram бот е основният потребителски интерфейс на Лилит. Streaming режим е активиран. Стикери от 3 пакета (291 file_id). Bot token се конфигурира в openclaw.json → channels.telegram.", tags: ["telegram", "interface"] },
  { id: 7, text: "Embedding модел: Google Gemini-2-preview с 4096 измерения, достъпен чрез OpenAI-compatible endpoint. Цена: ~$0.03 за обработка на 4,000 записа при 1,500 req/min rate limit. Поддържа руски и български текст.", tags: ["embedding", "gemini"] },
  { id: 8, text: "Тристепенна архитектура на паметта: L0 (hot) — текуща сесия в OpenClaw RAM, латентност <30ms. L1 (warm) — sqlite-vec векторна база, 16.5K записа, hybrid BM25+cosine. L2 (cold) — Obsidian vault, Syncthing P2P sync.", tags: ["architecture", "memory"] },
  { id: 9, text: "Retrieval-Augmented Generation (RAG) е архитектурен подход, при който езиковият модел се свързва с външни източници на знания по време на генериране. Въведен от Lewis et al. (2020) в NeurIPS. Комбинира информационно извличане (IR) с генеративни модели.", tags: ["rag", "definition"] },
  { id: 10, text: "BM25 е класически алгоритъм за пълнотекстово търсене, базиран на TF-IDF с нормализация по дължина на документа. Параметри: k1=1.5, b=0.75. Ефективен за точно съвпадение на ключови думи и терминологични заявки.", tags: ["bm25", "search"] },
  { id: 11, text: "Cosine similarity измерва ъгъла между два вектора: sim(A,B) = (A·B)/(|A|×|B|). Стойност 1.0 = идентични, 0.0 = ортогонални. Използва се за семантично търсене — намира парафрази и свързани концепции дори без съвпадение на думи.", tags: ["cosine", "similarity"] },
  { id: 12, text: "Maximal Marginal Relevance (MMR) балансира релевантност и разнообразие при избор на документи. Формула: MMR = λ·Sim(doc,query) − (1−λ)·max(Sim(doc,selected)). Предотвратява дублиране на информация в контекста на LLM.", tags: ["mmr", "reranking"] },
  { id: 13, text: "Heartbeat рутини на Лилит: idle consolidation (на всеки 3 часа неактивност), reflection cycle (на всеки 4 часа), deep harvest (веднъж на 24 часа — пълно сканиране на main.sqlite). Proactive learning е неактивен от 12 април 2026.", tags: ["heartbeat", "maintenance"] },
  { id: 14, text: "Chunking стратегии: фиксиран размер (всеки N токена с overlap), семантично (по параграфи и теми), рекурсивно (глави → параграфи → изречения). Размерът на chunk пряко влияе на качеството на retrieval — твърде малки губят контекст, твърде големи намаляват precision.", tags: ["chunking", "strategy"] },
  { id: 15, text: "Graph RAG комбинира knowledge graphs с векторно търсене. Microsoft Research (Edge et al., 2024) показва значително подобрение при summarization на големи корпуси. Hybrid vector+graph подходи стават индустриален стандарт.", tags: ["graph-rag", "future"] },
];

function bm25Search(query: string, docs: typeof KB): { doc: typeof KB[0]; score: number }[] {
  const terms = query.toLowerCase().split(/\s+/).filter(t => t.length > 2);
  if (terms.length === 0) return [];

  const N = docs.length;
  const avgDl = docs.reduce((s, d) => s + d.text.length, 0) / N;
  const k1 = 1.5;
  const b = 0.75;

  const df: Record<string, number> = {};
  terms.forEach(t => {
    df[t] = docs.filter(d => d.text.toLowerCase().includes(t)).length;
  });

  return docs.map(doc => {
    const dl = doc.text.length;
    let score = 0;
    terms.forEach(t => {
      const tf = (doc.text.toLowerCase().match(new RegExp(t, 'g')) || []).length;
      const idf = Math.log((N - (df[t] || 0) + 0.5) / ((df[t] || 0) + 0.5) + 1);
      score += idf * (tf * (k1 + 1)) / (tf + k1 * (1 - b + b * dl / avgDl));
    });
    return { doc, score };
  })
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}

function highlightTerms(text: string, query: string): string {
  const terms = query.toLowerCase().split(/\s+/).filter(t => t.length > 2);
  let result = text;
  terms.forEach(t => {
    const re = new RegExp(`(${t})`, 'gi');
    result = result.replace(re, '⟨$1⟩');
  });
  return result;
}

export default function RagPlayground() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{ doc: typeof KB[0]; score: number }[]>([]);
  const [searched, setSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const presets = [
    "Как работи търсенето?",
    "Какво е Knowledge Graph?",
    "Каква е архитектурата на паметта?",
    "Какво е BM25?",
    "Как работи cosine similarity?",
  ];

  const doSearch = useCallback((q: string) => {
    setQuery(q);
    setResults(bm25Search(q, KB));
    setSearched(true);
  }, []);

  return (
    <section id="playground" className="relative py-20 md:py-28 px-8 md:px-14">
      <Crosshairs />
      <div className="max-w-5xl mx-auto">
        <SectionHeader number="05" title="<strong>Live RAG</strong> — Retrieval Demo" sheet="06/08" />

        <FadeIn>
          <p className="text-bl-ink-3 text-sm mb-8 max-w-2xl leading-relaxed">
            Реално BM25 търсене по knowledge base от 15 документа.
            Въведи заявка — виж кои документи се извличат, с какъв score,
            и как се сглобява контекстът за LLM.
          </p>

          {/* Search input */}
          <div className="mb-6">
            <div className="flex gap-2 mb-4">
              <input
                ref={inputRef}
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === "Enter" && doSearch(query)}
                placeholder="Въведи заявка..."
                className="flex-1 bg-bl-paper-deep border border-bl-cyan-ghost text-bl-ink text-sm px-4 py-3 outline-none focus:border-bl-cyan transition-colors placeholder:text-bl-ink-5"
                style={{ fontFamily: "var(--font-display)" }}
              />
              <button
                onClick={() => doSearch(query)}
                className="bl-cta !py-3"
              >
                search
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {presets.map(p => (
                <button
                  key={p}
                  onClick={() => doSearch(p)}
                  className={`text-[10px] px-3 py-1.5 border transition-colors ${
                    query === p
                      ? "border-bl-cyan text-bl-cyan"
                      : "border-bl-cyan-ghost text-bl-ink-5 hover:text-bl-ink-3"
                  }`}
                  style={{ fontFamily: "var(--font-meta)", letterSpacing: "0.08em" }}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Results */}
          {searched && (
            <div className="grid md:grid-cols-[1fr_300px] gap-6">
              {/* Retrieved docs */}
              <Block label={`RETRIEVED · ${results.length} DOCS · BM25`}>
                {results.length === 0 ? (
                  <p className="text-bl-ink-5 text-xs">Няма резултати за тази заявка.</p>
                ) : (
                  <div className="space-y-0">
                    {results.map((r, i) => (
                      <div
                        key={r.doc.id}
                        className={`py-3 ${i > 0 ? "border-t border-bl-cyan-trace" : ""}`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-bl-cyan text-xs font-light">
                              #{String(i + 1).padStart(2, "0")}
                            </span>
                            <div className="flex gap-1">
                              {r.doc.tags.map(t => (
                                <span key={t} className="bl-tag">{t}</span>
                              ))}
                            </div>
                          </div>
                          <span className="text-bl-cyan text-sm font-medium" style={{ fontFamily: "var(--font-display)" }}>
                            {r.score.toFixed(3)}
                          </span>
                        </div>
                        <p className="text-bl-ink-2 text-xs leading-relaxed">
                          {highlightTerms(r.doc.text, query).split(/⟨|⟩/).map((part, j) =>
                            j % 2 === 1 ? (
                              <span key={j} className="text-bl-cyan font-medium">{part}</span>
                            ) : (
                              <span key={j}>{part}</span>
                            )
                          )}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </Block>

              {/* Assembled prompt preview */}
              <div>
                <Block label="ASSEMBLED PROMPT">
                  <div className="text-[10px] leading-relaxed" style={{ fontFamily: "var(--font-meta)" }}>
                    <div className="text-bl-ink-4 mb-2">SYSTEM:</div>
                    <div className="text-bl-ink-5 mb-3">
                      You are a RAG assistant. Answer based on the provided context.
                    </div>
                    <div className="text-bl-ink-4 mb-2">CONTEXT ({results.length} docs):</div>
                    {results.slice(0, 3).map((r, i) => (
                      <div key={i} className="text-bl-ink-5 mb-1 truncate">
                        [{r.score.toFixed(2)}] {r.doc.text.slice(0, 60)}...
                      </div>
                    ))}
                    {results.length > 3 && (
                      <div className="text-bl-ink-5 mb-3">...+{results.length - 3} more</div>
                    )}
                    <div className="text-bl-ink-4 mb-2">QUERY:</div>
                    <div className="text-bl-cyan">{query}</div>
                  </div>
                </Block>

                <div className="mt-4">
                  <Block label="STATS">
                    <div className="space-y-1 text-[10px]" style={{ fontFamily: "var(--font-meta)" }}>
                      <div className="flex justify-between">
                        <span className="text-bl-ink-4">KB SIZE</span>
                        <span className="text-bl-ink-2">{KB.length} docs</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-bl-ink-4">QUERY TERMS</span>
                        <span className="text-bl-ink-2">{query.split(/\s+/).filter(t => t.length > 2).length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-bl-ink-4">RETRIEVED</span>
                        <span className="text-bl-ink-2">{results.length} / {KB.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-bl-ink-4">TOP SCORE</span>
                        <span className="text-bl-cyan">{results[0]?.score.toFixed(3) || "—"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-bl-ink-4">METHOD</span>
                        <span className="text-bl-ink-2">BM25 (k1=1.5, b=0.75)</span>
                      </div>
                    </div>
                  </Block>
                </div>
              </div>
            </div>
          )}
        </FadeIn>
      </div>
    </section>
  );
}
