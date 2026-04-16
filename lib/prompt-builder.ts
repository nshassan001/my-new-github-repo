import { VideoInput } from "@/types";
import { RANKING_FACTORS, CATEGORY_WEIGHTS } from "./ranking-factors";

export function buildAnalysisPrompt(input: VideoInput): string {
  const factorContext = Object.entries(RANKING_FACTORS)
    .map(([group, factors]) => {
      const factorList = Object.entries(factors)
        .map(([, f]) => `  - ${f.description} (weight: ${f.weight})`)
        .join("\n");
      return `${group}:\n${factorList}`;
    })
    .join("\n\n");

  const categoryWeightsText = Object.entries(CATEGORY_WEIGHTS)
    .map(([cat, weight]) => `${cat}: ${weight}%`)
    .join(", ");

  return `You are an expert YouTube SEO analyst specializing in South Asian content, particularly Bangla-language and bilingual (Banglish) YouTube channels.

Analyze this YouTube video metadata and provide a comprehensive SEO score and optimization recommendations.

## VIDEO METADATA
- **Title**: ${input.title}
- **Target Keyword**: ${input.keyword}
- **Language**: ${input.language}
- **Niche**: ${input.niche}
- **Video Type**: ${input.videoType}
- **Channel Size**: ${input.channelSize}
- **Custom Thumbnail**: ${input.thumbnailStatus}

## DESCRIPTION
${input.description || "(no description provided)"}

## TRANSCRIPT EXCERPT
${input.transcript ? input.transcript.slice(0, 2000) : "(no transcript provided)"}

## EXISTING TAGS
${input.tags || "(no tags provided)"}

## TAG LANGUAGES REQUESTED
${Object.entries(input.tagLanguages)
  .filter(([, v]) => v)
  .map(([k]) => k)
  .join(", ")}

## SCORING FRAMEWORK (internal use only — do NOT mention these factor names to user)
${factorContext}

Category weights: ${categoryWeightsText}

---

## YOUR TASK

Provide a JSON response with this EXACT structure:

\`\`\`json
{
  "score": <number 0-100>,
  "grade": <"S"|"A"|"B"|"C"|"D"|"F">,
  "summary": "<2-3 sentence plain-language summary of overall SEO health>",
  "categoryScores": {
    "titleOptimization": <0-100>,
    "descriptionQuality": <0-100>,
    "tagStrategy": <0-100>,
    "transcriptRelevance": <0-100>,
    "thumbnailSEO": <0-100>,
    "engagementPotential": <0-100>,
    "channelAuthority": <0-100>
  },
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "issues": ["<issue 1>", "<issue 2>", "<issue 3>"],
  "fixSteps": ["<actionable fix step 1>", "<actionable fix step 2>", "<actionable fix step 3>", "<step 4>", "<step 5>"],
  "tags": [
    {
      "text": "<exact keyword match — always first>",
      "language": "english|bangla|banglish",
      "relevanceScore": <0-100>,
      "tier": <1|2|3|4|5>,
      "isExactMatch": true
    },
    // ... 34+ more tags
  ],
  "titleOptions": [
    "<optimized title option 1>",
    "<optimized title option 2>",
    "<optimized title option 3>"
  ],
  "optimizedDescription": "<full optimized description 200-350 words with keyword naturally integrated, timestamps placeholder, CTA, and relevant hashtags>",
  "pinnedComment": "<keyword-rich pinned comment 50-100 words to boost engagement>",
  "channelKeywords": ["<channel keyword 1>", "<keyword 2>", "<keyword 3>", "<keyword 4>", "<keyword 5>", "<keyword 6>", "<keyword 7>", "<keyword 8>", "<keyword 9>", "<keyword 10>"],
  "quickWins": ["<quick win 1>", "<quick win 2>", "<quick win 3>", "<quick win 4>", "<quick win 5>"]
}
\`\`\`

## CRITICAL RULES:
1. **NEVER** mention factor names, weights, or scoring internals in any user-facing text
2. First tag MUST be exact keyword match (isExactMatch: true, ★ marker implied)
3. Generate **at least 35 tags** covering:
   - Bangla (বাংলা) tags if requested
   - Banglish (romanized Bangla) tags if requested  
   - English tags if requested
   - Mix of: exact match, broad, narrow, question-based, trending variations
4. Tag tiers: T1=Very easy to rank, T2=Easy, T3=Moderate, T4=Hard, T5=Very hard
5. Tag relevanceScore should reflect how closely the tag matches the video's topic
6. All text in strengths/issues/fixSteps/summary must be plain language — no technical jargon
7. Title options should be meaningfully different from each other (different angles/hooks)
8. optimizedDescription must be copy-paste ready
9. Respond with ONLY the JSON — no explanation, no markdown outside the JSON block

IMPORTANT: Return ONLY valid JSON. No text before or after the JSON.`;
}
