"use client";
import { useEffect, useRef, useState } from "react";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  label: string;
  color: string;
  size: number;
}

const labels = [
  "Лилит", "sqlite-vec", "BM25", "cosine", "Gemini",
  "OpenClaw", "KG-BFS", "Telegram", "MMR", "Plugin",
  "Vector DB", "Embeddings", "RRF", "Obsidian",
];

const colors = ["#8b5cf6", "#06b6d4", "#22c55e", "#fbbf24", "#ef4444"];

const edges = [
  [0, 1], [0, 5], [0, 7], [0, 13], [1, 2], [1, 3], [1, 10],
  [4, 11], [5, 9], [6, 1], [8, 2], [8, 3], [9, 6], [10, 11],
  [11, 4], [12, 2], [12, 3],
];

export default function KnowledgeGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<Node[]>([]);
  const [hovered, setHovered] = useState<number | null>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    canvas.width = w * 2;
    canvas.height = h * 2;

    nodesRef.current = labels.map((label, i) => ({
      x: w * 0.2 + Math.random() * w * 0.6,
      y: h * 0.2 + Math.random() * h * 0.6,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      label,
      color: colors[i % colors.length],
      size: i === 0 ? 8 : 4 + Math.random() * 3,
    }));

    const ctx = canvas.getContext("2d")!;
    ctx.scale(2, 2);

    const draw = () => {
      const nodes = nodesRef.current;
      ctx.clearRect(0, 0, w, h);

      // edges
      edges.forEach(([a, b]) => {
        const na = nodes[a], nb = nodes[b];
        const isHighlighted = hovered === a || hovered === b;
        ctx.beginPath();
        ctx.moveTo(na.x, na.y);
        ctx.lineTo(nb.x, nb.y);
        ctx.strokeStyle = isHighlighted
          ? "rgba(139,92,246,0.4)"
          : "rgba(42,42,60,0.5)";
        ctx.lineWidth = isHighlighted ? 1.5 : 0.5;
        ctx.stroke();
      });

      // nodes
      nodes.forEach((n, i) => {
        const isHighlighted =
          hovered === i ||
          edges.some(
            ([a, b]) => (a === hovered && b === i) || (b === hovered && a === i)
          );

        // glow
        if (isHighlighted) {
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.size * 3, 0, Math.PI * 2);
          ctx.fillStyle = n.color.replace(")", ",0.15)").replace("rgb", "rgba");
          ctx.fill();
        }

        // circle
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.size, 0, Math.PI * 2);
        ctx.fillStyle = isHighlighted ? n.color : n.color + "88";
        ctx.fill();

        // label
        if (isHighlighted || n.size > 6) {
          ctx.font = `${isHighlighted ? "bold " : ""}10px system-ui`;
          ctx.fillStyle = isHighlighted ? "#e4e4ef" : "#888";
          ctx.textAlign = "center";
          ctx.fillText(n.label, n.x, n.y - n.size - 6);
        }

        // move
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 20 || n.x > w - 20) n.vx *= -1;
        if (n.y < 20 || n.y > h - 20) n.vy *= -1;

        // gentle pull toward center
        n.vx += (w / 2 - n.x) * 0.00005;
        n.vy += (h / 2 - n.y) * 0.00005;
      });

      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, [hovered]);

  const onMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    let closest = -1;
    let minDist = 30;
    nodesRef.current.forEach((n, i) => {
      const d = Math.hypot(n.x - mx, n.y - my);
      if (d < minDist) {
        minDist = d;
        closest = i;
      }
    });
    setHovered(closest >= 0 ? closest : null);
  };

  return (
    <canvas
      ref={canvasRef}
      onMouseMove={onMouseMove}
      onMouseLeave={() => setHovered(null)}
      className="w-full h-[300px] rounded-xl bg-bg/50 border border-border cursor-crosshair"
    />
  );
}
