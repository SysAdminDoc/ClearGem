// ClearGem v1.0.6 — Background Service Worker
// Fetches images using extension host_permissions (bypasses CORS).

async function encodeResponse(resp) {
    const contentType = resp.headers.get('Content-Type') || 'image/png';
    const buf = await resp.arrayBuffer();
    const bytes = new Uint8Array(buf);
    let binary = '';
    const chunkSize = 8192;
    for (let i = 0; i < bytes.length; i += chunkSize) {
        binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunkSize));
    }
    return { ok: true, data: btoa(binary), type: contentType };
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type !== 'cleargem-fetch') return false;

    const url = msg.url;
    console.log('[ClearGem BG] Fetching:', url.substring(0, 100));

    fetch(url, { credentials: 'omit' })
        .then(resp => {
            console.log('[ClearGem BG] Response:', resp.status, resp.type, resp.url.substring(0, 100));
            if (!resp.ok) throw new Error(`HTTP ${resp.status} ${resp.statusText}`);
            return encodeResponse(resp);
        })
        .then(sendResponse)
        .catch(e => {
            console.error('[ClearGem BG] Fetch failed:', e.message);
            sendResponse({ ok: false, error: e.message });
        });

    return true;
});

console.log('[ClearGem BG] Service worker started (v1.0.6)');
