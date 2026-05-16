import FadeIn from "./FadeIn";
import SectionHeader from "./SectionHeader";
import Block from "./Block";
import Crosshairs from "./Crosshairs";

const pros = [
  "Актуални данни без повторно обучение",
  "По-малко халюцинации — генерация от реални документи",
  "Domain-specific знания — вътрешни бази, частна информация",
  "Прозрачност — всеки отговор свързан с конкретни източници",
  "Ефективност — без GPU ресурси за fine-tuning",
];

const cons = [
  "Допълнителна латентност: 50–500ms за извличане",
  "Качество зависи от retriever — грешен chunk = грешен отговор",
  "Поддръжка на индекс — chunking, re-indexing, мониторинг",
  "Контекстен прозорец ограничава количеството извлечена информация",
  "Сложност — vector DB, embedding модел, retriever, reranker",
];

export default function ProsConsSection() {
  return (
    <section id="pros-cons" className="relative py-20 md:py-28 px-8 md:px-14">
      <Crosshairs />
      <div className="max-w-5xl mx-auto">
        <SectionHeader number="06" title="<strong>Предимства</strong> и ограничения" sheet="07/08" />

        <FadeIn>
          <div className="grid md:grid-cols-2 gap-px bg-bl-cyan-ghost">
            <Block label="ADVANTAGES" className="">
              <div className="space-y-3">
                {pros.map((p, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="text-bl-ok text-xs mt-0.5">●</span>
                    <p className="text-bl-ink-2 text-xs leading-relaxed">{p}</p>
                  </div>
                ))}
              </div>
            </Block>
            <Block label="LIMITATIONS" className="">
              <div className="space-y-3">
                {cons.map((c, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="text-bl-warn text-xs mt-0.5">●</span>
                    <p className="text-bl-ink-3 text-xs leading-relaxed">{c}</p>
                  </div>
                ))}
              </div>
            </Block>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
