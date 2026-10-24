# Publishing learnings_web

Preserve existing storage keys and backup compatibility. Before publishing, run `npm test`, which fingerprints the release with `scripts/prepare-release.mjs` and checks the install/update path. Publish the generated `dist/sw.js` alongside all app assets. This makes content-only releases discoverable to installed apps. Preserve browser-local work when applying updates.

## Teaching style

Start lessons with a concrete request, observation, or problem. Use specific messages and values, explain what each means and why it is needed, then introduce terminology through that example. Avoid opening with generic protocol definitions or postponing the useful example to a later lesson. Clearly distinguish live observations from authored examples. Keep questions open-ended with answer reveal and learner self-rating.
