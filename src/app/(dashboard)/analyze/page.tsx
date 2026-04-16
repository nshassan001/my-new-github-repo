"use client";

import { useRouter } from "next/navigation";
import { useAnalyzerStore } from "@/store/analyzerStore";
import { CHECKLIST_ITEMS } from "@/lib/ranking-factors";
import type { VideoInput } from "@/types";
import { clsx } from "clsx";
import toast from "react-hot-toast";

function LiveScorePill({ score, grade }: { score: number; grade: string }) {
  const gradeColors: Record<string, string> = {
    S: "bg-yellow-400/15 text-yellow-400 border-yellow-400/30",
    A: "bg-green-400/15 text-green-400 border-green-400/30",
    B: "bg-blue-400/15 text-blue-400 border-blue-400/30",
    C: "bg-orange-400/15 text-orange-400 border-orange-400/30",
    D: "bg-red-400/15 text-red-400 border-red-400/30",
    F: "bg-red-600/15 text-red-500 border-red-600/30",
  };

  return (
    <div
      className={clsx(
        "flex items-center gap-2 border rounded-full px-4 py-2 transition-all duration-300",
        gradeColors[grade] || "bg-[#D85A30]/15 text-[#D85A30] border-[#D85A30]/30"
      )}
    >
      <div className="flex items-center gap-1.5">
        <div className="w-2 h-2 rounded-full bg-current animate-pulse" />
        <span className="text-xs font-medium tracking-wide uppercase">Live Score</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="text-2xl font-black tabular-nums leading-none">{score}</span>
        <span className="text-lg font-bold">{grade}</span>
      </div>
    </div>
  );
}

