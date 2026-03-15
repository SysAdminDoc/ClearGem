# ClearGem

Browser extension (and userscript) that automatically removes the visible watermark from Google Gemini AI-generated images. Zero-click, 100% client-side, pixel-perfect reverse alpha blending.

<table>
<tr>
<td align="center"><strong>Before</strong></td>
<td align="center"><strong>After</strong></td>
</tr>
<tr>
<td><img src="before.png" alt="Gemini image with watermark" width="400"></td>
<td><img src="after.png" alt="Gemini image with watermark removed" width="400"></td>
</tr>
</table>

## How It Works

Gemini stamps a semi-transparent white 4-pointed star logo in the bottom-right corner of every generated image using alpha compositing:

```
watermarked_pixel = alpha * 255 + (1 - alpha) * original_pixel
```

ClearGem reverses this mathematically to reconstruct the original pixels:

```
original_pixel = (watermarked_pixel - alpha * 255) / (1 - alpha)
```

Pre-calibrated alpha maps (48x48 and 96x96) are embedded directly in the script. No AI inpainting, no server calls, no quality loss — pixel-perfect reconstruction with 99.9% accuracy (bounded only by 8-bit quantization).

## Features

- **Zero-click** — images are cleaned automatically as they appear in chat
- **Download interception** — download buttons deliver clean images
- **Fetch interception** — cleans images at the network level before they render
- **Auto-detection** — picks 48x48 or 96x96 watermark size based on image dimensions
- **100% client-side** — nothing leaves your browser
- **Toast notifications** — subtle confirmation when images are cleaned

## Install

1. Install [Tampermonkey](https://www.tampermonkey.net/) (or any userscript manager)
2. Open `cleargem.user.js` and click "Install" / "Raw" — or create a new script in Tampermonkey and paste the contents
3. Navigate to [gemini.google.com](https://gemini.google.com) — ClearGem is active immediately

## Compatibility

| Site | Status |
|------|--------|
| gemini.google.com | Supported |
| aistudio.google.com | Supported |

Works with Tampermonkey MV3 (`@inject-into content`).

## Limitations

- Removes the **visible** watermark only. Does **not** remove [SynthID](https://deepmind.google/technologies/synthid/) — Google's invisible steganographic watermark embedded at the pixel generation level. That requires diffusion model re-processing and is a fundamentally different problem.
- If Google changes the watermark pattern, position, or alpha values, the embedded alpha maps will need updating.

## Credits

Reverse alpha blending method and calibrated watermark masks based on [GeminiWatermarkTool](https://github.com/allenk/GeminiWatermarkTool) by Allen Kuo (MIT License). Alpha map data sourced from [gemini-watermark-remover](https://github.com/GargantuaX/gemini-watermark-remover).

## License

MIT
