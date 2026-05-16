export interface KBDoc {
  id: number;
  text: string;
  tags: string[];
}

export const KB: KBDoc[] = [
  // RAG fundamentals
  { id: 1, text: "Retrieval-Augmented Generation (RAG) е архитектурен подход, при който езиковият модел се свързва с външни източници на знания по време на генериране на отговор. Въведен от Lewis et al. (2020) в NeurIPS. Тристъпков pipeline: Retrieve → Augment → Generate.", tags: ["rag", "definition"] },
  { id: 2, text: "RAG решава три основни проблема на LLM: халюцинации (измисляне на факти), остаряла информация (knowledge cutoff) и липса на domain-specific знания (вътрешни документи, частни бази данни).", tags: ["rag", "problems"] },
  { id: 3, text: "Сравнение: Fine-tuning изисква GPU ресурси и повторно обучение. Prompt engineering е ограничен от контекстния прозорец. RAG дава актуални данни в реално време, без повторно обучение, с прозрачни източници.", tags: ["rag", "comparison"] },

  // Embeddings
  { id: 4, text: "Embedding модели преобразуват текст в числови вектори с висока размерност (768–4096 измерения). Семантично близки текстове получават близки вектори в пространството. Cosine similarity измерва сходството.", tags: ["embedding", "vectors"] },
  { id: 5, text: "Embedding модел на Лилит: Google Gemini-2-preview с 4096 измерения, достъпен чрез OpenAI-compatible endpoint. Цена: ~$0.03 за обработка на 4,000 записа при 1,500 req/min rate limit. Поддържа руски и български.", tags: ["embedding", "gemini"] },
  { id: 6, text: "Cosine similarity: sim(A,B) = (A·B)/(|A|×|B|). Стойност 1.0 = идентични вектори, 0.0 = ортогонални (несвързани). Използва се за семантично търсене — намира парафрази и свързани концепции.", tags: ["cosine", "similarity"] },
  { id: 7, text: "Популярни embedding модели: OpenAI text-embedding-3-large (3072d), Google Gemini Embedding (4096d), BGE-M3 (open source, 1024d), Cohere embed-v3. Избор зависи от език, размерност и цена.", tags: ["embedding", "models"] },

  // Search methods
  { id: 8, text: "BM25 е класически алгоритъм за пълнотекстово търсене, базиран на TF-IDF с нормализация по дължина на документа. Параметри: k1=1.5, b=0.75. Ефективен за точно съвпадение на ключови думи.", tags: ["bm25", "search"] },
  { id: 9, text: "Vector search търси по cosine similarity между embedding вектори. Разбира семантика — намира парафрази и свързани концепции дори без съвпадение на думи. По-бавен от BM25 но по-точен семантично.", tags: ["vector", "search"] },
  { id: 10, text: "Hybrid search комбинира BM25 (sparse) + Vector search (dense) с настройваеми тегла. Reciprocal Rank Fusion (RRF) обединява резултатите. Лилит използва 50/50 тегла по подразбиране.", tags: ["hybrid", "search"] },

  // Chunking
  { id: 11, text: "Chunking стратегии: фиксиран размер (всеки N токена с overlap), семантично (по параграфи и теми), рекурсивно (глави → параграфи → изречения). Размерът пряко влияе на retrieval качество.", tags: ["chunking", "strategy"] },
  { id: 12, text: "Оптимален chunk размер: 256–512 токена за повечето приложения. Overlap от 10–20% предотвратява загуба на контекст на границите. Твърде малки chunks губят контекст, твърде големи намаляват precision.", tags: ["chunking", "size"] },

  // Knowledge Graphs
  { id: 13, text: "Knowledge Graph представя знания чрез ентитети (nodes) и типирани релации (edges). За разлика от векторно търсене, графите проследяват многостъпкови връзки между ентитетите.", tags: ["kg", "definition"] },
  { id: 14, text: "KG на Лилит: 3,376 ентитети и 8,085 връзки с 16 типа релации (uses, imports, modifies, causes, fixes, depends_on, related_to, works_at, prefers, blocked_by, caused_by, optimizes_for).", tags: ["kg", "lilith"] },
  { id: 15, text: "Graph RAG комбинира knowledge graphs с векторно търсене. Microsoft Research (Edge et al., 2024) показва значително подобрение при summarization. Hybrid vector+graph е стандарт.", tags: ["graph-rag", "future"] },

  // MMR & Reranking
  { id: 16, text: "Maximal Marginal Relevance (MMR) балансира релевантност и разнообразие: MMR = λ·Sim(doc,query) − (1−λ)·max(Sim(doc,selected)). Предотвратява дублиране на информация в контекста.", tags: ["mmr", "reranking"] },
  { id: 17, text: "Reranking: след първоначално извличане (BM25/vector), вторичен модел (cross-encoder) преоценява документите. По-бавен но значително по-точен. Cohere Rerank и BGE-Reranker са популярни.", tags: ["reranking", "models"] },

  // Lilith architecture
  { id: 18, text: "Лилит е self-hosted RAG система в продукция на 128GB Hetzner сървър (95.217.x.x). Персонален AI асистент с тристепенна архитектура за памет, обслужващ потребител чрез Telegram бот.", tags: ["lilith", "overview"] },
  { id: 19, text: "Тристепенна архитектура: L0 (hot) — текуща сесия в OpenClaw RAM, латентност <30ms. L1 (warm) — sqlite-vec векторна база, 16,500 записа, hybrid BM25+cosine. L2 (cold) — Obsidian vault, Syncthing P2P.", tags: ["lilith", "architecture"] },
  { id: 20, text: "Лилит използва sqlite-vec за векторно търсене с 16,500 записа. Hybrid search комбинира BM25 fulltext и cosine similarity с 50/50 тегла. Gemini Embedding модел с 4096 измерения.", tags: ["lilith", "vector-db"] },
  { id: 21, text: "OpenClaw Gateway (порт 18789) е agent runtime на TypeScript/Node.js. Bootstrap configs: AGENTS.md (правила), SOUL.md (личност), IDENTITY.md, HEARTBEAT.md (cron). Claude Sonnet 4.6 като LLM.", tags: ["lilith", "openclaw"] },
  { id: 22, text: "Plugin v3.2 (agentmemory/index.js) автоматично инжектира top-8 резултата в промпта на LLM. Score threshold 0.005 (BM25 scale). Budget-aware truncation спазва token лимита.", tags: ["lilith", "plugin"] },
  { id: 23, text: "Obsidian Vault е L2 cold storage ниво, синхронизирано чрез Syncthing (P2P, без централен сървър). Git-версиониран. PARA структура. inotify watcher тригерира re-indexing за 7ms.", tags: ["lilith", "obsidian"] },
  { id: 24, text: "Telegram бот е основният потребителски интерфейс на Лилит. Streaming режим активен. 291 стикера от 3 пакета. Конфигурация в openclaw.json → channels.telegram.", tags: ["lilith", "telegram"] },
  { id: 25, text: "Heartbeat рутини на Лилит: idle consolidation (на всеки 3 часа), reflection cycle (4 часа), deep harvest (24 часа — пълно сканиране). Proactive learning неактивен от 12 април 2026.", tags: ["lilith", "heartbeat"] },

  // Retrieval pipeline
  { id: 26, text: "Retrieval pipeline на Лилит: 1) Съобщение пристига чрез Telegram, 2) Plugin класифицира заявката (тривиална?), 3) Паралелен BM25 + cosine + KG-BFS, 4) RRF fusion, 5) Top-8 инжектиране, 6) Claude генерира.", tags: ["lilith", "pipeline"] },
  { id: 27, text: "Латентност на Лилит: L0 RAM <30ms, L1 vector search ~150ms, L2 Obsidian read ~50ms. Общо p50: ~312ms retrieve + ~894ms generate. p99: ~1.4s (хвост от студени кешове).", tags: ["lilith", "latency"] },

  // Future of RAG
  { id: 28, text: "Agentic RAG: AI агентите сами решават кога, какво и как да търсят. Итеративно усъвършенстват заявки и комбинират множество източници. Лилит е пример — plugin автоматично решава дали да търси.", tags: ["future", "agentic"] },
  { id: 29, text: "Self-Reflective Retrieval: моделът оценява качеството на извлечените документи и може да търси отново с променена заявка. CRAG (Corrective RAG) и Self-RAG са изследователски подходи.", tags: ["future", "reflective"] },
  { id: 30, text: "Multi-modal RAG: извличане от изображения, аудио, видео и таблици. GPT-4V и Gemini поддържат multi-modal reasoning. Бъдещите RAG системи ще интегрират тези модалности.", tags: ["future", "multimodal"] },

  // Benchmarks
  { id: 31, text: "RAGAS метрики за оценка на RAG: faithfulness (0–1), answer relevancy (0–1), context precision, context recall. agentmemory v0.9.4 постига R@5 95.2% на LongMemEval benchmark.", tags: ["benchmarks", "ragas"] },
  { id: 32, text: "MTEB (Massive Text Embedding Benchmark): стандарт за оценка на embedding модели. 56 датасета, 8 задачи. Gemini-2-preview е сред top-5 за multilingual (включително руски/български).", tags: ["benchmarks", "mteb"] },
];

export function bm25Search(query: string, docs: KBDoc[] = KB): { doc: KBDoc; score: number }[] {
  const terms = query.toLowerCase().split(/\s+/).filter(t => t.length > 2);
  if (terms.length === 0) return [];

  const N = docs.length;
  const avgDl = docs.reduce((s, d) => s + d.text.length, 0) / N;
  const k1 = 1.5;
  const b = 0.75;

  const df: Record<string, number> = {};
  terms.forEach(t => {
    df[t] = docs.filter(d => d.text.toLowerCase().includes(t)).length;
  });

  return docs.map(doc => {
    const dl = doc.text.length;
    let score = 0;
    terms.forEach(t => {
      const tf = (doc.text.toLowerCase().match(new RegExp(t, "g")) || []).length;
      const idf = Math.log((N - (df[t] || 0) + 0.5) / ((df[t] || 0) + 0.5) + 1);
      score += idf * (tf * (k1 + 1)) / (tf + k1 * (1 - b + b * dl / avgDl));
    });
    return { doc, score };
  })
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}
