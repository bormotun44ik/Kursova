import FadeIn from "./FadeIn";
import SectionHeader from "./SectionHeader";
import Stagger from "./Stagger";

const cards = [
  {
    icon: "🤖",
    title: "Agentic RAG",
    text: `AI агентите сами решават кога, какво и как да търсят. Итеративно усъвършенстват заявката си и комбинират резултати от множество източници. Системата «Лилит» е пример.`,
    gradient: "from-accent/10 via-transparent to-transparent",
  },
  {
    icon: "🔄",
    title: "Self-Reflective Retrieval",
    text: "Моделът оценява качеството на извлечените документи и може да реши да търси отново с променена заявка. CRAG и Self-RAG са водещи подходи.",
    gradient: "from-accent-2/10 via-transparent to-transparent",
  },
  {
    icon: "🌐",
    title: "Multi-modal RAG",
    text: "Извличане на информация от изображения, аудио, видео и таблици. GPT-4V и Gemini вече поддържат multi-modal reasoning.",
    gradient: "from-green/10 via-transparent to-transparent",
  },
  {
    icon: "🕸️",
    title: "Graph RAG",
    text: "Комбинация на графи на знания с векторно търсене. Microsoft Research показва значително подобрение при обобщение на големи корпуси.",
    gradient: "from-yellow/10 via-transparent to-transparent",
  },
];

export default function FutureSection() {
  return (
    <section id="future" className="py-28 px-6 bg-bg-alt relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-30" />

      <div className="max-w-5xl mx-auto relative">
        <SectionHeader number="06" title="Бъдещето на RAG" />

        <Stagger className="grid sm:grid-cols-2 gap-5">
          {cards.map((c) => (
            <div
              key={c.title}
              className="group glow-card bg-surface border border-border rounded-2xl p-8 hover:-translate-y-1 transition-all duration-300 cursor-default"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${c.gradient} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity`}
              />
              <div className="relative">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {c.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{c.title}</h3>
                <p className="text-sm text-text-muted leading-relaxed">
                  {c.text}
                </p>
              </div>
            </div>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
