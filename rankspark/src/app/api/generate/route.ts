import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { generateRanking } from "@/lib/anthropic";
import { z } from "zod";

const generateSchema = z.object({
  topic: z.string().min(3).max(200),
  count: z.number().int().min(3).max(20).default(10),
  category: z.string().default("general"),
});

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = generateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.issues },
      { status: 400 }
    );
  }

  const { topic, count, category } = parsed.data;

  const generated = await generateRanking(topic, count, category);
  return NextResponse.json(generated);
}
