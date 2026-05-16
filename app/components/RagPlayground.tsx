"use client";
import { useState, useRef, useCallback } from "react";
import FadeIn from "./FadeIn";
import SectionHeader from "./SectionHeader";
import Block from "./Block";
import Crosshairs from "./Crosshairs";
import { KB, bm25Search } from "../lib/kb";

function highlightTerms(text: string, query: string) {
  const terms = query.toLowerCase().split(/\s+/).filter(t => t.length > 2);
  let result = text;
  terms.forEach(t => {
    result = result.replace(new RegExp(`(${t})`, "gi"), "\x00$1\x01");
  });
  return result.split(/\x00|\x01/).map((part, j) =>
    j % 2 === 1
      ? <span key={j} className="text-bl-cyan font-medium">{part}</span>
      : <span key={j}>{part}</span>
  );
}

export default function RagPlayground() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ReturnType<typeof bm25Search>>([]);
  const [searched, setSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const presets = [
    "Как работи търсенето?",
    "Какво е Knowledge Graph?",
    "Каква е архитектурата на паметта?",
    "Какво е BM25?",
    "Cosine similarity обяснение",
    "Какви chunking стратегии има?",
  ];

  const doSearch = useCallback((q: string) => {
    setQuery(q);
    setResults(bm25Search(q));
    setSearched(true);
  }, []);

  return (
    <section id="playground" className="relative py-20 md:py-28 px-8 md:px-14 bg-bl-paper-edge">
      <Crosshairs />
      <div className="max-w-5xl mx-auto">
        <SectionHeader number="05" title="<strong>Live RAG</strong> — Retrieval Demo" sheet="06/09" />

        <FadeIn>
          <p className="text-bl-ink-3 text-sm mb-8 max-w-2xl leading-relaxed">
            Реално BM25 търсене по knowledge base от {KB.length} документа.
            Въведи заявка — виж кои документи се извличат, с какъв score,
            и как се сглобява контекстът за LLM.
          </p>

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
              <button onClick={() => doSearch(query)} className="bl-cta !py-3">search</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {presets.map(p => (
                <button
                  key={p}
                  onClick={() => doSearch(p)}
                  className={`text-[10px] px-3 py-1.5 border transition-colors ${
                    query === p ? "border-bl-cyan text-bl-cyan" : "border-bl-cyan-ghost text-bl-ink-5 hover:text-bl-ink-3"
                  }`}
                  style={{ fontFamily: "var(--font-meta)", letterSpacing: "0.08em" }}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {searched && (
            <div className="grid md:grid-cols-[1fr_300px] gap-6">
              <Block label={`RETRIEVED · ${results.length} DOCS · BM25`}>
                {results.length === 0 ? (
                  <p className="text-bl-ink-5 text-xs">Няма резултати.</p>
                ) : (
                  <div className="space-y-0">
                    {results.map((r, i) => (
                      <div key={r.doc.id} className={`py-3 ${i > 0 ? "border-t border-bl-cyan-trace" : ""}`}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-bl-cyan text-xs">#{String(i + 1).padStart(2, "0")}</span>
                            {r.doc.tags.map(t => <span key={t} className="bl-tag">{t}</span>)}
                          </div>
                          <span className="text-bl-cyan text-sm font-medium" style={{ fontFamily: "var(--font-display)" }}>
                            {r.score.toFixed(3)}
                          </span>
                        </div>
                        <p className="text-bl-ink-2 text-xs leading-relaxed">
                          {highlightTerms(r.doc.text, query)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </Block>

              <div>
                <Block label="ASSEMBLED PROMPT">
                  <div className="text-[10px] leading-relaxed" style={{ fontFamily: "var(--font-meta)" }}>
                    <div className="text-bl-ink-4 mb-1">SYSTEM:</div>
                    <div className="text-bl-ink-5 mb-3">Answer based on context.</div>
                    <div className="text-bl-ink-4 mb-1">CONTEXT ({results.length}):</div>
                    {results.slice(0, 3).map((r, i) => (
                      <div key={i} className="text-bl-ink-5 mb-1 truncate">[{r.score.toFixed(2)}] {r.doc.text.slice(0, 50)}...</div>
                    ))}
                    {results.length > 3 && <div className="text-bl-ink-5 mb-3">+{results.length - 3} more</div>}
                    <div className="text-bl-ink-4 mb-1">QUERY:</div>
                    <div className="text-bl-cyan">{query}</div>
                  </div>
                </Block>
                <div className="mt-4">
                  <Block label="STATS">
                    <div className="space-y-1 text-[10px]" style={{ fontFamily: "var(--font-meta)" }}>
                      <div className="flex justify-between"><span className="text-bl-ink-4">KB SIZE</span><span className="text-bl-ink-2">{KB.length} docs</span></div>
                      <div className="flex justify-between"><span className="text-bl-ink-4">TERMS</span><span className="text-bl-ink-2">{query.split(/\s+/).filter(t => t.length > 2).length}</span></div>
                      <div className="flex justify-between"><span className="text-bl-ink-4">HITS</span><span className="text-bl-ink-2">{results.length} / {KB.length}</span></div>
                      <div className="flex justify-between"><span className="text-bl-ink-4">TOP</span><span className="text-bl-cyan">{results[0]?.score.toFixed(3) || "—"}</span></div>
                      <div className="flex justify-between"><span className="text-bl-ink-4">METHOD</span><span className="text-bl-ink-2">BM25</span></div>
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
