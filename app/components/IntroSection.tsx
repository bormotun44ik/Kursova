import FadeIn from "./FadeIn";
import SectionHeader from "./SectionHeader";
import Block from "./Block";
import Crosshairs from "./Crosshairs";

export default function IntroSection() {
  return (
    <section id="intro" className="relative py-20 md:py-28 px-8 md:px-14">
      <Crosshairs />
      <div className="max-w-5xl mx-auto">
        <SectionHeader number="01" title="<strong>Проблемът</strong> — защо LLM не стигат" sheet="02/08" />

        <FadeIn className="max-w-3xl mb-12">
          <p className="text-bl-ink-2 text-sm leading-relaxed">
            Големите езикови модели демонстрират впечатляващи способности.
            Въпреки това, те имат фундаментални ограничения, които правят
            директната им употреба ненадеждна в production среда.
          </p>
        </FadeIn>

        <div className="grid sm:grid-cols-3 gap-px bg-bl-cyan-ghost">
          {[
            {
              label: "HALLUCINATION",
              title: "Халюцинации",
              text: "Моделът генерира убедителни, но фактически неверни отговори. Не разграничава знание от вероятностно продължение.",
            },
            {
              label: "STALE DATA",
              title: "Остаряла информация",
              text: "Обучителните данни имат cutoff дата. Нови закони, актуализации, текущи събития — невидими.",
            },
            {
              label: "NO DOMAIN",
              title: "Липса на специфика",
              text: "Вътрешна документация, частни бази данни, специализирани области — извън обучителния корпус.",
            },
          ].map((p, i) => (
            <FadeIn key={p.label} delay={i * 100}>
              <div className="bg-bl-paper p-6 h-full">
                <span className="meta text-[9px] text-bl-cyan block mb-3">{p.label}</span>
                <h3 className="text-bl-ink text-base font-medium mb-2">{p.title}</h3>
                <p className="text-bl-ink-3 text-xs leading-relaxed">{p.text}</p>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn className="mt-12">
          <Block label="HYPOTHESIS">
            <p className="text-bl-ink-2 text-sm">
              Как можем да дадем на езиковите модели достъп до актуални, точни и
              специфични знания, без повторно обучение?
            </p>
            <p className="text-bl-cyan text-sm mt-3 font-medium">
              Отговор: RAG — Retrieval-Augmented Generation.
            </p>
          </Block>
        </FadeIn>
      </div>
    </section>
  );
}
