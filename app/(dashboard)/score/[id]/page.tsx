"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAnalyzerStore } from "@/store/analyzerStore";
import { ScoreRing } from "@/components/ui/ScoreRing";
import { AnalysisResult, CategoryScores } from "@/types";
import { clsx } from "clsx";

const CATEGORY_LABELS: Record<keyof CategoryScores, string> = {
  titleOptimization: "Title Optimization",
  descriptionQuality: "Description Quality",
  tagStrategy: "Tag Strategy",
  transcriptRelevance: "Transcript Relevance",
  thumbnailSEO: "Thumbnail SEO",
  engagementPotential: "Engagement Potential",
  channelAuthority: "Channel Authority",
};

function CategoryBar({
  label,
  score,
  delay = 0,
}: {
  label: string;
  score: number;
  delay?: number;
}) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setWidth(score), delay + 100);
    return () => clearTimeout(timer);
  }, [score, delay]);

  const barColor =
    score >= 80
      ? "bg-green-400"
      : score >= 65
      ? "bg-blue-400"
      : score >= 50
      ? "bg-yellow-400"
      : score >= 35
      ? "bg-orange-400"
      : "bg-red-400";

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-white/70">{label}</span>
        <span className="text-sm font-semibold tabular-nums">{score}</span>
      </div>
      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
        <div
          className={clsx("h-full rounded-full transition-all duration-700 ease-out", barColor)}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}

export default function ScorePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { result, resultId, loadResult } = useAnalyzerStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[60vh]">
        <div className="text-center space-y-3">
          <svg className="w-10 h-10 animate-spin text-brand mx-auto" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-white/50">Loading results...</p>
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

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">SEO Score Report</h1>
          <p className="text-white/40 text-sm mt-1 truncate max-w-md">
            {analysis.input.title}
          </p>
        </div>
        <Link href="/analyze" className="btn-secondary text-sm">
          New Analysis
        </Link>
      </div>

      {/* Score + Summary */}
      <div className="grid grid-cols-1 md:grid-cols-[auto,1fr] gap-6 items-center">
        <div className="flex justify-center">
          <ScoreRing score={analysis.score} grade={analysis.grade} size={220} animate />
        </div>
        <div className="space-y-4">
          <div className="card">
            <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">
              Summary
            </h3>
            <p className="text-white/80 leading-relaxed">{analysis.summary}</p>
          </div>
        </div>
      </div>

      {/* Category bars */}
      <div className="card">
        <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-5">
          Category Breakdown
        </h3>
        <div className="space-y-4">
          {(Object.entries(analysis.categoryScores) as [keyof CategoryScores, number][]).map(
            ([key, score], i) => (
              <CategoryBar
                key={key}
                label={CATEGORY_LABELS[key]}
                score={score}
                delay={i * 80}
              />
            )
          )}
        </div>
      </div>

      {/* Strengths & Issues */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="card">
          <h3 className="text-sm font-semibold text-green-400 flex items-center gap-2 mb-4">
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2}>
              <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Strengths
          </h3>
          <ul className="space-y-2.5">
            {analysis.strengths.map((s, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-white/75">
                <span className="text-green-400 shrink-0 mt-0.5">✓</span>
                {s}
              </li>
            ))}
          </ul>
        </div>

        {/* Issues */}
        <div className="card">
          <h3 className="text-sm font-semibold text-red-400 flex items-center gap-2 mb-4">
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2}>
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" strokeLinecap="round" />
              <line x1="12" y1="16" x2="12.01" y2="16" strokeLinecap="round" />
            </svg>
            Issues
          </h3>
          <ul className="space-y-2.5">
            {analysis.issues.map((issue, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-white/75">
                <span className="text-red-400 shrink-0 mt-0.5">!</span>
                {issue}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Fix Steps */}
      <div className="card">
        <h3 className="text-sm font-semibold text-brand flex items-center gap-2 mb-4">
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Fix Steps
        </h3>
        <ol className="space-y-3">
          {analysis.fixSteps.map((step, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-white/75">
              <span className="w-6 h-6 rounded-full bg-brand/20 text-brand text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3 pb-8">
        <Link href={`/tags/${id}`} className="btn-primary flex items-center gap-2">
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
            <line x1="7" y1="7" x2="7.01" y2="7" strokeLinecap="round" />
          </svg>
          View Tags
        </Link>
        <Link href={`/copy/${id}`} className="btn-secondary flex items-center gap-2">
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2}>
            <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
          </svg>
          Copy Content
        </Link>
        <Link href="/analyze" className="btn-secondary flex items-center gap-2">
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2}>
            <polyline points="1 4 1 10 7 10" />
            <path d="M3.51 15a9 9 0 1 0 .49-4.5" />
          </svg>
          Re-analyze
        </Link>
      </div>
    </div>
  );
}
