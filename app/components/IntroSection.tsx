import FadeIn from "./FadeIn";
import SectionHeader from "./SectionHeader";
import Stagger from "./Stagger";

const problems = [
  {
    icon: "🎭",
    title: "Халюцинации",
    text: `LLM модели генерират отговори, които звучат убедително, но са фактически неверни. Моделът «измисля» факти, защото не може да разграничи знание от вероятностно продължение на текст.`,
    gradient: "from-purple-500/10 to-transparent",
  },
  {
    icon: "📅",
    title: "Остаряла информация",
    text: "Моделите са обучени с данни до определена дата (knowledge cutoff). Всичко след тази дата е невидимо — нови закони, актуализации, текущи събития остават неизвестни.",
    gradient: "from-cyan-500/10 to-transparent",
  },
  {
    icon: "🔒",
    title: "Липса на специфични знания",
    text: "Вътрешна документация, частни бази данни, специализирани области — LLM няма достъп до тях, тъй като не са били част от обучителните данни.",
    gradient: "from-green-500/10 to-transparent",
  },
];

export default function IntroSection() {
  return (
    <section id="intro" className="py-28 px-6 relative">
      <div className="max-w-5xl mx-auto">
        <SectionHeader number="01" title="Въведение — Проблемът" />

        <FadeIn className="max-w-3xl mb-12">
          <p className="text-text-muted leading-relaxed text-lg">
            Големите езикови модели (LLM) като GPT-4, Claude и Gemini
            демонстрират впечатляващи способности за генериране на текст. Въпреки
            това, те имат{" "}
            <strong className="text-text">фундаментални ограничения</strong>,
            които правят директната им употреба ненадеждна.
          </p>
        </FadeIn>

        <Stagger className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {problems.map((p) => (
            <div
              key={p.title}
              className="glow-card group bg-surface border border-border rounded-xl p-7 hover:-translate-y-1 transition-all duration-300 cursor-default"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${p.gradient} rounded-xl opacity-0 group-hover:opacity-100 transition-opacity`}
              />
              <div className="relative">
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">
                  {p.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{p.title}</h3>
                <p className="text-sm text-text-muted leading-relaxed">
                  {p.text}
                </p>
              </div>
            </div>
          ))}
        </Stagger>

        <FadeIn className="mt-12">
          <div className="relative overflow-hidden rounded-xl">
            <div className="animated-border p-[1px] rounded-xl">
              <div className="bg-surface rounded-xl p-8">
                <p className="text-text-muted text-lg">
                  <strong className="text-text">Ключов въпрос:</strong> Как
                  можем да дадем на езиковите модели достъп до актуални, точни и
                  специфични знания, без да ги обучаваме наново?
                </p>
                <p className="text-text-muted mt-3 text-lg">
                  Отговорът е{" "}
                  <strong className="text-accent text-xl">RAG</strong>{" "}
                  <span className="text-text-dim">
                    — Retrieval-Augmented Generation.
                  </span>
                </p>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
