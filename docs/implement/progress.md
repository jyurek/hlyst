# Issue #3 — Subscribe to a podcast via RSS URL

## Header

- **Branch:** feat/subscribe-rss-url
- **Base branch:** main
- **PR strategy:** one
- **Skill-retro:** yes
- **Timestamp:** 2026-05-11

## Plan Summary

Install fast-xml-parser. Build RSS 2.0 + iTunes namespace parser (fetch → parse → typed structs). Build a subscriptionService that orchestrates fetch/parse/persist/delete via existing DAOs. Build LibraryScreen UI (add URL input, subscription list, delete). Wire into App.tsx.

## Stories

- [ ] TDD cycle 1: RSS parser (src/rss/parser.ts)
- [ ] TDD cycle 2: subscriptionService (src/services/subscriptionService.ts)
- [ ] Cycle 3: LibraryScreen + App wiring (verify-mode)

## PR Body Draft

## Summary
Implements RSS subscription via URL paste. Users can add a podcast by URL, see it in a library list, and remove it — all backed by the SQLite DAOs from issue #2.

## Stories completed
- [ ] RSS parser + subscription service + library UI (closes #3)

## Test plan
- RSS parser unit tests (valid feed, malformed XML, missing duration)
- Subscription service unit tests (mock DAOs)
- tsc --noEmit passes
- npm test passes
