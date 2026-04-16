import { create } from "zustand";
import { VideoInput, AnalysisResult, LiveScore } from "@/types";
import { calculateLiveScore } from "@/lib/score-calculator";
import { CHECKLIST_ITEMS } from "@/lib/ranking-factors";

interface AnalyzerState {
  input: Partial<VideoInput>;
  liveScore: LiveScore;
  isAnalyzing: boolean;
  result: AnalysisResult | null;
  resultId: string | null;

  setField: <K extends keyof VideoInput>(key: K, value: VideoInput[K]) => void;
  setChecklist: (id: string, checked: boolean) => void;
  setTagLanguage: (lang: keyof VideoInput["tagLanguages"], checked: boolean) => void;
  submitAnalysis: () => Promise<void>;
  loadResult: (id: string) => Promise<void>;
  reset: () => void;
}

const defaultInput: Partial<VideoInput> = {
  title: "",
  keyword: "",
  transcript: "",
  description: "",
  tags: "",
  language: "bangla",
  niche: "",
  videoType: "tutorial",
  channelSize: "small",
  thumbnailStatus: "yes",
  tagLanguages: { bangla: true, banglish: true, english: true },
  checklist: CHECKLIST_ITEMS.reduce((acc, item) => ({ ...acc, [item.id]: false }), {}),
};

export const useAnalyzerStore = create<AnalyzerState>((set, get) => ({
  input: defaultInput,
  liveScore: calculateLiveScore(defaultInput),
  isAnalyzing: false,
  result: null,
  resultId: null,

  setField: (key, value) => {
    const newInput = { ...get().input, [key]: value };
    set({ input: newInput, liveScore: calculateLiveScore(newInput) });
  },

  setChecklist: (id, checked) => {
    const newInput = {
      ...get().input,
      checklist: { ...get().input.checklist, [id]: checked },
    };
    set({ input: newInput, liveScore: calculateLiveScore(newInput) });
  },

  setTagLanguage: (lang, checked) => {
    const newInput = {
      ...get().input,
      tagLanguages: { ...get().input.tagLanguages!, [lang]: checked },
    };
    set({ input: newInput, liveScore: calculateLiveScore(newInput) });
  },

  submitAnalysis: async () => {
    const { input } = get();
    set({ isAnalyzing: true });

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Analysis failed");
      }

      const data = await response.json();
      set({ result: data.result, resultId: data.id, isAnalyzing: false });
      return data.id;
    } catch (error) {
      set({ isAnalyzing: false });
      throw error;
    }
  },

  loadResult: async (id: string) => {
    const response = await fetch(`/api/analyze?id=${id}`);
    if (!response.ok) throw new Error("Result not found");
    const data = await response.json();

    const result: AnalysisResult = {
      id: data.id,
      score: data.score,
      grade: data.grade,
      summary: data.summary,
      categoryScores: data.categoryScores,
      strengths: data.strengths,
      issues: data.issues,
      fixSteps: data.fixSteps,
      tags: data.tags,
      titleOptions: data.titleOptions,
      optimizedDescription: data.optimizedDescription,
      pinnedComment: data.pinnedComment,
      channelKeywords: data.channelKeywords,
      quickWins: data.quickWins,
      input: data.input,
      createdAt: data.createdAt,
    };

    set({ result, resultId: id });
  },

  reset: () => {
    set({
      input: defaultInput,
      liveScore: calculateLiveScore(defaultInput),
      result: null,
      resultId: null,
    });
  },
}));
