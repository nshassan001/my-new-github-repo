import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import RankingDetailClient from "./RankingDetailClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  try {
    const ranking = await prisma.rankingList.findFirst({
      where: { OR: [{ slug }, { id: slug }], isPublic: true },
    });
    if (!ranking) return { title: "Ranking Not Found" };
    return {
      title: `${ranking.title} — RankSpark`,
      description: ranking.description ?? `A ranking of ${ranking.title}`,
    };
  } catch {
    return { title: "Ranking Not Found" };
  }
}

export default async function RankingDetailPage({ params }: Props) {
  const { slug } = await params;

  let ranking;
  try {
    ranking = await prisma.rankingList.findFirst({
      where: { OR: [{ slug }, { id: slug }], isPublic: true },
      include: {
        author: { select: { id: true, name: true, image: true } },
        items: { orderBy: { rank: "asc" } },
        tags: true,
        comments: {
          orderBy: { createdAt: "desc" },
          include: {
            user: { select: { id: true, name: true, image: true } },
          },
          take: 50,
        },
        _count: { select: { votes: true, comments: true, items: true } },
      },
    });
  } catch {
    notFound();
  }

  if (!ranking) notFound();

  return <RankingDetailClient ranking={JSON.parse(JSON.stringify(ranking))} />;
}
