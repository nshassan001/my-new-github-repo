import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateUniqueSlug } from "@/lib/utils";
import { z } from "zod";

const createRankingSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().max(1000).optional(),
  category: z.string(),
  isPublic: z.boolean().default(true),
  items: z.array(
    z.object({
      title: z.string().min(1).max(200),
      description: z.string().max(500).optional(),
      imageUrl: z.string().url().optional(),
      rank: z.number().int().positive(),
      aiReasoning: z.string().optional(),
    })
  ).min(2).max(50),
  tags: z.array(z.string()).optional(),
  aiGenerated: z.boolean().default(false),
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = parseInt(searchParams.get("limit") ?? "12");
  const category = searchParams.get("category");
  const search = searchParams.get("search");
  const sort = searchParams.get("sort") ?? "recent";

  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {
    isPublic: true,
  };

  if (category) {
    where.category = category;
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  const orderBy: Record<string, unknown> =
    sort === "votes"
      ? { votes: { _count: "desc" } }
      : sort === "comments"
      ? { comments: { _count: "desc" } }
      : { createdAt: "desc" };

  const [rankings, total] = await Promise.all([
    prisma.rankingList.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      include: {
        author: { select: { id: true, name: true, image: true } },
        items: { orderBy: { rank: "asc" } },
        tags: true,
        _count: { select: { votes: true, comments: true, items: true } },
      },
    }),
    prisma.rankingList.count({ where }),
  ]);

  return NextResponse.json({
    rankings,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = createRankingSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.issues },
      { status: 400 }
    );
  }

  const { title, description, category, isPublic, items, tags, aiGenerated } =
    parsed.data;

  const slug = generateUniqueSlug(title);

  const ranking = await prisma.rankingList.create({
    data: {
      title,
      description,
      category,
      isPublic,
      aiGenerated,
      slug,
      authorId: session.user.id,
      items: {
        create: items.map((item) => ({
          title: item.title,
          description: item.description,
          imageUrl: item.imageUrl,
          rank: item.rank,
          aiReasoning: item.aiReasoning,
        })),
      },
      tags: tags
        ? {
            connectOrCreate: tags.map((tag) => ({
              where: { name: tag.toLowerCase() },
              create: { name: tag.toLowerCase() },
            })),
          }
        : undefined,
    },
    include: {
      author: { select: { id: true, name: true, image: true } },
      items: { orderBy: { rank: "asc" } },
      tags: true,
      _count: { select: { votes: true, comments: true } },
    },
  });

  return NextResponse.json(ranking, { status: 201 });
}
