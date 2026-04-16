import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import RankingCard from "@/components/ranking/RankingCard";
import { RankingListWithDetails } from "@/types";
import { User, Plus, BarChart3 } from "lucide-react";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/auth/signin");

  const [user, rankings] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      include: { _count: { select: { rankings: true, votes: true, comments: true } } },
    }),
    prisma.rankingList.findMany({
      where: { authorId: session.user.id },
      orderBy: { createdAt: "desc" },
      include: {
        author: { select: { id: true, name: true, image: true } },
        items: { orderBy: { rank: "asc" } },
        tags: true,
        _count: { select: { votes: true, comments: true, items: true } },
      },
    }),
  ]);

  if (!user) redirect("/auth/signin");

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Profile header */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 mb-8">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
            {user.image ? (
              <img src={user.image} alt={user.name ?? ""} className="w-20 h-20 rounded-2xl" />
            ) : (
              <User className="w-10 h-10 text-indigo-400" />
            )}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
            <p className="text-gray-500 text-sm">{user.email}</p>
            <div className="flex items-center gap-6 mt-3 text-sm">
              <div>
                <span className="font-semibold text-gray-900">{user._count.rankings}</span>
                <span className="text-gray-500 ml-1">rankings</span>
              </div>
              <div>
                <span className="font-semibold text-gray-900">{user._count.votes}</span>
                <span className="text-gray-500 ml-1">votes</span>
              </div>
              <div>
                <span className="font-semibold text-gray-900">{user._count.comments}</span>
                <span className="text-gray-500 ml-1">comments</span>
              </div>
            </div>
          </div>
          <Link
            href="/create"
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Ranking
          </Link>
        </div>
      </div>

      {/* Rankings */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-5">My Rankings</h2>
        {rankings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {(rankings as RankingListWithDetails[]).map((ranking) => (
              <RankingCard key={ranking.id} ranking={ranking} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
            <BarChart3 className="w-12 h-12 mx-auto text-gray-200 mb-3" />
            <p className="text-lg font-medium text-gray-500">No rankings yet</p>
            <p className="text-sm text-gray-400 mt-1">
              <Link href="/create" className="text-indigo-600 hover:underline">
                Create your first ranking
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
