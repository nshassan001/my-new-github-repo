"use client";

import { clsx } from "clsx";
import { Tag } from "@/types";

interface TagCardProps {
  tag: Tag;
  selected?: boolean;
  onToggle?: () => void;
  showTier?: boolean;
}

const TIER_LABELS: Record<number, string> = {
  1: "Very Easy",
  2: "Easy",
  3: "Moderate",
  4: "Hard",
  5: "Very Hard",
};

const TIER_COLORS: Record<number, string> = {
  1: "text-green-400 bg-green-400/10 border-green-400/20",
  2: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  3: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  4: "text-orange-400 bg-orange-400/10 border-orange-400/20",
  5: "text-red-400 bg-red-400/10 border-red-400/20",
};

const RELEVANCE_BAR_COLOR: Record<number, string> = {
  1: "bg-green-400",
  2: "bg-emerald-400",
  3: "bg-yellow-400",
  4: "bg-orange-400",
  5: "bg-red-400",
};

const LANG_BADGE: Record<string, string> = {
  bangla: "বা",
  banglish: "BL",
  english: "EN",
};

export function TagCard({ tag, selected = false, onToggle, showTier = true }: TagCardProps) {
  return (
    <div
      onClick={onToggle}
      className={clsx(
        "group relative border rounded-xl p-3 transition-all duration-200",
        onToggle ? "cursor-pointer" : "",
        selected
          ? "border-[#D85A30]/50 bg-[#D85A30]/10"
          : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]"
      )}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          {tag.isExactMatch && (
            <span className="text-[#D85A30] text-xs font-bold">★</span>
          )}
          <span className="text-sm font-medium text-white leading-tight">
            {tag.text}
          </span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Language badge */}
          <span className="text-[10px] font-bold text-white/40 bg-white/5 border border-white/10 rounded px-1.5 py-0.5">
            {LANG_BADGE[tag.language] || tag.language.slice(0, 2).toUpperCase()}
          </span>
          {/* Selected check */}
          {onToggle && (
            <div
              className={clsx(
                "w-4 h-4 rounded border flex items-center justify-center transition-colors",
                selected ? "bg-[#D85A30] border-[#D85A30]" : "border-white/20"
              )}
            >
              {selected && (
                <svg viewBox="0 0 12 12" className="w-2.5 h-2.5 text-white" fill="currentColor">
                  <path d="M10 3L5 8 2 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </svg>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Relevance bar */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
          <div
            className={clsx("h-full rounded-full transition-all duration-500", RELEVANCE_BAR_COLOR[tag.tier])}
            style={{ width: `${tag.relevanceScore}%` }}
          />
        </div>
        <span className="text-[11px] text-white/40 tabular-nums w-8 text-right">
          {tag.relevanceScore}
        </span>
      </div>

      {/* Tier badge */}
      {showTier && (
        <div className="mt-2">
          <span
            className={clsx(
              "text-[10px] font-semibold border rounded px-1.5 py-0.5",
              TIER_COLORS[tag.tier]
            )}
          >
            T{tag.tier} · {TIER_LABELS[tag.tier]}
          </span>
        </div>
      )}
    </div>
  );
}
