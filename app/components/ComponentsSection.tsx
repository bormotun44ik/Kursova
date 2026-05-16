import FadeIn from "./FadeIn";
import SectionHeader from "./SectionHeader";
import Block from "./Block";
import Crosshairs from "./Crosshairs";
import EmbeddingViz from "./EmbeddingViz";

export default function ComponentsSection() {
  return (
    <section id="components" className="relative py-20 md:py-28 px-8 md:px-14 bg-bl-paper-edge">
      <Crosshairs />
      <div className="max-w-5xl mx-auto">
        <SectionHeader number="03" title="<strong>Компоненти</strong> на RAG система" sheet="04/08" />

        <div className="space-y-8">
          {/* Embeddings */}
          <FadeIn>
            <Block label="EMBEDDINGS">
              <p className="text-bl-ink-2 text-sm mb-4 max-w-2xl leading-relaxed">
                Embedding моделите преобразуват текст в числови вектори (768–4096d).
                Семантично близки текстове получават близки вектори.
              </p>
              <div className="bl-log mb-5">
                <div><span className="ts">embed</span><span className="lv">IN</span> &quot;Котката спи на дивана&quot; → [0.12, 0.85, ...]</div>
                <div><span className="ts">embed</span><span className="lv">IN</span> &quot;Котето дреме на канапето&quot; → [0.13, 0.84, ...]</div>
                <div><span className="ts">cosine</span><span className="lv">OK</span> similarity = 0.97</div>
                <div style={{ opacity: 0.5 }}><span className="ts">embed</span><span className="lv">IN</span> &quot;Цената на биткойн расте&quot; → [0.91, 0.02, ...]</div>
                <div style={{ opacity: 0.5 }}><span className="ts">cosine</span><span className="lv">--</span> similarity = 0.12</div>
              </div>
              <span className="meta text-[10px] text-bl-ink-4 block mb-5">
                Модели: OpenAI text-embedding-3 · Google Gemini · BGE-M3 (OSS)
              </span>
              <h4 className="meta text-[10px] text-bl-cyan mb-3">EMBEDDING SPACE PROJECTION</h4>
              <EmbeddingViz />
            </Block>
          </FadeIn>

          {/* Chunking */}
          <FadeIn>
            <Block label="CHUNKING STRATEGIES">
              <p className="text-bl-ink-2 text-sm mb-5 max-w-2xl leading-relaxed">
                Документите се разделят на фрагменти (chunks) за индексиране.
                Стратегията пряко влияе на качеството на извличане.
              </p>
              <div className="grid sm:grid-cols-3 gap-px bg-bl-cyan-ghost">
                {[
                  { label: "FIXED", title: "Фиксиран размер", desc: "Всеки N токена с overlap. Просто, но раздробява контекст." },
                  { label: "SEMANTIC", title: "Семантично", desc: "По смислови граници — параграфи, теми. По-добро качество." },
                  { label: "RECURSIVE", title: "Рекурсивно", desc: "Глави → параграфи → изречения. Баланс между контекст и гранулярност." },
                ].map((c) => (
                  <div key={c.label} className="bg-bl-paper p-5">
                    <span className="meta text-[9px] text-bl-cyan block mb-2">{c.label}</span>
                    <h4 className="text-bl-ink text-sm font-medium mb-1">{c.title}</h4>
                    <p className="text-bl-ink-3 text-xs leading-relaxed">{c.desc}</p>
                  </div>
                ))}
              </div>
            </Block>
          </FadeIn>

          {/* Retrieval Methods */}
          <FadeIn>
            <Block label="RETRIEVAL METHODS">
              <div className="space-y-4">
                {[
                  { tag: "sparse", name: "BM25", desc: "Пълнотекстово търсене. Точно съвпадение на ключови думи. Бърз." },
                  { tag: "dense", name: "Vector Search", desc: "Cosine similarity между embeddings. Разбира семантика — намира парафрази." },
                  { tag: "hybrid", name: "Hybrid Search", desc: "BM25 + Vector с настройваеми тегла. RRF обединява резултатите." },
                ].map((m) => (
                  <div key={m.name} className="flex items-start gap-4 py-3 border-b border-bl-cyan-trace last:border-0">
                    <span className="bl-tag shrink-0 mt-0.5">{m.tag}</span>
                    <div>
                      <span className="text-bl-ink text-sm font-medium">{m.name}</span>
                      <p className="text-bl-ink-3 text-xs mt-1">{m.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Block>
          </FadeIn>

          {/* Knowledge Graphs */}
          <FadeIn>
            <Block label="KNOWLEDGE GRAPHS">
              <p className="text-bl-ink-2 text-sm mb-4 max-w-2xl leading-relaxed">
                Структурирано представяне чрез ентитети (nodes) и релации (edges).
                Проследяват многостъпкови връзки — за разлика от векторното търсене.
              </p>
              <div className="bl-log">
                <div><span className="lv">EDGE</span> Лилит --[използва]--&gt; sqlite-vec</div>
                <div><span className="lv">EDGE</span> Лилит --[работи_на]--&gt; Hetzner</div>
                <div><span className="lv">EDGE</span> sqlite-vec --[поддържа]--&gt; cosine</div>
                <div><span className="lv">EDGE</span> sqlite-vec --[поддържа]--&gt; BM25</div>
                <div style={{ opacity: 0.5 }}><span className="ts">query</span><span className="lv">BFS</span> Лилит → sqlite-vec → cosine, BM25</div>
              </div>
            </Block>
          </FadeIn>

          {/* MMR */}
          <FadeIn>
            <Block label="RERANKING · MMR">
              <p className="text-bl-ink-2 text-sm mb-4 max-w-2xl leading-relaxed">
                Reranking — вторично класиране с по-мощен модел.
                MMR балансира релевантност и разнообразие.
              </p>
              <div className="bg-bl-paper-deep border-l-2 border-bl-cyan p-4">
                <code className="text-bl-cyan text-sm">
                  MMR = λ · Sim(doc, query) − (1−λ) · max(Sim(doc, D<sub>sel</sub>))
                </code>
                <p className="text-bl-ink-4 text-xs mt-2" style={{ fontFamily: "var(--font-meta)" }}>
                  λ контролира баланса: релевантност ↔ разнообразие
                </p>
              </div>
            </Block>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
