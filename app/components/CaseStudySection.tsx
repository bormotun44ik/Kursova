"use client";
import FadeIn from "./FadeIn";
import SectionHeader from "./SectionHeader";
import Block from "./Block";
import Crosshairs from "./Crosshairs";
import AnimatedCounter from "./AnimatedCounter";
import KnowledgeGraph from "./KnowledgeGraph";

const layers = [
  { badge: "L0", label: "HOT", title: "Сесийно състояние", tech: "OpenClaw Gateway · JSONL · Working set", stat: "<30ms", statLabel: "LATENCY" },
  { badge: "L1", label: "WARM", title: "Векторна база данни", tech: "sqlite-vec · BM25 + cosine · Gemini 4096d · MMR", stat: "16.5K", statLabel: "RECORDS" },
  { badge: "L2", label: "COLD", title: "Obsidian Vault", tech: "Syncthing P2P · PARA · inotify watcher", stat: "P2P", statLabel: "SYNC" },
];

const predicates = [
  "uses", "imports", "modifies", "causes", "fixes", "depends_on",
  "related_to", "works_at", "prefers", "blocked_by", "caused_by",
  "optimizes_for", "rejected", "avoids", "located_in", "succeeded_by",
];

export default function CaseStudySection() {
  return (
    <section id="case-study" className="relative py-20 md:py-28 px-8 md:px-14">
      <Crosshairs />
      <div className="max-w-5xl mx-auto">
        <SectionHeader number="04" title="Система <strong>«Лилит»</strong> — case study" sheet="05/08" />

        <FadeIn className="max-w-3xl mb-14">
          <p className="text-bl-ink-2 text-sm leading-relaxed">
            Self-hosted RAG система в продукция. Тристепенна архитектура за памет,
            Telegram бот интерфейс, hybrid search с knowledge graph.
          </p>
        </FadeIn>

        {/* Architecture layers */}
        <FadeIn className="mb-14">
          <Block label="MEMORY ARCHITECTURE">
            <div className="space-y-0">
              {layers.map((l, i) => (
                <div key={l.badge}>
                  <div className="flex items-center gap-6 py-4">
                    <div className="shrink-0 w-10 text-center">
                      <span className="text-bl-cyan text-lg font-light">{l.badge}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-baseline gap-2 mb-0.5">
                        <span className="meta text-[9px] text-bl-cyan">{l.label}</span>
                        <span className="text-bl-ink text-sm font-medium">{l.title}</span>
                      </div>
                      <span className="meta text-[9px] text-bl-ink-5">{l.tech}</span>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-bl-ink text-lg font-light block">{l.stat}</span>
                      <span className="meta text-[8px] text-bl-ink-5">{l.statLabel}</span>
                    </div>
                  </div>
                  {i < layers.length - 1 && (
                    <div className="border-b border-bl-cyan-ghost ml-16" />
                  )}
                </div>
              ))}
            </div>
          </Block>
        </FadeIn>

        {/* Metrics grid */}
        <FadeIn className="mb-14">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-bl-cyan-ghost">
            {[
              { label: "MEMORY DEPTH", v: 16500, suffix: "" },
              { label: "KG ENTITIES", v: 3376, suffix: "" },
              { label: "KG EDGES", v: 8085, suffix: "" },
              { label: "PREDICATES", v: 16, suffix: "" },
            ].map((m) => (
              <div key={m.label} className="bg-bl-paper p-5">
                <span className="meta text-[9px] text-bl-cyan block mb-2">{m.label}</span>
                <AnimatedCounter
                  value={m.v}
                  suffix={m.suffix}
                  className="ticker text-3xl"
                />
              </div>
            ))}
          </div>
        </FadeIn>

        {/* Knowledge Graph */}
        <FadeIn className="mb-14">
          <Block label="KNOWLEDGE GRAPH · INTERACTIVE">
            <div className="grid md:grid-cols-[1fr_200px] gap-6">
              <KnowledgeGraph />
              <div>
                <span className="meta text-[9px] text-bl-ink-4 block mb-3">EDGE PREDICATES</span>
                <div className="flex flex-wrap gap-1">
                  {predicates.map((p) => (
                    <span key={p} className="bl-tag">{p}</span>
                  ))}
                </div>
              </div>
            </div>
          </Block>
        </FadeIn>

        {/* Retrieval flow */}
        <FadeIn className="mb-14">
          <Block label="RETRIEVAL PIPELINE">
            {[
              { n: "01", label: "INBOUND", desc: "Потребителят изпраща заявка чрез Telegram" },
              { n: "02", label: "CLASSIFY", desc: "Plugin преценява: нетривиална заявка? Ако не — skip" },
              { n: "03", label: "SEARCH", desc: "BM25 + Vector cosine + KG-BFS паралелно. RRF fusion" },
              { n: "04", label: "INJECT", desc: "Top-8 резултата (score > 0.005) в промпта с token budget" },
              { n: "05", label: "GENERATE", desc: "Claude Sonnet генерира отговор с обогатен контекст" },
            ].map((s, i) => (
              <div key={s.n} className={`flex items-start gap-4 py-3 ${i > 0 ? "border-t border-bl-cyan-trace" : ""}`}>
                <span className="text-bl-cyan text-sm font-light shrink-0 w-6">{s.n}</span>
                <div>
                  <span className="meta text-[9px] text-bl-cyan">{s.label}</span>
                  <p className="text-bl-ink-3 text-xs mt-0.5">{s.desc}</p>
                </div>
              </div>
            ))}
          </Block>
        </FadeIn>

        {/* Code */}
        <FadeIn>
          <div>
            <span className="meta text-[9px] text-bl-ink-4 block mb-3">IMPLEMENTATION · PLUGIN V3.2</span>
            <div className="bl-log">
              <div><span className="lv">HOOK</span> message_received → agentmemory/index.js</div>
              <div><span className="ts">check</span><span className="lv">--</span> isSimpleGreeting(msg) ? skip : search</div>
              <div><span className="ts">POST</span><span className="lv">OK</span> /agentmemory/smart-search query=... limit=8</div>
              <div><span className="ts">filter</span><span className="lv">OK</span> results.filter(r =&gt; r.score &gt; 0.005)</div>
              <div><span className="ts">inject</span><span className="lv">OK</span> injectIntoPrompt(truncateToTokenBudget(ctx))</div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
