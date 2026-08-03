// ClearGem v1.1.1 - Content Script (ISOLATED world)
// Relays fetch requests from MAIN world to background service worker.
// Also relays settings from chrome.storage to MAIN world.
'use strict';

(function () {
    const DEFAULTS = {
        interceptDownload: true,
        interceptCopy: true,
        autoClean: true,
        toastEnabled: true,
        toastPosition: 'bottom-right',
        toastDuration: 2500
    };

    // Send settings to MAIN world
    function pushSettings(settings) {
        window.postMessage({
            type: 'cleargem-settings',
            settings: Object.assign({}, DEFAULTS, settings)
        }, '*');
    }

    // Load and push settings on startup
    chrome.storage.sync.get(DEFAULTS, pushSettings);

    // Listen for settings changes
    chrome.storage.onChanged.addListener((changes, area) => {
        if (area !== 'sync') return;
        chrome.storage.sync.get(DEFAULTS, pushSettings);
    });

    // Listen for settings requests from MAIN world
    window.addEventListener('message', (e) => {
        if (e.source !== window || !e.data) return;

        if (e.data.type === 'cleargem-get-settings') {
            chrome.storage.sync.get(DEFAULTS, pushSettings);
            return;
        }

        if (e.data.type !== 'cleargem-fetch-request') return;

        const { id, url } = e.data;
        console.log('[ClearGem Relay] Request:', url.substring(0, 80));

        chrome.runtime.sendMessage({ type: 'cleargem-fetch', url }, (resp) => {
            if (chrome.runtime.lastError) {
                console.error('[ClearGem Relay] Error:', chrome.runtime.lastError.message);
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
                dataUrl: resp?.dataUrl,
                error: resp?.error
            }, '*');
        });
    });

    console.log('[ClearGem Relay] v1.1.1 content relay loaded');
})();
