import FadeIn from "./FadeIn";

export default function SectionHeader({
  number,
  title,
}: {
  number: string;
  title: string;
}) {
  return (
    <FadeIn className="mb-12">
      <span className="block text-sm text-accent font-semibold tracking-widest font-mono mb-2">
        {number}
      </span>
      <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
        {title}
      </h2>
    </FadeIn>
  );
}
