import { NextResponse } from "next/server";
import { getAnthropicClient } from "@/lib/anthropic";
import { buildAnalysisPrompt } from "@/lib/prompt-builder";
import { RANKING_FACTORS } from "@/lib/ranking-factors";
import { calculateOverallScore } from "@/lib/score-calculator";
import type { AnalysisRequest, FactorScore, RankingFactorId } from "@/types";

type AIAnalysisPayload = {
  summary?: string;
  quickWins?: string[];
  factorScores?: Array<{
    factorId: RankingFactorId;
    score: number;
    notes: string;
    suggestions?: string[];
  }>;
};

function parseModelPayload(text: string): AIAnalysisPayload | null {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");

  if (start < 0 || end < 0) {
    return null;
  }

  try {
    return JSON.parse(text.slice(start, end + 1)) as AIAnalysisPayload;
  } catch {
    return null;
  }
}

function buildHeuristicScores(input: AnalysisRequest): FactorScore[] {
  const loweredTitle = input.title.toLowerCase();
  const loweredDescription = input.description.toLowerCase();
  const loweredKeyword = input.targetKeyword.toLowerCase();
  const tags = input.tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  const keywordInTitle = loweredTitle.includes(loweredKeyword);
  const keywordInDescription = loweredDescription.includes(loweredKeyword);
  const keywordInTags = tags.some((tag) => tag.toLowerCase().includes(loweredKeyword));
  const descriptionLength = input.description.trim().length;
  const transcriptLength = input.transcript?.trim().length ?? 0;

  return RANKING_FACTORS.map((factor) => {
    let score = 55;
    let notes = "Neutral baseline score.";
    const suggestions: string[] = [];

    if (factor.id === "keywordRelevance") {
      score = 40 + (keywordInTitle ? 25 : 0) + (keywordInDescription ? 20 : 0) + (keywordInTags ? 15 : 0);
      notes = "Measures how often and where your target keyword appears.";
      if (!keywordInTitle) suggestions.push("Include your exact target keyword in the first half of the title.");
      if (!keywordInDescription) suggestions.push("Add the keyword naturally in the first two lines of the description.");
    }

    if (factor.id === "titleOptimization") {
      score = 50 + (input.title.length >= 45 && input.title.length <= 70 ? 25 : 0) + (keywordInTitle ? 15 : 0);
      notes = "Evaluates title length, clarity, and keyword placement.";
      if (input.title.length < 45) suggestions.push("Consider a more descriptive title with specific value.");
      if (input.title.length > 70) suggestions.push("Trim title length to avoid truncation in search results.");
    }

    if (factor.id === "descriptionQuality") {
      score = 45 + (descriptionLength > 250 ? 30 : 10) + (keywordInDescription ? 15 : 0);
      notes = "Scores depth and clarity of your video description.";
      if (descriptionLength < 180) suggestions.push("Expand your description with summary, timestamps, and CTA.");
    }

    if (factor.id === "tagStrategy") {
      score = 40 + Math.min(tags.length * 4, 35) + (keywordInTags ? 15 : 0);
      notes = "Assesses tag count and relevance to search intent.";
      if (tags.length < 8) suggestions.push("Use 8-15 focused tags mixing short and long-tail terms.");
    }

    if (factor.id === "engagementSignals") {
      const hasCta = /subscribe|comment|like|share|join/i.test(input.description);
      score = 50 + (hasCta ? 25 : 0) + (transcriptLength > 600 ? 15 : 5);
      notes = "Estimates engagement potential via CTAs and content depth.";
      if (!hasCta) suggestions.push("Add a clear CTA asking viewers to comment or subscribe.");
    }

    if (factor.id === "thumbnailCtrPotential") {
      const hasPowerWords = /best|secret|fast|easy|proven|step-by-step/i.test(input.title);
      score = 55 + (hasPowerWords ? 20 : 0) + (keywordInTitle ? 10 : 0);
      notes = "Approximates click potential based on title framing and clarity.";
      if (!hasPowerWords) suggestions.push("Test curiosity-driven wording to improve click appeal.");
    }

    if (factor.id === "retentionPotential") {
      score = 50 + (transcriptLength > 900 ? 25 : transcriptLength > 300 ? 15 : 0);
      notes = "Uses transcript depth as a proxy for structured, retention-friendly flow.";
      if (transcriptLength < 300) suggestions.push("Provide transcript sections or bullet structure to improve pacing.");
    }

    return {
      factorId: factor.id,
      label: factor.label,
      score,
      notes,
      suggestions,
    };
  });
}