export default function AnalyzePage() {
  const router = useRouter();
  const {
    input,
    liveScore,
    isAnalyzing,
    setField,
    setChecklist,
    setTagLanguage,
    submitAnalysis,
  } = useAnalyzerStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.title || !input.keyword) {
      toast.error("Title and keyword are required");
      return;
    }

    try {
      const toastId = toast.loading("Analyzing video metadata with AI...");
      const id = await submitAnalysis() as unknown as string;
      toast.dismiss(toastId);
      toast.success("Analysis complete!");
      router.push(`/score/${id}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Analysis failed");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-1">Video Analyzer</h1>
          <p className="text-white/50 text-sm">
            Fill in your video metadata to get an AI-powered SEO score
          </p>
        </div>
        <LiveScorePill score={liveScore.score} grade={liveScore.grade} />
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Core metadata */}
        <section className="card space-y-5">
          <h2 className="text-base font-semibold text-white/80 flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-[#D85A30]/20 text-[#D85A30] text-xs flex items-center justify-center font-bold">1</span>
            Core Metadata
          </h2>

          <div>
            <label className="label">
              Video Title <span className="text-[#D85A30]">*</span>
            </label>
            <input
              type="text"
              value={input.title || ""}
              onChange={(e) => setField("title", e.target.value)}
              placeholder="e.g. কিভাবে YouTube SEO করবেন - Complete Guide 2024"
              className="input-field"
              required
            />
            <div className="flex justify-between mt-1">
              <span className="text-xs text-white/30">Aim for 40–60 characters</span>
              <span
                className={clsx(
                  "text-xs tabular-nums",
                  (input.title?.length || 0) >= 40 && (input.title?.length || 0) <= 60
                    ? "text-green-400"
                    : "text-white/30"
                )}
              >
                {input.title?.length || 0} chars
              </span>
            </div>
          </div>

          <div>
            <label className="label">
              Target Keyword <span className="text-[#D85A30]">*</span>
            </label>
            <input
              type="text"
              value={input.keyword || ""}
              onChange={(e) => setField("keyword", e.target.value)}
              placeholder="e.g. YouTube SEO বাংলা"
              className="input-field"
              required
            />
            <p className="text-xs text-white/30 mt-1">
              The main keyword you want to rank for (will be first tag ★)
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="label">Niche / Topic</label>
              <input
                type="text"
                value={input.niche || ""}
                onChange={(e) => setField("niche", e.target.value)}
                placeholder="e.g. Tech, Cooking, Finance"
                className="input-field"
              />
            </div>
            <div>
              <label className="label">Video Language</label>
              <select
                value={input.language || "bangla"}
                onChange={(e) => setField("language", e.target.value as VideoInput["language"])}
                className="input-field"
              >
                <option value="bangla">বাংলা (Bangla)</option>
                <option value="banglish">Banglish</option>
                <option value="english">English</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="label">Video Type</label>
              <select
                value={input.videoType || "tutorial"}
                onChange={(e) => setField("videoType", e.target.value as VideoInput["videoType"])}
                className="input-field"
              >
                <option value="tutorial">Tutorial</option>
                <option value="vlog">Vlog</option>
                <option value="review">Review</option>
                <option value="news">News</option>
                <option value="entertainment">Entertainment</option>
                <option value="educational">Educational</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="label">Channel Size</label>
              <select
                value={input.channelSize || "small"}
                onChange={(e) => setField("channelSize", e.target.value as VideoInput["channelSize"])}
                className="input-field"
              >
                <option value="nano">&lt;1K (Nano)</option>
                <option value="micro">1K–10K (Micro)</option>
                <option value="small">10K–100K (Small)</option>
                <option value="medium">100K–1M (Medium)</option>
                <option value="large">&gt;1M (Large)</option>
              </select>
            </div>
            <div>
              <label className="label">Custom Thumbnail</label>
              <select
                value={input.thumbnailStatus || "yes"}
                onChange={(e) => setField("thumbnailStatus", e.target.value as VideoInput["thumbnailStatus"])}
                className="input-field"
              >
                <option value="yes">Yes, uploaded</option>
                <option value="no">No</option>
                <option value="unknown">Not sure</option>
              </select>
            </div>
          </div>
        </section>

        {/* Description */}
        <section className="card space-y-4">
          <h2 className="text-base font-semibold text-white/80 flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-[#D85A30]/20 text-[#D85A30] text-xs flex items-center justify-center font-bold">2</span>
            Description
          </h2>
          <div>
            <label className="label">Video Description</label>
            <textarea
              value={input.description || ""}
              onChange={(e) => setField("description", e.target.value)}
              placeholder="Paste your video description here..."
              rows={6}
              className="input-field resize-y"
            />
            <div className="flex justify-between mt-1">
              <span className="text-xs text-white/30">Aim for 150+ words</span>
              <span
                className={clsx(
                  "text-xs tabular-nums",
                  (input.description?.trim().split(/\s+/).filter(Boolean).length || 0) >= 150
                    ? "text-green-400"
                    : "text-white/30"
                )}
              >
                {input.description?.trim().split(/\s+/).filter(Boolean).length || 0} words
              </span>
            </div>
          </div>
        </section>

        {/* Transcript */}
        <section className="card space-y-4">
          <h2 className="text-base font-semibold text-white/80 flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-[#D85A30]/20 text-[#D85A30] text-xs flex items-center justify-center font-bold">3</span>
            Transcript
          </h2>
          <div>
            <label className="label">Video Transcript / Script</label>
            <textarea
              value={input.transcript || ""}
              onChange={(e) => setField("transcript", e.target.value)}
              placeholder="Paste your video transcript or script here. This helps AI understand your content better..."
              rows={6}
              className="input-field resize-y"
            />
            <p className="text-xs text-white/30 mt-1">
              Optional but recommended — improves transcript relevance score
            </p>
          </div>
        </section>

        {/* Tags */}
        <section className="card space-y-4">
          <h2 className="text-base font-semibold text-white/80 flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-[#D85A30]/20 text-[#D85A30] text-xs flex items-center justify-center font-bold">4</span>
            Tags
          </h2>
          <div>
            <label className="label">Existing Tags</label>
            <textarea
              value={input.tags || ""}
              onChange={(e) => setField("tags", e.target.value)}
              placeholder="tag1, tag2, ট্যাগ, banglish tag, ..."
              rows={3}
              className="input-field resize-none font-mono text-sm"
            />
            <div className="flex justify-between mt-1">
              <span className="text-xs text-white/30">Comma-separated. Aim for 15+</span>
              <span
                className={clsx(
                  "text-xs tabular-nums",
                  (input.tags?.split(",").filter((t) => t.trim()).length || 0) >= 15
                    ? "text-green-400"
                    : "text-white/30"
                )}
              >
                {input.tags?.split(",").filter((t) => t.trim()).length || 0} tags
              </span>
            </div>
          </div>

          {/* Tag language checkboxes */}
          <div>
            <label className="label">Generate tags in</label>
            <div className="flex gap-4 flex-wrap">
              {(
                [
                  { key: "bangla", label: "বাংলা (Bangla)" },
                  { key: "banglish", label: "Banglish" },
                  { key: "english", label: "English" },
                ] as const
              ).map(({ key, label }) => (
                <label key={key} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={input.tagLanguages?.[key] ?? true}
                    onChange={(e) => setTagLanguage(key, e.target.checked)}
                    className="w-4 h-4 rounded border-white/20 bg-white/5 accent-brand"
                  />
                  <span className="text-sm text-white/70">{label}</span>
                </label>
              ))}
            </div>
          </div>
        </section>

        {/* 23-item Checklist */}
        <section className="card space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-white/80 flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-[#D85A30]/20 text-[#D85A30] text-xs flex items-center justify-center font-bold">5</span>
              SEO Checklist
            </h2>
            <span className="text-xs text-white/40">
              {Object.values(input.checklist || {}).filter(Boolean).length}/{CHECKLIST_ITEMS.length} completed
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {CHECKLIST_ITEMS.map((item) => {
              const checked = input.checklist?.[item.id] ?? false;
              return (
                <label
                  key={item.id}
                  className={clsx(
                    "flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors",
                    checked
                      ? "border-[#D85A30]/30 bg-[#D85A30]/5"
                      : "border-white/5 bg-white/[0.02] hover:border-white/10"
                  )}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => setChecklist(item.id, e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-white/20 bg-white/5 accent-brand shrink-0"
                  />
                  <div>
                    <div
                      className={clsx(
                        "text-sm font-medium transition-colors",
                        checked ? "text-white" : "text-white/70"
                      )}
                    >
                      {item.label}
                    </div>
                    <div className="text-xs text-white/35 mt-0.5">{item.description}</div>
                  </div>
                  <span className="ml-auto text-xs text-[#D85A30]/60 font-mono shrink-0">
                    +{item.points}
                  </span>
                </label>
              );
            })}
          </div>
        </section>

        {/* Submit */}
        <div className="flex items-center justify-between pt-2 pb-8">
          <div className="text-sm text-white/40">
            Live preview updates as you type — full AI analysis on submit
          </div>
          <button
            type="submit"
            disabled={isAnalyzing || !input.title || !input.keyword}
            className="btn-primary flex items-center gap-2 px-8 py-3 text-base rounded-xl"
          >
            {isAnalyzing ? (
              <>
                <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Analyzing...
              </>
            ) : (
              <>
                Analyze Video
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

