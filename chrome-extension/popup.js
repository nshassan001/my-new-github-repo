/**
 * RankSpark — YouTube SEO
 * Popup script
 */

const DEFAULT_API_URL = 'http://localhost:3000';

async function loadSettings() {
  const stored = await chrome.storage.sync.get(['apiUrl', 'tagLanguages', 'sidebarVisible']);

  document.getElementById('api-url').value = stored.apiUrl || DEFAULT_API_URL;

  const tl = stored.tagLanguages || { bangla: true, banglish: true, english: true };
  document.getElementById('lang-bangla').checked = tl.bangla !== false;
  document.getElementById('lang-banglish').checked = tl.banglish !== false;
  document.getElementById('lang-english').checked = tl.english !== false;

  const sidebarVisible = stored.sidebarVisible !== false;
  document.getElementById('sidebar-toggle').checked = sidebarVisible;
}

async function fetchCurrentScore() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab || !tab.url?.includes('studio.youtube.com')) return;

    const response = await chrome.tabs.sendMessage(tab.id, { type: 'GET_SCORE' });
    if (response && response.score != null) {
      renderScore(response.score, response.grade);
    }
  } catch {
    // Tab may not have content script loaded yet
  }
}

function renderScore(score, grade) {
  document.getElementById('no-score-text').style.display = 'none';
  const infoEl = document.getElementById('score-info');
  const gradeEl = document.getElementById('score-grade');
  infoEl.style.display = 'flex';
  gradeEl.style.display = 'flex';

  document.getElementById('score-num').textContent = Math.round(score);
  gradeEl.textContent = grade || '–';
  gradeEl.className = `score-grade grade-${(grade || 'F').toLowerCase()}`;
}

async function saveSettings() {
  const apiUrl = document.getElementById('api-url').value.trim() || DEFAULT_API_URL;
  const tagLanguages = {
    bangla: document.getElementById('lang-bangla').checked,
    banglish: document.getElementById('lang-banglish').checked,
    english: document.getElementById('lang-english').checked,
  };
  const sidebarVisible = document.getElementById('sidebar-toggle').checked;

  await chrome.storage.sync.set({ apiUrl, tagLanguages, sidebarVisible });

  // Notify active YouTube Studio tab
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab && tab.url?.includes('studio.youtube.com')) {
      await chrome.tabs.sendMessage(tab.id, {
        type: 'SETTINGS_UPDATED',
        apiUrl,
        tagLanguages,
      });
      // Sync sidebar visibility
      const stored = await chrome.storage.sync.get('sidebarVisible');
      if (stored.sidebarVisible !== sidebarVisible) {
        await chrome.tabs.sendMessage(tab.id, { type: 'TOGGLE_SIDEBAR' });
      }
    }
  } catch {
    // content script may not be ready
  }

  showToast('Settings saved!');
}

async function resetSettings() {
  document.getElementById('api-url').value = DEFAULT_API_URL;
  document.getElementById('lang-bangla').checked = true;
  document.getElementById('lang-banglish').checked = true;
  document.getElementById('lang-english').checked = true;
  document.getElementById('sidebar-toggle').checked = true;
  showToast('Reset to defaults.');
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2200);
}

// ── Sidebar toggle live sync ──────────────────────────
document.getElementById('sidebar-toggle').addEventListener('change', async (e) => {
  const visible = e.target.checked;
  await chrome.storage.sync.set({ sidebarVisible: visible });
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab && tab.url?.includes('studio.youtube.com')) {
      await chrome.tabs.sendMessage(tab.id, { type: 'TOGGLE_SIDEBAR' });
    }
  } catch {}
});

document.getElementById('btn-save').addEventListener('click', saveSettings);
document.getElementById('btn-reset').addEventListener('click', resetSettings);

// ── Init ──────────────────────────────────────────────
loadSettings();
fetchCurrentScore();
