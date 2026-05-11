"use client";
import { useState, useRef, useEffect } from "react";

interface Point {
  x: number; y: number; label: string; category: string;
}

const points: Point[] = [
  { x: 0.15, y: 0.75, label: "Котката спи", category: "Животни" },
  { x: 0.19, y: 0.71, label: "Кучето лежи", category: "Животни" },
  { x: 0.11, y: 0.79, label: "Котето дреме", category: "Животни" },
  { x: 0.22, y: 0.68, label: "Птицата лети", category: "Животни" },
  { x: 0.72, y: 0.22, label: "Vector DB", category: "Tech" },
  { x: 0.76, y: 0.18, label: "BM25 search", category: "Tech" },
  { x: 0.79, y: 0.26, label: "Cosine sim", category: "Tech" },
  { x: 0.68, y: 0.28, label: "Embedding", category: "Tech" },
  { x: 0.66, y: 0.17, label: "Neural net", category: "Tech" },
  { x: 0.82, y: 0.74, label: "Биткойн", category: "Finance" },
  { x: 0.86, y: 0.70, label: "Крипто", category: "Finance" },
  { x: 0.78, y: 0.78, label: "Борса", category: "Finance" },
  { x: 0.88, y: 0.67, label: "Валутен курс", category: "Finance" },
  { x: 0.44, y: 0.48, label: "RAG system", category: "RAG" },
  { x: 0.49, y: 0.42, label: "Retrieval", category: "RAG" },
  { x: 0.40, y: 0.54, label: "KG graph", category: "RAG" },
];

const categories = ["Животни", "Tech", "Finance", "RAG"];

export default function EmbeddingViz() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hovered, setHovered] = useState<Point | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    canvas.width = w * 2;
    canvas.height = h * 2;
    const ctx = canvas.getContext("2d")!;
    ctx.scale(2, 2);

    const cyan = "#5cdcff";

    ctx.fillStyle = "#060d11";
    ctx.fillRect(0, 0, w, h);

    // Grid
    ctx.strokeStyle = "rgba(92,220,255,0.04)";
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 10; i++) {
      ctx.beginPath(); ctx.moveTo((i / 10) * w, 0); ctx.lineTo((i / 10) * w, h); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, (i / 10) * h); ctx.lineTo(w, (i / 10) * h); ctx.stroke();
    }

    // Cluster ellipses
    const clusters: Record<string, { cx: number; cy: number; rx: number; ry: number }> = {};
    categories.forEach((cat) => {
      const catPts = points.filter((p) => p.category === cat);
      const cx = catPts.reduce((s, p) => s + p.x, 0) / catPts.length;
      const cy = catPts.reduce((s, p) => s + p.y, 0) / catPts.length;
      const rx = Math.max(...catPts.map((p) => Math.abs(p.x - cx))) + 0.06;
      const ry = Math.max(...catPts.map((p) => Math.abs(p.y - cy))) + 0.06;
      clusters[cat] = { cx, cy, rx, ry };

      const dimmed = activeCategory && cat !== activeCategory;
      ctx.beginPath();
      ctx.ellipse(cx * w, cy * h, rx * w, ry * h, 0, 0, Math.PI * 2);
      ctx.strokeStyle = dimmed ? "rgba(92,220,255,0.03)" : "rgba(92,220,255,0.08)";
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Cluster label
      ctx.font = "600 11px 'IBM Plex Mono', monospace";
      ctx.fillStyle = dimmed ? "rgba(92,220,255,0.06)" : "rgba(92,220,255,0.25)";
      ctx.textAlign = "center";
      ctx.fillText(cat.toUpperCase(), cx * w, (cy - ry) * h - 8);
    });

    // Connections to hovered
    if (hovered) {
      points.forEach((p) => {
        if (p === hovered) return;
        const dist = Math.hypot(p.x - hovered.x, p.y - hovered.y);
        if (dist < 0.2) {
          ctx.beginPath();
          ctx.moveTo(hovered.x * w, hovered.y * h);
          ctx.lineTo(p.x * w, p.y * h);
          ctx.strokeStyle = `rgba(92,220,255,${Math.max(0.05, 0.35 - dist * 1.5)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      });
    }

    // Points
    points.forEach((p) => {
      const dimmed = activeCategory && p.category !== activeCategory;
      const isH = hovered === p;
      const size = isH ? 7 : 4;

      if (isH) {
        ctx.beginPath();
        ctx.arc(p.x * w, p.y * h, 18, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(92,220,255,0.1)";
        ctx.fill();
      }

      ctx.beginPath();
      ctx.arc(p.x * w, p.y * h, size, 0, Math.PI * 2);
      ctx.fillStyle = dimmed ? "rgba(92,220,255,0.1)" : isH ? cyan : "rgba(92,220,255,0.5)";
      ctx.fill();

      // Always show labels (dimmed if filtered)
      const showLabel = !dimmed || isH;
      if (showLabel) {
        ctx.font = `${isH ? "600 " : ""}11px 'IBM Plex Mono', monospace`;
        ctx.fillStyle = isH ? "#eaf6fa" : dimmed ? "rgba(122,169,182,0.15)" : "rgba(122,169,182,0.6)";
        ctx.textAlign = "center";
        ctx.fillText(p.label, p.x * w, p.y * h - size - 6);
      }
    });
  }, [hovered, activeCategory]);

  const onMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = (e.clientX - rect.left) / rect.width;
    const my = (e.clientY - rect.top) / rect.height;
    let closest: Point | null = null;
    let minDist = 0.06;
    points.forEach((p) => {
      const d = Math.hypot(p.x - mx, p.y - my);
      if (d < minDist) { minDist = d; closest = p; }
    });
    setHovered(closest);
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-3">
        <button
          onClick={() => setActiveCategory(null)}
          className={`text-[10px] px-3 py-1.5 border transition-colors ${
            !activeCategory
              ? "border-bl-cyan text-bl-cyan"
              : "border-bl-cyan-ghost text-bl-ink-5 hover:text-bl-ink-3"
          }`}
          style={{ fontFamily: "var(--font-meta)", letterSpacing: "0.1em", textTransform: "uppercase" }}
        >
          all
        </button>
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setActiveCategory(activeCategory === c ? null : c)}
            className={`text-[10px] px-3 py-1.5 border transition-colors ${
              activeCategory === c
                ? "border-bl-cyan text-bl-cyan"
                : "border-bl-cyan-ghost text-bl-ink-5 hover:text-bl-ink-3"
            }`}
            style={{ fontFamily: "var(--font-meta)", letterSpacing: "0.1em", textTransform: "uppercase" }}
          >
            {c}
          </button>
        ))}
      </div>

      <canvas
        ref={canvasRef}
        onMouseMove={onMouseMove}
        onMouseLeave={() => setHovered(null)}
        className="w-full h-[420px] border border-bl-cyan-ghost cursor-crosshair"
      />

      {hovered && (
        <div className="mt-2 flex items-center gap-4" style={{ fontFamily: "var(--font-meta)" }}>
          <span className="text-bl-cyan text-[10px] uppercase tracking-wider">{hovered.category}</span>
          <span className="text-bl-ink text-xs">{hovered.label}</span>
          <span className="text-bl-ink-5 text-[10px]">
            ({(hovered.x * 100).toFixed(0)}, {(hovered.y * 100).toFixed(0)})
          </span>
        </div>
      )}
    </div>
  );
}
