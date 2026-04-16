"use client";

import { useState } from "react";
import { clsx } from "clsx";
import toast from "react-hot-toast";

interface CopyBoxProps {
  content: string;
  label?: string;
  className?: string;
  rows?: number;
}

export function CopyBox({ content, label, className, rows = 5 }: CopyBoxProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  return (
    <div className={clsx("relative group", className)}>
      {label && (
        <div className="flex items-center justify-between mb-2">
          <span className="label">{label}</span>
          <button
            onClick={handleCopy}
            className={clsx(
              "text-xs font-medium px-3 py-1 rounded-md transition-all duration-200 flex items-center gap-1.5",
              copied
                ? "bg-green-500/20 text-green-400 border border-green-500/30"
                : "bg-white/5 text-white/50 hover:text-white hover:bg-white/10 border border-white/10"
            )}
          >
            {copied ? (
              <>
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2}>
                  <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2}>
                  <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                  <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" strokeLinecap="round" />
                </svg>
                Copy
              </>
            )}
          </button>
        </div>
      )}
      <div className="relative">
        <textarea
          readOnly
          value={content}
          rows={rows}
          className="input-field resize-none font-mono text-sm scrollbar-thin"
        />
        {!label && (
          <button
            onClick={handleCopy}
            className={clsx(
              "absolute top-2 right-2 text-xs font-medium px-3 py-1 rounded-md transition-all duration-200 flex items-center gap-1.5",
              copied
                ? "bg-green-500/20 text-green-400 border border-green-500/30"
                : "bg-black/40 text-white/50 hover:text-white hover:bg-black/60 border border-white/10 opacity-0 group-hover:opacity-100"
            )}
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        )}
      </div>
    </div>
  );
}
