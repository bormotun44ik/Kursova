"use client";
import { useEffect, useState } from "react";
import Crosshairs from "./Crosshairs";

export default function Hero() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <header
      id="hero"
      className="relative min-h-screen flex items-center px-8 md:px-14 py-20"
    >
      <Crosshairs />

      {/* Coordinate labels */}
      <span className="absolute bottom-4 left-8 meta text-[9px] text-bl-ink-5">
        X: 1440.00mm
      </span>
      <span className="absolute bottom-4 right-8 meta text-[9px] text-bl-ink-5">
        Y: 900.00mm
      </span>

      <div
        className="w-full max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center"
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? "none" : "translateY(20px)",
          transition: "all 0.8s ease",
        }}
      >
        {/* Left column */}
        <div>
          <span className="stamp mb-8 inline-block">
            REV.A · SHEET 01/08
          </span>

          <h1 className="section-title text-[clamp(40px,6vw,80px)] mt-6 mb-6">
            Архитектурна{" "}
            <br className="hidden md:block" />
            схема на{" "}
            <strong>RAG.</strong>
          </h1>

          <p className="text-bl-ink-3 text-sm leading-relaxed max-w-md mb-8" style={{ fontFamily: "var(--font-meta)" }}>
            Технически чертёж на Retrieval-Augmented Generation —
            как езиковите модели използват външни източници на знания.
            Курсова работа, тема №4, 2026.
          </p>

          <div className="callouts mb-10">
            <div><b>SCALE</b><span>1 : 1 production</span></div>
            <div><b>STACK</b><span>sqlite-vec · Gemini 4096d · BM25</span></div>
            <div><b>P50</b><span>312ms retrieve + 894ms generate</span></div>
            <div><b>K</b><span>top-8 MMR · score &gt; 0.005</span></div>
          </div>

          <a href="#intro" className="bl-cta">
            Разгледай чертежа
          </a>
        </div>

        {/* Right column — SVG pipeline schematic */}
        <div className="relative flex justify-center">
          <svg
            viewBox="0 0 320 360"
            className="w-full max-w-[320px]"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Connecting lines */}
            <path
              d="M150 80 L150 140"
              stroke="var(--color-bl-cyan-ghost)"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
            <path
              d="M150 200 L150 260"
              stroke="var(--color-bl-cyan-ghost)"
              strokeWidth="1"
              strokeDasharray="4 4"
            />

            {/* Node: embed */}
            <rect x="70" y="30" width="160" height="50" stroke="var(--color-bl-cyan)" strokeWidth="1" />
            <text x="90" y="27" fill="var(--color-bl-cyan)" fontSize="9" fontFamily="var(--font-meta)" letterSpacing="0.15em">EMBED</text>
            <text x="150" y="58" fill="var(--color-bl-ink)" fontSize="13" fontFamily="var(--font-display)" textAnchor="middle" fontWeight="300">embed(query)</text>
            {/* label moved to annotation line */}

            {/* Node: retrieve */}
            <rect x="70" y="140" width="160" height="60" stroke="var(--color-bl-cyan)" strokeWidth="1" />
            <text x="90" y="137" fill="var(--color-bl-cyan)" fontSize="9" fontFamily="var(--font-meta)" letterSpacing="0.15em">RETRIEVE</text>
            <text x="150" y="168" fill="var(--color-bl-ink)" fontSize="13" fontFamily="var(--font-display)" textAnchor="middle" fontWeight="300">hybrid_search()</text>
            <text x="150" y="185" fill="var(--color-bl-ink-4)" fontSize="10" fontFamily="var(--font-meta)" textAnchor="middle">BM25 + cosine</text>

            {/* Node: generate */}
            <rect x="70" y="260" width="160" height="50" stroke="var(--color-bl-cyan)" strokeWidth="1" />
            <text x="90" y="257" fill="var(--color-bl-cyan)" fontSize="9" fontFamily="var(--font-meta)" letterSpacing="0.15em">GENERATE</text>
            <text x="150" y="290" fill="var(--color-bl-ink)" fontSize="13" fontFamily="var(--font-display)" textAnchor="middle" fontWeight="300">claude_sonnet()</text>

            {/* Annotations */}
            <line x1="230" y1="55" x2="255" y2="55" stroke="var(--color-bl-cyan-dim)" strokeWidth="0.5" />
            <text x="258" y="58" fill="var(--color-bl-ink-4)" fontSize="8" fontFamily="var(--font-meta)">4096d</text>
            <line x1="230" y1="170" x2="255" y2="170" stroke="var(--color-bl-cyan-dim)" strokeWidth="0.5" />
            <text x="258" y="173" fill="var(--color-bl-ink-4)" fontSize="8" fontFamily="var(--font-meta)">hybrid</text>
            <line x1="230" y1="290" x2="255" y2="290" stroke="var(--color-bl-cyan-dim)" strokeWidth="0.5" />
            <text x="258" y="293" fill="var(--color-bl-ink-4)" fontSize="8" fontFamily="var(--font-meta)">sonnet</text>

            {/* Pulses */}
            <circle r="3" fill="var(--color-bl-cyan)">
              <animateMotion dur="4s" repeatCount="indefinite" path="M150,80 L150,140" />
              <animate attributeName="opacity" values="0;1;1;0" dur="4s" repeatCount="indefinite" />
            </circle>
            <circle r="3" fill="var(--color-bl-cyan)">
              <animateMotion dur="4s" repeatCount="indefinite" path="M150,200 L150,260" begin="1.5s" />
              <animate attributeName="opacity" values="0;1;1;0" dur="4s" repeatCount="indefinite" begin="1.5s" />
            </circle>
          </svg>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="meta text-[9px] text-bl-ink-5">SCROLL</span>
        <div className="w-px h-6 bg-bl-cyan-ghost" />
      </div>
    </header>
  );
}
