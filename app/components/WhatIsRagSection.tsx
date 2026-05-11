"use client";
import FadeIn from "./FadeIn";
import SectionHeader from "./SectionHeader";

const steps = [
  {
    num: 1,
    title: "Извличане",
    sub: "Retrieval",
    text: "Потребителската заявка се трансформира в embedding вектор и се търсят най-релевантните документи от базата данни.",
    color: "text-accent",
    bg: "bg-accent",
    glow: "shadow-[0_0_40px_rgba(139,92,246,0.15)]",
    border: "hover:border-accent/50",
  },
  {
    num: 2,
    title: "Обогатяване",
    sub: "Augmentation",
    text: "Извлечените документи се добавят към промпта на модела като контекст, заедно с оригиналната заявка.",
    color: "text-accent-2",
    bg: "bg-accent-2",
    glow: "shadow-[0_0_40px_rgba(6,182,212,0.15)]",
    border: "hover:border-accent-2/50",
  },
  {
    num: 3,
    title: "Генериране",
    sub: "Generation",
    text: "LLM генерира отговор, базиран на предоставения контекст, вместо да разчита само на вътрешните си параметри.",
    color: "text-green",
    bg: "bg-green",
    glow: "shadow-[0_0_40px_rgba(34,197,94,0.15)]",
    border: "hover:border-green/50",
  },
];

const rows = [
  ["Актуалност на данни", "Ниска (при обучение)", "Средна (ръчно)", "Висока (реално време)"],
  ["Цена", "Висока (GPU ресурси)", "Ниска", "Средна"],
  ["Гъвкавост", "Ниска", "Висока", "Висока"],
  ["Прозрачност", "Ниска", "Средна", "Висока (цитати)"],
  ["Скалируемост", "Трудна", "Ограничена от контекста", "Добра"],
];

export default function WhatIsRagSection() {
  return (
    <section id="what-is-rag" className="py-28 px-6 bg-bg-alt relative overflow-hidden">
      {/* Subtle grid */}
      <div className="absolute inset-0 grid-bg opacity-50" />

      <div className="max-w-5xl mx-auto relative">
        <SectionHeader number="02" title="Какво е RAG?" />

        <FadeIn className="max-w-3xl mb-14">
          <p className="text-text-muted leading-relaxed text-lg">
            <strong className="text-text">
              Retrieval-Augmented Generation (RAG)
            </strong>{" "}
            е архитектурен подход, при който езиковият модел се свързва с външни
            източници на знания по време на генериране на отговор. Въведен от{" "}
            <em className="text-accent/80">Lewis et al.</em> през 2020 г.
          </p>
        </FadeIn>

        {/* Pipeline */}
        <FadeIn className="mb-20">
          <h3 className="text-center text-text-muted text-lg mb-10">
            RAG Pipeline — Тристъпков процес
          </h3>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6">
            {steps.map((s, i) => (
              <div key={s.num} className="contents">
                <div
                  className={`group bg-surface border border-border rounded-2xl p-8 text-center flex-1 min-w-[220px] max-w-[300px] hover:-translate-y-2 transition-all duration-500 ${s.glow} ${s.border}`}
                >
                  <div
                    className={`inline-flex items-center justify-center w-12 h-12 ${s.bg} text-white rounded-full text-lg font-bold mb-4 group-hover:scale-110 transition-transform shadow-lg`}
                  >
                    {s.num}
                  </div>
                  <h4 className="font-bold text-lg mb-1">
                    {s.title}
                    <span
                      className={`block text-xs ${s.color} font-medium mt-1 tracking-wider uppercase`}
                    >
                      {s.sub}
                    </span>
                  </h4>
                  <p className="text-sm text-text-muted leading-relaxed mt-3">
                    {s.text}
                  </p>
                </div>
                {i < steps.length - 1 && (
                  <div className="flex items-center">
                    <div className="hidden md:flex items-center">
                      <div className="w-8 h-[2px] bg-gradient-to-r from-accent/40 to-accent-2/40" />
                      <svg
                        className="w-4 h-4 text-accent-2/60 -ml-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" />
                      </svg>
                    </div>
                    <svg
                      className="md:hidden w-4 h-4 text-accent-2/60 rotate-90"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </FadeIn>

        {/* Comparison Table */}
        <FadeIn>
          <h3 className="text-text-muted text-lg mb-6">
            Сравнение на подходите
          </h3>
          <div className="overflow-x-auto rounded-xl border border-border bg-surface/50 backdrop-blur">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-surface-2/80">
                  <th className="text-left p-4 font-semibold text-xs uppercase tracking-wider text-text-dim">
                    Критерий
                  </th>
                  <th className="text-left p-4 font-semibold text-xs uppercase tracking-wider text-text-dim">
                    Fine-tuning
                  </th>
                  <th className="text-left p-4 font-semibold text-xs uppercase tracking-wider text-text-dim">
                    Prompt Eng.
                  </th>
                  <th className="text-left p-4 font-semibold text-xs uppercase tracking-wider text-accent">
                    RAG
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr
                    key={row[0]}
                    className="border-t border-border/50 hover:bg-accent/[0.03] transition-colors"
                  >
                    <td className="p-4 text-text-muted font-medium">{row[0]}</td>
                    <td className="p-4 text-text-dim">{row[1]}</td>
                    <td className="p-4 text-text-dim">{row[2]}</td>
                    <td className="p-4 font-medium text-text bg-accent/[0.04]">
                      {row[3]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
