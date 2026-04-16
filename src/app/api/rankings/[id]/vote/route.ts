import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const { rankingItemId } = body;

  const ranking = await prisma.rankingList.findFirst({
    where: { OR: [{ id }, { slug: id }] },
  });

  if (!ranking) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const existing = await prisma.vote.findFirst({
    where: {
      userId: session.user.id,
      rankingListId: ranking.id,
      rankingItemId: rankingItemId ?? null,
    },
  });

  if (existing) {
    await prisma.vote.delete({ where: { id: existing.id } });
    return NextResponse.json({ voted: false });
  }

  await prisma.vote.create({
    data: {
      userId: session.user.id,
      rankingListId: ranking.id,
      rankingItemId: rankingItemId ?? null,
    },
  });

  return NextResponse.json({ voted: true });
}
