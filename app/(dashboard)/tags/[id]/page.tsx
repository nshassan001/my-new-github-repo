"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAnalyzerStore } from "@/store/analyzerStore";
import { TagCard } from "@/components/ui/TagCard";
import { CopyBox } from "@/components/ui/CopyBox";
import { AnalysisResult } from "@/types";
import { clsx } from "clsx";
import toast from "react-hot-toast";

type LangFilter = "all" | "bangla" | "banglish" | "english";
type SortMode = "relevance" | "tier" | "alpha";

export default function TagsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { result, resultId, loadResult } = useAnalyzerStore();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [langFilter, setLangFilter] = useState<LangFilter>("all");
  const [sortMode, setSortMode] = useState<SortMode>("relevance");
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  const analysis: AnalysisResult | null =
    result && resultId === id ? result : null;

  useEffect(() => {
    if (!analysis) {
      setLoading(true);
      loadResult(id)
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [id, analysis, loadResult]);

  // Auto-select best 12 on load
  useEffect(() => {
    if (analysis?.tags) {
      const sorted = [...analysis.tags]
        .sort((a, b) => {
          if (a.isExactMatch) return -1;
          if (b.isExactMatch) return 1;
          return b.relevanceScore - a.relevanceScore;
        })
        .slice(0, 12)
        .map((tag) => analysis.tags.indexOf(tag));
      setSelectedIds(new Set(sorted));
    }
  }, [analysis]);

  const filteredTags = useMemo(() => {
    if (!analysis?.tags) return [];

    let tags = [...analysis.tags];

    if (langFilter !== "all") {
      tags = tags.filter((t) => t.language === langFilter);
    }

    switch (sortMode) {
      case "relevance":
        tags.sort((a, b) => {
          if (a.isExactMatch) return -1;
          if (b.isExactMatch) return 1;
          return b.relevanceScore - a.relevanceScore;
        });
        break;
      case "tier":
        tags.sort((a, b) => {
          if (a.isExactMatch) return -1;
          if (b.isExactMatch) return 1;
          return a.tier - b.tier;
        });
        break;
      case "alpha":
        tags.sort((a, b) => {
          if (a.isExactMatch) return -1;
          if (b.isExactMatch) return 1;
          return a.text.localeCompare(b.text);
        });
        break;
    }

    return tags;
  }, [analysis?.tags, langFilter, sortMode]);

  const selectedTags = useMemo(() => {
    if (!analysis?.tags) return [];
    return Array.from(selectedIds)
      .map((i) => analysis.tags[i])
      .filter(Boolean);
  }, [selectedIds, analysis?.tags]);

  const selectedTagsText = selectedTags.map((t) => t.text).join(", ");

  const toggleTag = (globalIdx: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(globalIdx)) next.delete(globalIdx);
      else next.add(globalIdx);
      return next;
    });
  };

  const selectBest12 = () => {
    if (!analysis?.tags) return;
    const sorted = [...analysis.tags]
      .sort((a, b) => {
        if (a.isExactMatch) return -1;
        if (b.isExactMatch) return 1;
        return b.relevanceScore - a.relevanceScore;
      })
      .slice(0, 12)
      .map((tag) => analysis.tags.indexOf(tag));
    setSelectedIds(new Set(sorted));
    toast.success("Best 12 tags selected!");
  };

  const selectAll = () => {
    if (!analysis?.tags) return;
    setSelectedIds(new Set(analysis.tags.map((_, i) => i)));
  };

  const clearSelection = () => setSelectedIds(new Set());

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[60vh]">
        <div className="text-center space-y-3">
          <svg className="w-10 h-10 animate-spin text-brand mx-auto" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-white/50">Loading tags...</p>
        </div>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="flex items-center justify-center h-full min-h-[60vh]">
        <div className="text-center space-y-4">
          <p className="text-red-400">{error || "Analysis not found"}</p>
          <button onClick={() => router.push("/analyze")} className="btn-primary">
            New Analysis
          </button>
        </div>
      </div>
    );
  }

  const langCounts = {
    bangla: analysis.tags.filter((t) => t.language === "bangla").length,
    banglish: analysis.tags.filter((t) => t.language === "banglish").length,
    english: analysis.tags.filter((t) => t.language === "english").length,
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold">Tag Portfolio</h1>
          <p className="text-white/40 text-sm mt-1">
            {analysis.tags.length} tags generated · {selectedIds.size} selected
          </p>
        </div>
        <div className="flex gap-2">
          <Link href={`/score/${id}`} className="btn-secondary text-sm">
            ← Score
          </Link>
          <Link href={`/copy/${id}`} className="btn-primary text-sm">
            Copy Content →
          </Link>
        </div>
      </div>

      {/* Copy box for selected tags */}
      {selectedIds.size > 0 && (
        <div className="card border-brand/20 bg-brand/5">
          <CopyBox
            content={selectedTagsText}
            label={`Selected Tags (${selectedIds.size})`}
            rows={3}
          />
        </div>
      )}

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Language filter */}
        <div className="flex bg-white/5 rounded-lg p-1 gap-1">
          {(["all", "bangla", "banglish", "english"] as LangFilter[]).map((lang) => (
            <button
              key={lang}
              onClick={() => setLangFilter(lang)}
              className={clsx(
                "px-3 py-1.5 rounded-md text-xs font-medium transition-colors capitalize",
                langFilter === lang
                  ? "bg-brand text-white"
                  : "text-white/50 hover:text-white"
              )}
            >
              {lang === "all" ? `All (${analysis.tags.length})` : lang === "bangla" ? `বাংলা (${langCounts.bangla})` : lang === "banglish" ? `Banglish (${langCounts.banglish})` : `EN (${langCounts.english})`}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="flex bg-white/5 rounded-lg p-1 gap-1">
          {(["relevance", "tier", "alpha"] as SortMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setSortMode(mode)}
              className={clsx(
                "px-3 py-1.5 rounded-md text-xs font-medium transition-colors capitalize",
                sortMode === mode
                  ? "bg-white/15 text-white"
                  : "text-white/50 hover:text-white"
              )}
            >
              {mode === "relevance" ? "By Relevance" : mode === "tier" ? "By Tier" : "A–Z"}
            </button>
          ))}
        </div>

        <div className="ml-auto flex gap-2">
          <button onClick={selectBest12} className="btn-secondary text-xs py-1.5">
            Best 12 ★
          </button>
          <button onClick={selectAll} className="btn-secondary text-xs py-1.5">
            All
          </button>
          <button onClick={clearSelection} className="btn-secondary text-xs py-1.5">
            Clear
          </button>
        </div>
      </div>

      {/* Tag grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pb-8">
        {filteredTags.map((tag) => {
          const globalIdx = analysis.tags.indexOf(tag);
          return (
            <TagCard
              key={`${tag.text}-${globalIdx}`}
              tag={tag}
              selected={selectedIds.has(globalIdx)}
              onToggle={() => toggleTag(globalIdx)}
              showTier
            />
          );
        })}
      </div>
    </div>
  );
}
