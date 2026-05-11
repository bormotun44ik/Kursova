"use client";
import { useEffect, useState } from "react";
import Particles from "./Particles";

const words = ["Извличане", "Обогатяване", "Генериране"];

function TypingText() {
  const [wordIdx, setWordIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[wordIdx];
    const speed = deleting ? 40 : 80;

    if (!deleting && charIdx === word.length) {
      const t = setTimeout(() => setDeleting(true), 1800);
      return () => clearTimeout(t);
    }
    if (deleting && charIdx === 0) {
      setDeleting(false);
      setWordIdx((i) => (i + 1) % words.length);
      return;
    }

    const t = setTimeout(
      () => setCharIdx((c) => c + (deleting ? -1 : 1)),
      speed
    );
    return () => clearTimeout(t);
  }, [charIdx, deleting, wordIdx]);

  return (
    <span className="text-accent-2">
      {words[wordIdx].slice(0, charIdx)}
      <span className="inline-block w-[2px] h-[1em] bg-accent-2 ml-0.5 align-text-bottom animate-pulse" />
    </span>
  );
}

export default function Hero() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <header
      id="hero"
      className="relative min-h-screen flex items-center justify-center text-center overflow-hidden grid-bg"
    >
      <Particles />

      {/* Glow orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className={`absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-accent/15 rounded-full blur-[150px] transition-all duration-[2s] ${
            mounted ? "opacity-60 scale-100" : "opacity-0 scale-50"
          }`}
        />
        <div
          className={`absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent-2/10 rounded-full blur-[150px] transition-all duration-[2s] delay-500 ${
            mounted ? "opacity-50 scale-100" : "opacity-0 scale-50"
          }`}
        />
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-green/5 rounded-full blur-[120px] transition-all duration-[2s] delay-1000 ${
            mounted ? "opacity-40 scale-100" : "opacity-0 scale-50"
          }`}
        />
      </div>

      <div
        className={`relative z-10 max-w-3xl mx-auto px-6 transition-all duration-1000 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <p className="text-sm text-accent uppercase tracking-[0.15em] font-medium mb-6 opacity-80">
          Курсова работа &bull; Тема №4
        </p>

        <h1 className="text-5xl sm:text-6xl md:text-8xl font-black tracking-tighter leading-[1.05] mb-6 shimmer-text">
          RAG системи
        </h1>

        <p className="text-lg md:text-xl text-text-muted max-w-xl mx-auto mb-3 leading-relaxed">
          Как езиковите модели използват външни източници на знания
        </p>

        <p className="text-base md:text-lg text-text-dim mb-10 h-7">
          <TypingText />
        </p>

        <div className="flex items-center justify-center gap-4 mb-12">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-accent/40" />
          <span className="text-text-dim text-xs tracking-widest uppercase">
            Retrieval-Augmented Generation
          </span>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-accent-2/40" />
        </div>

        <a
          href="#intro"
          className="group inline-flex items-center gap-2 text-accent border border-accent/50 rounded-full px-8 py-3 text-sm hover:bg-accent hover:text-bg hover:border-accent transition-all duration-300 hover:shadow-[0_0_30px_rgba(139,92,246,0.3)]"
        >
          Разгледай
          <svg
            className="w-4 h-4 transition-transform group-hover:translate-y-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </a>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="w-5 h-8 border-2 border-text-dim/30 rounded-full flex justify-center pt-1.5">
          <div className="w-1 h-2 bg-accent rounded-full animate-bounce" />
        </div>
      </div>
    </header>
  );
}
