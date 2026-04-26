# ClearGem Roadmap

Next features for the Gemini watermark remover (v1.0.4+). Focus: broader provider coverage, robustness against watermark drift, and UX polish.

## Planned Features

### Watermark coverage
- **Auto-calibration pipeline** — when Gemini changes the watermark alpha, mask, or position, automatically rebuild alpha maps from a short sample set instead of shipping manual updates
- **Additional watermark sizes** — support 24x24, 32x32, 64x64, 128x128, 192x192 glyphs as Gemini rolls them out
- **Corner auto-detect** — support all four corners (Gemini sometimes uses bottom-left on aspect-ratio edge cases)
- **Animated watermark support** — detect animated GIF/MP4 watermarks per frame when video generation ships to Gemini
- **Multi-provider support** (opt-in) — OpenAI DALL-E C2PA visible marks, Microsoft Designer stamp, Adobe Firefly CR logo — each a separate toggle
- **Vertex AI / Imagen 3 Studio** — extend host list beyond gemini.google.com and aistudio.google.com

### Detection & robustness
- **Structural similarity (SSIM) verifier** — after removal, run a local check; if residue > threshold, re-try with neighbor alpha map
- **Fallback to content-aware inpainting** — ship an optional WASM-packaged patch-match algorithm for cases where math-based reversal fails (rare)
- **Bypass site A/B tests** — MutationObserver backed by IntersectionObserver so lazy-loaded images are caught even with React virtualization changes

### UX
- **Toggle per-site** — easily disable on a specific host from the popup
- **Before/after slider** in page — optional comparison overlay on hover
- **Batch download** — collect all cleaned images from a conversation into a single ZIP
- **History log** (local, opt-in) — count of images cleaned, with clear button
- **Options page** — pick watermark sizes to scan, toggle copy/download intercept independently, set toast duration/position

### Packaging
- **Firefox MV3 manifest** — current XPI is MV2-compatible; add explicit MV3 manifest for Firefox 115+
- **Edge Add-ons store listing** — identical build, just store submission
- **Userscript auto-update** — ensure `@updateURL` + `@downloadURL` headers point to GitHub raw (per global userscript rules)
- **CRX3 + XPI signed artifacts** on every tag release via GitHub Actions

## Competitive Research

- **GeminiWatermarkTool (allenk)** — upstream source of the alpha-reversal math. Gap: CLI only, single-image. ClearGem's browser-integrated auto-clean is the product layer.
- **gemini-watermark-remover (GargantuaX)** — server-side Python. Gap: privacy-hostile (upload required) and slower. ClearGem runs 100% client-side.
- **SynthID defeat research (academic)** — diffusion re-processing is computationally expensive and probabilistic. Takeaway: do not promise SynthID removal, keep the README disclaimer sharp.
- **General image watermark removers (Watermark Remover AI, HitPaw)** — paid, cloud-based, generic inpainting. Takeaway: math-based exact reversal is the moat for *known* watermarks.

## Nice-to-Haves

- **C2PA manifest stripper** — optional removal of C2PA metadata blocks when the user explicitly opts in (separate from visible watermark; legal/ethical disclaimer in UI)
- **EXIF preservation option** — keep original EXIF/XMP tags from the source image (Gemini strips most, but not all)
- **Integration with Astra-Deck downloader** — share UI patterns/toast library across the browser-extension portfolio
- **Offline evaluation tool** — drop a folder of watermarked PNGs onto a desktop helper, get them cleaned locally, useful for batch archive recovery
- **Automatic pattern-drift detection** — daily background check against a small canary image, alert user if next release is needed
- **Shadow DOM isolation** for toast UI to avoid any style leak on Google's properties (per userscript standard)

## Open-Source Research (Round 2)

