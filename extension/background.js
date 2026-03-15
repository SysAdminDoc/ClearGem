// ClearGem v1.0.2 — Background Service Worker
// Proxies fetch requests from content script to bypass CORS

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type !== 'cleargem-fetch') return false;

    fetch(msg.url)
        .then(resp => {
            if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
            return resp.arrayBuffer();
        })
        .then(buf => {
            sendResponse({ ok: true, data: Array.from(new Uint8Array(buf)), type: 'image/png' });
        })
        .catch(err => {
            sendResponse({ ok: false, error: err.message });
        });

    return true; // keep message channel open for async response
});
