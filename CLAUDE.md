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
  - `rules.json` — declarativeNetRequest rules to inject CORS headers on googleusercontent.com
  - `background.js` — minimal service worker (kept for future use)
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
  - Extension: `declarativeNetRequest` injects `Access-Control-Allow-Origin: *` on googleusercontent.com responses, allowing direct `fetch()` from content script

## Version
- v1.0.0 — Initial release
- v1.0.1 — Fixed CORS via GM_xmlhttpRequest
- v1.0.2 — Fixed download/copy button interception, added extension builds
- v1.0.3 — Fixed extension CORS: switched from background proxy to declarativeNetRequest

## Gotchas
- Alpha maps from Allen Kuo's GeminiWatermarkTool — if Google changes watermark pattern, need recalibrating
- Does NOT remove SynthID (invisible steganographic watermark)
- Extension v1.0.2 background service worker fetch failed — Google CDN doesn't send CORS headers and SW fetch didn't work. Fixed in v1.0.3 with declarativeNetRequest header injection.
- Userscript uses `@grant none` for fetch interception in page context; extension uses declarativeNetRequest instead
