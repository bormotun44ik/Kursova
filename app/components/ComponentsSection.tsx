import FadeIn from "./FadeIn";
import SectionHeader from "./SectionHeader";
import Stagger from "./Stagger";
import EmbeddingViz from "./EmbeddingViz";
import { type ReactNode } from "react";

function CodeBlock({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="bg-bg border border-border rounded-xl overflow-hidden my-5 shadow-xl shadow-black/10">
      <div className="flex items-center gap-2 bg-surface-2 px-4 py-2.5 border-b border-border">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red/50" />
          <div className="w-3 h-3 rounded-full bg-yellow/50" />
          <div className="w-3 h-3 rounded-full bg-green/50" />
        </div>
        <span className="text-xs text-text-dim font-mono ml-2">{title}</span>
      </div>
      <pre className="p-5 overflow-x-auto text-sm leading-[1.8]">
        <code className="font-mono code-highlight">{children}</code>
      </pre>
    </div>
  );
}

export default function ComponentsSection() {
  return (
    <section id="components" className="py-28 px-6">
      <div className="max-w-5xl mx-auto">
        <SectionHeader number="03" title="Компоненти на RAG система" />

        <div className="flex flex-col gap-6">
          {/* Embeddings */}
          <FadeIn>
            <div className="group bg-surface border border-border rounded-2xl p-8 hover:border-accent/40 transition-all duration-300 hover:shadow-[0_0_40px_rgba(139,92,246,0.06)]">
              <h3 className="text-xl font-bold mb-4">
                Векторни вграждания (Embeddings)
              </h3>
              <p className="text-text-muted mb-4 max-w-3xl leading-relaxed">
                Embedding моделите преобразуват текст в числови вектори с висока
                размерност (768{"–"}4096 измерения). Семантично близки текстове
                получават близки вектори в пространството.
              </p>
              <CodeBlock title="cosine-similarity.js">
                <span className="cm">{"// Два текста с близко значение"}</span>{"\n"}
                <span className="fn">embed</span>(<span className="str">{'"Котката спи на дивана"'}</span>){"    "}→ [<span className="num">0.12</span>, <span className="num">0.85</span>, ...]{"\n"}
                <span className="fn">embed</span>(<span className="str">{'"Котето дреме на канапето"'}</span>) → [<span className="num">0.13</span>, <span className="num">0.84</span>, ...]{"\n\n"}
                <span className="prop">cosine_similarity</span> = <span className="num">0.97</span>{"  "}<span className="cm">{"// ✅ Висока сходство!"}</span>{"\n\n"}
                <span className="cm">{"// Несвързан текст"}</span>{"\n"}
                <span className="fn">embed</span>(<span className="str">{'"Цената на биткойн расте"'}</span>) → [<span className="num">0.91</span>, <span className="num">0.02</span>, ...]{"\n"}
                <span className="prop">cosine_similarity</span> = <span className="num">0.12</span>{"  "}<span className="cm">{"// ❌ Ниска сходство"}</span>
              </CodeBlock>
              <p className="text-sm text-text-dim mt-4 mb-6">
                Популярни модели:{" "}
                <span className="text-accent-2/80">OpenAI text-embedding-3</span>,{" "}
                <span className="text-accent/80">Google Gemini Embedding</span>,{" "}
                <span className="text-green/80">BGE-M3</span>{" "}
                (open source)
              </p>

              <h4 className="text-base font-semibold mb-3 text-text-muted">
                Визуализация на embedding пространство
              </h4>
              <EmbeddingViz />
            </div>
          </FadeIn>

          {/* Chunking */}
          <FadeIn>
            <div className="group bg-surface border border-border rounded-2xl p-8 hover:border-accent-2/40 transition-all duration-300 hover:shadow-[0_0_40px_rgba(6,182,212,0.06)]">
              <h3 className="text-xl font-bold mb-4">
                Chunking стратегии
              </h3>
              <p className="text-text-muted mb-6 max-w-3xl leading-relaxed">
                Документите се разделят на по-малки фрагменти (chunks), които
                могат да бъдат индексирани и извлечени независимо. Размерът и
                методът пряко влияят на качеството.
              </p>
              <Stagger className="grid sm:grid-cols-3 gap-4">
                {[
                  {
                    t: "Фиксиран размер",
                    d: "Разделяне на всеки N токена с overlap. Просто, но може да раздели смислово свързан текст.",
                    icon: "📏",
                    accent: "border-accent/20 hover:border-accent/40",
                  },
                  {
                    t: "Семантично",
                    d: "Разделяне по смислови граници (параграфи, теми). По-добро качество, но по-сложна имплементация.",
                    icon: "🧠",
                    accent: "border-accent-2/20 hover:border-accent-2/40",
                  },
                  {
                    t: "Рекурсивно",
                    d: "Йерархично: глави → параграфи → изречения. Балансира контекст и гранулярност.",
                    icon: "🌳",
                    accent: "border-green/20 hover:border-green/40",
                  },
                ].map((c) => (
                  <div
                    key={c.t}
                    className={`bg-bg border ${c.accent} rounded-xl p-5 transition-all duration-300 hover:-translate-y-0.5`}
                  >
                    <div className="text-2xl mb-2">{c.icon}</div>
                    <h4 className="text-accent font-semibold mb-2">{c.t}</h4>
                    <p className="text-sm text-text-muted leading-relaxed">
                      {c.d}
                    </p>
                  </div>
                ))}
              </Stagger>
            </div>
          </FadeIn>

          {/* Retrieval Methods */}
          <FadeIn>
            <div className="group bg-surface border border-border rounded-2xl p-8 hover:border-green/40 transition-all duration-300 hover:shadow-[0_0_40px_rgba(34,197,94,0.06)]">
              <h3 className="text-xl font-bold mb-5">
                Методи за извличане
              </h3>
              <div className="flex flex-col gap-4">
                {[
                  {
                    name: "BM25",
                    tag: "Sparse",
                    tagClass: "bg-accent/15 text-accent",
                    desc: "Класически алгоритъм за пълнотекстово търсене. Работи с точно съвпадение на ключови думи. Бърз и ефективен.",
                    bar: "w-[65%] bg-accent/40",
                    barLabel: "Точност при ключови думи",
                  },
                  {
                    name: "Vector Search",
                    tag: "Dense",
                    tagClass: "bg-accent-2/15 text-accent-2",
                    desc: "Търсене по cosine similarity между embedding вектори. Разбира семантика — намира парафрази и свързани концепции.",
                    bar: "w-[80%] bg-accent-2/40",
                    barLabel: "Семантично разбиране",
                  },
                  {
                    name: "Hybrid Search",
                    tag: "Hybrid",
                    tagClass: "bg-green/15 text-green",
                    desc: "Комбинира BM25 + Vector Search с настройваеми тегла. Reciprocal Rank Fusion (RRF). Най-доброто от двата свята.",
                    bar: "w-[95%] bg-green/40",
                    barLabel: "Общо качество",
                  },
                ].map((m) => (
                  <div
                    key={m.name}
                    className="bg-bg border border-border rounded-xl p-5 hover:border-border transition-colors"
                  >
                    <h4 className="font-semibold flex items-center gap-2 mb-2">
                      {m.name}
                      <span
                        className={`text-[0.65rem] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${m.tagClass}`}
                      >
                        {m.tag}
                      </span>
                    </h4>
                    <p className="text-sm text-text-muted mb-3">{m.desc}</p>
                    <div className="flex items-center gap-3">
                      <span className="text-[0.7rem] text-text-dim w-40 shrink-0">
                        {m.barLabel}
                      </span>
                      <div className="flex-1 h-1.5 bg-border/50 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${m.bar} transition-all duration-1000`} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* Knowledge Graphs */}
          <FadeIn>
            <div className="group bg-surface border border-border rounded-2xl p-8 hover:border-accent/40 transition-all duration-300 hover:shadow-[0_0_40px_rgba(139,92,246,0.06)]">
              <h3 className="text-xl font-bold mb-4">
                Knowledge Graphs (Графи на знания)
              </h3>
              <p className="text-text-muted mb-4 max-w-3xl leading-relaxed">
                Структурирано представяне на знания чрез{" "}
                <strong className="text-text">ентитети</strong> (nodes) и{" "}
                <strong className="text-text">релации</strong> (edges). Графите
                проследяват многостъпкови връзки.
              </p>
              <CodeBlock title="knowledge-graph.cypher">
                <span className="cm">{"// Типирани релации между ентитети"}</span>{"\n"}
                <span className="str">Лилит</span>{"  "}--[<span className="kw">използва</span>]--{">"} <span className="str">sqlite-vec</span>{"\n"}
                <span className="str">Лилит</span>{"  "}--[<span className="kw">работи_на</span>]--{">"} <span className="str">Hetzner сървър</span>{"\n"}
                <span className="str">sqlite-vec</span> --[<span className="kw">поддържа</span>]--{">"} <span className="str">cosine similarity</span>{"\n"}
                <span className="str">sqlite-vec</span> --[<span className="kw">поддържа</span>]--{">"} <span className="str">BM25 fulltext</span>{"\n\n"}
                <span className="cm">{"// BFS заявка:"}</span>{"\n"}
                <span className="cm">{'// "Какви методи за търсене има Лилит?"'}</span>{"\n"}
                <span className="cm">{"// Обход: Лилит → sqlite-vec → cosine, BM25"}</span>
              </CodeBlock>
            </div>
          </FadeIn>

          {/* Reranking & MMR */}
          <FadeIn>
            <div className="group bg-surface border border-border rounded-2xl p-8 hover:border-yellow/40 transition-all duration-300 hover:shadow-[0_0_40px_rgba(251,191,36,0.06)]">
              <h3 className="text-xl font-bold mb-4">Reranking и MMR</h3>
              <p className="text-text-muted mb-5 max-w-3xl leading-relaxed">
                <strong className="text-text">Reranking</strong> — вторично
                класиране с по-мощен модел.{" "}
                <strong className="text-text">
                  Maximal Marginal Relevance (MMR)
                </strong>{" "}
                — балансира релевантност и разнообразие.
              </p>
              <div className="bg-bg border border-border rounded-xl p-6 text-center">
                <div className="inline-block bg-gradient-to-r from-accent/10 via-accent-2/10 to-green/10 rounded-lg px-6 py-3 mb-3">
                  <code className="font-mono text-accent text-base font-medium">
                    MMR = {"λ"} {"·"} Sim(doc, query) {"−"} (1{"−"}{"λ"}) {"·"} max(Sim(doc, D<sub>sel</sub>))
                  </code>
                </div>
                <p className="text-sm text-text-dim">
                  Където <span className="text-accent font-mono">{"λ"}</span> контролира баланса между релевантност и разнообразие
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
