// ClearGem v1.0.8 — Background Service Worker
// Fetches images using host_permissions (bypasses CORS entirely).
// Returns base64 data URL to content script.
'use strict';

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type !== 'cleargem-fetch') return false;

    const url = msg.url;
    console.log('[ClearGem BG] Fetching:', url.substring(0, 80));

    fetch(url, { credentials: 'omit', redirect: 'follow' })
        .then(resp => {
            if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
            return resp.blob();
        })
        .then(blob => {
            const reader = new FileReader();
            reader.onloadend = () => {
                console.log('[ClearGem BG] Success, data URL length:', reader.result.length);
                sendResponse({ ok: true, dataUrl: reader.result });
            };
            reader.onerror = () => {
                sendResponse({ ok: false, error: 'FileReader failed' });
            };
            reader.readAsDataURL(blob);
        })
        .catch(err => {
            console.error('[ClearGem BG] Fetch error:', err.message);
            sendResponse({ ok: false, error: err.message });
        });

    return true; // async sendResponse
});

console.log('[ClearGem BG] Service worker started (v1.0.8)');
