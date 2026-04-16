"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { CATEGORIES } from "@/lib/utils";
import Button from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import {
  Sparkles,
  Plus,
  Trash2,
  GripVertical,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

interface RankingItemForm {
  id: string;
  title: string;
  description: string;
  rank: number;
}

function CreatePageContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isAI = searchParams.get("ai") === "true";

  const [mode, setMode] = useState<"manual" | "ai">(isAI ? "ai" : "manual");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("general");
  const [isPublic, setIsPublic] = useState(true);
  const [tags, setTags] = useState("");
  const [items, setItems] = useState<RankingItemForm[]>([
    { id: "1", title: "", description: "", rank: 1 },
    { id: "2", title: "", description: "", rank: 2 },
    { id: "3", title: "", description: "", rank: 3 },
  ]);

  // AI state
  const [aiTopic, setAiTopic] = useState("");
  const [aiCount, setAiCount] = useState(10);
  const [generating, setGenerating] = useState(false);
  const [aiGenerated, setAiGenerated] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin?callbackUrl=/create");
    }
  }, [status, router]);

  const handleGenerateAI = async () => {
    if (!aiTopic.trim()) {
      toast.error("Enter a topic first");
      return;
    }
    setGenerating(true);
    try {
      const res = await axios.post("/api/generate", {
        topic: aiTopic,
        count: aiCount,
        category,
      });
      const generated = res.data;
      setTitle(generated.title);
      setDescription(generated.description);
      setItems(
        generated.items.map(
          (item: { rank: number; title: string; description: string; aiReasoning: string }, i: number) => ({
            id: String(i + 1),
            title: item.title,
            description: item.description,
            rank: item.rank,
            aiReasoning: item.aiReasoning,
          })
        )
      );
      setAiGenerated(true);
      toast.success("AI ranking generated!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate ranking. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  const addItem = () => {
    const maxRank = Math.max(...items.map((i) => i.rank), 0);
    setItems([
      ...items,
      { id: Date.now().toString(), title: "", description: "", rank: maxRank + 1 },
    ]);
  };

  const removeItem = (id: string) => {
    if (items.length <= 2) {
      toast.error("Minimum 2 items required");
      return;
    }
    const filtered = items.filter((item) => item.id !== id);
    setItems(filtered.map((item, i) => ({ ...item, rank: i + 1 })));
  };

  const updateItem = (id: string, field: keyof RankingItemForm, value: string | number) => {
    setItems(items.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }
    const validItems = items.filter((item) => item.title.trim());
    if (validItems.length < 2) {
      toast.error("At least 2 items with titles required");
      return;
    }

    setSubmitting(true);
    try {
      const res = await axios.post("/api/rankings", {
        title: title.trim(),
        description: description.trim() || undefined,
        category,
        isPublic,
        aiGenerated,
        items: validItems.map((item) => ({
          title: item.title.trim(),
          description: item.description.trim() || undefined,
          rank: item.rank,
        })),
        tags: tags
          ? tags
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
          : [],
      });
      toast.success("Ranking created!");
      router.push(`/rankings/${res.data.slug}`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to create ranking");
    } finally {
      setSubmitting(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6">
        <Link
          href="/"
          className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Create Ranking</h1>
        <p className="text-gray-500 mt-1">Build your list manually or let AI do it</p>
      </div>

      {/* Mode toggle */}
      <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
        <button
          onClick={() => setMode("manual")}
          className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
            mode === "manual"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Manual
        </button>
        <button
          onClick={() => setMode("ai")}
          className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-1.5 ${
            mode === "ai"
              ? "bg-white text-indigo-700 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <Sparkles className="w-4 h-4" />
          AI Generated
        </button>
      </div>

      {/* AI Section */}
      {mode === "ai" && (
        <Card className="mb-6 border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50">
          <CardHeader>
            <h2 className="font-semibold text-indigo-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Generate with Claude AI
            </h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Topic
                </label>
                <input
                  type="text"
                  value={aiTopic}
                  onChange={(e) => setAiTopic(e.target.value)}
                  placeholder="e.g. programming languages, sci-fi movies, pizza toppings..."
                  className="w-full px-4 py-2.5 border border-indigo-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Number of items
                  </label>
                  <select
                    value={aiCount}
                    onChange={(e) => setAiCount(Number(e.target.value))}
                    className="w-full px-3 py-2.5 border border-indigo-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  >
                    <option value={5}>Top 5</option>
                    <option value={10}>Top 10</option>
                    <option value={15}>Top 15</option>
                    <option value={20}>Top 20</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2.5 border border-indigo-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.icon} {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <Button
                onClick={handleGenerateAI}
                loading={generating}
                className="w-full"
                variant="primary"
              >
                <Sparkles className="w-4 h-4" />
                {generating ? "Generating..." : "Generate Ranking"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic info */}
        <Card>
          <CardHeader>
            <h2 className="font-semibold text-gray-900">Details</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Top 10 Best Programming Languages in 2025"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of this ranking..."
                rows={3}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {mode === "manual" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.icon} {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="tech, web, backend"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isPublic"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="isPublic" className="text-sm text-gray-700">
                Make this ranking public
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Items */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">
                Ranking Items ({items.filter((i) => i.title.trim()).length})
              </h2>
              <Button type="button" variant="ghost" size="sm" onClick={addItem}>
                <Plus className="w-4 h-4" />
                Add Item
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {items.map((item, idx) => (
              <div
                key={item.id}
                className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-2 shrink-0 pt-2.5">
                  <GripVertical className="w-4 h-4 text-gray-300" />
                  <span className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                </div>
                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => updateItem(item.id, "title", e.target.value)}
                    placeholder={`Item #${idx + 1} title`}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  />
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) =>
                      updateItem(item.id, "description", e.target.value)
                    }
                    placeholder="Brief description (optional)"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors shrink-0 mt-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Button type="submit" loading={submitting} className="w-full" size="lg">
          {submitting ? "Publishing..." : "Publish Ranking"}
        </Button>
      </form>
    </div>
  );
}

export default function CreatePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full" /></div>}>
      <CreatePageContent />
    </Suspense>
  );
}
