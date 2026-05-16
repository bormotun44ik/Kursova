import FadeIn from "./FadeIn";
import SectionHeader from "./SectionHeader";
import Block from "./Block";
import Crosshairs from "./Crosshairs";

const rows = [
  ["Актуалност", "Ниска", "Средна", "Висока"],
  ["Цена", "Висока", "Ниска", "Средна"],
  ["Гъвкавост", "Ниска", "Висока", "Висока"],
  ["Прозрачност", "Ниска", "Средна", "Висока"],
  ["Скалируемост", "Трудна", "Ограничена", "Добра"],
];

export default function WhatIsRagSection() {
  return (
    <section id="what-is-rag" className="relative py-20 md:py-28 px-8 md:px-14">
      <Crosshairs />
      <div className="max-w-5xl mx-auto">
        <SectionHeader number="02" title="Какво е <strong>RAG</strong>" sheet="03/08" />

        <FadeIn className="max-w-3xl mb-14">
          <p className="text-bl-ink-2 text-sm leading-relaxed">
            Retrieval-Augmented Generation — архитектурен подход, при който
            езиковият модел се свързва с външни източници на знания по време
            на генериране. Въведен от Lewis et al. (2020).
          </p>
        </FadeIn>

        {/* Pipeline */}
        <FadeIn className="mb-16">
          <div className="flex flex-col md:flex-row items-stretch gap-px bg-bl-cyan-ghost">
            {[
              { n: "01", label: "RETRIEVE", title: "Извличане", desc: "Заявката се трансформира в embedding вектор. Търсят се най-релевантните документи." },
              { n: "02", label: "AUGMENT", title: "Обогатяване", desc: "Извлечените документи се добавят към промпта като контекст." },
              { n: "03", label: "GENERATE", title: "Генериране", desc: "LLM генерира отговор базиран на предоставения контекст." },
            ].map((s) => (
              <div key={s.n} className="flex-1 bg-bl-paper p-6">
                <div className="flex items-baseline gap-3 mb-3">
                  <span className="text-bl-cyan text-2xl font-light">{s.n}</span>
                  <span className="meta text-[9px] text-bl-cyan">{s.label}</span>
                </div>
                <h3 className="text-bl-ink text-base font-medium mb-2">{s.title}</h3>
                <p className="text-bl-ink-3 text-xs leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
          {/* Connecting arrows */}
          <div className="hidden md:flex justify-around mt-0 -mb-2 px-16">
            <span className="text-bl-cyan-dim text-xs">→</span>
            <span className="text-bl-cyan-dim text-xs">→</span>
          </div>
        </FadeIn>

        {/* Comparison */}
        <FadeIn>
          <Block label="COMPARISON MATRIX">
            <div className="overflow-x-auto">
              <table className="w-full text-xs" style={{ fontFamily: "var(--font-meta)" }}>
                <thead>
                  <tr className="border-b border-bl-cyan-ghost">
                    <th className="text-left py-2 pr-4 text-bl-ink-4 font-normal tracking-wider uppercase">Критерий</th>
                    <th className="text-left py-2 pr-4 text-bl-ink-5 font-normal tracking-wider uppercase">Fine-tune</th>
                    <th className="text-left py-2 pr-4 text-bl-ink-5 font-normal tracking-wider uppercase">Prompt Eng</th>
                    <th className="text-left py-2 pr-4 text-bl-cyan font-normal tracking-wider uppercase">RAG</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r[0]} className="border-b border-bl-cyan-trace">
                      <td className="py-2 pr-4 text-bl-ink-3">{r[0]}</td>
                      <td className="py-2 pr-4 text-bl-ink-5">{r[1]}</td>
                      <td className="py-2 pr-4 text-bl-ink-5">{r[2]}</td>
                      <td className="py-2 pr-4 text-bl-ink font-medium">{r[3]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Block>
        </FadeIn>
      </div>
    </section>
  );
}
