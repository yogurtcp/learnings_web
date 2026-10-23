# learnings_web

A blue learning desk modeled on Remember Finance. This independent course teaches internet networking through explanations, worked examples and open-ended recall.

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

`dist/content.js` contains original teaching text, model answers, answer checklists, definitions and protocol reference links. `dist/engine.js` contains pure scheduling and backup logic. `dist/app.js` implements views and interactions. Packet panels are explicitly authored examples, not live captures or simulations. Protocol references may have later updates and errata listed on their reference pages.

## Installation

Open the public site in a supported browser and click **Install app**. It uses the native installation prompt when available and otherwise explains the browser’s manual flow. iPhone/iPad users can use Safari → Share → Add to Home Screen. A service worker caches the complete course for offline use after online setup. External fonts may fall back to system fonts offline. Installation does not provide cross-device synchronization.

The application was renamed from Packet Path / Remember Networks. The existing hosting URL, repository, browser storage key and backup schema are retained to preserve existing progress and integrations.
