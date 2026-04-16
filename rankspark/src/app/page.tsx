import Link from "next/link";
import { prisma } from "@/lib/prisma";
import RankingCard from "@/components/ranking/RankingCard";
import { CATEGORIES } from "@/lib/utils";
import { Sparkles, ArrowRight, Zap, TrendingUp, Users } from "lucide-react";
import { RankingListWithDetails } from "@/types";

async function getFeaturedRankings() {
  return prisma.rankingList.findMany({
    where: { isPublic: true },
    orderBy: { createdAt: "desc" },
    take: 6,
    include: {
      author: { select: { id: true, name: true, image: true } },
      items: { orderBy: { rank: "asc" } },
      tags: true,
      _count: { select: { votes: true, comments: true, items: true } },
    },
  });
}

async function getStats() {
  const [totalRankings, totalUsers] = await Promise.all([
    prisma.rankingList.count({ where: { isPublic: true } }),
    prisma.user.count(),
  ]);
  return { totalRankings, totalUsers };
}

export default async function HomePage() {
  const [rankings, stats] = await Promise.all([
    getFeaturedRankings(),
    getStats(),
  ]);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-950 via-indigo-900 to-purple-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-sm mb-6">
              <Sparkles className="w-4 h-4 text-purple-300" />
              <span>AI-Powered Rankings</span>
            </div>
            <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight mb-6">
              The definitive home for{" "}
              <span className="bg-gradient-to-r from-purple-300 to-indigo-300 bg-clip-text text-transparent">
                rankings
              </span>
            </h1>
            <p className="text-xl text-indigo-200 mb-10 leading-relaxed">
              Create, discover, and debate top lists on any topic. Let Claude AI
              generate insightful rankings with detailed reasoning in seconds.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/create"
                className="inline-flex items-center gap-2 bg-white text-indigo-900 px-7 py-3.5 rounded-xl font-semibold hover:bg-indigo-50 transition-colors shadow-lg"
              >
                <Zap className="w-5 h-5" />
                Create a Ranking
              </Link>
              <Link
                href="/explore"
                className="inline-flex items-center gap-2 bg-white/10 text-white border border-white/20 px-7 py-3.5 rounded-xl font-semibold hover:bg-white/20 transition-colors"
              >
                Explore Rankings
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            {/* Stats */}
            <div className="flex justify-center gap-12 mt-14 pt-10 border-t border-white/10">
              <div className="text-center">
                <p className="text-3xl font-bold text-white">
                  {stats.totalRankings}+
                </p>
                <p className="text-sm text-indigo-300 mt-1 flex items-center gap-1 justify-center">
                  <TrendingUp className="w-3.5 h-3.5" />
                  Rankings
                </p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-white">
                  {stats.totalUsers}+
                </p>
                <p className="text-sm text-indigo-300 mt-1 flex items-center gap-1 justify-center">
                  <Users className="w-3.5 h-3.5" />
                  Members
                </p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-white">∞</p>
                <p className="text-sm text-indigo-300 mt-1 flex items-center gap-1 justify-center">
                  <Sparkles className="w-3.5 h-3.5" />
                  Topics
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            <Link
              href="/explore"
              className="shrink-0 px-4 py-2 rounded-full text-sm font-medium bg-indigo-600 text-white"
            >
              All
            </Link>
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={`/explore?category=${cat.id}`}
                className="shrink-0 px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors whitespace-nowrap"
              >
                {cat.icon} {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Rankings */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Latest Rankings
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Fresh rankings from the community
            </p>
          </div>
          <Link
            href="/explore"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
          >
            View all
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {rankings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {(rankings as RankingListWithDetails[]).map((ranking) => (
              <RankingCard key={ranking.id} ranking={ranking} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-400">
            <BarChart3Icon className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-lg font-medium text-gray-500">
              No rankings yet
            </p>
            <p className="text-sm mt-1">
              Be the first to{" "}
              <Link
                href="/create"
                className="text-indigo-600 hover:underline"
              >
                create a ranking
              </Link>
            </p>
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <Sparkles className="w-10 h-10 mx-auto mb-4 opacity-90" />
          <h2 className="text-3xl font-bold mb-4">
            Let AI create your next ranking
          </h2>
          <p className="text-indigo-100 mb-8 text-lg">
            Just describe a topic and Claude will generate a comprehensive,
            well-reasoned ranking with detailed explanations.
          </p>
          <Link
            href="/create?ai=true"
            className="inline-flex items-center gap-2 bg-white text-indigo-700 px-8 py-3.5 rounded-xl font-semibold hover:bg-indigo-50 transition-colors shadow-lg"
          >
            <Sparkles className="w-5 h-5" />
            Generate AI Ranking
          </Link>
        </div>
      </section>
    </div>
  );
}

function BarChart3Icon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 13.5V21M9 10.5V21M15 6V21M21 3v18"
      />
    </svg>
  );
}
