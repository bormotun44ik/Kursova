"use client";
import { useState, useRef, useEffect } from "react";

interface Point {
  x: number; y: number; label: string; category: string;
}

const points: Point[] = [
  { x: 0.15, y: 0.75, label: "Котката спи", category: "Животни" },
  { x: 0.18, y: 0.72, label: "Кучето лежи", category: "Животни" },
  { x: 0.12, y: 0.78, label: "Котето дреме", category: "Животни" },
  { x: 0.20, y: 0.70, label: "Птицата лети", category: "Животни" },
  { x: 0.72, y: 0.25, label: "Vector DB", category: "Tech" },
  { x: 0.75, y: 0.22, label: "BM25 search", category: "Tech" },
  { x: 0.78, y: 0.28, label: "Cosine sim", category: "Tech" },
  { x: 0.70, y: 0.30, label: "Embedding", category: "Tech" },
  { x: 0.80, y: 0.75, label: "Биткойн", category: "Finance" },
  { x: 0.83, y: 0.72, label: "Крипто", category: "Finance" },
  { x: 0.77, y: 0.78, label: "Борса", category: "Finance" },
  { x: 0.45, y: 0.50, label: "RAG system", category: "RAG" },
  { x: 0.48, y: 0.45, label: "Retrieval", category: "RAG" },
  { x: 0.42, y: 0.52, label: "KG graph", category: "RAG" },
];

export default function EmbeddingViz() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hovered, setHovered] = useState<Point | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    canvas.width = w * 2;
    canvas.height = h * 2;
    const ctx = canvas.getContext("2d")!;
    ctx.scale(2, 2);

    ctx.fillStyle = "#060d11";
    ctx.fillRect(0, 0, w, h);

    // Minor grid
    ctx.strokeStyle = "rgba(92,220,255,0.04)";
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 10; i++) {
      ctx.beginPath(); ctx.moveTo((i/10)*w, 0); ctx.lineTo((i/10)*w, h); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, (i/10)*h); ctx.lineTo(w, (i/10)*h); ctx.stroke();
    }

    // Connections to hovered
    if (hovered) {
      points.forEach((p) => {
        if (p === hovered) return;
        const dist = Math.hypot(p.x - hovered.x, p.y - hovered.y);
        if (dist < 0.15) {
          ctx.beginPath();
          ctx.moveTo(hovered.x * w, hovered.y * h);
          ctx.lineTo(p.x * w, p.y * h);
          ctx.strokeStyle = `rgba(92,220,255,${0.3 - dist * 2})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      });
    }

    // Points
    const cyan = "#5cdcff";
    const dim = "rgba(92,220,255,0.3)";
    points.forEach((p) => {
      const isH = hovered === p;
      const size = isH ? 6 : 3;

      if (isH) {
        ctx.beginPath();
        ctx.arc(p.x*w, p.y*h, 15, 0, Math.PI*2);
        ctx.fillStyle = "rgba(92,220,255,0.08)";
        ctx.fill();
      }

      ctx.beginPath();
      ctx.arc(p.x*w, p.y*h, size, 0, Math.PI*2);
      ctx.fillStyle = isH ? cyan : dim;
      ctx.fill();

      if (isH) {
        ctx.font = "9px 'IBM Plex Mono', monospace";
        ctx.fillStyle = "#eaf6fa";
        ctx.textAlign = "center";
        ctx.fillText(p.label, p.x*w, p.y*h - size - 8);
        ctx.font = "8px 'IBM Plex Mono', monospace";
        ctx.fillStyle = "#5a8a96";
        ctx.fillText(p.category, p.x*w, p.y*h - size - 18);
      }
    });
  }, [hovered]);

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
      if (d < minDist) { minDist = d; closest = p; }
    });
    setHovered(closest);
  };

  return (
    <canvas
      ref={canvasRef}
      onMouseMove={onMouseMove}
      onMouseLeave={() => setHovered(null)}
      className="w-full h-[280px] border border-bl-cyan-ghost cursor-crosshair"
    />
  );
}
