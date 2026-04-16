"use client";

import { useState } from "react";
import Link from "next/link";

interface AnalysisResult {
  wordCount: number;
  charCount: number;
  charCountNoSpaces: number;
  sentenceCount: number;
  paragraphCount: number;
  avgWordsPerSentence: number;
  longestWord: string;
  mostFrequentWords: Array<{ word: string; count: number }>;
  readingTimeMinutes: number;
}

function analyzeText(text: string): AnalysisResult {
  const trimmed = text.trim();

  if (!trimmed) {
    return {
      wordCount: 0,
      charCount: 0,
      charCountNoSpaces: 0,
      sentenceCount: 0,
      paragraphCount: 0,
      avgWordsPerSentence: 0,
      longestWord: "",
      mostFrequentWords: [],
      readingTimeMinutes: 0,
    };
  }

  const words = trimmed.match(/\b\w+\b/g) ?? [];
  const sentences = trimmed.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const paragraphs = trimmed.split(/\n\s*\n/).filter((p) => p.trim().length > 0);

  const longestWord = words.reduce(
    (longest, word) => (word.length > longest.length ? word : longest),
    ""
  );

  const frequency: Record<string, number> = {};
  for (const word of words) {
    const lower = word.toLowerCase();
    frequency[lower] = (frequency[lower] ?? 0) + 1;
  }

  const mostFrequentWords = Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([word, count]) => ({ word, count }));

  const avgWordsPerSentence =
    sentences.length > 0 ? Math.round(words.length / sentences.length) : 0;

  const readingTimeMinutes = Math.ceil(words.length / 200);

  return {
    wordCount: words.length,
    charCount: trimmed.length,
    charCountNoSpaces: trimmed.replace(/\s/g, "").length,
    sentenceCount: sentences.length,
    paragraphCount: paragraphs.length,
    avgWordsPerSentence,
    longestWord,
    mostFrequentWords,
    readingTimeMinutes,
  };
}

interface StatCardProps {
  label: string;
  value: string | number;
}

function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-700 dark:bg-zinc-800">
      <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{label}</p>
      <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-zinc-50">{value}</p>
    </div>
  );
}

export default function AnalyzePage() {
  const [text, setText] = useState("");
  const result = analyzeText(text);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-950">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Text Analyzer
          </h1>
          <Link
            href="/"
            className="text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-10 space-y-8">
        {/* Input */}
        <section>
          <label
            htmlFor="text-input"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
          >
            Paste or type your text below
          </label>
          <textarea
            id="text-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Start typing or paste your text here…"
            rows={10}
            className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-200 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-50 dark:placeholder-zinc-500 dark:focus:border-zinc-400 dark:focus:ring-zinc-700 resize-y"
          />
        </section>

        {/* Stats grid */}
        {text.trim().length > 0 && (
          <>
            <section>
              <h2 className="text-base font-semibold text-zinc-700 dark:text-zinc-300 mb-4">
                Overview
              </h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                <StatCard label="Words" value={result.wordCount} />
                <StatCard label="Characters" value={result.charCount} />
                <StatCard label="Characters (no spaces)" value={result.charCountNoSpaces} />
                <StatCard label="Sentences" value={result.sentenceCount} />
                <StatCard label="Paragraphs" value={result.paragraphCount} />
                <StatCard label="Avg. words / sentence" value={result.avgWordsPerSentence} />
              </div>
            </section>

            <section className="grid gap-4 sm:grid-cols-2">
              {/* Reading time */}
              <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-700 dark:bg-zinc-800">
                <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                  Estimated reading time
                </p>
                <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                  {result.readingTimeMinutes} min
                </p>
                <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">at 200 wpm</p>
              </div>

              {/* Longest word */}
              <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-700 dark:bg-zinc-800">
                <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                  Longest word
                </p>
                <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-zinc-50 break-all">
                  {result.longestWord || "—"}
                </p>
                {result.longestWord && (
                  <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
                    {result.longestWord.length} characters
                  </p>
                )}
              </div>
            </section>

            {/* Top words */}
            {result.mostFrequentWords.length > 0 && (
              <section>
                <h2 className="text-base font-semibold text-zinc-700 dark:text-zinc-300 mb-4">
                  Most frequent words
                </h2>
                <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-800">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-zinc-100 dark:border-zinc-700">
                        <th className="px-5 py-3 text-left font-medium text-zinc-500 dark:text-zinc-400">
                          Word
                        </th>
                        <th className="px-5 py-3 text-right font-medium text-zinc-500 dark:text-zinc-400">
                          Count
                        </th>
                        <th className="px-5 py-3 text-right font-medium text-zinc-500 dark:text-zinc-400">
                          Frequency
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.mostFrequentWords.map(({ word, count }, index) => (
                        <tr
                          key={word}
                          className={
                            index < result.mostFrequentWords.length - 1
                              ? "border-b border-zinc-100 dark:border-zinc-700"
                              : ""
                          }
                        >
                          <td className="px-5 py-3 font-medium text-zinc-900 dark:text-zinc-50">
                            {word}
                          </td>
                          <td className="px-5 py-3 text-right text-zinc-600 dark:text-zinc-300">
                            {count}
                          </td>
                          <td className="px-5 py-3 text-right text-zinc-600 dark:text-zinc-300">
                            {result.wordCount > 0
                              ? ((count / result.wordCount) * 100).toFixed(1)
                              : "0.0"}
                            %
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}
          </>
        )}

        {text.trim().length === 0 && (
          <p className="text-center text-sm text-zinc-400 dark:text-zinc-500 py-8">
            Statistics will appear here once you enter some text.
          </p>
        )}
      </main>
    </div>
  );
}
