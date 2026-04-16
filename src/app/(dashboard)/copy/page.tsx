"use client";

import { useRouter } from "next/navigation";
import { useAnalyzerStore } from "@/store/analyzerStore";
import { useEffect } from "react";
import Link from "next/link";

export default function CopyIndexPage() {
  const router = useRouter();
  const { resultId } = useAnalyzerStore();

  useEffect(() => {
    if (resultId) router.push(`/copy/${resultId}`);
  }, [resultId, router]);

  return (
    <div className="flex items-center justify-center h-full min-h-[60vh]">
      <div className="text-center space-y-4">
        <div className="text-5xl">✍️</div>
        <h2 className="text-xl font-bold">No content yet</h2>
        <p className="text-white/40">Run an analysis to get copy-ready content</p>
        <Link href="/analyze" className="btn-primary inline-block">
          Analyze a Video
        </Link>
      </div>
    </div>
  );
}
