// ClearGem v1.0.2 — Background Service Worker
// Proxies fetch requests from content script to bypass CORS

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type !== 'cleargem-fetch') return false;

    console.log('[ClearGem BG] Fetching:', msg.url.substring(0, 80) + '...');

    fetch(msg.url, { redirect: 'follow' })
        .then(resp => {
            if (!resp.ok) throw new Error(`HTTP ${resp.status} ${resp.statusText}`);
            const contentType = resp.headers.get('Content-Type') || 'image/png';
            return resp.arrayBuffer().then(buf => ({ buf, contentType }));
        })
        .then(({ buf, contentType }) => {
            // Convert to base64 — far more efficient for message passing than a number array
            const bytes = new Uint8Array(buf);
            let binary = '';
            const chunkSize = 8192;
            for (let i = 0; i < bytes.length; i += chunkSize) {
                binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunkSize));
            }
            const b64 = btoa(binary);
            console.log('[ClearGem BG] Success:', contentType, `${bytes.length} bytes`);
            sendResponse({ ok: true, data: b64, type: contentType });
        })
        .catch(err => {
            console.error('[ClearGem BG] Fetch error:', err.message);
            sendResponse({ ok: false, error: err.message });
        });

    return true; // keep message channel open for async response
});

console.log('[ClearGem BG] Service worker started');
