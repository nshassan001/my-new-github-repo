# RankSpark Chrome Extension — YouTube SEO

A Chrome Extension that injects a live SEO analysis sidebar directly into **YouTube Studio**. As soon as you type your video title, RankSpark automatically analyzes it and shows:

- Live score ring (0–100)
- 15-point SEO checklist with green/red indicators
- Top 10 rankable tags (Bangla + Banglish + English)
- 3 title suggestions (click to apply directly to the title field)
- Keyword overall score
- Demonetization risk indicator

---

## Prerequisites

- Google Chrome (version 88+) or any Chromium-based browser
- The RankSpark web app running at `http://localhost:3000` (or a deployed URL)

---

## Installation (Developer Mode)

1. **Clone / download** this repository so you have the `chrome-extension/` folder locally.

2. **Open Chrome** and navigate to `chrome://extensions`.

3. **Enable Developer Mode** — toggle the switch in the top-right corner.

4. Click **"Load unpacked"** and select the `chrome-extension/` folder.

5. The RankSpark extension icon will appear in your Chrome toolbar.

---

## Configuration

1. Click the **RankSpark icon** in the Chrome toolbar to open the popup.
2. In the **API URL** field, enter your RankSpark server URL:
   - Local development: `http://localhost:3000`
   - Production: `https://your-deployed-rankspark.app`
3. Choose which **tag languages** to generate: Bangla, Banglish, English (all enabled by default).
4. Click **Save Settings**.

---

## Usage

1. Go to [YouTube Studio](https://studio.youtube.com) and open any video for editing.
2. The **RankSpark sidebar** will appear automatically on the right side.
3. Start typing in the **video title** field — after 800ms of inactivity, RankSpark analyzes your title.
4. The sidebar shows:
   - **Score ring** — overall SEO score 0–100 with a letter grade
   - **Demonetization risk** — green/orange/red indicator
   - **Keyword score** — how well your primary keyword scores
   - **SEO Checklist** — 15 checks with green ✓ or red ✗
   - **Top 10 Tags** — color-coded by language; click a tag to copy it
   - **Title Suggestions** — 3 AI-optimized alternatives; click **Apply** to replace your current title
5. Use the **orange toggle button** (◀ ▶) on the left edge of the sidebar to collapse/expand it.

---

## API Contract

The extension sends a `POST` request to `{apiUrl}/api/analyze` with:

```json
{
  "title": "Your video title",
  "keyword": "extracted keyword phrase",
  "language": "bangla | banglish | english",
  "niche": "general",
  "transcript": "",
  "description": "",
  "tags": "",
  "videoType": "other",
  "channelSize": "small",
  "thumbnailStatus": "unknown",
  "tagLanguages": { "bangla": true, "banglish": true, "english": true },
  "checklist": {}
}
```

Expected response:

```json
{
  "id": "uuid",
  "result": {
    "score": 75,
    "grade": "B",
    "summary": "...",
    "categoryScores": { "titleOptimization": 80, ... },
    "issues": ["..."],
    "tags": [{ "text": "tag", "language": "english", "relevanceScore": 90, "tier": 1, "isExactMatch": true }],
    "titleOptions": ["Alternative title 1", "Alternative title 2", "Alternative title 3"],
    "quickWins": ["..."]
  }
}
```

---

## File Structure

```
chrome-extension/
├── manifest.json       # MV3 manifest — permissions & entry points
├── content.js          # Injected into YouTube Studio; sidebar logic & API calls
├── sidebar.css         # All sidebar styles (injected as content CSS)
├── popup.html          # Extension toolbar popup UI
├── popup.js            # Popup logic — settings, score display
├── background.js       # Service worker — install handler, message relay
├── icons/
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md
```

---

## Packaging for Distribution

Run the included packaging script to generate a `rankspark-extension.zip` ready for the Chrome Web Store:

```bash
chmod +x package.sh
./package.sh
```

This creates `rankspark-extension.zip` in the parent directory.

---

## CORS Configuration

When calling the RankSpark API from the extension, ensure your Next.js app allows requests from `chrome-extension://` origins.

Add to `next.config.mjs`:

```js
async headers() {
  return [
    {
      source: '/api/:path*',
      headers: [
        { key: 'Access-Control-Allow-Origin', value: '*' },
        { key: 'Access-Control-Allow-Methods', value: 'GET, POST, OPTIONS' },
        { key: 'Access-Control-Allow-Headers', value: 'Content-Type' },
      ],
    },
  ];
},
```

---

## Troubleshooting

| Issue | Solution |
|---|---|
| Sidebar doesn't appear | Reload the YouTube Studio tab after installing the extension |
| "Check your API URL" error | Make sure your RankSpark server is running and the URL in popup settings is correct |
| Analysis doesn't trigger | Type at least 5 characters in the title field and wait 800ms |
| CORS errors in console | Add the CORS headers shown above to your Next.js config |
| Tags not showing | Ensure tag language checkboxes are enabled in popup settings |

---

## Development

To iterate on the extension:

1. Edit files in `chrome-extension/`
2. Go to `chrome://extensions` and click the **refresh icon** on the RankSpark card
3. Reload any open YouTube Studio tabs

---

## License

Part of the RankSpark project. See root `README.md` for license details.
