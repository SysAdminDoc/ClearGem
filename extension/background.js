// ClearGem v1.0.3 — Background Service Worker
// Proxies fetch requests from content script to bypass CORS
// Extension service workers with host_permissions bypass CORS entirely

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type !== 'cleargem-fetch') return false;

    const url = msg.url;
    console.log('[ClearGem BG] Fetching:', url.substring(0, 100));

    fetch(url)
        .then(resp => {
            console.log('[ClearGem BG] Response:', resp.status, resp.statusText, 'type:', resp.type);
            if (!resp.ok) throw new Error(`HTTP ${resp.status} ${resp.statusText}`);
            const contentType = resp.headers.get('Content-Type') || 'image/png';
            return resp.arrayBuffer().then(buf => ({ buf, contentType }));
        })
        .then(({ buf, contentType }) => {
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
            console.error('[ClearGem BG] Fetch error:', err.message, 'URL:', url.substring(0, 100));
            sendResponse({ ok: false, error: err.message });
        });

    return true; // keep message channel open for async response
});

console.log('[ClearGem BG] Service worker started');
