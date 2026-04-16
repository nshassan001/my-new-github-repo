import { RANKING_FACTORS } from "@/lib/ranking-factors";
import type { FactorScore, RankingFactorId } from "@/types";

function clampScore(value: number) {
  if (Number.isNaN(value)) {
    return 0;
  }

  return Math.max(0, Math.min(100, Math.round(value)));
}

function scoreToGrade(score: number) {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
}

export function ensureFactorCoverage(factorScores: FactorScore[]) {
  const scoreByFactor = new Map<RankingFactorId, FactorScore>();

  for (const factorScore of factorScores) {
    scoreByFactor.set(factorScore.factorId, {
      ...factorScore,
      score: clampScore(factorScore.score),
    });
  }

  return RANKING_FACTORS.map((factor) => {
    const existing = scoreByFactor.get(factor.id);

    if (existing) {
      return {
        ...existing,
        label: factor.label,
      };
    }

    return {
      factorId: factor.id,
      label: factor.label,
      score: 50,
      notes: "No model output for this factor; using neutral baseline.",
      suggestions: ["Add more metadata details to improve this factor assessment."],
    } satisfies FactorScore;
  });
}

export function calculateOverallScore(factorScores: FactorScore[]) {
  const coveredScores = ensureFactorCoverage(factorScores);
  const weightedScore = RANKING_FACTORS.reduce((accumulator, factor) => {
    const factorScore = coveredScores.find((entry) => entry.factorId === factor.id)?.score ?? 0;
    return accumulator + factorScore * factor.weight;
  }, 0);

  const overallScore = clampScore(weightedScore);
  return {
    overallScore,
    grade: scoreToGrade(overallScore),
    factorScores: coveredScores,
  };
}
