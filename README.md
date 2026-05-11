# RAG системи — Курсова работа

Как езиковите модели използват външни източници на знания.

**Тема №4** · Retrieval-Augmented Generation · 2026

[**Live →** bormotun44ik.github.io/Kursova](https://bormotun44ik.github.io/Kursova/)

---

## Съдържание

| Секция | Описание |
|--------|----------|
| 01 Въведение | Проблеми на LLM: халюцинации, остаряла информация, липса на domain знания |
| 02 Какво е RAG | Тристъпков pipeline: Retrieve → Augment → Generate. Сравнение с fine-tuning и prompt engineering |
| 03 Компоненти | Embeddings, chunking стратегии, BM25/vector/hybrid search, knowledge graphs, MMR |
| 04 Case study | Система «Лилит» — тристепенна памет (L0 hot / L1 warm vector DB / L2 cold vault), 16.5K записа, KG с 3376 ентитета |
| 05 Live Pipeline | Auto-cycling RAG демонстрация: retrieve → augment → generate |
| 06 Анализ | Предимства и ограничения на RAG подхода |
| 07 Бъдеще | Agentic RAG, Self-Reflective Retrieval, Multi-modal RAG, Graph RAG |
| 08 Източници | Lewis et al. 2020, Gao et al. 2024, Edge et al. 2024 (Microsoft Graph RAG) и др. |

## Стек

- **Next.js 16** — static export за GitHub Pages
- **TypeScript** + **Tailwind CSS v4**
- **JetBrains Mono** + **IBM Plex Mono** — blueprint typography
- **Canvas API** — Knowledge Graph визуализация, embedding scatter plot
- **GitHub Actions** — автоматичен deploy при push

## Локално стартиране

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static export → out/
```

## Структура

```
app/
├── layout.tsx              # Шрифтове, metadata
├── page.tsx                # Сглобяване на секции
├── globals.css             # Blueprint design tokens, grid, utilities
└── components/
    ├── Hero.tsx            # SVG pipeline с пулсове
    ├── IntroSection.tsx    # Проблеми на LLM
    ├── WhatIsRagSection.tsx
    ├── ComponentsSection.tsx
    ├── EmbeddingViz.tsx    # Canvas 2D scatter plot
    ├── KnowledgeGraph.tsx  # Canvas force-directed граф
    ├── CaseStudySection.tsx
    ├── RagPlayground.tsx   # Auto-cycling pipeline демо
    ├── ProsConsSection.tsx
    ├── FutureSection.tsx
    ├── ReferencesSection.tsx
    ├── Block.tsx           # Schematic блок с label
    ├── Stamp.tsx           # Revision badge
    ├── Crosshairs.tsx      # Ъглови маркери
    ├── AnimatedCounter.tsx # Count-up при scroll
    └── FadeIn.tsx          # Scroll-triggered fade
```
