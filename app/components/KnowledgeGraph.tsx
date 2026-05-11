"use client";
import { useEffect, useRef, useState } from "react";

interface Node { x: number; y: number; vx: number; vy: number; label: string; size: number; }

const labels = [
  "Лилит", "sqlite-vec", "BM25", "cosine", "Gemini",
  "OpenClaw", "KG-BFS", "Telegram", "MMR", "Plugin",
  "VectorDB", "Embeddings", "RRF", "Obsidian",
];

const edges = [
  [0,1],[0,5],[0,7],[0,13],[1,2],[1,3],[1,10],
  [4,11],[5,9],[6,1],[8,2],[8,3],[9,6],[10,11],[11,4],[12,2],[12,3],
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
      x: w*0.15 + Math.random()*w*0.7,
      y: h*0.15 + Math.random()*h*0.7,
      vx: (Math.random()-0.5)*0.2,
      vy: (Math.random()-0.5)*0.2,
      label,
      size: i === 0 ? 6 : 3,
    }));

    const ctx = canvas.getContext("2d")!;
    ctx.scale(2, 2);

    const cyan = "#5cdcff";
    const dim = "rgba(92,220,255,0.15)";
    const edgeDim = "rgba(92,220,255,0.08)";
    const edgeLit = "rgba(92,220,255,0.35)";

    const draw = () => {
      const nodes = nodesRef.current;
      ctx.clearRect(0, 0, w, h);

      edges.forEach(([a,b]) => {
        const na = nodes[a], nb = nodes[b];
        const lit = hovered === a || hovered === b;
        ctx.beginPath();
        ctx.moveTo(na.x, na.y);
        ctx.lineTo(nb.x, nb.y);
        ctx.strokeStyle = lit ? edgeLit : edgeDim;
        ctx.lineWidth = lit ? 1 : 0.5;
        ctx.stroke();
      });

      nodes.forEach((n, i) => {
        const isH = hovered === i || edges.some(([a,b]) => (a===hovered&&b===i)||(b===hovered&&a===i));

        if (isH) {
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.size*3, 0, Math.PI*2);
          ctx.fillStyle = "rgba(92,220,255,0.06)";
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(n.x, n.y, n.size, 0, Math.PI*2);
        ctx.fillStyle = isH ? cyan : dim;
        ctx.fill();

        if (isH || n.size > 4) {
          ctx.font = `${isH?"500 ":""}9px 'IBM Plex Mono', monospace`;
          ctx.fillStyle = isH ? "#eaf6fa" : "#5a8a96";
          ctx.textAlign = "center";
          ctx.fillText(n.label, n.x, n.y - n.size - 5);
        }

        n.x += n.vx; n.y += n.vy;
        if (n.x < 20 || n.x > w-20) n.vx *= -1;
        if (n.y < 20 || n.y > h-20) n.vy *= -1;
        n.vx += (w/2 - n.x) * 0.00003;
        n.vy += (h/2 - n.y) * 0.00003;
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
    let closest = -1, minDist = 25;
    nodesRef.current.forEach((n, i) => {
      const d = Math.hypot(n.x - mx, n.y - my);
      if (d < minDist) { minDist = d; closest = i; }
    });
    setHovered(closest >= 0 ? closest : null);
  };

  return (
    <canvas
      ref={canvasRef}
      onMouseMove={onMouseMove}
      onMouseLeave={() => setHovered(null)}
      className="w-full h-[280px] border border-bl-cyan-ghost cursor-crosshair bg-bl-paper-deep"
    />
  );
}
