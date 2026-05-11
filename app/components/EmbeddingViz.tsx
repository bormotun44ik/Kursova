"use client";
import { useState, useRef, useEffect } from "react";

interface Point {
  x: number;
  y: number;
  label: string;
  category: string;
  color: string;
}

const points: Point[] = [
  // Animals cluster
  { x: 0.15, y: 0.75, label: "Котката спи", category: "Животни", color: "#8b5cf6" },
  { x: 0.18, y: 0.72, label: "Кучето лежи", category: "Животни", color: "#8b5cf6" },
  { x: 0.12, y: 0.78, label: "Котето дреме", category: "Животни", color: "#8b5cf6" },
  { x: 0.20, y: 0.70, label: "Птицата лети", category: "Животни", color: "#8b5cf6" },
  // Tech cluster
  { x: 0.72, y: 0.25, label: "Vector database", category: "Технологии", color: "#06b6d4" },
  { x: 0.75, y: 0.22, label: "BM25 search", category: "Технологии", color: "#06b6d4" },
  { x: 0.78, y: 0.28, label: "Cosine similarity", category: "Технологии", color: "#06b6d4" },
  { x: 0.70, y: 0.30, label: "Embedding model", category: "Технологии", color: "#06b6d4" },
  { x: 0.68, y: 0.20, label: "Neural network", category: "Технологии", color: "#06b6d4" },
  // Finance cluster
  { x: 0.80, y: 0.75, label: "Биткойн цена", category: "Финанси", color: "#22c55e" },
  { x: 0.83, y: 0.72, label: "Крипто пазар", category: "Финанси", color: "#22c55e" },
  { x: 0.77, y: 0.78, label: "Борсов индекс", category: "Финанси", color: "#22c55e" },
  { x: 0.85, y: 0.70, label: "Валутен курс", category: "Финанси", color: "#22c55e" },
  // Outliers
  { x: 0.45, y: 0.50, label: "RAG система", category: "RAG", color: "#fbbf24" },
  { x: 0.48, y: 0.45, label: "Retrieval pipeline", category: "RAG", color: "#fbbf24" },
  { x: 0.42, y: 0.52, label: "Knowledge graph", category: "RAG", color: "#fbbf24" },
];

const categories = ["Животни", "Технологии", "Финанси", "RAG"];
const categoryColors: Record<string, string> = {
  "Животни": "#8b5cf6",
  "Технологии": "#06b6d4",
  "Финанси": "#22c55e",
  "RAG": "#fbbf24",
};

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

    // Background
    ctx.fillStyle = "#0a0a0f";
    ctx.fillRect(0, 0, w, h);

    // Grid
    ctx.strokeStyle = "rgba(42,42,60,0.3)";
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 10; i++) {
      ctx.beginPath();
      ctx.moveTo((i / 10) * w, 0);
      ctx.lineTo((i / 10) * w, h);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, (i / 10) * h);
      ctx.lineTo(w, (i / 10) * h);
      ctx.stroke();
    }

    // Draw connections to hovered point
    if (hovered) {
      points.forEach((p) => {
        if (p === hovered) return;
        const dist = Math.hypot(p.x - hovered.x, p.y - hovered.y);
        if (dist < 0.2) {
          ctx.beginPath();
          ctx.moveTo(hovered.x * w, hovered.y * h);
          ctx.lineTo(p.x * w, p.y * h);
          ctx.strokeStyle = `rgba(139,92,246,${0.4 - dist * 2})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      });
    }

    // Points
    points.forEach((p) => {
      const dimmed = activeCategory && p.category !== activeCategory;
      const isHovered = hovered === p;
      const alpha = dimmed ? 0.15 : 1;
      const size = isHovered ? 8 : 5;

      // Glow
      if (isHovered) {
        ctx.beginPath();
        ctx.arc(p.x * w, p.y * h, 20, 0, Math.PI * 2);
        const grd = ctx.createRadialGradient(
          p.x * w, p.y * h, 0,
          p.x * w, p.y * h, 20
        );
        grd.addColorStop(0, p.color + "40");
        grd.addColorStop(1, "transparent");
        ctx.fillStyle = grd;
        ctx.fill();
      }

      ctx.beginPath();
      ctx.arc(p.x * w, p.y * h, size, 0, Math.PI * 2);
      ctx.fillStyle = dimmed ? p.color + "30" : p.color;
      ctx.fill();

      // Label
      if (isHovered || (!dimmed && !activeCategory)) {
        ctx.font = `${isHovered ? "bold " : ""}10px system-ui`;
        ctx.fillStyle = isHovered ? "#e4e4ef" : `rgba(136,136,160,${alpha})`;
        ctx.textAlign = "center";
        ctx.fillText(p.label, p.x * w, p.y * h - size - 6);
      }
    });

    // Cluster labels
    if (!hovered) {
      const clusters = [
        { label: "Животни", x: 0.16, y: 0.65 },
        { label: "Технологии", x: 0.73, y: 0.14 },
        { label: "Финанси", x: 0.81, y: 0.82 },
        { label: "RAG", x: 0.45, y: 0.40 },
      ];
      clusters.forEach((c) => {
        const dimmed = activeCategory && c.label !== activeCategory;
        ctx.font = "bold 11px system-ui";
        ctx.fillStyle = dimmed
          ? "rgba(136,136,160,0.15)"
          : categoryColors[c.label] + "80";
        ctx.textAlign = "center";
        ctx.fillText(c.label, c.x * w, c.y * h);
      });
    }
  }, [hovered, activeCategory]);

  const onMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = (e.clientX - rect.left) / rect.width;
    const my = (e.clientY - rect.top) / rect.height;
    let closest: Point | null = null;
    let minDist = 0.05;
    points.forEach((p) => {
      const d = Math.hypot(p.x - mx, p.y - my);
      if (d < minDist) {
        minDist = d;
        closest = p;
      }
    });
    setHovered(closest);
  };

  return (
    <div>
      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setActiveCategory(null)}
          className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
            !activeCategory
              ? "bg-surface-2 border-border text-text"
              : "border-border text-text-dim hover:text-text"
          }`}
        >
          Всички
        </button>
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setActiveCategory(activeCategory === c ? null : c)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-all flex items-center gap-1.5 ${
              activeCategory === c
                ? "border-border text-text bg-surface-2"
                : "border-border text-text-dim hover:text-text"
            }`}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: categoryColors[c] }}
            />
            {c}
          </button>
        ))}
      </div>

      <div className="relative">
        <canvas
          ref={canvasRef}
          onMouseMove={onMouseMove}
          onMouseLeave={() => setHovered(null)}
          className="w-full h-[350px] rounded-xl border border-border cursor-crosshair"
        />

        {/* Tooltip */}
        {hovered && (
          <div className="absolute top-3 right-3 bg-surface-2 border border-border rounded-lg px-4 py-3 max-w-[200px] pointer-events-none">
            <p className="text-xs font-mono text-accent mb-1">
              {hovered.category}
            </p>
            <p className="text-sm font-medium">{hovered.label}</p>
            <p className="text-xs text-text-dim mt-1">
              Позиция: ({(hovered.x * 100).toFixed(0)}%, {(hovered.y * 100).toFixed(0)}%)
            </p>
          </div>
        )}
      </div>

      <p className="text-xs text-text-dim mt-3 text-center">
        2D проекция на embedding пространство (симулация). Точките от един клъстер
        имат висока cosine similarity помежду си.
      </p>
    </div>
  );
}
