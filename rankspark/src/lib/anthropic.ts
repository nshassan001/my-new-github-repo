import Anthropic from "@anthropic-ai/sdk";

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface GeneratedRanking {
  title: string;
  description: string;
  items: {
    rank: number;
    title: string;
    description: string;
    aiReasoning: string;
  }[];
}

export async function generateRanking(
  topic: string,
  count: number = 10,
  category: string = "general"
): Promise<GeneratedRanking> {
  const message = await anthropic.messages.create({
    model: "claude-opus-4-5",
    max_tokens: 2048,
    messages: [
      {
        role: "user",
        content: `Create a definitive ranking of the top ${count} ${topic} in the "${category}" category.

Return your response as valid JSON with this exact structure:
{
  "title": "Top ${count} ${topic}",
  "description": "A comprehensive AI-generated ranking of ${topic}",
  "items": [
    {
      "rank": 1,
      "title": "Item name",
      "description": "Brief description (1-2 sentences)",
      "aiReasoning": "Why this ranks here (2-3 sentences)"
    }
  ]
}

Be authoritative, insightful, and consider multiple factors. Return only valid JSON, no markdown.`,
      },
    ],
  });

  const content = message.content[0];
  if (content.type !== "text") {
    throw new Error("Unexpected response type from Claude");
  }

  const parsed = JSON.parse(content.text) as GeneratedRanking;
  return parsed;
}

export async function improveRankingItem(
  listTitle: string,
  itemTitle: string,
  currentRank: number
): Promise<string> {
  const message = await anthropic.messages.create({
    model: "claude-opus-4-5",
    max_tokens: 512,
    messages: [
      {
        role: "user",
        content: `In the context of the ranking "${listTitle}", explain in 2-3 sentences why "${itemTitle}" deserves rank #${currentRank}. Be specific and insightful. Return only the explanation text, no JSON or markdown.`,
      },
    ],
  });

  const content = message.content[0];
  if (content.type !== "text") {
    throw new Error("Unexpected response type from Claude");
  }

  return content.text;
}
