# ClearGem

## Overview
Removes visible Gemini AI watermarks via reverse alpha blending. Available as Tampermonkey userscript and Chrome/Firefox extension.

## Tech Stack
- JavaScript userscript (`@inject-into content` for MV3 compat)
- Chrome/Firefox MV3 extension (declarativeNetRequest for CORS bypass)

## Key Files
- `cleargem.user.js` — Tampermonkey userscript (~72KB, bulk is embedded alpha maps)
- `extension/` — Chrome/Firefox extension
  - `manifest.json` — MV3 manifest with declarativeNetRequest
  - `content.js` — built by `build_extension.py` (embeds alpha maps from userscript)
  - `rules.json` — declarativeNetRequest rules to strip Origin header from requests to googleusercontent.com
  - `background.js` — service worker that proxies fetch requests from content script
  - `icons/` — diamond icons (Catppuccin lavender)
- `build_extension.py` — extracts alpha maps from userscript, generates content.js
- `gen_icons.py` — generates diamond PNG icons with Pillow

## Architecture
- **Alpha maps**: Two pre-calibrated Float32Array maps (48x48 and 96x96) embedded as base64
- **Watermark detection**: Size auto-detected from image dimensions (>1024px both dims = 96x96, else 48x48)
- **Position**: Bottom-right corner, 32px margin (48) or 64px margin (96)
- **Removal**: Reverse alpha blending: `original = (watermarked - alpha * 255) / (1 - alpha)`
- **Hooks**: MutationObserver for new images, click capture for download/copy buttons
- **CORS strategy**:
  - Userscript: `GM_xmlhttpRequest` bypasses CORS
  - Extension: `declarativeNetRequest` strips `Origin` header from requests to googleusercontent.com (CDN returns 403 if Origin is present), background service worker proxies fetch for content script

## Version
- v1.0.0 — Initial release
- v1.0.1 — Fixed CORS via GM_xmlhttpRequest
- v1.0.2 — Fixed download/copy button interception, added extension builds
- v1.0.3 — Attempted extension CORS fix (didn't work — adding CORS response headers insufficient)
- v1.0.4 — Fixed extension CORS: DNR strips Origin header from requests (Google CDN 403s on Origin), background SW proxies fetch

## Gotchas
- Alpha maps from Allen Kuo's GeminiWatermarkTool — if Google changes watermark pattern, need recalibrating
- Does NOT remove SynthID (invisible steganographic watermark)
- Google CDN `/gg/` AI image URLs return 403 Forbidden when ANY `Origin` header is present. Public URLs like `/a/` (profile pics) work fine. This is why SW fetch and content script fetch both failed — they always send Origin.
- Fix: `declarativeNetRequest` strips Origin header from outgoing requests to googleusercontent.com, then background SW fetch works normally.
- Adding CORS response headers via DNR was NOT sufficient — the 403 happens server-side before any response headers matter.
- Userscript bypasses all this via `GM_xmlhttpRequest` which sends no Origin header.
