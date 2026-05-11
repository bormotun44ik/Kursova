"use client";
import { useState, useEffect, useRef } from "react";
import FadeIn from "./FadeIn";
import SectionHeader from "./SectionHeader";
import Block from "./Block";
import Crosshairs from "./Crosshairs";

const docs = [
  { id: 1, text: "sqlite-vec с ~16 500 записа. Hybrid search: BM25 fulltext + cosine similarity.", score: 0.94, tags: ["memory", "search"] },
  { id: 2, text: "Plugin v3.2 инжектира top-8 резултата в промпта с budget-aware truncation.", score: 0.87, tags: ["plugin"] },
  { id: 3, text: "Knowledge Graph: 3,376 ентитети, 8,085 връзки, BFS обход.", score: 0.71, tags: ["kg"] },
];

const query = "Как работи търсенето в Лилит?";
const answer = "Системата използва hybrid search — комбинация от BM25 fulltext и cosine similarity върху 4096d Gemini embeddings в sqlite-vec. Plugin v3.2 автоматично извлича top-8 резултата и ги инжектира в промпта на Claude Sonnet.";

const CYCLE = 10000;
const RETRIEVE_END = 3500;
const AUGMENT_END = 5000;
const GENERATE_END = 9000;

export default function RagPlayground() {
  const [time, setTime] = useState(0);
  const [paused, setPaused] = useState(false);
  const [typed, setTyped] = useState("");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      if (!paused) {
        setTime((t) => {
          const next = t + 50;
          return next >= CYCLE ? 0 : next;
        });
      }
    }, 50);
    return () => clearInterval(intervalRef.current);
  }, [paused]);

  useEffect(() => {
    if (time >= AUGMENT_END && time < GENERATE_END) {
      const progress = (time - AUGMENT_END) / (GENERATE_END - AUGMENT_END);
      const chars = Math.floor(progress * answer.length);
      setTyped(answer.slice(0, chars));
    } else if (time >= GENERATE_END) {
      setTyped(answer);
    } else {
      setTyped("");
    }
  }, [time]);

  const phase =
    time < RETRIEVE_END ? "retrieve" :
    time < AUGMENT_END ? "augment" :
    time < GENERATE_END ? "generate" : "complete";

  const formatTime = (ms: number) => {
    const s = Math.floor(ms / 1000);
    const m = String(Math.floor(s / 60)).padStart(2, "0");
    const sec = String(s % 60).padStart(2, "0");
    return `${m}:${sec}`;
  };

  return (
    <section id="playground" className="relative py-20 md:py-28 px-8 md:px-14">
      <Crosshairs />
      <div className="max-w-5xl mx-auto">
        <SectionHeader number="05" title="<strong>Live Pipeline</strong>" sheet="06/08" />

        <FadeIn>
          <div
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            {/* Player header */}
            <div className="flex items-center justify-between border border-bl-cyan-ghost border-b-0 px-5 py-3">
              <div className="flex items-center gap-3">
                <span className="pulse-dot" />
                <span className="meta text-[10px] text-bl-ink-3">RAG PIPELINE · AUTO</span>
              </div>
              <span className="meta text-[10px] text-bl-ink-5">
                {formatTime(time)} / {formatTime(CYCLE)}
              </span>
            </div>

            {/* Player body */}
            <div className="grid md:grid-cols-2 border border-bl-cyan-ghost">
              {/* Left: Query + Retrieve */}
              <div className="p-5 border-r border-bl-cyan-ghost">
                <div className="flex items-center justify-between mb-4">
                  <span className="meta text-[9px] text-bl-ink-4">QUERY → RETRIEVE</span>
                  <span className={`meta text-[9px] ${phase === "retrieve" ? "text-bl-cyan" : "text-bl-ink-5"}`}>
                    {phase === "retrieve" ? "SEARCHING..." : phase === "augment" || phase === "generate" || phase === "complete" ? "DONE" : "IDLE"}
                  </span>
                </div>

                <div className="bl-log mb-4 text-[11px]">
                  <div><span className="lv">Q</span>{query}</div>
                </div>

                <div className="space-y-2">
                  {docs.map((d, i) => {
                    const showAt = 800 + i * 800;
                    const visible = time >= showAt;
                    return (
                      <div
                        key={d.id}
                        className="flex items-start gap-3 py-2 border-b border-bl-cyan-trace last:border-0"
                        style={{
                          opacity: visible ? 1 : 0,
                          transform: visible ? "none" : "translateY(8px)",
                          transition: "all 0.4s ease",
                        }}
                      >
                        <div className="shrink-0 text-right w-12">
                          <span className="text-bl-cyan text-xs font-medium">
                            {visible ? `${(d.score * 100).toFixed(0)}%` : ""}
                          </span>
                        </div>
                        <div>
                          <div className="flex gap-1 mb-1">
                            {d.tags.map((t) => <span key={t} className="bl-tag">{t}</span>)}
                          </div>
                          <p className="text-bl-ink-3 text-[11px] leading-relaxed">{d.text}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right: Augment + Generate */}
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <span className="meta text-[9px] text-bl-ink-4">AUGMENT → GENERATE</span>
                  <span className={`meta text-[9px] ${phase === "generate" ? "text-bl-cyan" : phase === "complete" ? "text-bl-ok" : "text-bl-ink-5"}`}>
                    {phase === "generate" ? "GENERATING..." : phase === "complete" ? "COMPLETE" : "WAITING"}
                  </span>
                </div>

                <div className="min-h-[180px]">
                  {phase === "augment" && (
                    <div className="text-bl-ink-5 text-xs flex items-center gap-2">
                      <span className="pulse-dot" />
                      Подготовка на контекст...
                    </div>
                  )}
                  {(phase === "generate" || phase === "complete") && (
                    <p className="text-bl-ink-2 text-xs leading-relaxed">
                      {typed}
                      {phase === "generate" && (
                        <span className="text-bl-cyan">▮</span>
                      )}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="border border-bl-cyan-ghost border-t-0 px-5 py-3">
              <div className="relative h-1 bg-bl-cyan-trace rounded-full overflow-hidden mb-2">
                <div
                  className="h-full bg-bl-cyan transition-[width] duration-100"
                  style={{ width: `${(time / CYCLE) * 100}%` }}
                />
              </div>
              <div className="flex justify-between">
                {["retrieve", "augment", "generate", "complete"].map((p) => (
                  <span
                    key={p}
                    className={`meta text-[8px] ${phase === p ? "text-bl-cyan" : "text-bl-ink-5"}`}
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>

            {paused && (
              <div className="text-center mt-2">
                <span className="meta text-[9px] text-bl-ink-5">PAUSED · HOVER TO HOLD</span>
              </div>
            )}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
