# Publishing learnings_web

Preserve existing storage keys and backup compatibility. Before publishing, run `npm test`, which fingerprints the release with `scripts/prepare-release.mjs` and checks the install/update path. Publish the generated `dist/sw.js` alongside all app assets. This makes content-only releases discoverable to installed apps. Preserve browser-local work when applying updates.
