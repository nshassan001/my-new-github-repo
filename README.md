# RankSpark — YouTube SEO Scoring Tool

AI-powered YouTube SEO analyzer for Bangla, Banglish, and English content creators.

## Features

- **Live SEO Score** — real-time score (0–100) and grade (S/A/B/C/D/F) as you type, no API call needed
- **AI-Powered Full Analysis** — Claude AI analyzes title, description, transcript, and tags
- **35+ Multi-Language Tags** — Bangla (বাংলা), Banglish, and English, with exact keyword as ★ first tag
- **7 Category Scores** — Title, Description, Tags, Transcript, Thumbnail, Engagement, Channel Authority
- **Copy-Ready Content** — 3 title options, optimized description, pinned comment, channel keywords
- **Quick Wins** — immediate actionable improvements
- **23-Item SEO Checklist** — comprehensive optimization checklist

## Tech Stack

- **Next.js 14** with App Router
- **TypeScript**
- **Tailwind CSS** (primary color: `#D85A30`)
- **Anthropic SDK** (`claude-sonnet-4-20250514`)
- **Prisma + PostgreSQL**
- **Zustand** (state management)
- **react-hot-toast**

## Project Structure

```
├── app/
│   ├── (dashboard)/
│   │   ├── analyze/page.tsx     # Video input form + live score
│   │   ├── score/[id]/page.tsx  # Score results with animated ring
│   │   ├── tags/[id]/page.tsx   # Tag portfolio with filters
│   │   └── copy/[id]/page.tsx   # Copy-ready content
│   ├── api/analyze/route.ts     # POST/GET analysis endpoint
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Landing page
├── components/ui/
│   ├── ScoreRing.tsx            # Animated SVG score ring
│   ├── TagCard.tsx              # Tag with relevance bar
│   └── CopyBox.tsx              # Copy to clipboard component
├── lib/
│   ├── anthropic.ts             # Anthropic client + analyzeVideo()
│   ├── db.ts                    # Prisma client singleton
│   ├── prompt-builder.ts        # AI prompt construction
│   ├── ranking-factors.ts       # Internal scoring data (never shown to users)
│   └── score-calculator.ts      # Live score (no API call)
├── prisma/schema.prisma         # Analysis + ChannelProfile models
├── store/analyzerStore.ts       # Zustand state management
└── types/index.ts               # TypeScript types
```

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your DATABASE_URL and ANTHROPIC_API_KEY
   ```

3. **Set up the database:**
   ```bash
   npx prisma db push
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

Visit [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `ANTHROPIC_API_KEY` | Your Anthropic API key |

## Tag Tiers

| Tier | Difficulty | Description |
|------|-----------|-------------|
| T1 | Very Easy | Low competition, easy to rank |
| T2 | Easy | Moderate traffic, lower competition |
| T3 | Moderate | Balanced traffic and competition |
| T4 | Hard | High competition |
| T5 | Very Hard | Very high competition |

## Grade Scale

| Grade | Score | Meaning |
|-------|-------|---------|
| S | 90–100 | Excellent SEO |
| A | 80–89 | Very Good |
| B | 65–79 | Good |
| C | 50–64 | Average |
| D | 35–49 | Below Average |
| F | 0–34 | Poor |
