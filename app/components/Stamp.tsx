export default function Stamp({ rev, sheet }: { rev: string; sheet: string }) {
  return <span className="stamp">REV.{rev} · SHEET {sheet}</span>;
}
