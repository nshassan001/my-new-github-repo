"use client";

import Link from "next/link";
import { formatDate, formatNumber, CATEGORIES } from "@/lib/utils";
import { RankingListWithDetails } from "@/types";
import Badge from "@/components/ui/Badge";
import { MessageSquare, ThumbsUp, Sparkles, BarChart3 } from "lucide-react";

interface RankingCardProps {
  ranking: RankingListWithDetails;
}

export default function RankingCard({ ranking }: RankingCardProps) {
  const category = CATEGORIES.find((c) => c.id === ranking.category);
  const topItems = ranking.items.slice(0, 3);

  return (
    <Link href={`/rankings/${ranking.slug}`}>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              {ranking.aiGenerated && (
                <Badge variant="ai">
                  <Sparkles className="w-3 h-3" />
                  AI Generated
                </Badge>
              )}
              {category && (
                <Badge variant="default">
                  {category.icon} {category.name}
                </Badge>
              )}
            </div>
            <h3 className="font-semibold text-gray-900 line-clamp-2 text-base leading-snug">
              {ranking.title}
            </h3>
          </div>
          <BarChart3 className="w-5 h-5 text-gray-300 shrink-0 mt-0.5" />
        </div>

        {/* Description */}
        {ranking.description && (
          <p className="text-sm text-gray-500 line-clamp-2 mb-3">
            {ranking.description}
          </p>
        )}

        {/* Top 3 items preview */}
        {topItems.length > 0 && (
          <div className="space-y-1.5 mb-4">
            {topItems.map((item, idx) => (
              <div
                key={item.id}
                className="flex items-center gap-2.5 text-sm"
              >
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    idx === 0
                      ? "bg-yellow-100 text-yellow-700"
                      : idx === 1
                      ? "bg-gray-100 text-gray-600"
                      : "bg-orange-100 text-orange-600"
                  }`}
                >
                  {item.rank}
                </span>
                <span className="text-gray-700 truncate font-medium">
                  {item.title}
                </span>
              </div>
            ))}
            {ranking.items.length > 3 && (
              <p className="text-xs text-gray-400 pl-8">
                +{ranking.items.length - 3} more items
              </p>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <ThumbsUp className="w-3.5 h-3.5" />
              {formatNumber(ranking._count?.votes ?? ranking.votes?.length ?? 0)}
            </span>
            <span className="flex items-center gap-1">
              <MessageSquare className="w-3.5 h-3.5" />
              {formatNumber(ranking._count?.comments ?? ranking.comments?.length ?? 0)}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            {ranking.author.image && (
              <img
                src={ranking.author.image}
                alt={ranking.author.name ?? ""}
                className="w-4 h-4 rounded-full"
              />
            )}
            <span className="truncate max-w-[100px]">
              {ranking.author.name ?? "Anonymous"}
            </span>
            <span>·</span>
            <span>{formatDate(ranking.createdAt)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
