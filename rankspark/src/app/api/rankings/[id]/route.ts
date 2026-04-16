import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const ranking = await prisma.rankingList.findFirst({
    where: {
      OR: [{ id }, { slug: id }],
      isPublic: true,
    },
    include: {
      author: { select: { id: true, name: true, image: true } },
      items: { orderBy: { rank: "asc" } },
      tags: true,
      comments: {
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { id: true, name: true, image: true } },
        },
        take: 20,
      },
      _count: { select: { votes: true, comments: true, items: true } },
    },
  });

  if (!ranking) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(ranking);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const ranking = await prisma.rankingList.findFirst({
    where: { OR: [{ id }, { slug: id }] },
  });

  if (!ranking) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (ranking.authorId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.rankingList.delete({ where: { id: ranking.id } });

  return NextResponse.json({ success: true });
}
