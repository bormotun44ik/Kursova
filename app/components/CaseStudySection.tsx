import FadeIn from "./FadeIn";
import SectionHeader from "./SectionHeader";
import AnimatedCounter from "./AnimatedCounter";
import KnowledgeGraph from "./KnowledgeGraph";

const layers = [
  {
    badge: "L0",
    title: "Hot — Сесийно състояние",
    desc: "Текущата конверсация в OpenClaw runtime. Незабавен достъп.",
    tech: "OpenClaw Gateway • JSONL сесии • Working set",
    badgeClass: "bg-red/15 text-red border-red/30",
    borderClass: "border-red/20 hover:border-red/40",
    glowClass: "hover:shadow-[0_0_30px_rgba(239,68,68,0.08)]",
    stat: "<30ms",
    statLabel: "Латентност",
  },
  {
    badge: "L1",
    title: "Warm — Векторна база данни",
    desc: "sqlite-vec с ~16 500 записа. Hybrid search: BM25 + cosine similarity. Gemini Embedding (4096d).",
    tech: "sqlite-vec • BM25 + Cosine hybrid • Gemini 4096d • MMR",
    badgeClass: "bg-yellow/15 text-yellow border-yellow/30",
    borderClass: "border-yellow/20 hover:border-yellow/40",
    glowClass: "hover:shadow-[0_0_30px_rgba(251,191,36,0.08)]",
    stat: "16.5K",
    statLabel: "Записа",
  },
  {
    badge: "L2",
    title: "Cold — Obsidian Vault",
    desc: "Git-версиониран vault, синхронизиран чрез Syncthing (P2P). Единичен източник на истина.",
    tech: "Obsidian • Syncthing P2P • PARA структура • inotify",
    badgeClass: "bg-accent-2/15 text-accent-2 border-accent-2/30",
    borderClass: "border-accent-2/20 hover:border-accent-2/40",
    glowClass: "hover:shadow-[0_0_30px_rgba(6,182,212,0.08)]",
    stat: "P2P",
    statLabel: "Синхр.",
  },
];

const flowSteps = [
  { title: "Съобщение пристига", desc: "Потребителят изпраща заявка чрез Telegram бот", icon: "📨" },
  { title: "Класификация", desc: "Plugin преценява: нетривиална заявка ли е?", icon: "🔍" },
  { title: "Smart Search", desc: "Паралелни заявки: BM25 + Vector cosine + KG-BFS. Обединяване чрез RRF", icon: "⚡" },
  { title: "Инжектиране", desc: "Top-8 резултата (score > 0.005) се добавят в промпта", icon: "💉" },
  { title: "Генериране", desc: "Claude Sonnet генерира отговор с обогатен контекст", icon: "🤖" },
];

const predicates = [
  "uses", "imports", "modifies", "causes", "fixes", "depends_on",
  "related_to", "works_at", "prefers", "blocked_by", "caused_by",
  "optimizes_for", "rejected", "avoids", "located_in", "succeeded_by",
];

