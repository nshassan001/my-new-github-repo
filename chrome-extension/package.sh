#!/usr/bin/env bash
# ============================================================
# RankSpark Chrome Extension — Packaging Script
# Produces: rankspark-extension.zip (Chrome Web Store ready)
# ============================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OUTPUT_NAME="rankspark-extension.zip"
OUTPUT_PATH="${SCRIPT_DIR}/../${OUTPUT_NAME}"

# Files to include in the zip
INCLUDE_FILES=(
  "manifest.json"
  "content.js"
  "sidebar.css"
  "popup.html"
  "popup.js"
  "background.js"
  "icons/icon16.png"
  "icons/icon48.png"
  "icons/icon128.png"
)

echo "🚀 Packaging RankSpark Chrome Extension..."

# Remove old zip if it exists
if [[ -f "$OUTPUT_PATH" ]]; then
  rm "$OUTPUT_PATH"
  echo "   Removed old $OUTPUT_NAME"
fi

# Validate all required files exist
echo ""
echo "📋 Validating files..."
MISSING=0
for file in "${INCLUDE_FILES[@]}"; do
  if [[ -f "${SCRIPT_DIR}/${file}" ]]; then
    echo "   ✓ ${file}"
  else
    echo "   ✗ MISSING: ${file}"
    MISSING=$((MISSING + 1))
  fi
done

if [[ $MISSING -gt 0 ]]; then
  echo ""
  echo "❌ Error: $MISSING required file(s) missing. Aborting."
  exit 1
fi

# Create the zip from the extension directory
echo ""
echo "📦 Creating zip..."
(
  cd "$SCRIPT_DIR"
  zip -r "$OUTPUT_PATH" "${INCLUDE_FILES[@]}" -x "*.DS_Store" -x "__MACOSX/*"
)

# Report
SIZE=$(du -sh "$OUTPUT_PATH" | cut -f1)
echo ""
echo "✅ Done! Packaged as: ${OUTPUT_NAME} (${SIZE})"
echo "   Path: ${OUTPUT_PATH}"
echo ""
echo "📌 To install in Chrome:"
echo "   1. Go to chrome://extensions"
echo "   2. Enable Developer Mode"
echo "   3. Click 'Load unpacked' → select the chrome-extension/ folder"
echo ""
echo "📌 To publish to Chrome Web Store:"
echo "   1. Go to https://chrome.google.com/webstore/devconsole"
echo "   2. Upload ${OUTPUT_NAME}"
