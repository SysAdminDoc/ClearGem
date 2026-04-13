// ClearGem v1.0.6 — Content Script (ISOLATED world)
// Relays fetch requests from MAIN world to background service worker.
'use strict';

(function () {
    const VERSION = '1.0.6';

    window.addEventListener('message', (e) => {
        if (e.source !== window || !e.data || e.data.type !== 'cleargem-fetch-request') return;

        const { id, url } = e.data;
        console.log('[ClearGem] Relay fetch:', url.substring(0, 80));

        chrome.runtime.sendMessage({ type: 'cleargem-fetch', url }, (resp) => {
            if (chrome.runtime.lastError) {
                console.error('[ClearGem] Relay error:', chrome.runtime.lastError.message);
                window.postMessage({
                    type: 'cleargem-fetch-response',
                    id,
                    ok: false,
                    error: chrome.runtime.lastError.message
                }, '*');
                return;
            }
            window.postMessage({
                type: 'cleargem-fetch-response',
                id,
                ok: resp?.ok || false,
                data: resp?.data,
                contentType: resp?.type,
                error: resp?.error
            }, '*');
        });
    });

    console.log(`[ClearGem] v${VERSION} content relay loaded`);
})();
