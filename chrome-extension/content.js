/**
 * RankSpark — YouTube SEO
 * Content script injected into YouTube Studio
 */

const RANKSPARK_ID = 'rankspark-sidebar';
const TOGGLE_ID = 'rankspark-toggle';
const DEBOUNCE_MS = 800;

const TITLE_SELECTORS = [
  '#title-textarea textarea',
  '[id*="title"] textarea',
  'textarea[aria-label*="title"]',
  'textarea[aria-label*="Title"]',
];

let sidebar = null;
let toggleBtn = null;
let debounceTimer = null;
let lastAnalyzedTitle = '';
let apiUrl = 'http://localhost:3000';
let tagLanguages = { bangla: true, banglish: true, english: true };
let isSidebarVisible = true;
let currentScore = null;

// ─── Bootstrap ───────────────────────────────────────────────────────────────

async function init() {
  const stored = await chrome.storage.sync.get(['apiUrl', 'tagLanguages', 'sidebarVisible']);
  if (stored.apiUrl) apiUrl = stored.apiUrl;
  if (stored.tagLanguages) tagLanguages = stored.tagLanguages;
  if (typeof stored.sidebarVisible === 'boolean') isSidebarVisible = stored.sidebarVisible;

  injectSidebar();
  observeTitleField();
  listenForMessages();
}

// ─── Sidebar Injection ────────────────────────────────────────────────────────

function injectSidebar() {
  if (document.getElementById(RANKSPARK_ID)) return;

  sidebar = document.createElement('div');
  sidebar.id = RANKSPARK_ID;
  sidebar.className = isSidebarVisible ? '' : 'rs-hidden';
  sidebar.innerHTML = buildSidebarHTML();
  document.body.appendChild(sidebar);

  toggleBtn = document.createElement('button');
  toggleBtn.id = TOGGLE_ID;
  toggleBtn.className = 'rs-toggle-btn';
  toggleBtn.setAttribute('aria-label', 'Toggle RankSpark sidebar');
  toggleBtn.innerHTML = isSidebarVisible ? '&#10094;' : '&#10095;';
  toggleBtn.addEventListener('click', toggleSidebar);
  document.body.appendChild(toggleBtn);

  updateToggleBtnPosition();
}

function buildSidebarHTML() {
  return `
    <div class="rs-header">
      <div class="rs-logo">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
            fill="#D85A30" stroke="#D85A30" stroke-width="1.5" stroke-linejoin="round"/>
        </svg>
        <span class="rs-logo-text">RankSpark</span>
      </div>
      <span class="rs-badge">SEO</span>
    </div>

    <div class="rs-scroll-area" id="rs-content">
      <div class="rs-idle-state" id="rs-idle">
        <div class="rs-idle-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="#D85A30" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="#D85A30" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <p class="rs-idle-text">Start typing your video title to see live SEO analysis.</p>
      </div>

      <div class="rs-analyzing" id="rs-analyzing" style="display:none">
        <div class="rs-spinner"></div>
        <p>Analyzing title…</p>
      </div>

      <div class="rs-results" id="rs-results" style="display:none">

        <!-- Score Ring -->
        <div class="rs-score-section">
          <div class="rs-score-ring" id="rs-score-ring">
            <svg class="rs-ring-svg" viewBox="0 0 120 120">
              <circle class="rs-ring-bg" cx="60" cy="60" r="50"/>
              <circle class="rs-ring-fill" id="rs-ring-arc" cx="60" cy="60" r="50"
                stroke-dasharray="314" stroke-dashoffset="314"/>
            </svg>
            <div class="rs-score-inner">
              <span class="rs-score-num" id="rs-score-num">0</span>
              <span class="rs-score-label">/ 100</span>
            </div>
          </div>
          <div class="rs-grade-badge" id="rs-grade-badge">F</div>
        </div>

        <!-- Demonetization Risk -->
        <div class="rs-demonetize" id="rs-demonetize">
          <span class="rs-demonetize-dot" id="rs-demonetize-dot"></span>
          <span class="rs-demonetize-label" id="rs-demonetize-label">Checking risk…</span>
        </div>

        <!-- Keyword Score -->
        <div class="rs-keyword-score" id="rs-keyword-section">
          <div class="rs-section-title">Keyword Score</div>
          <div class="rs-kw-bar-wrap">
            <div class="rs-kw-bar" id="rs-kw-bar"></div>
          </div>
          <span class="rs-kw-score-num" id="rs-kw-score-num">–</span>
        </div>

        <!-- Checklist -->
        <div class="rs-section">
          <div class="rs-section-title">SEO Checklist</div>
          <ul class="rs-checklist" id="rs-checklist"></ul>
        </div>

        <!-- Tags -->
        <div class="rs-section">
          <div class="rs-section-title">Top Rankable Tags</div>
          <div class="rs-tags-wrap" id="rs-tags"></div>
        </div>

        <!-- Title Suggestions -->
        <div class="rs-section">
          <div class="rs-section-title">Title Suggestions <span class="rs-click-hint">click to apply</span></div>
          <div class="rs-titles-list" id="rs-titles"></div>
        </div>

      </div>
    </div>
  `;
}

