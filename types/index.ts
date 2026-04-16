export interface VideoInput {
  title: string;
  keyword: string;
  transcript: string;
  description: string;
  tags: string;
  language: "bangla" | "banglish" | "english";
  niche: string;
  videoType: "tutorial" | "vlog" | "review" | "news" | "entertainment" | "educational" | "other";
  channelSize: "nano" | "micro" | "small" | "medium" | "large";
  thumbnailStatus: "yes" | "no" | "unknown";
  tagLanguages: {
    bangla: boolean;
    banglish: boolean;
    english: boolean;
  };
  checklist: Record<string, boolean>;
}

export interface Tag {
  text: string;
  language: "bangla" | "banglish" | "english";
  relevanceScore: number;
  tier: 1 | 2 | 3 | 4 | 5;
  isExactMatch: boolean;
}

export interface CategoryScores {
  titleOptimization: number;
  descriptionQuality: number;
  tagStrategy: number;
  transcriptRelevance: number;
  thumbnailSEO: number;
  engagementPotential: number;
  channelAuthority: number;
}

export interface AnalysisResult {
  id: string;
  score: number;
  grade: "S" | "A" | "B" | "C" | "D" | "F";
  summary: string;
  categoryScores: CategoryScores;
  strengths: string[];
  issues: string[];
  fixSteps: string[];
  tags: Tag[];
  titleOptions: string[];
  optimizedDescription: string;
  pinnedComment: string;
  channelKeywords: string[];
  quickWins: string[];
  input: VideoInput;
  createdAt: string;
}

export interface LiveScore {
  score: number;
  grade: "S" | "A" | "B" | "C" | "D" | "F";
  breakdown: {
    label: string;
    value: number;
    max: number;
  }[];
}

export interface ChecklistItem {
  id: string;
  label: string;
  description: string;
  points: number;
}
