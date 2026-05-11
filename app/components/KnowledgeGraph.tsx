"use client";
import { useEffect, useRef, useCallback } from "react";

interface Node { x: number; y: number; vx: number; vy: number; label: string; size: number; }

const labels = [
  "Лилит", "sqlite-vec", "BM25", "cosine", "Gemini",
  "OpenClaw", "KG-BFS", "Telegram", "MMR", "Plugin",
  "VectorDB", "Embeddings", "RRF", "Obsidian",
];

const edges: [number, number][] = [
  [0,1],[0,5],[0,7],[0,13],[1,2],[1,3],[1,10],
  [4,11],[5,9],[6,1],[8,2],[8,3],[9,6],[10,11],[11,4],[12,2],[12,3],
];

export default function KnowledgeGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<Node[]>([]);
  const hoveredRef = useRef<number | null>(null);
  const animRef = useRef<number>(0);
  const initRef = useRef(false);

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    canvas.width = w * 2;
    canvas.height = h * 2;

    nodesRef.current = labels.map((label, i) => ({
      x: w * 0.15 + Math.random() * w * 0.7,
      y: h * 0.15 + Math.random() * h * 0.7,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
      label,
      size: i === 0 ? 7 : 3.5,
    }));

    const ctx = canvas.getContext("2d")!;
    ctx.scale(2, 2);

    const draw = () => {
      const nodes = nodesRef.current;
      const hovered = hoveredRef.current;

      ctx.clearRect(0, 0, w, h);

      // Edges
      edges.forEach(([a, b]) => {
        const na = nodes[a], nb = nodes[b];
        const lit = hovered === a || hovered === b;
        ctx.beginPath();
        ctx.moveTo(na.x, na.y);
        ctx.lineTo(nb.x, nb.y);
        ctx.strokeStyle = lit ? "rgba(92,220,255,0.4)" : "rgba(92,220,255,0.07)";
        ctx.lineWidth = lit ? 1 : 0.5;
        ctx.stroke();
      });

      // Nodes
      nodes.forEach((n, i) => {
        const isH = hovered === i;
        const isNeighbor = !isH && edges.some(
          ([a, b]) => (a === hovered && b === i) || (b === hovered && a === i)
        );
        const lit = isH || isNeighbor;

        // Glow
        if (isH) {
          ctx.beginPath();
          ctx.arc(n.x, n.y, 20, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(92,220,255,0.08)";
          ctx.fill();
        }

        // Dot
        ctx.beginPath();
        ctx.arc(n.x, n.y, lit ? n.size * 1.5 : n.size, 0, Math.PI * 2);
        ctx.fillStyle = lit ? "#5cdcff" : "rgba(92,220,255,0.2)";
        ctx.fill();

        // Label — always show for main node, on hover for others
        if (isH || isNeighbor || n.size > 5) {
          ctx.font = `${isH ? "600 " : ""}11px 'IBM Plex Mono', monospace`;
          ctx.fillStyle = isH ? "#eaf6fa" : isNeighbor ? "#7ba9b6" : "#5a8a96";
          ctx.textAlign = "center";
          ctx.fillText(n.label, n.x, n.y - (lit ? n.size * 1.5 : n.size) - 6);
        }

        // Physics
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 30 || n.x > w - 30) n.vx *= -1;
        if (n.y < 30 || n.y > h - 30) n.vy *= -1;
        n.vx += (w / 2 - n.x) * 0.00002;
        n.vy += (h / 2 - n.y) * 0.00002;
        n.vx *= 0.999;
        n.vy *= 0.999;
      });

      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    let closest = -1;
    let minDist = 30;
    nodesRef.current.forEach((n, i) => {
      const d = Math.hypot(n.x - mx, n.y - my);
      if (d < minDist) { minDist = d; closest = i; }
    });
    hoveredRef.current = closest >= 0 ? closest : null;
  }, []);

  const onMouseLeave = useCallback(() => {
    hoveredRef.current = null;
  }, []);

  return (
    <canvas
      ref={canvasRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className="w-full h-[320px] border border-bl-cyan-ghost cursor-crosshair bg-bl-paper-deep"
    />
  );
}