// ─── Toggle Sidebar ───────────────────────────────────────────────────────────

function toggleSidebar() {
  isSidebarVisible = !isSidebarVisible;
  if (isSidebarVisible) {
    sidebar.classList.remove('rs-hidden');
    toggleBtn.innerHTML = '&#10094;';
  } else {
    sidebar.classList.add('rs-hidden');
    toggleBtn.innerHTML = '&#10095;';
  }
  updateToggleBtnPosition();
  chrome.storage.sync.set({ sidebarVisible: isSidebarVisible });
}

function updateToggleBtnPosition() {
  if (!toggleBtn) return;
  if (isSidebarVisible) {
    toggleBtn.style.right = '348px';
  } else {
    toggleBtn.style.right = '0px';
  }
}

// ─── Title Field Detection & Observer ────────────────────────────────────────

function findTitleField() {
  for (const sel of TITLE_SELECTORS) {
    const el = document.querySelector(sel);
    if (el) return el;
  }
  return null;
}

function observeTitleField() {
  // Poll until title field appears (YouTube Studio is SPA)
  const poll = setInterval(() => {
    const titleField = findTitleField();
    if (titleField) {
      clearInterval(poll);
      attachTitleListener(titleField);
    }
  }, 1000);

  // Also watch DOM mutations for SPA navigation
  const navObserver = new MutationObserver(() => {
    const titleField = findTitleField();
    if (titleField && !titleField.__rsAttached) {
      attachTitleListener(titleField);
    }
  });
  navObserver.observe(document.body, { childList: true, subtree: true });
}

function attachTitleListener(field) {
  if (field.__rsAttached) return;
  field.__rsAttached = true;

  field.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    const title = field.value.trim();
    if (!title || title.length < 5) return;
    debounceTimer = setTimeout(() => analyzeTitle(title), DEBOUNCE_MS);
  });

  // Trigger on existing value if present
  const existing = field.value.trim();
  if (existing.length >= 5) {
    analyzeTitle(existing);
  }
}

// ─── API Call ─────────────────────────────────────────────────────────────────

