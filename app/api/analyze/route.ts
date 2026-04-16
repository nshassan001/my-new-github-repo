import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { analyzeVideo } from "@/lib/anthropic";
import { VideoInput } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const input: VideoInput = body;

    // Validate required fields
    if (!input.title || !input.keyword) {
      return NextResponse.json(
        { error: "Title and keyword are required" },
        { status: 400 }
      );
    }

    const id = crypto.randomUUID();

    // Run AI analysis
    const result = await analyzeVideo(input, id);

    // Persist to database
    await prisma.analysis.create({
      data: {
        id: result.id,
        score: result.score,
        grade: result.grade,
        summary: result.summary,
        categoryScores: result.categoryScores as object,
        strengths: result.strengths as string[],
        issues: result.issues as string[],
        fixSteps: result.fixSteps as string[],
        tags: result.tags as object[],
        titleOptions: result.titleOptions as string[],
        optimizedDescription: result.optimizedDescription,
        pinnedComment: result.pinnedComment,
        channelKeywords: result.channelKeywords as string[],
        quickWins: result.quickWins as string[],
        input: result.input as object,
      },
    });

    return NextResponse.json({ id: result.id, result });
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to analyze video. Please try again.",
      },
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
    const analysis = await prisma.analysis.findUnique({ where: { id } });
    if (!analysis) {
      return NextResponse.json({ error: "Analysis not found" }, { status: 404 });
    }
    return NextResponse.json(analysis);
  } catch (error) {
    console.error("Fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch analysis" }, { status: 500 });
  }
}
