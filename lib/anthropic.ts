import Anthropic from "@anthropic-ai/sdk";
import { VideoInput, AnalysisResult } from "@/types";
import { buildAnalysisPrompt } from "./prompt-builder";
import { GRADE_THRESHOLDS } from "./ranking-factors";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

function getGrade(score: number): AnalysisResult["grade"] {
  if (score >= GRADE_THRESHOLDS.S) return "S";
  if (score >= GRADE_THRESHOLDS.A) return "A";
  if (score >= GRADE_THRESHOLDS.B) return "B";
  if (score >= GRADE_THRESHOLDS.C) return "C";
  if (score >= GRADE_THRESHOLDS.D) return "D";
  return "F";
}

export async function analyzeVideo(
  input: VideoInput,
  id: string
): Promise<AnalysisResult> {
  const prompt = buildAnalysisPrompt(input);

  const message = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  const responseText =
    message.content[0].type === "text" ? message.content[0].text : "";

  // Extract JSON from response
  let parsed: Omit<AnalysisResult, "id" | "input" | "createdAt">;
  try {
    // Try direct parse first
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found in response");
    parsed = JSON.parse(jsonMatch[0]);
  } catch {
    throw new Error(`Failed to parse AI response: ${responseText.slice(0, 200)}`);
  }

  // Validate and sanitize
  const score = Math.min(100, Math.max(0, Number(parsed.score) || 0));

  return {
    id,
    score,
    grade: parsed.grade || getGrade(score),
    summary: parsed.summary || "Analysis complete.",
    categoryScores: {
      titleOptimization: parsed.categoryScores?.titleOptimization ?? 0,
      descriptionQuality: parsed.categoryScores?.descriptionQuality ?? 0,
      tagStrategy: parsed.categoryScores?.tagStrategy ?? 0,
      transcriptRelevance: parsed.categoryScores?.transcriptRelevance ?? 0,
      thumbnailSEO: parsed.categoryScores?.thumbnailSEO ?? 0,
      engagementPotential: parsed.categoryScores?.engagementPotential ?? 0,
      channelAuthority: parsed.categoryScores?.channelAuthority ?? 0,
    },
    strengths: parsed.strengths || [],
    issues: parsed.issues || [],
    fixSteps: parsed.fixSteps || [],
    tags: Array.isArray(parsed.tags) ? parsed.tags : [],
    titleOptions: parsed.titleOptions || [],
    optimizedDescription: parsed.optimizedDescription || "",
    pinnedComment: parsed.pinnedComment || "",
    channelKeywords: parsed.channelKeywords || [],
    quickWins: parsed.quickWins || [],
    input,
    createdAt: new Date().toISOString(),
  };
}
