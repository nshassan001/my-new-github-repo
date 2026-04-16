"use client";

import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { useAnalyzeStore } from "@/lib/analysis-store";
import type { AnalysisRequest, AnalysisResult } from "@/types";

const initialForm: AnalysisRequest = {
  title: "",
  description: "",
  tags: "",
  transcript: "",
  targetKeyword: "",
};

export default function AnalyzePage() {
  const [form, setForm] = useState<AnalysisRequest>(initialForm);
  const { result, isLoading, error, setLoading, setResult, setError, reset } = useAnalyzeStore();

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const payload = (await response.json()) as { error?: string };
        throw new Error(payload.error ?? "Could not analyze this video.");
      }

      const data = (await response.json()) as AnalysisResult;
      setResult(data);
      toast.success("Analysis complete");
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : "Unknown error";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">RankSpark Analyzer</h1>
        <p className="mt-2 text-slate-600">
          Submit your video metadata to generate a YouTube SEO score and optimization tips.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <form onSubmit={onSubmit} className="space-y-4 rounded-2xl bg-white p-6 shadow-sm">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Video Title</label>
            <input
              required
              value={form.title}
              onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none ring-primary/30 focus:ring"
              placeholder="How I Grew to 100K Subscribers in 6 Months"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Description</label>
            <textarea
              required
              rows={5}
              value={form.description}
              onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none ring-primary/30 focus:ring"
              placeholder="Summarize your video, include benefits, and add a CTA."
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Tags (comma separated)</label>
            <input
              required
              value={form.tags}
              onChange={(event) => setForm((prev) => ({ ...prev, tags: event.target.value }))}
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none ring-primary/30 focus:ring"
              placeholder="youtube growth, channel tips, creator strategy"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Target Keyword</label>
            <input
              required
              value={form.targetKeyword}
              onChange={(event) => setForm((prev) => ({ ...prev, targetKeyword: event.target.value }))}
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none ring-primary/30 focus:ring"
              placeholder="youtube growth strategy"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Transcript (optional)</label>
            <textarea
              rows={5}
              value={form.transcript ?? ""}
              onChange={(event) => setForm((prev) => ({ ...prev, transcript: event.target.value }))}
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none ring-primary/30 focus:ring"
              placeholder="Paste full or partial transcript for deeper analysis."
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={isLoading}
              className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#c84f28] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? "Analyzing..." : "Analyze SEO"}
            </button>
            <button
              type="button"
              onClick={() => {
                setForm(initialForm);
                reset();
              }}
              className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Reset
            </button>
          </div>
        </form>

        <section className="rounded-2xl bg-white p-6 shadow-sm">
          {!result && !error && (
            <p className="text-sm text-slate-500">Your scoring breakdown will appear here.</p>
          )}

          {error && <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}

          {result && (
            <>
              <div className="mb-5 rounded-xl bg-slate-100 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-500">Overall SEO Score</p>
                <div className="mt-1 flex items-end gap-3">
                  <span className="text-4xl font-bold text-primary">{result.overallScore}</span>
                  <span className="mb-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    {result.grade}
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-600">{result.summary}</p>
              </div>

              <div className="space-y-3">
                {result.factorScores.map((factor) => (
                  <div key={factor.factorId} className="rounded-lg border border-slate-200 p-3">
                    <div className="mb-1 flex items-center justify-between gap-4">
                      <span className="text-sm font-semibold text-slate-800">{factor.label}</span>
                      <span className="text-sm font-bold text-primary">{factor.score}/100</span>
                    </div>
                    <p className="text-xs text-slate-600">{factor.notes}</p>
                    {factor.suggestions.length > 0 && (
                      <ul className="mt-2 list-inside list-disc space-y-1 text-xs text-slate-600">
                        {factor.suggestions.map((suggestion) => (
                          <li key={suggestion}>{suggestion}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-5">
                <h2 className="mb-2 text-sm font-semibold text-slate-800">Quick Wins</h2>
                <ul className="list-inside list-disc space-y-1 text-sm text-slate-600">
                  {result.quickWins.map((tip) => (
                    <li key={tip}>{tip}</li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
