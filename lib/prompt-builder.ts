import type { AnalysisRequest } from "@/types";
import { RANKING_FACTORS } from "@/lib/ranking-factors";

export function buildAnalysisPrompt(input: AnalysisRequest) {
  const factors = RANKING_FACTORS.map(
    (factor) => `- ${factor.id}: ${factor.description} (weight: ${factor.weight})`,
  ).join("\n");

  const userPrompt = `You are RankSpark, an expert YouTube SEO analyst.
Evaluate the following video metadata against these ranking factors:
${factors}

Video input:
- Title: ${input.title}
- Description: ${input.description}
- Tags: ${input.tags}
- Target keyword: ${input.targetKeyword}
- Transcript: ${input.transcript || "Not provided"}

Return STRICT JSON with this exact schema:
{
  "summary": "string",
  "quickWins": ["string"],
  "factorScores": [
    {
      "factorId": "keywordRelevance|titleOptimization|descriptionQuality|tagStrategy|engagementSignals|thumbnailCtrPotential|retentionPotential",
      "score": 0-100,
      "notes": "string",
      "suggestions": ["string"]
    }
  ]
}
Only return valid JSON and no markdown.`;

  return {
    systemPrompt:
      "You are a strict JSON API. Never include markdown wrappers, explanations, or extra keys.",
    userPrompt,
  };
}
