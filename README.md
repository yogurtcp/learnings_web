# learnings_web

**[Open learnings_web →](https://packet-path.yogurt-co.chatgpt.site)**

A blue learning desk modeled on Remember Finance. All 24 lessons teach internet networking through concrete worked cases, annotated evidence and open-ended recall. Each starts with a specific exchange or failure and explains the meaning of its fields before relying on terminology.

## Use

Start on **Today** for the next unfinished lesson and questions due for review. Each lesson has six reading steps (four explanations, a worked example, and a distinction to remember), followed by three questions. Answer aloud or type an optional draft, reveal the model answer, compare against its three key points and self-rate. All three questions must be rated to complete a lesson. A lesson can be completed with Again ratings: completion means coverage rather than mastery.

**Lessons** permits browsing or reading ahead. **Reference** searches definitions and full explanations and includes an inspectable illustrative network. **Progress** shows coverage, ratings, activity, due cards and upcoming dates. **Settings** controls review session size and exports/restores backups.

The 24 lessons cover local links, switching, subnet calculations, ARP, DHCP, routes, ICMP and MTU, NAT, IPv6, TCP connections and reliability, UDP, DNS and trust, TLS identity and setup, HTTP, HTTP/2 and HTTP/3, sessions, intermediaries, firewalls, VPNs, captures, spoofing, resource exhaustion and end-to-end diagnosis. There are 72 cards and 144 prompt phrasings. All content is supplied; no paid API or runtime generation is needed.

## Scheduling and persistence

Only cards from completed lessons appear in spaced review. Cards cycle between two phrasings. Again schedules 10 minutes, Hard at least 12 hours (prior interval ×1.2), Good at least 1 day (×2.4), Easy at least 4 days (×3.2), capped at 365 days. A new review takes the oldest due cards up to the configured session limit. Rating buttons show their actual computed intervals.

State is stored in browser localStorage under `packet-path-v1`. Drafts, notes, reading position, active question and reveal state survive navigation and reload. There is no cross-device account synchronization. Export/import JSON to move state. Restoration validates known identifiers, timestamps, text, scheduling records and session shape before requesting replacement confirmation. Invalid stored data is preserved rather than silently overwritten. Storage failures surface a banner and can be backed up from memory.

## Development

```sh
npm install
npm test
npm start
```

Open http://localhost:4387. The deployable site is the buildless `dist/` directory. No server-side data or credentials are used. The hosting identity is in `.openai/hosting.json`.

Engine and DOM tests exercise curriculum integrity, scheduling, due filtering, completion, prompt variation, draft and session persistence, reload, reference search, network inspection and backup validation. DOM tests use linkedom and are not visual browser tests. No browser was available in the creation session; visual desktop/mobile QA remains outstanding.

## Content model

`dist/content.js` assembles the course and glossary. `dist/lesson-one.js` contains the live-request opening. `dist/course-cases.js` contains the 23 rewritten worked cases, model answers and checklists; `dist/course-evidence.js` supplies self-contained question inputs; `dist/curriculum.js` preserves stable identities and protocol references. `dist/engine.js` contains pure scheduling and backup logic. `dist/app.js` implements views and interactions. Packet panels are explicitly authored examples, not live captures or simulations. Lesson 1 also includes a real same-origin HTTP request experiment showing the actual returned status, Content-Type and body. That experiment requires a connection and deliberately bypasses the app’s offline cache. Its HTTP/1.1 illustration is labeled separately from observed results. Protocol references may have later updates and errata listed on their reference pages.

## Installation

Open the public site in a supported browser and click **Install app**. It uses the native installation prompt when available and otherwise explains the browser’s manual flow. iPhone/iPad users can use Safari → Share → Add to Home Screen. A service worker caches the complete course for offline use after online setup. External fonts may fall back to system fonts offline. Installation does not provide cross-device synchronization.

The application was renamed from Packet Path / Remember Networks. The existing hosting URL, repository, browser storage key and backup schema are retained to preserve existing progress and integrations.

## Automatic updates

Installed and browser-open apps check for new releases only on startup when online. There is no recurring polling or network update check on foreground return, focus, or reconnection. Foreground return can apply an update already downloaded at startup. Registration bypasses HTTP caching for the worker; release precaching reloads all app assets before activation. A successful update takes control and reloads the app once. First-time installation does not reload.

Reload waits until an input/draft editor loses focus and the app confirms progress can be saved. A storage failure keeps the current session open for backup. Offline checks fail silently and the cached course remains available. Closed or suspended apps are subject to browser/OS scheduling and check again when reopened.

Run `node scripts/prepare-release.mjs` before publication. It fingerprints app files and updates the worker cache identity, so even a content-only change produces a discoverable release. `npm test` runs this automatically.

The opening lesson is written around fetching a concrete resource, reading the returned message, following explicit addressing fields, and interpreting failures. Rich example panels and a full-explanation route (`#reading/layers`) make the teaching available without changing a learner’s saved question session.

## Worked-case coverage

The whole course uses the concrete-case format, not only lesson 1. Cases include an empty switch forwarding table, a /26 subnet boundary, gateway resolution, a lease with an unresponsive resolver, longest-prefix routing, two translated clients, IPv6 advertisements, TCP sequence state and a missing byte range, stale UDP updates, DNS cache expiry, conflicting lookup errors, certificate-name mismatch, TLS termination, conditional HTTP caching, HTTP multiplexing, sessions and CORS, an edge cache hit, split VPN routes, an incomplete capture, forged trust claims, constrained service resources and a two-attempt diagnostic capstone.

There are 96 reading sections, 72 stable card identifiers and 144 prompt phrasings. Each non-opening question includes authored scenario givens. Definitions remain a reference aid; the lesson body supplies the concrete mechanism and its interpretation. Packet-like evidence is explicitly authored. The live HTTP experiment is separately labeled and needs connectivity.

Completions, notes, card identifiers and the startup-only update policy are preserved. Reopen the installed app online to pick up the course release.
