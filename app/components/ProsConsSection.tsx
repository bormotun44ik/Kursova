import FadeIn from "./FadeIn";
import SectionHeader from "./SectionHeader";
import Stagger from "./Stagger";

const pros = [
  { t: "Актуални данни", d: "RAG системата има достъп до най-новата информация без повторно обучение на модела." },
  { t: "По-малко халюцинации", d: "Моделът генерира на базата на реални документи, което значително намалява измислените факти." },
  { t: "Domain-specific знания", d: "Могат да се индексират вътрешни документи, специализирани бази данни и частна информация." },
  { t: "Прозрачност", d: "Всеки отговор може да бъде свързан с конкретни източници, което позволява верификация." },
  { t: "Ефективност", d: "По-евтино от fine-tuning — не се изискват GPU ресурси за допълнително обучение." },
];

const cons = [
  { t: "Допълнителна латентност", d: "Стъпката на извличане добавя 50–500ms забавяне преди генерирането." },
  { t: "Качество на извличане", d: "Ако retrieval не намери правилните документи, моделът ще генерира неточен отговор." },
  { t: "Поддръжка на индекс", d: "Векторната база изисква редовно обновяване, chunking оптимизация и мониторинг." },
  { t: "Контекстен прозорец", d: "Количеството извлечена информация е ограничено от token лимита на модела." },
  { t: "Сложност на системата", d: "RAG добавя допълнителни компоненти, които трябва да се управляват." },
];

function ListCard({
  title,
  items,
  color,
  marker,
  borderColor,
  glowColor,
}: {
  title: string;
  items: { t: string; d: string }[];
  color: string;
  marker: string;
  borderColor: string;
  glowColor: string;
}) {
  return (
    <div
      className={`bg-surface border ${borderColor} rounded-2xl p-8 hover:shadow-[0_0_40px_${glowColor}] transition-shadow duration-500`}
    >
      <h3 className={`${color} text-xl font-bold mb-8 flex items-center gap-2`}>
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-current/10 text-sm">
          {marker === "+" ? "✓" : "✕"}
        </span>
        {title}
      </h3>
      <Stagger className="space-y-5">
        {items.map((item) => (
          <div key={item.t} className="flex gap-3">
            <span className={`${color} font-bold font-mono text-lg leading-none mt-0.5`}>
              {marker}
            </span>
            <div>
              <strong className="block text-[0.95rem]">{item.t}</strong>
              <p className="text-sm text-text-muted mt-0.5 leading-relaxed">
                {item.d}
              </p>
            </div>
          </div>
        ))}
      </Stagger>
    </div>
  );
}

export default function ProsConsSection() {
  return (
    <section id="pros-cons" className="py-28 px-6">
      <div className="max-w-5xl mx-auto">
        <SectionHeader number="05" title="Предимства и ограничения" />

        <FadeIn>
          <div className="grid md:grid-cols-2 gap-6">
            <ListCard
              title="Предимства"
              items={pros}
              color="text-green"
              marker="+"
              borderColor="border-green/20"
              glowColor="rgba(34,197,94,0.06)"
            />
            <ListCard
              title="Ограничения"
              items={cons}
              color="text-red"
              marker={"−"}
              borderColor="border-red/20"
              glowColor="rgba(239,68,68,0.06)"
            />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
