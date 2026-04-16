import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { analyzeVideo } from "@/lib/anthropic";
import { VideoInput } from "@/types";

const s = JSON.stringify;
const p = (v: string) => { try { return JSON.parse(v); } catch { return v; } };

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const input: VideoInput = body;

    if (!input.title || !input.keyword) {
      return NextResponse.json(
        { error: "Title and keyword are required" },
        { status: 400 }
      );
    }

    const id = crypto.randomUUID();
    const result = await analyzeVideo(input, id);

    await prisma.analysis.create({
      data: {
        id: result.id,
        score: result.score,
        grade: result.grade,
        summary: result.summary,
        categoryScores: s(result.categoryScores),
        strengths: s(result.strengths),
        issues: s(result.issues),
        fixSteps: s(result.fixSteps),
        tags: s(result.tags),
        titleOptions: s(result.titleOptions),
        optimizedDescription: result.optimizedDescription,
        pinnedComment: result.pinnedComment,
        channelKeywords: s(result.channelKeywords),
        quickWins: s(result.quickWins),
        input: s(result.input),
      },
    });

    return NextResponse.json({ id: result.id, result });
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to analyze video." },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID required" }, { status: 400 });
  }

  try {
    const row = await prisma.analysis.findUnique({ where: { id } });
    if (!row) {
      return NextResponse.json({ error: "Analysis not found" }, { status: 404 });
    }

    // Parse JSON strings back to objects for the response
    const analysis = {
      ...row,
      categoryScores: p(row.categoryScores),
      strengths: p(row.strengths),
      issues: p(row.issues),
      fixSteps: p(row.fixSteps),
      tags: p(row.tags),
      titleOptions: p(row.titleOptions),
      channelKeywords: p(row.channelKeywords),
      quickWins: p(row.quickWins),
      input: p(row.input),
    };

    return NextResponse.json(analysis);
  } catch (error) {
    console.error("Fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch analysis" }, { status: 500 });
  }
}
