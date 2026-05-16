import FadeIn from "./FadeIn";
import SectionHeader from "./SectionHeader";
import Crosshairs from "./Crosshairs";

const items = [
  { label: "AGENTIC", title: "Agentic RAG", desc: "Агентите сами решават кога и как да търсят. Итеративно усъвършенстват заявки." },
  { label: "REFLECTIVE", title: "Self-Reflective Retrieval", desc: "Моделът оценява качеството на извлечените документи. CRAG, Self-RAG." },
  { label: "MULTIMODAL", title: "Multi-modal RAG", desc: "Извличане от изображения, аудио, видео. GPT-4V, Gemini." },
  { label: "GRAPH", title: "Graph RAG", desc: "Графи на знания + векторно търсене. Microsoft Research. Hybrid стандарт." },
];

export default function FutureSection() {
  return (
    <section id="future" className="relative py-20 md:py-28 px-8 md:px-14 bg-bl-paper-edge">
      <Crosshairs />
      <div className="max-w-5xl mx-auto">
        <SectionHeader number="07" title="<strong>Бъдеще</strong> на RAG" sheet="08/08" />

        <div className="grid sm:grid-cols-2 gap-px bg-bl-cyan-ghost">
          {items.map((item, i) => (
            <FadeIn key={item.label} delay={i * 80}>
              <div className="bg-bl-paper p-6 h-full">
                <span className="meta text-[9px] text-bl-cyan block mb-3">{item.label}</span>
                <h3 className="text-bl-ink text-sm font-medium mb-2">{item.title}</h3>
                <p className="text-bl-ink-3 text-xs leading-relaxed">{item.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
