import type { RankingFactorDefinition } from "@/types";

export const RANKING_FACTORS: RankingFactorDefinition[] = [
  {
    id: "keywordRelevance",
    label: "Keyword Relevance",
    description: "How strongly your metadata targets the primary keyword and related phrases.",
    weight: 0.22,
  },
  {
    id: "titleOptimization",
    label: "Title Optimization",
    description: "Title clarity, keyword placement, and click appeal.",
    weight: 0.18,
  },
  {
    id: "descriptionQuality",
    label: "Description Quality",
    description: "Depth, readability, and strategic placement of supporting terms and CTA.",
    weight: 0.16,
  },
  {
    id: "tagStrategy",
    label: "Tag Strategy",
    description: "Tag breadth, specificity, and overlap with search intent.",
    weight: 0.12,
  },
  {
    id: "engagementSignals",
    label: "Engagement Signals",
    description: "Hooks and calls-to-action likely to drive comments, watch time, and shares.",
    weight: 0.12,
  },
  {
    id: "thumbnailCtrPotential",
    label: "Thumbnail CTR Potential",
    description: "Potential click-through support based on title-transcript alignment and curiosity.",
    weight: 0.1,
  },
  {
    id: "retentionPotential",
    label: "Retention Potential",
    description: "How likely the content structure is to retain viewers.",
    weight: 0.1,
  },
];
