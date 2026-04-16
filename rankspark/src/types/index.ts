export interface RankingListWithDetails {
  id: string;
  title: string;
  description: string | null;
  category: string;
  isPublic: boolean;
  aiGenerated: boolean;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
  author: {
    id: string;
    name: string | null;
    image: string | null;
  };
  items: RankingItemWithVotes[];
  votes: { id: string }[];
  comments: { id: string }[];
  tags: { id: string; name: string }[];
  _count?: {
    votes: number;
    comments: number;
    items: number;
  };
}

export interface RankingItemWithVotes {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  rank: number;
  score: number;
  aiReasoning: string | null;
  rankingListId: string;
  createdAt: Date;
  updatedAt: Date;
  votes?: { id: string }[];
  _count?: {
    votes: number;
  };
}

export interface CreateRankingInput {
  title: string;
  description?: string;
  category: string;
  isPublic?: boolean;
  items: {
    title: string;
    description?: string;
    imageUrl?: string;
    rank: number;
  }[];
  tags?: string[];
}

export interface AIGenerateInput {
  topic: string;
  count?: number;
  category?: string;
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}
