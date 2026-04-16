"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAnalyzerStore } from "@/store/analyzerStore";
import { CopyBox } from "@/components/ui/CopyBox";
import { AnalysisResult } from "@/types";
import { clsx } from "clsx";
import toast from "react-hot-toast";

export default function CopyPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { result, resultId, loadResult } = useAnalyzerStore();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTitle, setSelectedTitle] = useState(0);

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
          <svg className="w-10 h-10 animate-spin text-[#D85A30] mx-auto" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-white/50">Loading content...</p>
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

  const channelKeywordsText = analysis.channelKeywords.join(", ");

  const copyAll = async () => {
    const all = [
      `=== TITLE ===\n${analysis.titleOptions[selectedTitle] || analysis.titleOptions[0]}`,
      `\n=== DESCRIPTION ===\n${analysis.optimizedDescription}`,
      `\n=== PINNED COMMENT ===\n${analysis.pinnedComment}`,
      `\n=== CHANNEL KEYWORDS ===\n${channelKeywordsText}`,
    ].join("\n");

    try {
      await navigator.clipboard.writeText(all);
      toast.success("All content copied!");
    } catch {
      toast.error("Failed to copy");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold">Copy-Ready Content</h1>
          <p className="text-white/40 text-sm mt-1">
            All content is optimized for &quot;{analysis.input.keyword}&quot;
          </p>
        </div>
        <div className="flex gap-2">
          <Link href={`/score/${id}`} className="btn-secondary text-sm">
            ← Score
          </Link>
          <Link href={`/tags/${id}`} className="btn-secondary text-sm">
            Tags
          </Link>
          <button onClick={copyAll} className="btn-primary text-sm flex items-center gap-1.5">
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2}>
              <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
              <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
            </svg>
            Copy All
          </button>
        </div>
      </div>

      {/* Title Options */}
      <section className="card space-y-4">
        <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider">
          Title Options (3)
        </h2>
        <p className="text-xs text-white/40">Select your preferred title, then copy</p>

        <div className="space-y-2">
          {analysis.titleOptions.map((title, i) => (
            <div
              key={i}
              onClick={() => setSelectedTitle(i)}
              className={clsx(
                "flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all",
                selectedTitle === i
                  ? "border-[#D85A30]/50 bg-[#D85A30]/8"
                  : "border-white/10 hover:border-white/20"
              )}
            >
              <div
                className={clsx(
                  "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors",
                  selectedTitle === i ? "border-[#D85A30] bg-[#D85A30]" : "border-white/20"
                )}
              >
                {selectedTitle === i && (
                  <div className="w-2 h-2 rounded-full bg-white" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm text-white leading-relaxed">{title}</p>
                <p className="text-xs text-white/30 mt-1">{title.length} chars</p>
              </div>
              <button
                onClick={async (e) => {
                  e.stopPropagation();
                  await navigator.clipboard.writeText(title);
                  toast.success("Title copied!");
                }}
                className="text-xs text-white/30 hover:text-white px-2 py-1 hover:bg-white/5 rounded transition-colors shrink-0"
              >
                Copy
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Optimized Description */}
      <section className="card space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider">
            Optimized Description
          </h2>
          <span className="text-xs text-white/30">
            {analysis.optimizedDescription.split(/\s+/).length} words
          </span>
        </div>
        <CopyBox
          content={analysis.optimizedDescription}
          rows={10}
        />
      </section>

      {/* Pinned Comment */}
      <section className="card space-y-3">
        <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider">
          Pinned Comment
        </h2>
        <p className="text-xs text-white/40">
          Post this as your first comment and pin it to boost engagement signals
        </p>
        <CopyBox
          content={analysis.pinnedComment}
          rows={4}
        />
      </section>

      {/* Channel Keywords */}
      <section className="card space-y-3">
        <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider">
          Channel Keywords
        </h2>
        <p className="text-xs text-white/40">
          Add these to your channel description and YouTube Studio channel keywords
        </p>
        <div className="flex flex-wrap gap-2 mb-3">
          {analysis.channelKeywords.map((kw, i) => (
            <span
              key={i}
              className="bg-white/5 border border-white/10 text-white/70 text-xs px-3 py-1.5 rounded-full"
            >
              {kw}
            </span>
          ))}
        </div>
        <CopyBox
          content={channelKeywordsText}
          rows={2}
        />
      </section>

      {/* Quick Wins */}
      <section className="card space-y-4">
        <h2 className="text-sm font-semibold text-[#D85A30] flex items-center gap-2 uppercase tracking-wider">
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
          Quick Wins
        </h2>
        <p className="text-xs text-white/40">Do these now to see immediate improvement</p>
        <ul className="space-y-3">
          {analysis.quickWins.map((win, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[#D85A30]/20 text-[#D85A30] text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">
                {i + 1}
              </span>
              <span className="text-sm text-white/80 leading-relaxed">{win}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Bottom navigation */}
      <div className="flex justify-center gap-3 pt-4 pb-4">
        <Link href="/analyze" className="btn-primary flex items-center gap-2">
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2}>
            <polyline points="1 4 1 10 7 10" />
            <path d="M3.51 15a9 9 0 1 0 .49-4.5" />
          </svg>
          Analyze Another Video
        </Link>
      </div>
    </div>
  );
}
