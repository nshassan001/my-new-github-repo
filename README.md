# RankSpark

AI-powered ranking platform built with Next.js, Prisma, PostgreSQL, and Claude AI.

## Features

- **AI-Generated Rankings** — Describe any topic and Claude generates a ranked list with detailed reasoning for each entry
- **Community Rankings** — Create and share manual rankings on any topic
- **Voting System** — Vote on entire rankings and individual items
- **Comments** — Discuss rankings with the community
- **Categories & Tags** — Browse by technology, sports, food, entertainment, and more
- **User Profiles** — Track your created rankings, votes, and activity
- **Authentication** — Email/password and GitHub OAuth
- **YouTube SEO Tool** — Analyze YouTube videos for SEO scoring, tags, and copy generation

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: PostgreSQL + Prisma ORM v7
- **AI**: Anthropic Claude (`claude-opus-4-5`)
- **Auth**: NextAuth.js v4
- **UI**: Tailwind CSS, Lucide React
- **State**: TanStack Query, React Hot Toast, Zustand

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database

### Setup

```bash
npm install
cp .env.example .env.local
# Fill in DATABASE_URL, ANTHROPIC_API_KEY, NEXTAUTH_SECRET
npx prisma migrate dev
npm run dev
```

The app runs on [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `ANTHROPIC_API_KEY` | Anthropic API key for Claude |
| `NEXTAUTH_SECRET` | Random secret for NextAuth JWT |
| `NEXTAUTH_URL` | App URL (e.g. `http://localhost:3000`) |
| `GITHUB_CLIENT_ID` | Optional: GitHub OAuth app client ID |
| `GITHUB_CLIENT_SECRET` | Optional: GitHub OAuth app secret |

## Project Structure

```
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── migrations/          # Database migrations
├── src/
│   ├── app/
│   │   ├── api/             # API routes
│   │   ├── auth/            # Sign in / Sign up pages
│   │   ├── analyze/         # Text/YouTube SEO analyzer
│   │   ├── create/          # Create ranking page (manual + AI)
│   │   ├── explore/         # Browse rankings
│   │   ├── profile/         # User profile
│   │   └── rankings/        # Ranking detail page
│   ├── components/
│   │   ├── layout/          # Navbar, Footer
│   │   ├── ranking/         # RankingCard, RankingItemRow
│   │   └── ui/              # Button, Badge, Card, etc.
│   ├── lib/
│   │   ├── anthropic.ts     # Claude AI integration
│   │   ├── auth.ts          # NextAuth config
│   │   ├── prisma.ts        # Prisma client singleton
│   │   └── utils.ts         # Utilities, categories
│   └── types/               # TypeScript types
└── rankspark/               # Standalone RankSpark subapp
```
