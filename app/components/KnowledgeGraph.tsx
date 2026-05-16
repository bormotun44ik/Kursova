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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      if (w === 0 || h === 0) return;

      canvas.width = w * 2;
      canvas.height = h * 2;

      if (nodesRef.current.length === 0) {
        const cx = w / 2;
        const cy = h / 2;
        nodesRef.current = labels.map((label, i) => {
          const angle = (i / labels.length) * Math.PI * 2;
          const radius = Math.min(w, h) * 0.35;
          return {
            x: cx + Math.cos(angle) * radius * (0.7 + Math.random() * 0.3),
            y: cy + Math.sin(angle) * radius * (0.7 + Math.random() * 0.3),
            vx: 0,
            vy: 0,
            label,
            size: i === 0 ? 7 : 4,
          };
        });
      }

      const ctx = canvas.getContext("2d")!;
      ctx.setTransform(2, 0, 0, 2, 0, 0);

      cancelAnimationFrame(animRef.current);

      const draw = () => {
        const nodes = nodesRef.current;
        const hovered = hoveredRef.current;

        ctx.clearRect(0, 0, w, h);

        // Node repulsion
        for (let i = 0; i < nodes.length; i++) {
          for (let j = i + 1; j < nodes.length; j++) {
            const dx = nodes[j].x - nodes[i].x;
            const dy = nodes[j].y - nodes[i].y;
            const dist = Math.max(10, Math.hypot(dx, dy));
            const minDist = 60;
            if (dist < minDist) {
              const force = (minDist - dist) / dist * 0.08;
              const fx = dx * force;
              const fy = dy * force;
              nodes[i].vx -= fx;
              nodes[i].vy -= fy;
              nodes[j].vx += fx;
              nodes[j].vy += fy;
            }
          }
        }

        // Edge attraction
        edges.forEach(([a, b]) => {
          const dx = nodes[b].x - nodes[a].x;
          const dy = nodes[b].y - nodes[a].y;
          const dist = Math.hypot(dx, dy);
          const target = 80;
          const force = (dist - target) * 0.002;
          const fx = (dx / dist) * force;
          const fy = (dy / dist) * force;
          nodes[a].vx += fx;
          nodes[a].vy += fy;
          nodes[b].vx -= fx;
          nodes[b].vy -= fy;
        });

        // Edges draw
        edges.forEach(([a, b]) => {
          const na = nodes[a], nb = nodes[b];
          const lit = hovered === a || hovered === b;
          ctx.beginPath();
          ctx.moveTo(na.x, na.y);
          ctx.lineTo(nb.x, nb.y);
          ctx.strokeStyle = lit ? "rgba(92,220,255,0.4)" : "rgba(92,220,255,0.1)";
          ctx.lineWidth = lit ? 1.5 : 0.5;
          ctx.stroke();
        });

        // Nodes draw
        nodes.forEach((n, i) => {
          const isH = hovered === i;
          const isNeighbor = !isH && edges.some(
            ([a, b]) => (a === hovered && b === i) || (b === hovered && a === i)
          );
          const lit = isH || isNeighbor;

          if (isH) {
            ctx.beginPath();
            ctx.arc(n.x, n.y, 24, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(92,220,255,0.08)";
            ctx.fill();
          }

          ctx.beginPath();
          ctx.arc(n.x, n.y, lit ? n.size * 1.8 : n.size, 0, Math.PI * 2);
          ctx.fillStyle = lit ? "#5cdcff" : "rgba(92,220,255,0.25)";
          ctx.fill();

          // Labels — always visible
          ctx.font = `${isH ? "600 " : ""}11px 'IBM Plex Mono', monospace`;
          ctx.fillStyle = isH ? "#eaf6fa" : isNeighbor ? "#7ba9b6" : "rgba(122,169,182,0.5)";
          ctx.textAlign = "center";
          ctx.fillText(n.label, n.x, n.y - (lit ? n.size * 1.8 : n.size) - 6);

          // Physics
          n.vx += (w / 2 - n.x) * 0.0001;
          n.vy += (h / 2 - n.y) * 0.0001;
          n.vx *= 0.92;
          n.vy *= 0.92;
          n.x += n.vx;
          n.y += n.vy;
          if (n.x < 40) { n.x = 40; n.vx *= -0.5; }
          if (n.x > w - 40) { n.x = w - 40; n.vx *= -0.5; }
          if (n.y < 30) { n.y = 30; n.vy *= -0.5; }
          if (n.y > h - 30) { n.y = h - 30; n.vy *= -0.5; }
        });

        animRef.current = requestAnimationFrame(draw);
      };

      draw();
    };

    requestAnimationFrame(() => requestAnimationFrame(resize));
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    let closest = -1;
    let minDist = 35;
    nodesRef.current.forEach((n, i) => {
      const d = Math.hypot(n.x - mx, n.y - my);
      if (d < minDist) { minDist = d; closest = i; }
    });
    hoveredRef.current = closest >= 0 ? closest : null;
  }, []);

  return (
    <canvas
      ref={canvasRef}
      onMouseMove={onMouseMove}
      onMouseLeave={() => { hoveredRef.current = null; }}
      className="w-full h-[360px] border border-bl-cyan-ghost cursor-crosshair bg-bl-paper-deep"
    />
  );
}
