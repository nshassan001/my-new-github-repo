"use client";

import { create } from "zustand";
import type { AnalysisResult } from "@/types";

type AnalyzeState = {
  result: AnalysisResult | null;
  isLoading: boolean;
  error: string | null;
  setResult: (result: AnalysisResult) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
};

export const useAnalyzeStore = create<AnalyzeState>((set) => ({
  result: null,
  isLoading: false,
  error: null,
  setResult: (result) => set({ result }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  reset: () => set({ result: null, isLoading: false, error: null }),
}));
