# ClearGem

## Overview
Tampermonkey userscript that removes visible Gemini AI watermarks via reverse alpha blending. Single-file, zero-config.

## Tech Stack
- JavaScript (Tampermonkey userscript)
- Runs at `document-start` with `@inject-into content` for MV3 compat

## Key Files
- `cleargem.user.js` — the entire userscript (~72KB, bulk is embedded alpha map data)

## Architecture
- **Alpha maps**: Two pre-calibrated Float32Array maps (48x48 and 96x96) embedded as base64
- **Watermark detection**: Size auto-detected from image dimensions (>1024px both dims = 96x96, else 48x48)
- **Position**: Bottom-right corner, 32px margin (48) or 64px margin (96)
- **Removal**: Reverse alpha blending: `original = (watermarked - alpha * 255) / (1 - alpha)`
- **Hooks**: fetch interception, MutationObserver for new images, click capture for downloads

## Version
- v1.0.0 — Initial release

## Gotchas
- Alpha maps are from Allen Kuo's GeminiWatermarkTool — if Google changes the watermark pattern these need recalibrating
- Does NOT remove SynthID (invisible steganographic watermark)
- `@grant none` required for fetch interception to work in page context
