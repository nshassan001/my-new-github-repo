"use client";

import { useEffect, useRef } from "react";
import { clsx } from "clsx";

interface ScoreRingProps {
  score: number;
  grade: string;
  size?: number;
  strokeWidth?: number;
  animate?: boolean;
  className?: string;
}

function getGradeColor(grade: string): string {
  switch (grade) {
    case "S": return "#FACC15";
    case "A": return "#4ADE80";
    case "B": return "#60A5FA";
    case "C": return "#FB923C";
    case "D": return "#F87171";
    case "F": return "#DC2626";
    default: return "#D85A30";
  }
}

function getGradeClass(grade: string): string {
  switch (grade) {
    case "S": return "text-yellow-400";
    case "A": return "text-green-400";
    case "B": return "text-blue-400";
    case "C": return "text-orange-400";
    case "D": return "text-red-400";
    case "F": return "text-red-600";
    default: return "text-brand";
  }
}

export function ScoreRing({
  score,
  grade,
  size = 200,
  strokeWidth = 14,
  animate = true,
  className,
}: ScoreRingProps) {
  const circleRef = useRef<SVGCircleElement>(null);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = getGradeColor(grade);

  useEffect(() => {
    const circle = circleRef.current;
    if (!circle || !animate) return;

    circle.style.strokeDashoffset = String(circumference);
    circle.style.transition = "none";

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        circle.style.transition = "stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)";
        circle.style.strokeDashoffset = String(offset);
      });
    });
  }, [score, offset, circumference, animate]);

  const center = size / 2;

  return (
    <div className={clsx("relative inline-flex items-center justify-center", className)}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Background track */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={strokeWidth}
        />
        {/* Score arc */}
        <circle
          ref={circleRef}
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={animate ? circumference : offset}
          style={
            !animate
              ? { strokeDashoffset: offset }
              : undefined
          }
        />
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-5xl font-black tabular-nums leading-none">{score}</span>
        <span className={clsx("text-3xl font-black mt-1", getGradeClass(grade))}>
          {grade}
        </span>
        <span className="text-white/40 text-xs mt-1 tracking-widest uppercase">Score</span>
      </div>
    </div>
  );
}
