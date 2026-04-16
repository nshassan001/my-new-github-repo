import { prisma } from "@/lib/prisma";
import RankingCard from "@/components/ranking/RankingCard";
import { RankingListWithDetails } from "@/types";
import Link from "next/link";
import { BarChart3, TrendingUp, Sparkles } from "lucide-react";

async function getTopRankings() {
  try {
    return await prisma.rankingList.findMany({
      where: { isPublic: true },
      orderBy: { createdAt: "desc" },
      take: 24,
      include: {
        author: { select: { id: true, name: true, image: true } },
        items: { orderBy: { rank: "asc" } },
        tags: true,
        _count: { select: { votes: true, comments: true, items: true } },
      },
    });
  } catch {
    return [];
  }
}

export const metadata = {
  title: "All Rankings — RankSpark",
};

export default async function RankingsPage() {
  const rankings = await getTopRankings();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <BarChart3 className="w-8 h-8 text-indigo-600" />
            All Rankings
          </h1>
          <p className="text-gray-500 mt-1">
            {rankings.length} rankings from the community
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/create?ai=true"
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Sparkles className="w-4 h-4" />
            AI Generate
          </Link>
          <Link
            href="/create"
            className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            <TrendingUp className="w-4 h-4" />
            Create Manual
          </Link>
        </div>
      </div>

      {rankings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {(rankings as RankingListWithDetails[]).map((ranking) => (
            <RankingCard key={ranking.id} ranking={ranking} />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-white rounded-2xl border border-gray-200">
          <BarChart3 className="w-14 h-14 mx-auto text-gray-200 mb-4" />
          <h3 className="text-xl font-semibold text-gray-500 mb-2">
            No rankings yet
          </h3>
          <p className="text-gray-400 text-sm mb-6">
            Be the first to create a ranking!
          </p>
          <Link
            href="/create"
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            Create Ranking
          </Link>
        </div>
      )}
    </div>
  );
}
