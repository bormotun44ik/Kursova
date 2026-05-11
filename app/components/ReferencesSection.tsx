import FadeIn from "./FadeIn";
import SectionHeader from "./SectionHeader";

const refs = [
  'Lewis, P., Perez, E., Piktus, A., et al. (2020). "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks." Advances in Neural Information Processing Systems (NeurIPS).',
  'Gao, Y., Xiong, Y., Gao, X., et al. (2024). "Retrieval-Augmented Generation for Large Language Models: A Survey." arXiv:2312.10997.',
  'Yan, S., et al. (2024). "Corrective Retrieval Augmented Generation (CRAG)." arXiv:2401.15884.',
  'Edge, D., Trinh, H., et al. (2024). "From Local to Global: A Graph RAG Approach to Query-Focused Summarization." Microsoft Research. arXiv:2404.16130.',
  'Robertson, S., Zaragoza, H. (2009). "The Probabilistic Relevance Framework: BM25 and Beyond." Foundations and Trends in Information Retrieval.',
  'Carbonell, J., Goldstein, J. (1998). "The Use of MMR, Diversity-Based Reranking for Reordering Documents and Producing Summaries." SIGIR.',
  'Muennighoff, N., et al. (2023). "MTEB: Massive Text Embedding Benchmark." arXiv:2210.07316.',
  `Проектна документация на система «Лилит» — вътрешна архитектурна референция, 2026.`,
];

export default function ReferencesSection() {
  return (
    <section id="references" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <SectionHeader number="07" title="Източници" />

        <FadeIn>
          <ol className="space-y-4 pl-6 list-decimal marker:text-accent marker:font-bold">
            {refs.map((r, i) => (
              <li
                key={i}
                className="text-text-muted text-sm leading-relaxed pl-2"
              >
                {r}
              </li>
            ))}
          </ol>
        </FadeIn>
      </div>
    </section>
  );
}
