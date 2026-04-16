import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .substring(0, 60);
}

export function generateUniqueSlug(title: string): string {
  const base = slugify(title);
  const suffix = Math.random().toString(36).substring(2, 7);
  return `${base}-${suffix}`;
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

export const CATEGORIES = [
  { id: "technology", name: "Technology", icon: "💻" },
  { id: "entertainment", name: "Entertainment", icon: "🎬" },
  { id: "sports", name: "Sports", icon: "⚽" },
  { id: "food", name: "Food & Drink", icon: "🍔" },
  { id: "travel", name: "Travel", icon: "✈️" },
  { id: "music", name: "Music", icon: "🎵" },
  { id: "science", name: "Science", icon: "🔬" },
  { id: "business", name: "Business", icon: "💼" },
  { id: "general", name: "General", icon: "📋" },
  { id: "gaming", name: "Gaming", icon: "🎮" },
];