### Related OSS Projects
- **GargantuaX/gemini-watermark-remover** — https://github.com/GargantuaX/gemini-watermark-remover — 100% client-side JS reverse-alpha-blending; auto-detection of watermark size and position from Gemini's known output catalog.
- **allenk/GeminiWatermarkTool** — https://github.com/allenk/GeminiWatermarkTool — Upstream author; reverse-alpha blending + GPU-accelerated NCNN/Vulkan FDnCNN denoise for residual artifacts; now also supports Veo video watermarks (MP4→MP4, audio preserved).
- **dearabhin/gemini-watermark-remover** — https://github.com/dearabhin/gemini-watermark-remover — Vanilla JS + ES6 modules + Tailwind, 48px/96px auto-detect, mobile-responsive UI.
- **dinoBOLT/Gemini-Watermark-Remover** — https://github.com/dinoBOLT/Gemini-Watermark-Remover — Chrome extension using LaMa Large Mask Inpainting (AI fallback) when alpha-blend doesn't suffice.
- **VimalMollyn/Gemini-Watermark-Remover-Python** — https://github.com/VimalMollyn/Gemini-Watermark-Remover-Python — Python port of journey-ad's JS; useful for batch/server-side pipelines.
- **nicholasxdavis/remove-gemini-watermark** — https://github.com/nicholasxdavis/remove-gemini-watermark — "Banana Remove" browser app with pre-calculated alpha maps.
- **gemini-watermark-remover topic** — https://github.com/topics/gemini-watermark-remover — community catalog; "Banana Unmask" dual browser-extension + web tool is another active fork.

### Features to Borrow
- **Veo video watermark removal** (allenk/GeminiWatermarkTool) — same reverse-alpha blending engine applied frame-by-frame to MP4, audio preserved; ClearGem's next logical surface since Gemini now also marks Veo output.
- **FDnCNN denoise for residual artifacts** (allenk/GeminiWatermarkTool) — after the mathematical inversion, a tiny denoise pass via NCNN+Vulkan cleans up the 8-bit-quantization fringe; negligible VRAM, perceptibly cleaner.
- **Three-stage NCC detection with confidence score** (allenk/GeminiWatermarkTool) — instead of trusting image dimensions alone, cross-correlate against the 48/96 templates and only clean when confidence > threshold. Prevents false-positive "cleans" on non-Gemini images.
- **LaMa inpainting fallback** (dinoBOLT) — for the rare cases where the watermark overlaps an area that the linear inversion can't cleanly recover (pure black or pure white regions); trigger only when math residual exceeds ε.
- **Bookmarklet + extension + userscript trifecta** (dearabhin, nicholasxdavis, dinoBOLT) — ship the same logic as all three form factors from a single source; ClearGem already ships two of three.
- **Banana / Nano Banana Pro support** (allenk, gemini-watermark-remover topic) — Google's Nano Banana has a different stamp; add a second template set and detection branch.
- **Mobile-responsive drag-drop UI** (dearabhin) — the current extension is desktop-only; a standalone mobile web page widens reach without adding permissions.

### Patterns & Architectures Worth Studying
- **Deterministic inversion + optional AI denoise** (allenk/GeminiWatermarkTool) — prefer exact math, only fall back to learned models for residuals; avoids hallucination that plagues pure-inpainting forks.
- **Pre-calculated alpha maps as a bundled asset** (nicholasxdavis, dearabhin) — maps are small (~a few KB each), commit them and version them rather than deriving at runtime.
- **NCNN + Vulkan on the browser side via ONNX-WebGPU** (allenk design) — if ClearGem wants to adopt denoise, WebGPU via ONNX Runtime is the cross-browser path and avoids CUDA/Vulkan.
- **Extension ↔ page messaging via `trustedTypes.createPolicy()`** (user CLAUDE.md conventions) — already required since Gemini is a Google property; watch for CSP tightening.
- **SynthID-invisible-watermark out-of-scope acknowledgement** (dearabhin, dinoBOLT) — all reputable forks explicitly note they do not remove invisible SynthID; match that documentation stance for accurate positioning.
