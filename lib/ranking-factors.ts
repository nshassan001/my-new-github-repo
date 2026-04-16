// Internal scoring data — NEVER expose factor names or weights to users

export const RANKING_FACTORS = {
  titleFactors: {
    keywordPosition: { weight: 15, description: "Keyword placement in first 3 words" },
    titleLength: { weight: 8, description: "Optimal 40-60 character title" },
    powerWords: { weight: 7, description: "Emotional trigger words usage" },
    brandTerms: { weight: 5, description: "Channel brand recognition terms" },
    clickbaitBalance: { weight: 5, description: "Curiosity without misleading" },
  },
  descriptionFactors: {
    keywordDensity: { weight: 10, description: "Target keyword density 1-2%" },
    firstLineHook: { weight: 8, description: "First 2 lines contain keyword" },
    lengthOptimality: { weight: 5, description: "Description 150-300 words" },
    callToAction: { weight: 4, description: "Clear CTA presence" },
    linksAndTimestamps: { weight: 3, description: "Timestamps and relevant links" },
  },
  tagFactors: {
    exactMatchTag: { weight: 12, description: "Exact keyword as first tag" },
    tagVariety: { weight: 8, description: "Mix of broad and specific tags" },
    tagCount: { weight: 5, description: "Optimal 15-20 tags" },
    longTailTags: { weight: 5, description: "Long-tail keyword variations" },
  },
  contentFactors: {
    transcriptKeywordFreq: { weight: 8, description: "Natural keyword usage in content" },
    topicDepth: { weight: 7, description: "Content covers topic thoroughly" },
    watchTimeSignals: { weight: 5, description: "Content structure for retention" },
  },
  channelFactors: {
    channelSize: { weight: 3, description: "Channel size authority boost" },
    nicheAlignment: { weight: 4, description: "Content matches channel niche" },
  },
  thumbnailFactors: {
    hasThumbnail: { weight: 2, description: "Custom thumbnail presence" },
  },
} as const;

export const GRADE_THRESHOLDS = {
  S: 90,
  A: 80,
  B: 65,
  C: 50,
  D: 35,
  F: 0,
} as const;

export const CHECKLIST_ITEMS = [
  { id: "title_keyword", label: "Keyword in title", description: "Your main keyword appears in the title", points: 5 },
  { id: "title_length", label: "Title 40-60 chars", description: "Title is the optimal length", points: 3 },
  { id: "title_power_word", label: "Power word in title", description: "Title has emotional trigger words", points: 2 },
  { id: "desc_keyword_first", label: "Keyword in first 25 words", description: "Keyword in first 25 words of description", points: 4 },
  { id: "desc_length", label: "Description 150+ words", description: "Description is detailed enough", points: 2 },
  { id: "desc_cta", label: "Call to action present", description: "Description has subscribe/like CTA", points: 2 },
  { id: "desc_timestamps", label: "Timestamps added", description: "Video chapters/timestamps present", points: 2 },
  { id: "desc_links", label: "Relevant links added", description: "Related links in description", points: 1 },
  { id: "tags_exact_match", label: "Exact keyword as first tag", description: "First tag is exact keyword match", points: 5 },
  { id: "tags_15_plus", label: "15+ tags added", description: "Comprehensive tag coverage", points: 3 },
  { id: "tags_multilingual", label: "Multi-language tags", description: "Tags in Bangla, Banglish, English", points: 3 },
  { id: "tags_long_tail", label: "Long-tail keyword tags", description: "Specific phrase tags included", points: 2 },
  { id: "thumbnail_custom", label: "Custom thumbnail", description: "Custom thumbnail uploaded", points: 3 },
  { id: "transcript_uploaded", label: "Transcript/subtitles", description: "Subtitles or auto-captions active", points: 2 },
  { id: "transcript_keyword", label: "Keyword in transcript", description: "Keyword appears naturally in speech", points: 3 },
  { id: "niche_alignment", label: "Niche-aligned content", description: "Content matches channel niche", points: 2 },
  { id: "video_type_match", label: "Video type matches intent", description: "Format matches viewer search intent", points: 2 },
  { id: "end_screen", label: "End screen added", description: "End screen with video/subscribe", points: 1 },
  { id: "cards_added", label: "Cards/info cards", description: "Info cards linking related content", points: 1 },
  { id: "playlist_added", label: "Added to playlist", description: "Video added to relevant playlist", points: 1 },
  { id: "pinned_comment", label: "Pinned comment ready", description: "Keyword-rich pinned comment planned", points: 2 },
  { id: "channel_keywords", label: "Channel keywords updated", description: "Channel about section has keywords", points: 1 },
  { id: "premiere_or_schedule", label: "Premiere/scheduled publish", description: "Published at optimal time or premiered", points: 1 },
];

export const POWER_WORDS = [
  "ultimate", "complete", "best", "top", "secret", "proven", "easy", "fast",
  "free", "new", "how to", "why", "what", "never", "always", "instantly",
  "amazing", "powerful", "simple", "step by step", "beginners", "advanced",
  "সহজ", "সেরা", "কিভাবে", "সম্পূর্ণ", "নতুন", "বিশেষ", "সেরা উপায়",
];

export const CATEGORY_WEIGHTS = {
  titleOptimization: 20,
  descriptionQuality: 20,
  tagStrategy: 20,
  transcriptRelevance: 15,
  thumbnailSEO: 10,
  engagementPotential: 10,
  channelAuthority: 5,
} as const;