async function analyzeTitle(title) {
  if (title === lastAnalyzedTitle) return;
  lastAnalyzedTitle = title;

  showAnalyzing();

  const keyword = extractKeyword(title);
  const language = detectLanguage(title);

  const payload = {
    title,
    keyword,
    language,
    niche: 'general',
    transcript: '',
    description: '',
    tags: '',
    videoType: 'other',
    channelSize: 'small',
    thumbnailStatus: 'unknown',
    tagLanguages,
    checklist: {},
  };

  try {
    const stored = await chrome.storage.sync.get(['apiUrl']);
    const base = stored.apiUrl || apiUrl;
    const res = await fetch(`${base}/api/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
      throw new Error(err.error || `HTTP ${res.status}`);
    }

    const data = await res.json();
    const result = data.result || data;
    currentScore = result.score;

    // Notify popup of current score
    chrome.runtime.sendMessage({ type: 'SCORE_UPDATE', score: result.score, grade: result.grade });

    renderResults(result);
  } catch (err) {
    showError(err.message);
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function extractKeyword(title) {
  // Remove common filler words and return the most meaningful part
  const filler = /\b(how|to|the|a|an|in|on|at|by|for|with|about|like|and|or|of|is|it|this|that|you|your|my|we|do|get|make|use|can|will|i|am|are|was|were|be|been|being)\b/gi;
  const cleaned = title.replace(filler, '').replace(/\s+/g, ' ').trim();
  return cleaned.split(' ').slice(0, 5).join(' ') || title.split(' ').slice(0, 3).join(' ');
}

function detectLanguage(title) {
  // Detect Bangla unicode range
  const banglaPattern = /[\u0980-\u09FF]/;
  if (banglaPattern.test(title)) return 'bangla';
  // Banglish heuristic: common Bangla romanization patterns
  const banglishPattern = /\b(ami|tumi|apni|amar|tomar|ki|kemon|ache|kore|hobe|thakbe|bolo|dekho|jao|eso|bhai|didi|vai)\b/i;
  if (banglishPattern.test(title)) return 'banglish';
  return 'english';
}

// ─── Render Helpers ───────────────────────────────────────────────────────────

function showAnalyzing() {
  document.getElementById('rs-idle').style.display = 'none';
  document.getElementById('rs-analyzing').style.display = 'flex';
  document.getElementById('rs-results').style.display = 'none';
}

function showError(msg) {
  document.getElementById('rs-analyzing').style.display = 'none';
  document.getElementById('rs-results').style.display = 'none';
  document.getElementById('rs-idle').style.display = 'flex';
  document.getElementById('rs-idle').innerHTML = `
    <div class="rs-idle-icon rs-error-icon">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="#e53e3e" stroke-width="1.5"/>
        <line x1="12" y1="8" x2="12" y2="12" stroke="#e53e3e" stroke-width="2" stroke-linecap="round"/>
        <circle cx="12" cy="16" r="1" fill="#e53e3e"/>
      </svg>
    </div>
    <p class="rs-idle-text rs-error-text">${escHtml(msg)}</p>
    <p class="rs-hint-text">Check your API URL in the extension popup.</p>
  `;
}

function renderResults(result) {
  document.getElementById('rs-analyzing').style.display = 'none';
  document.getElementById('rs-idle').style.display = 'none';
  const resultsEl = document.getElementById('rs-results');
  resultsEl.style.display = 'block';

  // Score ring
  const score = Math.round(result.score ?? 0);
  document.getElementById('rs-score-num').textContent = score;
  const arc = document.getElementById('rs-ring-arc');
  const circumference = 314;
  const offset = circumference - (score / 100) * circumference;
  arc.style.strokeDashoffset = offset;
  arc.style.stroke = scoreColor(score);

  // Grade
  const gradeEl = document.getElementById('rs-grade-badge');
  gradeEl.textContent = result.grade || '–';
  gradeEl.className = `rs-grade-badge rs-grade-${(result.grade || 'F').toLowerCase()}`;

  // Demonetization risk
  renderDemonetizeRisk(result);

  // Keyword score (use titleOptimization as proxy if no dedicated kwScore)
  const kwScore = result.categoryScores?.titleOptimization ?? result.score ?? 0;
  document.getElementById('rs-kw-bar').style.width = `${kwScore}%`;
  document.getElementById('rs-kw-bar').style.backgroundColor = scoreColor(kwScore);
  document.getElementById('rs-kw-score-num').textContent = Math.round(kwScore);

  // Checklist
  renderChecklist(result);

  // Tags
  renderTags(result.tags || []);

  // Title suggestions
  renderTitleSuggestions(result.titleOptions || []);
}

function renderDemonetizeRisk(result) {
  const issues = result.issues || [];
  const riskKeywords = ['demonetize', 'monetiz', 'advertiser-friendly', 'inappropriate', 'restricted', 'violation', 'policy'];
  const hasRisk = issues.some(i => riskKeywords.some(k => i.toLowerCase().includes(k)));
  const score = result.score ?? 0;

  let level, color, label;
  if (hasRisk || score < 30) {
    level = 'high'; color = '#e53e3e'; label = 'High Demonetization Risk';
  } else if (score < 55) {
    level = 'medium'; color = '#dd6b20'; label = 'Medium Demonetization Risk';
  } else {
    level = 'low'; color = '#38a169'; label = 'Low Demonetization Risk';
  }

  const dot = document.getElementById('rs-demonetize-dot');
  const labelEl = document.getElementById('rs-demonetize-label');
  dot.style.backgroundColor = color;
  labelEl.textContent = label;
  labelEl.style.color = color;
}

function renderChecklist(result) {
  const listEl = document.getElementById('rs-checklist');
  listEl.innerHTML = '';

  const checklistItems = buildChecklist(result);
  checklistItems.forEach(item => {
    const li = document.createElement('li');
    li.className = `rs-checklist-item ${item.pass ? 'rs-pass' : 'rs-fail'}`;
    li.innerHTML = `
      <span class="rs-check-icon">${item.pass ? checkIcon() : crossIcon()}</span>
      <span class="rs-check-label">${escHtml(item.label)}</span>
    `;
    listEl.appendChild(li);
  });
}

function buildChecklist(result) {
  const score = result.score ?? 0;
  const cat = result.categoryScores || {};
  const title = result.input?.title || lastAnalyzedTitle;
  const titleLen = title.length;
  const issues = (result.issues || []).map(i => i.toLowerCase());

  return [
    { label: 'Title length 40–70 chars', pass: titleLen >= 40 && titleLen <= 70 },
    { label: 'Primary keyword in title', pass: cat.titleOptimization >= 60 },
    { label: 'Title optimization score ≥ 60', pass: (cat.titleOptimization ?? 0) >= 60 },
    { label: 'Description quality ≥ 60', pass: (cat.descriptionQuality ?? 50) >= 60 },
    { label: 'Tag strategy score ≥ 60', pass: (cat.tagStrategy ?? 0) >= 60 },
    { label: 'Engagement potential ≥ 60', pass: (cat.engagementPotential ?? 0) >= 60 },
    { label: 'No demonetization risk', pass: !issues.some(i => i.includes('demonetiz') || i.includes('policy')) },
    { label: 'Keyword in first 5 words', pass: cat.titleOptimization >= 70 },
    { label: 'Unique & compelling hook', pass: (cat.titleOptimization ?? 0) >= 65 },
    { label: 'Overall SEO score ≥ 50', pass: score >= 50 },
    { label: 'Tags cover Bangla variants', pass: (cat.tagStrategy ?? 0) >= 55 },
    { label: 'Transcript relevance ≥ 50', pass: (cat.transcriptRelevance ?? 50) >= 50 },
    { label: 'Thumbnail SEO signal', pass: (cat.thumbnailSEO ?? 50) >= 50 },
    { label: 'Channel authority leveraged', pass: (cat.channelAuthority ?? 50) >= 50 },
    { label: 'Quick wins identified', pass: (result.quickWins?.length ?? 0) > 0 },
  ];
}

function renderTags(tags) {
  const wrap = document.getElementById('rs-tags');
  wrap.innerHTML = '';

  // Show top 10 tags sorted by relevance
  const sorted = [...tags].sort((a, b) => b.relevanceScore - a.relevanceScore).slice(0, 10);
  sorted.forEach(tag => {
    const span = document.createElement('span');
    span.className = `rs-tag rs-tag-${tag.language || 'english'}`;
    span.textContent = tag.text;
    span.title = `${tag.language} · score: ${tag.relevanceScore}`;
    span.addEventListener('click', () => copyToClipboard(tag.text));
    wrap.appendChild(span);
  });

  if (sorted.length === 0) {
    wrap.innerHTML = '<span class="rs-no-data">No tags generated yet.</span>';
  }
}

function renderTitleSuggestions(titles) {
  const list = document.getElementById('rs-titles');
  list.innerHTML = '';
  const top3 = titles.slice(0, 3);

  top3.forEach((t, i) => {
    const div = document.createElement('div');
    div.className = 'rs-title-suggestion';
    div.innerHTML = `
      <span class="rs-title-num">${i + 1}</span>
      <span class="rs-title-text">${escHtml(t)}</span>
      <button class="rs-apply-btn" aria-label="Apply this title">Apply</button>
    `;
    div.querySelector('.rs-apply-btn').addEventListener('click', () => applyTitle(t));
    list.appendChild(div);
  });

  if (top3.length === 0) {
    list.innerHTML = '<p class="rs-no-data">No suggestions generated yet.</p>';
  }
}

// ─── Apply Title to YouTube Studio ────────────────────────────────────────────

function applyTitle(newTitle) {
  const field = findTitleField();
  if (!field) return;

  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
    window.HTMLTextAreaElement.prototype, 'value'
  )?.set;

  if (nativeInputValueSetter) {
    nativeInputValueSetter.call(field, newTitle);
  } else {
    field.value = newTitle;
  }

  field.dispatchEvent(new Event('input', { bubbles: true }));
  field.dispatchEvent(new Event('change', { bubbles: true }));
  field.focus();

  // Visual feedback on the button
  const btn = event?.target;
  if (btn) {
    btn.textContent = '✓';
    btn.classList.add('rs-applied');
    setTimeout(() => { btn.textContent = 'Apply'; btn.classList.remove('rs-applied'); }, 2000);
  }
}

// ─── Utility ──────────────────────────────────────────────────────────────────

function scoreColor(score) {
  if (score >= 80) return '#38a169';
  if (score >= 60) return '#D85A30';
  if (score >= 40) return '#dd6b20';
  return '#e53e3e';
}

function checkIcon() {
  return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path d="M20 6L9 17l-5-5" stroke="#38a169" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;
}

function crossIcon() {
  return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path d="M18 6L6 18M6 6l12 12" stroke="#e53e3e" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).catch(() => {});
}

// ─── Message Listener ─────────────────────────────────────────────────────────

function listenForMessages() {
  chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
    if (msg.type === 'GET_SCORE') {
      sendResponse({ score: currentScore });
    }
    if (msg.type === 'TOGGLE_SIDEBAR') {
      toggleSidebar();
      sendResponse({ visible: isSidebarVisible });
    }
    if (msg.type === 'SETTINGS_UPDATED') {
      if (msg.apiUrl) apiUrl = msg.apiUrl;
      if (msg.tagLanguages) tagLanguages = msg.tagLanguages;
      lastAnalyzedTitle = ''; // force re-analysis
      const field = findTitleField();
      if (field && field.value.trim().length >= 5) {
        analyzeTitle(field.value.trim());
      }
    }
  });
}

// ─── Start ────────────────────────────────────────────────────────────────────
init();
