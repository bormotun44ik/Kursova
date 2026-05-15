import Nav from "./components/Nav";
import Hero from "./components/Hero";
import IntroSection from "./components/IntroSection";
import WhatIsRagSection from "./components/WhatIsRagSection";
import ComponentsSection from "./components/ComponentsSection";
import CaseStudySection from "./components/CaseStudySection";
import RagPlayground from "./components/RagPlayground";
import AiChat from "./components/AiChat";
import ProsConsSection from "./components/ProsConsSection";
import FutureSection from "./components/FutureSection";
import ReferencesSection from "./components/ReferencesSection";

export default function Home() {
  return (
    <>
      <Nav />
      <Hero />
      <IntroSection />
      <WhatIsRagSection />
      <ComponentsSection />
      <CaseStudySection />
      <RagPlayground />
      <AiChat />
      <ProsConsSection />
      <FutureSection />
      <ReferencesSection />

      {/* Colophon footer */}
      <footer className="relative py-12 px-8 md:px-14 bg-bl-paper-deep border-t border-bl-cyan-ghost">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between gap-8">
          <div>
            <span
              className="block text-[10px] tracking-[0.2em] uppercase text-bl-ink-4 mb-3"
              style={{ fontFamily: "var(--font-meta)" }}
            >
              COLOPHON
            </span>
            <p className="text-bl-ink-3 text-xs leading-relaxed max-w-md">
              Built with sqlite-vec, Gemini-2 Embeddings,
              Claude Sonnet, JetBrains Mono.
            </p>
            <p className="text-bl-ink-5 text-[10px] mt-3" style={{ fontFamily: "var(--font-meta)" }}>
              © 2026 · REV.A · 12.05.26
            </p>
          </div>
          <div>
            <span
              className="block text-[10px] tracking-[0.2em] uppercase text-bl-ink-4 mb-3"
              style={{ fontFamily: "var(--font-meta)" }}
            >
              SIGNALS
            </span>
            <div className="space-y-1.5 text-xs" style={{ fontFamily: "var(--font-meta)" }}>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-bl-ok" />
                <span className="text-bl-ink-3">system online</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-bl-ok" />
                <span className="text-bl-ink-3">index synced</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-bl-ok" />
                <span className="text-bl-ink-3">graph 3 376</span>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-5xl mx-auto mt-6 flex justify-end">
          <span className="text-bl-ink-5 text-[9px]" style={{ fontFamily: "var(--font-meta)" }}>
            COORD · X: 1440.00mm · Y: END
          </span>
        </div>
      </footer>
    </>
  );
}
