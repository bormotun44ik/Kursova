import FadeIn from "./FadeIn";
import SectionHeader from "./SectionHeader";
import Crosshairs from "./Crosshairs";

const refs = [
  { id: "lewis2020", cite: "Lewis et al. (2020)", title: "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks", venue: "NeurIPS" },
  { id: "gao2024", cite: "Gao et al. (2024)", title: "Retrieval-Augmented Generation for Large Language Models: A Survey", venue: "arXiv:2312.10997" },
  { id: "yan2024", cite: "Yan et al. (2024)", title: "Corrective Retrieval Augmented Generation (CRAG)", venue: "arXiv:2401.15884" },
  { id: "edge2024", cite: "Edge et al. (2024)", title: "From Local to Global: A Graph RAG Approach", venue: "Microsoft Research" },
  { id: "robertson2009", cite: "Robertson & Zaragoza (2009)", title: "The Probabilistic Relevance Framework: BM25 and Beyond", venue: "FnTIR" },
  { id: "carbonell1998", cite: "Carbonell & Goldstein (1998)", title: "MMR Diversity-Based Reranking", venue: "SIGIR" },
  { id: "muennighoff2023", cite: "Muennighoff et al. (2023)", title: "MTEB: Massive Text Embedding Benchmark", venue: "arXiv:2210.07316" },
  { id: "lilith2026", cite: "Internal (2026)", title: "Проектна документация на система «Лилит»", venue: "Private" },
];

export default function ReferencesSection() {
  return (
    <section id="references" className="relative py-20 md:py-28 px-8 md:px-14">
      <Crosshairs />
      <div className="max-w-5xl mx-auto">
        <SectionHeader number="08" title="<strong>Източници</strong>" sheet="—" />

        <FadeIn>
          <div className="space-y-0">
            {refs.map((r, i) => (
              <div
                key={r.id}
                className={`flex items-start gap-4 py-3 ${i > 0 ? "border-t border-bl-cyan-trace" : ""}`}
              >
                <span className="text-bl-cyan text-xs font-light shrink-0 w-6 text-right">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <span className="text-bl-ink text-xs font-medium">{r.cite}</span>
                  <span className="text-bl-ink-3 text-xs"> — {r.title}.</span>
                  <span className="text-bl-ink-5 text-xs"> {r.venue}.</span>
                </div>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
