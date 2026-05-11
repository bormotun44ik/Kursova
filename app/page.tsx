import Nav from "./components/Nav";
import Hero from "./components/Hero";
import ScrollProgress from "./components/ScrollProgress";
import IntroSection from "./components/IntroSection";
import WhatIsRagSection from "./components/WhatIsRagSection";
import ComponentsSection from "./components/ComponentsSection";
import CaseStudySection from "./components/CaseStudySection";
import RagPlayground from "./components/RagPlayground";
import ProsConsSection from "./components/ProsConsSection";
import FutureSection from "./components/FutureSection";
import ReferencesSection from "./components/ReferencesSection";

export default function Home() {
  return (
    <>
      <Nav />
      <ScrollProgress />
      <Hero />
      <IntroSection />
      <WhatIsRagSection />
      <ComponentsSection />
      <CaseStudySection />
      <RagPlayground />
      <ProsConsSection />
      <FutureSection />
      <ReferencesSection />
      <footer className="py-16 border-t border-border text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-accent/5 rounded-full blur-[100px]" />
        </div>
        <div className="relative">
          <p className="text-text-muted text-sm">
            RAG системи: как езиковите модели използват външни източници на знания
          </p>
          <p className="text-text-dim text-xs mt-3">
            Курсова работа &bull; Тема №4 &bull; 2026
          </p>
        </div>
      </footer>
    </>
  );
}
