export type RankingFactorId =
  | "keywordRelevance"
  | "titleOptimization"
  | "descriptionQuality"
  | "tagStrategy"
  | "engagementSignals"
  | "thumbnailCtrPotential"
  | "retentionPotential";

export interface RankingFactorDefinition {
  id: RankingFactorId;
  label: string;
  description: string;
  weight: number;
}

export interface AnalysisRequest {
  title: string;
  description: string;
  tags: string;
  transcript?: string;
  targetKeyword: string;
}

export interface FactorScore {
  factorId: RankingFactorId;
  label: string;
  score: number;
  notes: string;
  suggestions: string[];
}

export interface AnalysisResult {
  overallScore: number;
  grade: string;
  summary: string;
  quickWins: string[];
  factorScores: FactorScore[];
  modelUsed: string;
  generatedAt: string;
}
