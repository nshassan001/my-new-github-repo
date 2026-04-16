"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import toast from "react-hot-toast";
import { formatDate, CATEGORIES } from "@/lib/utils";
import RankingItemRow from "@/components/ranking/RankingItemRow";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import {
  ThumbsUp,
  MessageSquare,
  Share2,
  Sparkles,
  User,
  Send,
} from "lucide-react";

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: { id: string; name: string | null; image: string | null };
}

interface RankingItem {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  rank: number;
  score: number;
  aiReasoning: string | null;
  rankingListId: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  _count?: { votes: number };
}

interface RankingDetail {
  id: string;
  title: string;
  description: string | null;
  category: string;
  aiGenerated: boolean;
  slug: string;
  createdAt: string;
  author: { id: string; name: string | null; image: string | null };
  items: RankingItem[];
  tags: { id: string; name: string }[];
  comments: Comment[];
  _count: { votes: number; comments: number; items: number };
}

interface Props {
  ranking: RankingDetail;
}

export default function RankingDetailClient({ ranking }: Props) {
  const { data: session } = useSession();
  const [voteCount, setVoteCount] = useState(ranking._count.votes);
  const [hasVoted, setHasVoted] = useState(false);
  const [itemVotes, setItemVotes] = useState<Record<string, number>>({});
  const [comments, setComments] = useState<Comment[]>(ranking.comments);
  const [newComment, setNewComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  const category = CATEGORIES.find((c) => c.id === ranking.category);

  const handleListVote = async () => {
    if (!session) {
      toast.error("Sign in to vote");
      return;
    }
    try {
      const res = await axios.post(`/api/rankings/${ranking.slug}/vote`, {});
      if (res.data.voted) {
        setVoteCount((v) => v + 1);
        setHasVoted(true);
      } else {
        setVoteCount((v) => v - 1);
        setHasVoted(false);
      }
    } catch {
      toast.error("Failed to vote");
    }
  };

  const handleItemVote = async (itemId: string) => {
    if (!session) {
      toast.error("Sign in to vote");
      return;
    }
    try {
      const res = await axios.post(`/api/rankings/${ranking.slug}/vote`, {
        rankingItemId: itemId,
      });
      setItemVotes((prev) => ({
        ...prev,
        [itemId]: res.data.voted
          ? (prev[itemId] ?? 0) + 1
          : (prev[itemId] ?? 0) - 1,
      }));
    } catch {
      toast.error("Failed to vote");
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied!");
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      toast.error("Sign in to comment");
      return;
    }
    if (!newComment.trim()) return;

    setSubmittingComment(true);
    try {
      const res = await axios.post(
        `/api/rankings/${ranking.slug}/comments`,
        { content: newComment }
      );
      setComments([res.data, ...comments]);
      setNewComment("");
      toast.success("Comment added!");
    } catch {
      toast.error("Failed to add comment");
    } finally {
      setSubmittingComment(false);
    }
  };

  const itemsWithVotes = ranking.items.map((item) => ({
    ...item,
    createdAt: new Date(item.createdAt),
    updatedAt: new Date(item.updatedAt),
    _count: {
      votes:
        (item._count?.votes ?? 0) + (itemVotes[item.id] ?? 0),
    },
  }));

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {ranking.aiGenerated && (
            <Badge variant="ai">
              <Sparkles className="w-3 h-3" />
              AI Generated
            </Badge>
          )}
          {category && (
            <Badge variant="default">
              {category.icon} {category.name}
            </Badge>
          )}
          {ranking.tags.map((tag) => (
            <Badge key={tag.id} variant="info">
              #{tag.name}
            </Badge>
          ))}
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          {ranking.title}
        </h1>

        {ranking.description && (
          <p className="text-gray-600 text-lg leading-relaxed mb-4">
            {ranking.description}
          </p>
        )}

        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3 text-sm text-gray-500">
            {ranking.author.image ? (
              <img
                src={ranking.author.image}
                alt={ranking.author.name ?? ""}
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                <User className="w-4 h-4 text-indigo-600" />
              </div>
            )}
            <span>
              <strong className="text-gray-700">
                {ranking.author.name ?? "Anonymous"}
              </strong>{" "}
              · {formatDate(ranking.createdAt)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleListVote}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                hasVoted
                  ? "bg-indigo-100 text-indigo-700"
                  : "bg-gray-100 text-gray-600 hover:bg-indigo-50 hover:text-indigo-700"
              }`}
            >
              <ThumbsUp
                className={`w-4 h-4 ${hasVoted ? "fill-indigo-600" : ""}`}
              />
              {voteCount}
            </button>
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 text-sm font-medium transition-colors"
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </div>
        </div>
      </div>

      {/* Ranking items */}
      <div className="space-y-3 mb-10">
        {itemsWithVotes.map((item) => (
          <RankingItemRow
            key={item.id}
            item={item}
            onVote={handleItemVote}
          />
        ))}
      </div>

      {/* Comments */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-gray-400" />
          Discussion ({comments.length})
        </h2>

        {/* Comment form */}
        <form onSubmit={handleComment} className="mb-6">
          <div className="flex gap-3">
            <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
              {session?.user?.image ? (
                <img
                  src={session.user.image}
                  alt=""
                  className="w-9 h-9 rounded-full"
                />
              ) : (
                <User className="w-4 h-4 text-indigo-600" />
              )}
            </div>
            <div className="flex-1 flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={
                  session ? "Add your thoughts..." : "Sign in to comment"
                }
                disabled={!session}
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50"
              />
              <Button
                type="submit"
                size="sm"
                loading={submittingComment}
                disabled={!session || !newComment.trim()}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </form>

        {/* Comment list */}
        {comments.length > 0 ? (
          <div className="space-y-4">
            {comments.map((comment) => (
              <Card key={comment.id}>
                <CardContent className="py-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                      {comment.user.image ? (
                        <img
                          src={comment.user.image}
                          alt=""
                          className="w-8 h-8 rounded-full"
                        />
                      ) : (
                        <User className="w-3.5 h-3.5 text-gray-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-gray-900">
                          {comment.user.name ?? "Anonymous"}
                        </span>
                        <span className="text-xs text-gray-400">
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400 text-sm py-8">
            No comments yet. Be the first to share your thoughts!
          </p>
        )}
      </div>
    </div>
  );
}
