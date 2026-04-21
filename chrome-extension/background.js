/**
 * RankSpark — YouTube SEO
 * Background service worker (Manifest V3)
 */

const DEFAULT_SETTINGS = {
  apiUrl: 'http://localhost:3000',
  tagLanguages: { bangla: true, banglish: true, english: true },
  sidebarVisible: true,
};

// ── Install handler ────────────────────────────────────
chrome.runtime.onInstalled.addListener(async ({ reason }) => {
  if (reason === 'install') {
    await chrome.storage.sync.set(DEFAULT_SETTINGS);
    console.log('[RankSpark] Extension installed. Default settings stored.');
  }

  if (reason === 'update') {
    // Preserve existing settings, only fill in missing keys
    const existing = await chrome.storage.sync.get(Object.keys(DEFAULT_SETTINGS));
    const merged = { ...DEFAULT_SETTINGS, ...existing };
    await chrome.storage.sync.set(merged);
    console.log('[RankSpark] Extension updated. Settings migrated.');
  }
});

// ── Message relay ──────────────────────────────────────
// Background can relay messages between content scripts and popup if needed.
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'GET_SETTINGS') {
    chrome.storage.sync.get(Object.keys(DEFAULT_SETTINGS)).then((settings) => {
      sendResponse({ ...DEFAULT_SETTINGS, ...settings });
    });
    return true; // async response
  }

  if (msg.type === 'SET_SETTINGS') {
    chrome.storage.sync.set(msg.settings).then(() => {
      sendResponse({ ok: true });
    });
    return true;
  }

  if (msg.type === 'SCORE_UPDATE') {
    // Store the latest score so popup can retrieve it quickly
    chrome.storage.session?.set({
      lastScore: msg.score,
      lastGrade: msg.grade,
    }).catch(() => {});
  }
});

// ── Keep-alive ping (avoids MV3 service worker going idle mid-analysis) ───────
// YouTube Studio sessions can be long; we use an alarm to keep the SW alive.
chrome.alarms?.create('rankspark-keepalive', { periodInMinutes: 0.4 });

chrome.alarms?.onAlarm.addListener((alarm) => {
  if (alarm.name === 'rankspark-keepalive') {
    // No-op; just wakes the service worker
  }
});
