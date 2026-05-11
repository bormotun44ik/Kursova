"use client";

const dots = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  size: 2 + Math.random() * 3,
  dur: 10 + Math.random() * 15,
  delay: Math.random() * 10,
  color:
    i % 3 === 0
      ? "rgba(139,92,246,0.4)"
      : i % 3 === 1
      ? "rgba(6,182,212,0.3)"
      : "rgba(34,197,94,0.25)",
}));

export default function Particles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {dots.map((d) => (
        <div
          key={d.id}
          className="particle"
          style={{
            left: d.left,
            width: d.size,
            height: d.size,
            background: d.color,
            boxShadow: `0 0 ${d.size * 3}px ${d.color}`,
            "--dur": `${d.dur}s`,
            "--delay": `${d.delay}s`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
