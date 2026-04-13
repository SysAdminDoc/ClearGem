# Changelog

All notable changes to ClearGem will be documented in this file.

## [v1.0.0] - %Y->- (HEAD -> master)

- Added: Add Chrome extension build workflow
- Added: Add @updateURL and @downloadURL to userscripts
- Fixed: Fix background fetch: add credentials:include for auth cookies
- Fixed: Fix CORS: use background service worker proxy (CDN rejects Origin header)
- Fixed: Fix CORS: use crossOrigin Image + canvas instead of fetch
- Fixed: Fix extension CORS: use declarativeNetRequest instead of background proxy
- Fixed: Fix extension CORS fetch: use base64 transfer, add debug logging
- Changed: Update README for userscript + extension install instructions
- Changed: Update README.md
- Added: Add Chrome/Firefox extension (MV3)