function mergeScores(aiScores: AIAnalysisPayload["factorScores"], fallback: FactorScore[]): FactorScore[] {
  if (!aiScores || aiScores.length === 0) {
    return fallback;
  }

  const fallbackById = new Map(fallback.map((score) => [score.factorId, score]));

  for (const aiScore of aiScores) {
    const base = fallbackById.get(aiScore.factorId);
    if (!base) {
      continue;
    }

    fallbackById.set(aiScore.factorId, {
      ...base,
      score: aiScore.score,
      notes: aiScore.notes || base.notes,
      suggestions: aiScore.suggestions?.length ? aiScore.suggestions : base.suggestions,
    });
  }

  return Array.from(fallbackById.values());
}

function sanitizeInput(payload: Partial<AnalysisRequest>): AnalysisRequest {
  return {
    title: payload.title?.trim() ?? "",
    description: payload.description?.trim() ?? "",
    tags: payload.tags?.trim() ?? "",
    transcript: payload.transcript?.trim() ?? "",
    targetKeyword: payload.targetKeyword?.trim() ?? "",
  };
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<AnalysisRequest>;
    const input = sanitizeInput(body);

    if (!input.title || !input.description || !input.tags || !input.targetKeyword) {
      return NextResponse.json(
        {
          error: "title, description, tags, and targetKeyword are required.",
        },
        { status: 400 },
      );
    }

    const fallbackScores = buildHeuristicScores(input);
    let selectedScores = fallbackScores;
    let summary = "Heuristic SEO assessment completed. Connect Anthropic for model-generated insights.";
    let quickWins: string[] = [
      "Place your exact target keyword in the first 60 characters of the title.",
      "Expand the description with clear value statements and a CTA.",
      "Use a balanced tag set with broad and long-tail terms.",
    ];
    let modelUsed = "heuristic-local";

    const anthropic = getAnthropicClient();

    if (anthropic) {
      const prompts = buildAnalysisPrompt(input);
      try {
        const response = await anthropic.messages.create({
          model: "claude-3-5-sonnet-latest",
          max_tokens: 1000,
          system: prompts.systemPrompt,
          messages: [
            {
              role: "user",
              content: prompts.userPrompt,
            },
          ],
        });

        const rawText = response.content
          .map((entry) => (entry.type === "text" ? entry.text : ""))
          .join("\n")
          .trim();

        const modelPayload = parseModelPayload(rawText);

        if (modelPayload) {
          selectedScores = mergeScores(modelPayload.factorScores, fallbackScores);
          summary = modelPayload.summary ?? summary;
          quickWins = modelPayload.quickWins?.length ? modelPayload.quickWins : quickWins;
          modelUsed = response.model;
        }
      } catch (modelError) {
        console.error("Anthropic analysis failed, using fallback:", modelError);
      }
    }

    const scoring = calculateOverallScore(selectedScores);

    return NextResponse.json({
      overallScore: scoring.overallScore,
      grade: scoring.grade,
      summary,
      quickWins,
      factorScores: scoring.factorScores,
      modelUsed,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Analyze route failed:", error);
    return NextResponse.json(
      {
        error: "Unable to analyze this payload.",
      },
      { status: 500 },
    );
  }
}
