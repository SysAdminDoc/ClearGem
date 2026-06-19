// ClearGem v1.1.0 — Options Page
'use strict';

const DEFAULTS = {
    interceptDownload: true,
    interceptCopy: true,
    autoClean: true,
    toastEnabled: true,
    toastPosition: 'bottom-right',
    toastDuration: 2500
};

const FIELDS = {
    'intercept-download': 'interceptDownload',
    'intercept-copy': 'interceptCopy',
    'auto-clean': 'autoClean',
    'toast-enabled': 'toastEnabled',
    'toast-position': 'toastPosition',
    'toast-duration': 'toastDuration'
};

function loadSettings() {
    chrome.storage.sync.get(DEFAULTS, (settings) => {
        for (const [elementId, settingKey] of Object.entries(FIELDS)) {
            const el = document.getElementById(elementId);
            if (!el) continue;
            if (el.type === 'checkbox') {
                el.checked = settings[settingKey];
            } else {
                el.value = String(settings[settingKey]);
            }
        }
    });
}

function saveSettings() {
    const settings = {};
    for (const [elementId, settingKey] of Object.entries(FIELDS)) {
        const el = document.getElementById(elementId);
        if (!el) continue;
        if (el.type === 'checkbox') {
            settings[settingKey] = el.checked;
        } else if (settingKey === 'toastDuration') {
            settings[settingKey] = parseInt(el.value, 10);
        } else {
            settings[settingKey] = el.value;
        }
    }
    chrome.storage.sync.set(settings, () => {
        const indicator = document.getElementById('saved-indicator');
        indicator.classList.add('show');
        setTimeout(() => indicator.classList.remove('show'), 1500);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadSettings();

    // Auto-save on any change
    for (const elementId of Object.keys(FIELDS)) {
        const el = document.getElementById(elementId);
        if (el) {
            el.addEventListener('change', saveSettings);
        }
    }
});
