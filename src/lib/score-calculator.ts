import { VideoInput, LiveScore } from "@/types";
import { CHECKLIST_ITEMS, GRADE_THRESHOLDS, POWER_WORDS } from "./ranking-factors";

function getGrade(score: number): LiveScore["grade"] {
  if (score >= GRADE_THRESHOLDS.S) return "S";
  if (score >= GRADE_THRESHOLDS.A) return "A";
  if (score >= GRADE_THRESHOLDS.B) return "B";
  if (score >= GRADE_THRESHOLDS.C) return "C";
  if (score >= GRADE_THRESHOLDS.D) return "D";
  return "F";
}

function clamp(value: number, min = 0, max = 100): number {
  return Math.min(max, Math.max(min, value));
}

export function calculateLiveScore(input: Partial<VideoInput>): LiveScore {
  const breakdown: LiveScore["breakdown"] = [];
  let totalScore = 0;

  // Title scoring (max 25 points)
  let titleScore = 0;
  const title = input.title || "";
  const keyword = (input.keyword || "").toLowerCase();

  if (title.length > 0) {
    // Keyword in title
    if (keyword && title.toLowerCase().includes(keyword)) {
      titleScore += 10;
      // Keyword in first 3 words
      const firstWords = title.toLowerCase().split(" ").slice(0, 3).join(" ");
      if (firstWords.includes(keyword)) titleScore += 5;
    }
    // Title length
    if (title.length >= 40 && title.length <= 60) titleScore += 5;
    else if (title.length >= 30 && title.length < 40) titleScore += 3;
    else if (title.length > 60 && title.length <= 70) titleScore += 3;
    // Power words
    const hasPowerWord = POWER_WORDS.some((w) =>
      title.toLowerCase().includes(w.toLowerCase())
    );
    if (hasPowerWord) titleScore += 5;
  }
  titleScore = clamp(titleScore, 0, 25);
  breakdown.push({ label: "Title", value: titleScore, max: 25 });
  totalScore += titleScore;

  // Description scoring (max 20 points)
  let descScore = 0;
  const desc = input.description || "";
  if (desc.length > 0) {
    if (keyword && desc.toLowerCase().includes(keyword)) {
      descScore += 6;
      const firstWords = desc.toLowerCase().split(" ").slice(0, 25).join(" ");
      if (firstWords.includes(keyword)) descScore += 4;
    }
    const wordCount = desc.trim().split(/\s+/).length;
    if (wordCount >= 150) descScore += 5;
    else if (wordCount >= 75) descScore += 3;
    const hasCTA = /subscribe|like|comment|share|follow|সাবস্ক্রাইব|লাইক/i.test(desc);
    if (hasCTA) descScore += 3;
    const hasTimestamps = /\d+:\d+/g.test(desc);
    if (hasTimestamps) descScore += 2;
  }
  descScore = clamp(descScore, 0, 20);
  breakdown.push({ label: "Description", value: descScore, max: 20 });
  totalScore += descScore;

  // Tags scoring (max 20 points)
  let tagScore = 0;
  const tagsRaw = input.tags || "";
  const tagList = tagsRaw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  if (tagList.length > 0) {
    if (keyword && tagList[0].toLowerCase() === keyword.toLowerCase()) {
      tagScore += 8;
    } else if (keyword && tagList.some((t) => t.toLowerCase() === keyword.toLowerCase())) {
      tagScore += 5;
    }
    if (tagList.length >= 15) tagScore += 6;
    else if (tagList.length >= 10) tagScore += 4;
    else if (tagList.length >= 5) tagScore += 2;

    const hasLongTail = tagList.some((t) => t.split(" ").length >= 3);
    if (hasLongTail) tagScore += 3;

    const langs = input.tagLanguages;
    if (langs) {
      const langCount = [langs.bangla, langs.banglish, langs.english].filter(Boolean).length;
      if (langCount >= 3) tagScore += 3;
      else if (langCount >= 2) tagScore += 2;
    }
  }
  tagScore = clamp(tagScore, 0, 20);
  breakdown.push({ label: "Tags", value: tagScore, max: 20 });
  totalScore += tagScore;

  // Transcript scoring (max 15 points)
  let transcriptScore = 0;
  const transcript = input.transcript || "";
  if (transcript.length > 0) {
    if (keyword && transcript.toLowerCase().includes(keyword)) {
      transcriptScore += 8;
      const keywordCount = (transcript.toLowerCase().match(new RegExp(keyword, "g")) || []).length;
      const wordCount = transcript.split(/\s+/).length;
      const density = (keywordCount / wordCount) * 100;
      if (density >= 1 && density <= 3) transcriptScore += 4;
      else if (density > 0) transcriptScore += 2;
    }
    if (transcript.split(/\s+/).length >= 200) transcriptScore += 3;
  }
  transcriptScore = clamp(transcriptScore, 0, 15);
  breakdown.push({ label: "Transcript", value: transcriptScore, max: 15 });
  totalScore += transcriptScore;

  // Checklist scoring (max 20 points)
  let checklistScore = 0;
  const checklist = input.checklist || {};
  const totalChecklistPoints = CHECKLIST_ITEMS.reduce((sum, item) => sum + item.points, 0);
  const earnedPoints = CHECKLIST_ITEMS.filter((item) => checklist[item.id]).reduce(
    (sum, item) => sum + item.points,
    0
  );
  checklistScore = Math.round((earnedPoints / totalChecklistPoints) * 20);
  breakdown.push({ label: "Checklist", value: checklistScore, max: 20 });
  totalScore += checklistScore;

  const finalScore = clamp(Math.round(totalScore));

  return {
    score: finalScore,
    grade: getGrade(finalScore),
    breakdown,
  };
}
