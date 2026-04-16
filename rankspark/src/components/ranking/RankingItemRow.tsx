"use client";

import { useState } from "react";
import { RankingItemWithVotes } from "@/types";
import { ChevronDown, ChevronUp, Sparkles, ThumbsUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface RankingItemRowProps {
  item: RankingItemWithVotes;
  onVote?: (itemId: string) => void;
  userVoted?: boolean;
}

export default function RankingItemRow({
  item,
  onVote,
  userVoted = false,
}: RankingItemRowProps) {
  const [expanded, setExpanded] = useState(false);
  const voteCount = item._count?.votes ?? item.votes?.length ?? 0;

  const rankColors: Record<number, string> = {
    1: "bg-yellow-400 text-yellow-900",
    2: "bg-gray-300 text-gray-700",
    3: "bg-orange-400 text-orange-900",
  };

  const rankColor =
    rankColors[item.rank] ?? "bg-indigo-100 text-indigo-700";

  return (
    <div className="group border border-gray-100 rounded-xl p-4 hover:border-indigo-100 hover:bg-indigo-50/30 transition-all">
      <div className="flex items-start gap-3">
        {/* Rank badge */}
        <div
          className={cn(
            "w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0",
            rankColor
          )}
        >
          {item.rank}
        </div>

        {/* Image */}
        {item.imageUrl && (
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-12 h-12 rounded-lg object-cover shrink-0"
          />
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 text-sm leading-snug">
            {item.title}
          </h4>
          {item.description && (
            <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
              {item.description}
            </p>
          )}

          {/* AI Reasoning */}
          {item.aiReasoning && (
            <div className="mt-2">
              <button
                onClick={() => setExpanded(!expanded)}
                className="flex items-center gap-1 text-xs text-purple-600 hover:text-purple-800 font-medium transition-colors"
              >
                <Sparkles className="w-3 h-3" />
                AI Reasoning
                {expanded ? (
                  <ChevronUp className="w-3 h-3" />
                ) : (
                  <ChevronDown className="w-3 h-3" />
                )}
              </button>
              {expanded && (
                <div className="mt-2 p-3 bg-purple-50 rounded-lg border border-purple-100">
                  <p className="text-xs text-purple-800 leading-relaxed">
                    {item.aiReasoning}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Vote button */}
        {onVote && (
          <button
            onClick={() => onVote(item.id)}
            className={cn(
              "flex flex-col items-center gap-0.5 p-2 rounded-lg transition-colors shrink-0",
              userVoted
                ? "text-indigo-600 bg-indigo-50"
                : "text-gray-400 hover:text-indigo-600 hover:bg-indigo-50"
            )}
          >
            <ThumbsUp className={cn("w-4 h-4", userVoted && "fill-indigo-600")} />
            <span className="text-xs font-medium">{voteCount}</span>
          </button>
        )}
      </div>
    </div>
  );
}
