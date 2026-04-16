# RankSpark

RankSpark is a Next.js 14 + TypeScript web app for scoring YouTube SEO potential.

## Tech

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Anthropic SDK
- Prisma ORM
- Zustand
- react-hot-toast

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Set environment variables:

```bash
cp .env.example .env
```

3. Run Prisma client generation:

```bash
npm run prisma:generate
```

4. Start dev server:

```bash
npm run dev
```

Open http://localhost:3000 and navigate to `/analyze`.