export default function CaseStudySection() {
  return (
    <section id="case-study" className="py-28 px-6 bg-bg-alt relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-30" />

      <div className="max-w-5xl mx-auto relative">
        <SectionHeader
          number="04"
          title={`Практически пример: Система «Лилит»`}
        />

        <FadeIn className="max-w-3xl mb-16">
          <p className="text-text-muted text-lg leading-relaxed">
            {"«"}Лилит{"»"} е реална self-hosted RAG система, работеща
            в продукция. Персонален AI асистент с тристепенна архитектура за
            памет, обслужващ потребител чрез Telegram бот.
          </p>
        </FadeIn>

        {/* Architecture Layers */}
        <FadeIn className="mb-20">
          <h3 className="text-center text-text-muted text-lg mb-10">
            Тристепенна архитектура на паметта
          </h3>
          <div className="flex flex-col items-center max-w-3xl mx-auto">
            {layers.map((l, i) => (
              <div key={l.badge}>
                <div
                  className={`flex flex-col sm:flex-row items-center gap-5 w-full bg-surface border ${l.borderClass} rounded-xl p-6 transition-all duration-300 ${l.glowClass}`}
                >
                  <div
                    className={`shrink-0 w-14 h-14 flex items-center justify-center rounded-lg font-black text-base font-mono border ${l.badgeClass}`}
                  >
                    {l.badge}
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <h4 className="font-semibold text-lg mb-1">{l.title}</h4>
                    <p className="text-sm text-text-muted mb-2">{l.desc}</p>
                    <p className="text-xs text-text-dim font-mono">{l.tech}</p>
                  </div>
                  <div className="text-center shrink-0">
                    <span className="block text-2xl font-black text-accent font-mono stat-glow">
                      {l.stat}
                    </span>
                    <span className="text-[0.7rem] text-text-dim uppercase tracking-wider">
                      {l.statLabel}
                    </span>
                  </div>
                </div>
                {i < layers.length - 1 && (
                  <div className="flex justify-center py-1">
                    <div className="w-px h-6 bg-gradient-to-b from-border to-transparent" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </FadeIn>

        {/* Knowledge Graph — Interactive */}
        <FadeIn className="mb-20">
          <h3 className="text-2xl font-bold mb-3">Knowledge Graph</h3>
          <p className="text-text-muted mb-6 max-w-2xl">
            Интерактивна визуализация на графа на знания. Посочи с мишката за да
            видиш връзките между ентитетите.
          </p>

          <div className="grid md:grid-cols-[1fr_auto] gap-6 items-start">
            <KnowledgeGraph />

            <div className="space-y-6">
              <div className="flex flex-wrap gap-3">
                {[
                  { v: 3376, l: "Ентитети" },
                  { v: 8085, l: "Връзки" },
                  { v: 16, l: "Типа" },
                ].map((s) => (
                  <div
                    key={s.l}
                    className="bg-surface border border-border rounded-lg px-5 py-4 text-center min-w-[90px]"
                  >
                    <AnimatedCounter
                      value={s.v}
                      className="block text-2xl font-black text-accent font-mono stat-glow"
                    />
                    <span className="text-[0.7rem] text-text-dim">{s.l}</span>
                  </div>
                ))}
              </div>

              <div>
                <h4 className="text-text-muted text-sm font-medium mb-3">
                  Типове релации
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {predicates.map((p) => (
                    <span
                      key={p}
                      className="px-2.5 py-1 bg-surface border border-border rounded-md text-[0.7rem] font-mono text-accent-2 hover:border-accent-2 hover:bg-accent-2/10 hover:scale-105 transition-all cursor-default"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Retrieval Flow */}
        <FadeIn className="mb-20">
          <h3 className="text-2xl font-bold mb-3">
            Как работи извличането на памет
          </h3>
          <p className="text-text-muted mb-10 max-w-2xl">
            При всяко съобщение, plugin системата автоматично решава дали е
            необходимо търсене и инжектира релевантен контекст.
          </p>
          <div className="flex flex-col max-w-xl">
            {flowSteps.map((s, i) => (
              <div key={s.title}>
                <div className="group flex items-start gap-4 py-3 hover:bg-surface/50 rounded-lg px-3 -mx-3 transition-colors">
                  <div className="shrink-0 w-10 h-10 flex items-center justify-center bg-accent/10 border border-accent/20 text-accent rounded-full text-sm font-bold group-hover:bg-accent group-hover:text-white group-hover:border-accent transition-all">
                    {i + 1}
                  </div>
                  <div className="pt-1">
                    <strong className="flex items-center gap-2 text-[0.95rem]">
                      <span>{s.icon}</span> {s.title}
                    </strong>
                    <p className="text-sm text-text-muted mt-0.5">{s.desc}</p>
                  </div>
                </div>
                {i < flowSteps.length - 1 && (
                  <div className="w-px h-4 bg-border ml-[22px]" />
                )}
              </div>
            ))}
          </div>
        </FadeIn>

        {/* Code Example */}
        <FadeIn>
          <h3 className="text-2xl font-bold mb-5">
            Пример: Plugin за извличане на памет
          </h3>
          <div className="bg-bg border border-border rounded-xl overflow-hidden shadow-2xl shadow-black/20">
            <div className="flex items-center gap-2 bg-surface-2 px-4 py-3 border-b border-border">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red/60" />
                <div className="w-3 h-3 rounded-full bg-yellow/60" />
                <div className="w-3 h-3 rounded-full bg-green/60" />
              </div>
              <span className="text-xs text-text-dim font-mono ml-2">
                agentmemory/index.js
              </span>
            </div>
            <pre className="p-6 overflow-x-auto text-sm leading-[1.8]">
              <code className="font-mono code-highlight">
                <span className="cm">{"// Plugin v3.2 — cross-session smart-search"}</span>{"\n"}
                <span className="kw">export async function</span> <span className="fn">messageReceived</span>{"({ message, injectIntoPrompt }) {\n"}
                {"  "}<span className="cm">{"// Пропусни тривиални съобщения"}</span>{"\n"}
                {"  "}<span className="kw">if</span> (<span className="fn">isSimpleGreeting</span>(message)) <span className="kw">return</span>{";\n\n"}
                {"  "}<span className="cm">{"// Hybrid search: BM25 + Vector + Knowledge Graph"}</span>{"\n"}
                {"  "}<span className="kw">const</span> results = <span className="kw">await</span> <span className="fn">fetch</span>(<span className="str">{`'/agentmemory/smart-search'`}</span>, {"{\n"}
                {"    "}<span className="prop">method</span>: <span className="str">{`'POST'`}</span>,{"\n"}
                {"    "}<span className="prop">body</span>: JSON.<span className="fn">stringify</span>({"{\n"}
                {"      "}<span className="prop">query</span>: message.text,{"\n"}
                {"      "}<span className="prop">limit</span>: <span className="num">8</span>,{"\n"}
                {"      "}<span className="prop">format</span>: <span className="str">{`'full'`}</span>{"\n"}
                {"    "}{"});\n\n"}
                {"  "}<span className="cm">{"// Филтрирай по минимален score"}</span>{"\n"}
                {"  "}<span className="kw">const</span> relevant = results.<span className="fn">filter</span>(r <span className="op">=&gt;</span> r.score &gt; <span className="num">0.005</span>){";\n\n"}
                {"  "}<span className="kw">if</span> (relevant.length &gt; <span className="num">0</span>) {"{\n"}
                {"    "}<span className="cm">{"// Инжектирай в промпта на LLM"}</span>{"\n"}
                {"    "}<span className="fn">injectIntoPrompt</span>(<span className="fn">truncateToTokenBudget</span>(context)){";\n"}
                {"  }\n}"}
              </code>
            </pre>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
