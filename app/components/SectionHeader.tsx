import FadeIn from "./FadeIn";
import Stamp from "./Stamp";

export default function SectionHeader({
  number,
  title,
  sheet,
}: {
  number: string;
  title: string;
  sheet: string;
}) {
  return (
    <FadeIn className="mb-16 flex items-start justify-between gap-4 flex-wrap">
      <div>
        <span className="meta block mb-3">§{number}</span>
        <h2
          className="section-title text-[clamp(28px,4vw,48px)]"
          dangerouslySetInnerHTML={{ __html: title }}
        />
      </div>
      <Stamp rev="A" sheet={sheet} />
    </FadeIn>
  );
}
