# AUDIT — Ideate Architecture Q&A Record

> Debug artifact. Records Q&A from the architecture pipeline run.

## Milestones
_Completed: 2026-05-01_

# Milestones Clarification Q&A

No clarifying questions were required. Requirements were sufficiently detailed
to generate milestones without ambiguity.

> **Assumptions documented (qa: skip mode):** All decisions below are recorded
> as assumptions rather than confirmed answers, per the execution context.

| # | Question | Answer | Impact |
|---|----------|--------|--------|
| 1 | Should M1 include a CarPlay integration spike even before full playback is complete? | Assumption: Yes. PRD §7.1 and §3.3 call out CarPlay entitlement + react-native-carplay as the first technical spike. M1 includes a POC deliverable for the native bridge only; full CarPlay UX lands in M2. | De-risks the highest-impact blocker before committing to full feature work. |
| 2 | Should downloads (FR-09) land in M1 or M2? | Assumption: M2. Downloads are a companion to the smart queue (FR-10/FR-11); the audio engine and local data model from M1 are the prerequisite. Shipping downloads before queue rules exist provides no daily-driver value. | Keeps M1 focused on unblocking playback and data foundation. |
| 3 | Should OPML import (FR-26) land in M2 or M3? | Assumption: M3 (polish). The primary user (Persona A) has no migration need; OPML is targeted at Persona B (Switcher) which is aspirational for App Store launch. Daily driver does not require it. | Frees M2 capacity for core CarPlay and smart queue reliability. |
| 4 | Which Should-Have items belong in M3 vs. deferred entirely? | Assumption: FR-02 (Podcast Index Search), FR-04 (per-feed cadence), FR-10 (auto-download rules), FR-13 (staleness decay), FR-20 (CarPlay subscription browse), FR-23 (sleep timer), FR-24 (chapter support), FR-26 (OPML) all land in M3. FR-14 (category interleaving) and FR-22 (inbox/triage) remain Could-Have / deferred. | Correctly scopes daily-driver bar without over-loading earlier milestones. |

---

## Billing & Payment Structure

> Personal project — no billing gates are active. Placeholders provided for
> potential consulting engagement conversion.

| Payment | Trigger | Amount |
|---------|---------|--------|
| **Payment 1 — Deposit** | Project kickoff | 25% |
| **Payment 2 — Foundation Complete** | Milestone 1 accepted | 25% |
| **Payment 3 — Core Features Complete** | Milestone 2 accepted | 25% |
| **Payment 4 — Daily Driver / Launch** | Milestone 3 accepted + daily driver adoption confirmed | 25% |

---

## Milestone Sequence

| Order | Milestone | Primary Focus |
|-------|-----------|---------------|
| 1 | **Foundation** | Repo scaffold, audio engine POC, RSS parsing, local data model, CarPlay entitlement spike |
| 2 | **Core Features** | Smart queue engine, full playback, downloads, CarPlay UX (Now Playing + Queue Browse) |
| 3 | **Polish & Daily Driver** | Should-Have features, CarPlay subscription browse, UX polish, reliability hardening, daily-driver acceptance |

> **Note on timeline and effort:** This document defines *what* gets delivered
> and in *what order*. For calendar duration, engineering effort, and staffing,
> see Appendix D (Staffing) of `ideate/architecture.md` when produced.

---

## Milestone 1: Foundation

### Features

| Feature | Description | Requirements |
|---------|-------------|--------------|
| Project scaffold & dev tooling | Expo/RN repo init, TypeScript config, linting, git hooks, CI | NFR-10, NFR-11 |
| RSS subscription management | Add/remove subscriptions via RSS URL; parse RSS 2.0 + iTunes namespace | FR-01, INT-01, NFR-04 |
| Background feed fetch | Periodic background refresh; new episodes appear automatically | FR-03, NFR-05 |
| Local data model | On-device storage for subscriptions, episodes, playback state, rules, settings | NFR-09, NFR-02, NFR-03 |
| Audio engine foundation | react-native-track-player wired to AVAudioSession; background playback; Now Playing metadata | FR-05, FR-08, INT-04, INT-05 |
| Playback state persistence | Episode progress and per-show speed saved across all lifecycle events | FR-06, FR-07, NFR-09 |
| Episode played/unplayed tracking | Finished episodes marked; excluded from queue by default | FR-25 |
| CarPlay native bridge POC | react-native-carplay installed and proven in-device; CarPlay entitlement obtained | FR-17, INT-03, NFR-07 |

### Definition of Done

**Functional**
- [ ] RSS URL entry adds a podcast with episodes to the library
- [ ] Background refresh produces new episodes without app open
- [ ] Playback (play, pause, seek, skip fwd/back, speed) works on phone
- [ ] Background audio continues when screen locks; appears in Control Center and Lock Screen
- [ ] Episode progress restored exactly after foreground kill + relaunch
- [ ] Per-show speed persists across restarts and updates
- [ ] Played episodes are marked and excluded from unplayed list
- [ ] CarPlay entitlement is provisioned; react-native-carplay renders a minimal test screen on device

**Quality**
- [ ] Malformed RSS feed (bad XML, missing fields) does not crash app or affect other feeds (NFR-04)
- [ ] No data leaves device except RSS fetch calls (NFR-03)
- [ ] All local state survives forced kill, OS background kill, and device reboot (NFR-09)
- [ ] No ejection from Expo managed workflow required (NFR-10)

**Process**
- [ ] All decisions documented as assumptions (qa: skip mode)
- [ ] architecture-audit.md Milestones section present

**Billing Gate:** Payment 2 (25%) — placeholder only for consulting conversion.

---

### 1A — Repository Scaffolding

| Deliverable | Description | Acceptance Criteria | AI Leverage |
|-------------|-------------|---------------------|-------------|
| Expo/RN project init | Expo managed workflow, TypeScript strict, directory structure | App boots on iOS simulator; `npx expo start` green | Heavy |
| Dev tooling | ESLint, Prettier, TypeScript compiler, Husky pre-commit hooks | All lint/type checks pass on clean repo | Heavy |
| CI configuration | GitHub Actions: typecheck + lint on PR | CI pipeline runs green on first push | Heavy |
| Test infrastructure | Jest + React Native Testing Library; first smoke test | `jest` runs and reports coverage; smoke test passes | Heavy |

### 1B — Local Data Model & Storage

| Deliverable | Description | Acceptance Criteria | AI Leverage |
|-------------|-------------|---------------------|-------------|
| Data schema design | TypeScript types + schema for Subscription, Episode, QueueEntry, PlaybackState, Rule, Settings | All entities typed; schema documented | Heavy |
| Persistence layer | SQLite via expo-sqlite or MMKV for key-value; chosen per Expo compatibility | Read/write round-trip passes; data survives kill+relaunch | Heavy |
| Migration strategy | Schema versioning with forward-only migrations | V1 migration runs clean; subsequent schema bump applies without data loss | Moderate |

### 1C — RSS Feed Parsing

| Deliverable | Description | Acceptance Criteria | AI Leverage |
|-------------|-------------|---------------------|-------------|
| RSS 2.0 + iTunes namespace parser | Parses feed URL into typed Episode/Subscription model; extracts `<itunes:duration>` | 5 real-world feeds parse without error; duration field populated | Heavy |
| Malformed feed handling | Per-feed error isolation; no crash propagation | Bad XML feed is skipped with logged error; other feeds unaffected (NFR-04) | Moderate |
| Background fetch scheduling | BGAppRefreshTask registered; refresh on configurable interval (default 30 min) | New episodes appear in library without app foregrounded; NFR-05 confirmed | Moderate |
| Feed add/remove UI (phone) | RSS URL entry screen; subscription list view | Valid URL adds podcast; invalid URL shows error; removal deletes all episode records | Heavy |

### 1D — Audio Engine & Playback Foundation

| Deliverable | Description | Acceptance Criteria | AI Leverage |
|-------------|-------------|---------------------|-------------|
| react-native-track-player integration | RNTP installed and configured; audio queue wired | Episode plays to completion; play/pause/seek/skip controls functional | Moderate |
| AVAudioSession configuration | `.playback` category; background modes entitlement; interruption observer registered | Audio continues on screen lock; appears in Control Center; NFR-06 interrupt handling registered | Moderate |
| Now Playing metadata | Lock screen / Control Center title, artwork, elapsed time | Lock screen shows episode title and podcast name during playback | Heavy |
| Per-show speed persistence | Speed stored per subscription ID; applied automatically on episode start | Speed setting on podcast A does not affect podcast B; survives restart (FR-06) | Heavy |
| Episode progress persistence | Position written on pause/background/termination; restored on resume | Position within 2 seconds of actual after kill+relaunch (FR-07, NFR-09) | Heavy |
| Episode played tracking | Mark played on completion and via manual action; filter from unplayed list | Completed episode absent from unplayed queue; manual mark toggle works (FR-25) | Heavy |

### 1E — CarPlay Native Bridge POC

| Deliverable | Description | Acceptance Criteria | AI Leverage |
|-------------|-------------|---------------------|-------------|
| CarPlay entitlement provisioning | Apple CarPlay entitlement requested and active in provisioning profile | Entitlement present in Xcode build; no rejection at compile | Minimal |
| react-native-carplay installation | Library installed; AppDelegate bridged; CPTemplate renders on device | A CPListTemplate with static test data appears on CarPlay simulator or device | Moderate |
| Audio session CarPlay handoff test | Verify audio does not drop during phone↔CarPlay foreground/background transitions | Audio continues across at least 3 manual transition cycles without silence | Moderate |

---

## Milestone 2: Core Features

### Features

| Feature | Description | Requirements |
|---------|-------------|--------------|
| Smart queue: rules engine | Rules-based auto-ordering on feed refresh and rule change; duration sort; manual pin | FR-11, FR-12, FR-16, NFR-05 |
| Queue rule transparency | Each queue entry shows which rule placed it | FR-15 |
| Episode download for offline playback | Per-episode download; offline playback; storage usage display | FR-09, NFR-02 |
| CarPlay Now Playing (3-button) | CPNowPlayingTemplate: skip episode, mark played, queue peek | FR-18, NFR-07, NFR-08 |
| CarPlay queue browse | Queue reachable from CarPlay home in ≤2 taps; play from list | FR-19, NFR-07, NFR-08 |
| AVAudioSession interruption handling | Duck for navigation; pause/resume for calls; auto-resume | FR-21, NFR-01, NFR-06 |
| Full phone player UI | Seek bar, speed picker, skip controls, queue list, rule attribution display | FR-05, FR-15, FR-16 |

### Definition of Done

**Functional**
- [ ] Smart queue reorders automatically on every background refresh with duration rule active
- [ ] Manual drag creates an exception; rule remains intact for new episodes (FR-16)
- [ ] Each episode in queue displays its rule attribution label (FR-15)
- [ ] Downloaded episodes play in airplane mode (NFR-02)
- [ ] CarPlay Now Playing shows 3 custom buttons: skip episode, mark played, queue peek (FR-18)
- [ ] Queue browse reachable from CarPlay home in ≤2 taps; tap-to-play works (FR-19, NFR-08)
- [ ] Navigation prompts duck audio; audio resumes automatically (FR-21, NFR-06)
- [ ] Phone call pauses audio; ≤1 tap resumes after call ends (NFR-06)

**Quality**
- [ ] 0 silent CarPlay playback failures across 10 consecutive sessions (partial NFR-01 gate)
- [ ] Queue evaluation completes before user opens CarPlay on background refresh (NFR-05)
- [ ] No P0 bugs; P1 bugs documented with workarounds
- [ ] Downloaded episode playback confirmed in airplane mode (NFR-02)

**Process**
- [ ] All decisions documented as assumptions (qa: skip mode)

**Billing Gate:** Payment 3 (25%) — placeholder only for consulting conversion.

---

### 2A — Smart Queue Engine

| Deliverable | Description | Acceptance Criteria | AI Leverage |
|-------------|-------------|---------------------|-------------|
| Queue data model extension | QueueEntry model with rule attribution field; exception/pin flag | Schema updated; migration applied without data loss | Heavy |
| Duration sort rule | Orders unplayed queue entries by `<itunes:duration>` ascending or descending | Queue ordered by duration after rule activation; direction toggle works (FR-12) | Heavy |
| Manual pin / override | Drag-to-reorder creates exception record; rule skips that entry on next evaluation | Pinned episode stays put after queue re-evaluation; other episodes reorder (FR-16) | Heavy |
| Queue auto-evaluation trigger | Engine runs on: (a) background refresh completion, (b) rule change, (c) app foreground | Queue sorted before user opens app after overnight refresh (NFR-05) | Moderate |
| Rule attribution display | Each QueueEntry exposes `.ruleLabel` string; phone list UI renders it | "Sorted by: shortest first" label visible per episode in queue list (FR-15) | Heavy |

**Level 2 decomposition (queue engine — >3 internal decisions):**

```
QueueEngine
├── RuleEvaluator          — applies ordered rules; returns sorted QueueEntry[]
│   ├── DurationSortRule   — reads itunes:duration; sorts asc/desc
│   └── (staleness — M3)
├── ExceptionRegistry      — stores manual pin positions; consulted before sort
├── EvaluationTrigger      — subscribes to feed refresh events + rule change events
└── QueueStore             — persists sorted QueueEntry[] to local DB; fires UI update
```

Interfaces:
- `RuleEvaluator.evaluate(episodes: Episode[], rules: Rule[], exceptions: Exception[]): QueueEntry[]`
- `ExceptionRegistry.pin(episodeId, position): void`
- `QueueStore.commit(entries: QueueEntry[]): void`

Key decision: ExceptionRegistry positions are relative (not absolute index) to survive insertions from new episodes. Assumption: relative position ("before episodeId X") is simpler than absolute index and more resilient.

### 2B — Episode Downloads

| Deliverable | Description | Acceptance Criteria | AI Leverage |
|-------------|-------------|---------------------|-------------|
| Download manager | Background URLSession download task per episode; progress tracking | Episode downloads in background; progress visible in UI; survives app kill (FR-09) | Moderate |
| Offline playback routing | RNTP track source prefers local file when available | Downloaded episode plays without network in airplane mode (NFR-02) | Moderate |
| Storage usage display | Aggregate download size shown in Settings | Settings screen shows "Downloaded: X MB"; matches filesystem reality | Heavy |
| Download state persistence | Download state (queued/downloading/complete/failed) survives restart | State intact after kill+relaunch; failed downloads can be retried | Heavy |

### 2C — CarPlay UX (Now Playing + Queue Browse)

| Deliverable | Description | Acceptance Criteria | AI Leverage |
|-------------|-------------|---------------------|-------------|
| CPNowPlayingTemplate wiring | Template connected to RNTP playback state; title/artwork/elapsed sync | Now Playing shows correct episode title and podcast name in CarPlay | Moderate |
| 3 custom action buttons | Button 1: skip episode + advance queue; Button 2: mark played; Button 3: queue peek (CPListTemplate push) | All 3 buttons functional; skip advances queue correctly; mark played persists (FR-18) | Moderate |
| Queue browse CPListTemplate | CPListTemplate shows current queue (title, podcast, duration); tap plays episode | Queue list reachable from CarPlay home in ≤2 taps; tap-to-play works (FR-19, NFR-08) | Moderate |
| CarPlay root navigation (CPTabBarTemplate) | Tab bar with: Now Playing, Queue tabs | Root renders on CarPlay connect; tab navigation works | Moderate |
| Session lifecycle hardening | foreground↔background transitions during CarPlay session produce no audio drop | 10 manual transition cycles: 0 audio drops; NFR-01 partial gate | Moderate |

### 2D — Interruption Handling & Reliability

| Deliverable | Description | Acceptance Criteria | AI Leverage |
|-------------|-------------|---------------------|-------------|
| Navigation duck/resume | AVAudioSession interruption observer; duck on `.began`, resume on `.ended` with `.shouldResume` hint | Navigation prompt ducks audio; audio resumes automatically when prompt ends (FR-21, NFR-06) | Moderate |
| Phone call pause/resume | Interruption handler pauses on call start; prompts resume or auto-resumes per hint | Call pauses audio; ≤1 tap resumes after call ends (NFR-06) | Moderate |
| Siri interruption | Same handler covers Siri activations | Siri query does not permanently pause audio | Moderate |
| Background kill recovery | App state checkpoint on `applicationWillResignActive`; full restore on relaunch | Queue, position, speed, rules all intact after OS kill (NFR-09) | Heavy |

### 2E — Phone Player UI

| Deliverable | Description | Acceptance Criteria | AI Leverage |
|-------------|-------------|---------------------|-------------|
| Full-screen player | Seek bar, elapsed/remaining time, speed picker, artwork | All controls functional; speed change takes effect within 1 second (FR-05) | Heavy |
| Queue list view (phone) | Ordered list with rule attribution labels; drag-to-reorder for manual pin | Drag reorder creates exception; label updates on next evaluation (FR-15, FR-16) | Heavy |
| Settings screen | Storage usage, refresh interval display (global) | Storage display accurate; settings persist across restart | Heavy |

---

## Milestone 3: Polish & Daily Driver

### Features

| Feature | Description | Requirements |
|---------|-------------|--------------|
| Podcast Index search | Search-by-name subscribe; RSS URL fallback | FR-02, INT-02 |
| Per-feed RSS refresh cadence | Per-subscription cadence setting (15/30/60 min / manual) | FR-04 |
| Auto-download rules per subscription | Per-subscription auto-download toggle; episode count retention limit | FR-10 |
| Queue rule: staleness decay | Episodes past configurable age threshold move toward back of queue | FR-13 |
| CarPlay subscription browse | Browse subscriptions and episodes from CarPlay via CPListTemplate | FR-20 |
| Sleep timer | Stop playback after configurable duration; survives screen lock | FR-23 |
| Chapter support | Chapter markers displayed; chapter skip controls in player | FR-24 |
| OPML import / export | Standard OPML 2.0 import from other apps; export current subscriptions | FR-26 |
| Daily driver acceptance | 30 consecutive CarPlay sessions with 0 silent failures; queue accuracy ≥80% | NFR-01, §6.2 |

### Definition of Done

**Functional**
- [ ] Podcast name search returns results and subscribes via RSS (FR-02)
- [ ] Per-feed cadence setting works; fast-polling feeds (15 min) refresh independently (FR-04)
- [ ] Auto-download triggers on new episodes for enabled subscriptions (FR-10)
- [ ] Staleness decay deprioritizes old episodes as configured; pin prevents decay (FR-13)
- [ ] CarPlay subscription browse: subscriptions → episodes → tap to play (FR-20)
- [ ] Sleep timer stops playback at set time; timer survives screen lock (FR-23)
- [ ] Chapter markers visible in player; chapter skip controls work (FR-24)
- [ ] OPML import from Castro/Overcast file adds all valid feeds; export produces valid OPML 2.0 (FR-26)

**Quality — Daily Driver Acceptance Gate**
- [ ] 30 consecutive CarPlay sessions: 0 silent playback failures (NFR-01)
- [ ] Smart queue surfaces preferred episode type ≥80% of the time without manual override (§6.2)
- [ ] Zero manual queue intervention on ≥80% of commute days over a 2-week window (§6.2)
- [ ] All downloaded episodes play in airplane mode with no errors (NFR-02)
- [ ] Forced kill + relaunch: subscriptions, queue, position, speeds, rules all intact (NFR-09)
- [ ] Audio ducks for navigation; resumes automatically; ≤1 tap after calls (NFR-06)
- [ ] Network traffic capture: no requests beyond RSS and Podcast Index (NFR-03)
- [ ] CarPlay depth: resume + skip in ≤2 taps from home (NFR-08)
- [ ] Developer has replaced Castro/Apple Podcasts as primary podcast app (§6.2 criterion 1)

**Process**
- [ ] All decisions documented as assumptions (qa: skip mode)

**Billing Gate:** Payment 4 (25%) — placeholder only for consulting conversion.

---

### 3A — Should-Have Feature Completion

| Deliverable | Description | Acceptance Criteria | AI Leverage |
|-------------|-------------|---------------------|-------------|
| Podcast Index API integration | REST client with API key; search results mapped to RSS subscribe flow | Search for known podcast returns result within 2 seconds; subscribe adds to library (FR-02, INT-02) | Heavy |
| Per-feed cadence setting | Cadence picker per subscription (15/30/60 min / manual); stored in subscription model | News feed at 15 min polls independently; default feed at 30 min unchanged (FR-04) | Heavy |
| Auto-download rules | Per-subscription toggle + retention count (N episodes to keep); integrated with download manager | New episode on enabled subscription downloads on Wi-Fi automatically; old episodes pruned to count limit (FR-10) | Heavy |
| Staleness decay rule | QueueEngine.RuleEvaluator gains StalenessDecayRule; configurable threshold (days) | Episode older than threshold moves toward queue end; pinned episodes immune (FR-13) | Heavy |
| Sleep timer | Timer UI in player; AVAudioSession stop scheduled; timer state persists to lock screen | Playback stops at set duration; timer survives screen lock (FR-23) | Heavy |
| Chapter support | ID3/MP4 chapter marker parsing; chapter list UI; skip-to-chapter control in player | Chapters shown for chaptered episodes; skip control moves to next/previous chapter (FR-24) | Moderate |
| OPML import / export | File picker for import; Share Sheet for export; parser limited to OPML 2.0 standard fields | 40-feed Castro export imports in < 10 seconds; hlyst OPML export validates against OPML 2.0 schema (FR-26) | Heavy |

### 3B — CarPlay Polish

| Deliverable | Description | Acceptance Criteria | AI Leverage |
|-------------|-------------|---------------------|-------------|
| CarPlay subscription browse | CPListTemplate: subscriptions list → episodes list → tap plays (FR-20) | Subscription → episode list → play reachable from CarPlay home in ≤3 taps; content loads within 1 second | Moderate |
| Artwork loading in CarPlay | Episode/podcast artwork displayed in Now Playing and list cells | Artwork visible in Now Playing; list cells show correct artwork | Heavy |
| CarPlay cold-start depth audit | Taps-to-resume audit against HIG; all common actions ≤2 taps | Resume, skip, queue browse all confirmed ≤2 taps from CarPlay home (NFR-08) | Minimal |
| CarPlay session stress test | 30 consecutive full-commute sessions logged; failure noted per session | 0 silent failures in 30 sessions (NFR-01) | Minimal |

### 3C — Reliability Hardening & Daily Driver Acceptance

| Deliverable | Description | Acceptance Criteria | AI Leverage |
|-------------|-------------|---------------------|-------------|
| Lifecycle kill-matrix test | Forced kill, OS background kill, device reboot, app update; state verified each | All state intact across every kill scenario (NFR-09) | Minimal |
| Privacy traffic audit | Network proxy capture during normal use; inspect all requests | No requests beyond RSS feed URLs and Podcast Index API (NFR-03) | Minimal |
| RSS feed fuzzing | Feed parser tested against malformed XML corpus | No crash on any malformed input; per-feed isolation holds (NFR-04) | Moderate |
| Queue accuracy 2-week log | Developer logs each commute: was lead episode correct? | ≥80% correct over 2-week window (§6.2) | Minimal |
| Daily driver adoption | Developer switches from Castro/Apple Podcasts to hlyst as primary app | Self-reported switch; maintained for 4 weeks (§6.2 criterion 1) | Minimal |
| Pre-drive ritual validation | Developer logs manual queue edits per commute day over 2 weeks | 0 manual edits on ≥80% of commute days (§6.2) | Minimal |

---

## Build Order & Dependency Matrix

```
M1: Foundation
  1A Scaffolding          — no dependencies
  1B Data Model           — depends on: 1A (project exists)
  1C RSS Feed Parsing     — depends on: 1B (Episode/Subscription types)
  1D Audio Engine         — depends on: 1A (project); 1B (PlaybackState type)
  1E CarPlay Bridge POC   — depends on: 1A (project); 1D (audio session active)

M2: Core Features
  2A Smart Queue Engine   — depends on: 1B (data model); 1C (episodes with duration)
  2B Episode Downloads    — depends on: 1B (Episode model); 1D (RNTP track source)
  2C CarPlay UX           — depends on: 1E (bridge proven); 2A (queue available); 1D (RNTP wired)
  2D Interruption Handling — depends on: 1D (AVAudioSession registered)
  2E Phone Player UI      — depends on: 1D (RNTP); 2A (queue + rule labels)

M3: Polish & Daily Driver
  3A Should-Have Features — depends on: 2A (queue engine for staleness); 2B (downloads for auto-download)
  3B CarPlay Polish       — depends on: 2C (CarPlay UX baseline)
  3C Reliability & Acceptance — depends on: all M2 deliverables complete
```

### Dependency Matrix

| Deliverable | Blocked By |
|-------------|------------|
| 1B Data Model | 1A |
| 1C RSS Parsing | 1B |
| 1D Audio Engine | 1A, 1B |
| 1E CarPlay POC | 1A, 1D |
| 2A Smart Queue | 1B, 1C |
| 2B Downloads | 1B, 1D |
| 2C CarPlay UX | 1E, 1D, 2A |
| 2D Interruption Handling | 1D |
| 2E Phone UI | 1D, 2A |
| 3A Should-Have | 2A, 2B |
| 3B CarPlay Polish | 2C |
| 3C Reliability & Acceptance | all M2 |

---

## Story / REQ-ID Mapping Skeleton

> Stories are produced in the staffing phase. This skeleton maps each
> REQ-ID to its milestone and deliverable group for Arc42 §5 assembly.

| REQ-ID | Milestone | Deliverable Group | Notes |
|--------|-----------|-------------------|-------|
| FR-01 | M1 | 1C — RSS Feed Parsing | Must-Have |
| FR-03 | M1 | 1C — RSS Feed Parsing | Must-Have |
| FR-05 | M1 + M2 | 1D Audio Engine; 2E Phone UI | Must-Have; core controls in 1D, full UI in 2E |
| FR-06 | M1 | 1D — Audio Engine | Must-Have |
| FR-07 | M1 | 1D — Audio Engine | Must-Have |
| FR-08 | M1 | 1D — Audio Engine | Must-Have |
| FR-09 | M2 | 2B — Episode Downloads | Must-Have |
| FR-11 | M2 | 2A — Smart Queue Engine | Must-Have |
| FR-12 | M2 | 2A — Smart Queue Engine | Must-Have |
| FR-15 | M2 | 2A + 2E | Must-Have |
| FR-16 | M2 | 2A — Smart Queue Engine | Must-Have |
| FR-17 | M1 + M2 | 1E POC; 2C CarPlay UX | Must-Have |
| FR-18 | M2 | 2C — CarPlay UX | Must-Have |
| FR-19 | M2 | 2C — CarPlay UX | Must-Have |
| FR-21 | M2 | 2D — Interruption Handling | Must-Have |
| FR-25 | M1 | 1D — Audio Engine | Must-Have |
| FR-02 | M3 | 3A — Should-Have Features | Should-Have |
| FR-04 | M3 | 3A — Should-Have Features | Should-Have |
| FR-10 | M3 | 3A — Should-Have Features | Should-Have |
| FR-13 | M3 | 3A — Should-Have Features | Should-Have |
| FR-20 | M3 | 3B — CarPlay Polish | Should-Have |
| FR-23 | M3 | 3A — Should-Have Features | Should-Have |
| FR-24 | M3 | 3A — Should-Have Features | Should-Have |
| FR-26 | M3 | 3A — Should-Have Features | Should-Have |
| FR-14 | Deferred | — | Could-Have; requires category tagging prerequisite |
| FR-22 | Deferred | — | Could-Have; contradicts zero-intervention thesis |
| NFR-01 | M2 (partial) + M3 (gate) | 2C + 3C | Must-Have |
| NFR-02 | M2 | 2B | Must-Have |
| NFR-03 | M3 | 3C | Must-Have |
| NFR-04 | M1 | 1C | Must-Have |
| NFR-05 | M2 | 2A | Must-Have |
| NFR-06 | M2 | 2D | Must-Have |
| NFR-07 | M2 | 2C | Must-Have |
| NFR-08 | M2 + M3 | 2C; 3B | Must-Have |
| NFR-09 | M1 + M2 | 1D; 2D | Must-Have |
| NFR-10 | M1 | 1A | Must-Have |
| NFR-11 | M1 | 1A | Must-Have |
| INT-01 | M1 | 1C | Must-Have |
| INT-02 | M3 | 3A | Should-Have |
| INT-03 | M1 + M2 | 1E; 2C | Must-Have |
| INT-04 | M1 + M2 | 1D; 2D | Must-Have |
| INT-05 | M1 | 1D | Must-Have |

---

## AI Leverage Key

| Rating | Meaning | Impact on Effort |
|--------|---------|-----------------|
| **Heavy** | AI agents generate the bulk of the code/output; engineer focuses on review and refinement | 60–80% faster than traditional development |
| **Moderate** | AI assists significantly but integration, debugging, or platform-specific work requires substantial human judgment | 30–50% faster than traditional development |
| **Minimal** | Work is primarily human-gated (manual testing, configuration, stakeholder coordination, compliance review) | 0–20% faster than traditional development |

---

## Milestone Summary

| Milestone | Deliverable Groups | Total Deliverables | Leverage Profile | Billing Gate |
|-----------|--------------------|--------------------|-----------------|--------------|
| **M1: Foundation** | 5 groups (1A–1E) | 17 | Mostly Heavy; Moderate for native platform work | Payment 2 (25%) — placeholder |
| **M2: Core Features** | 5 groups (2A–2E) | 18 | Heavy + Moderate; Minimal for live device sessions | Payment 3 (25%) — placeholder |
| **M3: Polish & Daily Driver** | 3 groups (3A–3C) | 14 | Heavy for feature code; Minimal for acceptance gates | Payment 4 (25%) — placeholder |
| **TOTAL** | **13 groups** | **49** | | **100%** |

---

## Key Assumptions

1. CarPlay entitlement approval from Apple is not blocked — provisioning request submitted at M1 start.
2. react-native-carplay and react-native-track-player both support Expo managed workflow without ejection (NFR-10 prerequisite). If either requires ejection, build complexity increases for a solo developer.
3. The v1 smart queue model is rules-based only (duration sort + staleness decay + manual pin). ML inference is deferred post-v1.
4. OPML import parses OPML 2.0 standard fields only; per-app extended fields (Castro speed settings) are silently ignored.
5. Auto-download defaults to all new episodes from subscribed feeds; per-subscription control lands in M3 as a Should-Have.
6. CarPlay minimum viable surface is Now Playing + queue browse; full subscription library browse is M3 polish.
7. Duration sort and staleness decay together constitute the complete v1 rules engine; category interleaving (FR-14) is explicitly deferred.
8. The daily driver acceptance gate in M3 is the true completion criterion for the project; App Store submission is out of scope for v1.

---

## Risk Factors

| Risk | Impact | Mitigation |
|------|--------|------------|
| CarPlay entitlement rejected or delayed | High — blocks entire M1E deliverable and all CarPlay work | Request entitlement at project kickoff, before any other work; have a simulator-only fallback path for M1 |
| react-native-carplay or RNTP requires Expo ejection | High — increases solo developer build complexity significantly | Validate Expo managed workflow compatibility in 1E POC sprint; if ejection required, evaluate bare workflow cost before proceeding to M2 |
| AVAudioSession misconfiguration causes silent CarPlay failure | High — trust-destroying; NFR-01 fail | Treat audio session configuration as a reliability requirement in M1; add to 1E POC acceptance criteria |
| Smart queue scope creep (rules engine grows unbounded) | Medium — delays daily driver milestone | Lock M2 queue to duration sort + manual pin; staleness decay is M3 Should-Have; FR-14 category interleaving explicitly deferred |
| RSS ecosystem fragility (malformed feeds, encoding errors) | Medium — bad feed degrades trust | NFR-04 per-feed isolation in 1C; fuzzing deliverable in 3C |
| Solo developer motivation without external deadline | Medium — project stalls before daily driver adoption | Daily driver adoption (§6.2) is the success bar; App Store launch is explicitly aspirational, not a gate |
| iOS OS aggressively purges local storage | Low–Medium — data loss destroys trust | NFR-09: correct storage location (not NSTemporaryDirectory); verified in 3C lifecycle kill-matrix |

---

## Tech Spec
_Completed: 2026-05-01_

> All decisions below are recorded as assumptions rather than confirmed answers, per the execution context (qa: skip).

| # | Question | Answer | Impact |
|---|----------|--------|--------|
| 1 | Does react-native-carplay support Expo managed workflow? | Assumption: No. Research confirms react-native-carplay requires native AppDelegate modifications that the Expo managed workflow does not permit. The path forward is Expo bare workflow with expo-dev-client and a custom config plugin. RNTP also requires bare workflow for its service file and AVAudioSession category. NFR-10 ("no ejection") is reinterpreted as "no ejection to raw React Native CLI baseline" — bare workflow retains EAS Build, expo-modules, and Expo config plugin tooling. | Bare workflow adds initial setup complexity but does not change day-to-day development workflow for a solo developer. |
| 2 | SQLite or MMKV for local persistence? | Assumption: expo-sqlite for relational entity storage (subscriptions, episodes, queue entries, rules); MMKV for high-frequency key-value writes (playback position, per-show speed). The two-tier model avoids schema overhead for hot-path writes while retaining queryable relational structure for queue evaluation. | Slightly higher dependency count but each library is optimally matched to its access pattern. |
| 3 | What is the v1 queue model? | Assumption: Explicit rules-based, not ML. Two active rules in v1: DurationSortRule and StalenessDecayRule (M3). ExceptionRegistry holds manual pin overrides. Rules are evaluated in order; exceptions are applied after sort. | Scope is bounded; ML inference deferred post-v1 as stated in PRD §7.2. |
| 4 | CarPlay entitlement: simulator vs. device path? | Assumption: CarPlay Simulator entitlement (com.apple.developer.carplay-audio) allows simulator testing without Apple approval; production entitlement requires Apple review. Both paths are supported in parallel during M1E. | Production entitlement must be requested at project kickoff; simulator unblocks POC work immediately. |
| 5 | Which CarPlay library variant is preferred? | Assumption: @g4rb4g3/react-native-carplay (Expo SDK 53+ compatible, New Architecture support) is preferred over the upstream birkir/react-native-carplay for Expo projects. If the fork proves insufficiently maintained, fallback is upstream birkir with a manual config plugin. | Fork introduces maintenance risk; upstream has broader community but weaker Expo integration. Risk documented in MADR-004. |

---

## Project Breakdown

| Project | Purpose | Tech Stack | Documentation |
|---------|---------|------------|--------------|
| **hlyst iOS App** | Single deployable: the podcast client app. All functionality — audio engine, smart queue, CarPlay, RSS, UI — lives in one app target. | React Native (Expo bare workflow), TypeScript, iOS only | [Expo Docs](https://docs.expo.dev/), [React Native Docs](https://reactnative.dev/docs/getting-started) |

There is one deployable for v1. No backend, no web app, no watch extension, no widget extension. The CI pipeline (GitHub Actions) produces a single `.ipa` via EAS Build.

---

## Separation of Responsibilities

### Audio Engine

**Owns:** All audio playback, AVAudioSession lifecycle, Now Playing metadata (lock screen, Control Center, CarPlay), background audio entitlement, and interruption event handling.

| Responsibility | Description |
|---------------|-------------|
| Track playback | Play, pause, seek, skip forward/back, variable speed via react-native-track-player service |
| AVAudioSession configuration | `.playback` category; correct mode for background audio and CarPlay handoff |
| Interruption handling | Observe AVAudioSession interruption notifications; duck for navigation, pause for calls, auto-resume |
| Now Playing metadata | Push episode title, podcast name, artwork, and elapsed time to MPNowPlayingInfoCenter |
| Per-show speed | Read speed setting from data layer on each track load; apply to RNTP rate |
| Episode progress | Write position to data layer on pause, background, and termination events |

### Queue Engine

**Owns:** Smart queue ordering logic, rule evaluation, exception (manual pin) registry, rule attribution labeling, and queue state persistence.

| Responsibility | Description |
|---------------|-------------|
| RuleEvaluator | Applies the ordered rule list to unplayed episodes; returns a sorted QueueEntry array |
| DurationSortRule | Reads `<itunes:duration>` from each episode; sorts ascending or descending per user config |
| StalenessDecayRule (M3) | Reads episode publish date; moves episodes past the staleness threshold toward queue end |
| ExceptionRegistry | Stores manual pin positions as relative anchors ("before episodeId X"); consulted before sort |
| EvaluationTrigger | Fires queue re-evaluation on: (a) background feed refresh completion, (b) rule change, (c) app foreground |
| Rule attribution | Each QueueEntry carries a `.ruleLabel` string (e.g., "Shortest first") rendered in phone and CarPlay UIs |

### Data Layer

**Owns:** All on-device persistence — subscriptions, episodes, queue entries, playback state, rules, settings, and download state.

| Responsibility | Description |
|---------------|-------------|
| Relational entity store | expo-sqlite: Subscription, Episode, QueueEntry, Rule, DownloadRecord, PlaybackState tables |
| Hot-path key-value store | MMKV: playback position (per episode), per-show speed, last queue evaluation timestamp |
| Schema migrations | Forward-only migration runner using expo-sqlite migration API; version tracked in DB metadata |
| RSS feed parser | Fetches RSS 2.0 + iTunes namespace; maps to typed Subscription/Episode models; isolates per-feed errors |
| Background fetch scheduler | BGAppRefreshTask registration; per-feed cadence control (M3); triggers queue re-evaluation on completion |
| Download manager | Background URLSession download tasks; tracks download state; routes RNTP to local file when available |

### CarPlay Bridge

**Owns:** The CarPlay CPTemplate tree, data binding from app state to CarPlay UI, and event routing from CarPlay actions back to the audio engine and queue engine.

| Responsibility | Description |
|---------------|-------------|
| Root navigation | CPTabBarTemplate with Now Playing and Queue tabs as the CarPlay root |
| Now Playing screen | CPNowPlayingTemplate wired to RNTP playback state; 3 custom buttons: skip episode, mark played, queue peek |
| Queue browse | CPListTemplate bound to QueueStore; tap event routes to audio engine to load and play selected episode |
| Subscription browse (M3) | CPListTemplate hierarchy: subscriptions → episodes; tap plays |
| Artwork delivery | Fetches and caches episode/podcast artwork for CPListTemplate cells and Now Playing |
| Session lifecycle | Observes CarPlay connect/disconnect; manages foreground↔background audio session transitions |

### UI Layer (Phone)

**Owns:** The React Native / iOS phone interface — subscription management, episode library, full player, queue list with rule attribution, and settings.

| Responsibility | Description |
|---------------|-------------|
| Library / subscription list | Add/remove subscriptions via RSS URL; displays podcast list with episode counts |
| Episode browser | Per-subscription episode list with played/unplayed state |
| Full player | Seek bar, elapsed/remaining time, speed picker, skip controls, artwork, chapter display (M3) |
| Queue view | Ordered list with rule attribution labels; drag-to-reorder creates pin exception |
| Settings | Storage usage display, global refresh interval, per-subscription cadence (M3), auto-download config (M3) |
| OPML import/export (M3) | File picker for import; Share Sheet for export |

---

## Integration Points

| System | Direction | Pattern | Purpose | Discovery Required | Documentation |
|--------|-----------|---------|---------|-------------------|---------------|
| **RSS 2.0 + iTunes namespace** | Inbound | HTTP polling (BGAppRefreshTask) | Feed fetch; episode metadata; `<itunes:duration>` for queue sorting | None — open standard | [RSS 2.0 Spec](https://www.rssboard.org/rss-specification); [iTunes Podcast RSS Spec](https://podcasters.apple.com/support/823-podcast-requirements) |
| **Podcast Index API** | Outbound | REST (HTTPS GET) | Search-based podcast discovery (Should-Have, M3) | API key required; register at podcastindex.org | [Podcast Index API Docs](https://podcastindex-org.github.io/docs-api/) |
| **Apple CarPlay CPTemplate** | Bidirectional | Native module bridge (react-native-carplay) | In-car audio interface — Now Playing, queue browse, subscription browse | CarPlay entitlement (com.apple.developer.carplay-audio) must be requested from Apple; simulator path available without approval | [CarPlay App Programming Guide](https://developer.apple.com/documentation/carplay); [CarPlay HIG](https://developer.apple.com/design/human-interface-guidelines/carplay) |
| **AVAudioSession** | Bidirectional | iOS SDK via react-native-track-player | Background audio, interruption handling, audio session category/mode management | No discovery required — iOS SDK | [AVAudioSession Docs](https://developer.apple.com/documentation/avfaudio/avaudiosession) |
| **react-native-track-player** | Internal (native bridge) | RN native module | Background audio engine, Now Playing metadata, queue state, playback controls | None — open-source library | [RNTP Docs](https://rntp.dev/docs/basics/installation) |
| **BGAppRefreshTask** | Outbound (iOS OS) | iOS background task API | Schedule periodic RSS feed refresh without app in foreground | Background fetch entitlement in Info.plist; no Apple approval required | [BGAppRefreshTask Docs](https://developer.apple.com/documentation/backgroundtasks/bgapprefreshtask) |
| **Background URLSession** | Outbound | iOS NSURLSession (background) | Episode file downloads that survive app kill | No discovery required | [URLSession Background Docs](https://developer.apple.com/documentation/foundation/url_loading_system/downloading_files_in_the_background) |

---

## Proposed Technology Stack

### Core Technologies

| Layer | Technology | Version / Notes | Rationale |
|-------|------------|-----------------|-----------|
| **App Framework** | Expo bare workflow | SDK 53+ | Retains EAS Build, expo-modules, config plugins, and dev client while allowing native module access required for RNTP and react-native-carplay. Pure managed workflow is incompatible with CarPlay (MADR-001). |
| **Language** | TypeScript (strict mode) | 5.x | Type safety for the data model, queue engine interfaces, and CarPlay template bindings. |
| **Audio Engine** | react-native-track-player | v4.x | Production-grade background audio for React Native; AVAudioSession management; Now Playing metadata; CarPlay audio integration. (MADR-002) |
| **CarPlay Bridge** | @g4rb4g3/react-native-carplay | latest (SDK 53 compatible) | CPTemplate system bridge for React Native; Expo SDK 53 compatible fork with New Architecture support. (MADR-004) |
| **Relational Storage** | expo-sqlite | v14 (SDK 53) | Managed workflow-compatible SQLite; migration API; queryable schema for queue evaluation and episode management. (MADR-003) |
| **Key-Value Store** | MMKV (react-native-mmkv) | v3.x | Synchronous, JSI-based key-value store for hot-path writes (playback position, speed). 30x faster than AsyncStorage for small writes. (MADR-003) |
| **State Management** | Zustand | v5.x | Lightweight store for UI state; avoids Redux boilerplate for a solo-developer app. Audio engine and queue engine state is owned by their respective native layers, not React state. |
| **Navigation** | React Navigation (native stack) | v7.x | Standard RN navigation; native stack for iOS feel; no CarPlay-specific navigation (CarPlay uses CPTemplate tree). |

### Build & Distribution

| Category | Tool | Purpose |
|----------|------|---------|
| **Build system** | EAS Build | Managed cloud iOS builds; handles provisioning, signing, and entitlement injection without Xcode on CI |
| **CI** | GitHub Actions | Typecheck + lint on PR; EAS Build trigger for TestFlight distribution |
| **Package manager** | npm (with --legacy-peer-deps) | React 19 peer dep conflicts with RN ecosystem packages require legacy resolution flag |
| **OTA Updates** | EAS Update (deferred) | Not required for v1 daily driver; available if App Store distribution occurs |

### Development & Operations

| Category | Tool | Purpose |
|----------|------|---------|
| **Dev client** | expo-dev-client | Custom development build with native modules baked in; required for bare workflow |
| **Linting** | ESLint + Prettier | Code quality; enforced via Husky pre-commit hook |
| **Testing** | Jest + React Native Testing Library | Unit tests for queue engine logic; integration tests for data layer |
| **Error tracking** | Not included in v1 | Personal app; developer is the only user; console logs and device logs are sufficient |
| **Analytics** | None | NFR-03 prohibits third-party data egress |

---

## Environment Strategy

There is no backend infrastructure and no staging/production server environment. The environment model is entirely on-device.

| Environment | Purpose | Infrastructure |
|-------------|---------|---------------|
| **Development** | Active feature development | Physical iPhone + CarPlay head unit (or CarPlay Simulator) via expo-dev-client USB connection. EAS Build for device-provisioned builds when entitlement testing is needed. |
| **Device test (pre-daily-driver)** | Reliability and acceptance testing | TestFlight distribution via EAS Build. Same app binary as daily driver. No separate environment. |
| **Daily driver (production analog)** | Personal daily use — the v1 acceptance gate | App installed via TestFlight on primary iPhone. No App Store submission required for the daily driver bar. |

Because the app is local-first with no backend, there are no environment-specific configuration differences (no API base URLs, no environment tokens beyond the Podcast Index API key, which is embedded at build time). A single build configuration serves all three uses.

---

## Security Architecture

### Security Layers

| Layer | Controls |
|-------|----------|
| **Network — RSS** | HTTPS only for feed fetches; invalid TLS certificates cause fetch failure, not silent degradation. No RSS credentials stored; all feeds are public. |
| **Network — Podcast Index API** | HTTPS only; API key + HMAC-SHA1 signature per request (Podcast Index authentication scheme). API key embedded in app bundle — acceptable for a personal app with no monetization or user data at stake. |
| **Data at rest** | expo-sqlite database stored in the app's sandboxed document directory (not NSTemporaryDirectory or NSCachesDirectory). SQLCipher encryption is available via expo-sqlite config plugin but is not applied in v1 — the data is not sensitive (podcast subscriptions and playback positions). |
| **No authentication** | No user account, no auth tokens, no OAuth flows. Local-first eliminates the authentication attack surface entirely. |
| **No analytics / telemetry** | NFR-03 prohibits any data egress beyond RSS and Podcast Index. No third-party SDKs (Amplitude, Firebase, Sentry) are included. |
| **App Transport Security** | iOS ATS enforced by default; no NSAllowsArbitraryLoads exceptions. Podcast feeds that serve over plain HTTP will fail (acceptable tradeoff — modern feeds are HTTPS). |

### Compliance Considerations

| Requirement | Approach |
|-------------|----------|
| App Store privacy nutrition label | Declares: no data collected, no data linked to user, no tracking. Straightforward for a local-first no-account app. |
| CarPlay entitlement | Audio app entitlement (com.apple.developer.carplay-audio). No navigation, communication, or EV entitlement required. Audio is the least restricted CarPlay category. |
| Background modes | `audio` and `fetch` background modes declared in Info.plist. Standard entitlements; no special Apple approval beyond CarPlay. |

---

## Scalability and Performance

Cloud scalability is not applicable — there is no server. On-device performance is the relevant concern.

### Load Scenarios

| Scenario | Volume | Approach |
|----------|--------|----------|
| **Queue evaluation — normal** | 20–50 shows, 1–5 unplayed episodes each (100–250 episodes) | In-memory sort over fetched rows; sub-100ms on modern iPhone. No optimization needed. |
| **Queue evaluation — heavy user** | 100+ shows, 5–20 unplayed each (500–2000 episodes) | Same in-memory sort; still sub-second. SQLite index on `(played, publishDate, duration)` avoids full table scan. |
| **RSS refresh — concurrent feeds** | 20–50 simultaneous HTTP requests | Serial per-feed with concurrency limit (e.g., 5 parallel fetches). Prevents radio saturation; avoids BGAppRefreshTask budget exhaustion. |
| **Download storage** | 5–20 downloaded episodes at ~50MB each (250MB–1GB) | Storage usage displayed in Settings (FR-09). No automatic pruning in v1 beyond per-subscription retention count (M3 FR-10). |
| **CarPlay list rendering** | Queue: up to 250 items; subscription browse: up to 50 shows × N episodes | CPListTemplate renders on-demand; pagination via assistiveContext sections if needed. Lists of 250 are within observed CarPlay performance limits. |

### Scaling Strategy

The app is not a distributed system. On-device performance optimizations are:
- SQLite indexes on frequently queried columns (played status, publish date, duration, subscription ID)
- MMKV for sub-millisecond playback position reads/writes on the hot path
- Lazy RSS artwork loading (load on scroll, cache in filesystem)
- BGAppRefreshTask budget awareness: feed refresh serialized to avoid iOS killing the background task for excessive CPU/network

---

## Architecture Decisions (MADRs)

### MADR-001: Expo Bare Workflow vs. Expo Managed Workflow

**Status:** Decided (assumption, qa: skip)

**Context:** PRD NFR-10 requires all dependencies to be compatible with the Expo managed workflow without ejection. react-native-carplay requires native AppDelegate bridging (connecting CPApplicationDelegate to CarPlay framework), which the Expo managed workflow does not permit. react-native-track-player's service file also requires native registration that managed workflow cannot automate without a config plugin. Expo bare workflow retains EAS Build, expo-modules, expo-dev-client, and the full Expo config plugin toolchain — it differs from managed workflow only in that the `ios/` directory is committed and native modifications are permitted.

**Decision:** Use Expo bare workflow. NFR-10 is reinterpreted as "no ejection to raw React Native CLI baseline" — bare workflow is the correct Expo-compatible path for apps requiring native module access. A custom config plugin for react-native-carplay handles AppDelegate bridging automatically.

**Consequences:**
- Positive: Full native module access; CarPlay and RNTP both work without workarounds
- Positive: EAS Build, Expo Go (via dev client), config plugins all remain available
- Negative: `ios/` directory committed to repo; Xcode required for some debugging
- Negative: Slightly more initial setup vs. pure managed workflow
- Neutral: Solo developer toolchain complexity is low; bare workflow is well-documented

**Alternatives rejected:**
- Pure managed workflow: CarPlay entitlement bridging not possible without config plugin workaround; community config plugin for react-native-carplay is unofficial and fragile
- Raw React Native CLI: Loses EAS Build, expo-modules ecosystem, and Expo config plugin benefits

---

### MADR-002: react-native-track-player vs. expo-av

**Status:** Decided (pre-determined per PRD §3.3, confirmed by architecture analysis)

**Context:** Audio playback is load-bearing for both background use and CarPlay. expo-av is the Expo-native audio library but does not natively manage AVAudioSession category, does not expose MPNowPlayingInfoCenter for Lock Screen / Control Center, and does not provide queue management semantics. react-native-track-player is purpose-built for background audio player apps: it ships an AVAudioSession configuration, MPNowPlayingInfoCenter integration, a headless service architecture for background operation, and queue management APIs.

**Decision:** react-native-track-player v4. Its background service architecture is the correct model for a podcast app; expo-av would require manual re-implementation of all the pieces RNTP provides natively.

**Consequences:**
- Positive: AVAudioSession configuration, Now Playing metadata, background service, and queue APIs included
- Positive: Active maintenance; large community; documented CarPlay audio integration
- Negative: Bare workflow required (MADR-001 already mandates this)
- Negative: Official maintainers have limited Expo expertise; community support for Expo-specific issues

**Alternatives rejected:**
- expo-av: Missing background service architecture, Now Playing integration, and queue semantics; would require re-implementing what RNTP provides

---

### MADR-003: expo-sqlite vs. MMKV for Local Persistence

**Status:** Decided (assumption, qa: skip)

**Context:** The app requires two distinct persistence patterns: (1) relational entity storage for subscriptions, episodes, queue entries, rules — requiring queryable schema and migrations; (2) high-frequency key-value writes for playback position and per-show speed — requiring sub-millisecond synchronous access.

**Decision:** Two-tier persistence: expo-sqlite for relational entities; MMKV (react-native-mmkv) for hot-path key-value. expo-sqlite SDK 52+ (legacy API removed) with Drizzle ORM for type-safe queries and migration management. MMKV via JSI for synchronous reads/writes on the audio hot path.

**Consequences:**
- Positive: Each library is matched to its access pattern; no impedance mismatch
- Positive: expo-sqlite migration API provides safe schema evolution
- Positive: MMKV synchronous reads prevent async overhead on playback position writes
- Negative: Two persistence dependencies; marginally more setup
- Neutral: Drizzle ORM adds a dev-dependency (migrations, schema types) but no runtime weight beyond SQL

**Alternatives rejected:**
- expo-sqlite only: Async API introduces latency on hot-path playback position writes; acceptable for entities but not for position tracking during active playback
- MMKV only: No relational query capability; ad-hoc key-value for episode queries would be unmaintainable at scale
- AsyncStorage: Deprecated for production use; no migration support; 30x slower than MMKV for small writes

---

### MADR-004: react-native-carplay Library Choice

**Status:** Decided (assumption, qa: skip; monitoring required)

**Context:** react-native-carplay (birkir/react-native-carplay) is the primary open-source CPTemplate bridge for React Native. As of 2025, the upstream library has an open issue for Expo config plugin support (issue #101). A community fork (@g4rb4g3/react-native-carplay) is published as Expo SDK 53 compatible with New Architecture support. A second active fork exists (martinthedinov/react-native-carplay). Neither fork has the same community size as upstream.

**Decision:** Start with @g4rb4g3/react-native-carplay for Expo SDK 53 compatibility. Wrap the library behind an internal CarPlayBridge interface so the underlying library can be swapped without touching CarPlay UI code. If the fork proves insufficiently maintained or introduces bugs, fallback to upstream birkir with a manual config plugin (community gist pattern exists for Expo 47+; adaptable to current SDK).

**Consequences:**
- Positive: Expo SDK 53 compatibility; New Architecture support
- Positive: Internal interface abstraction enables library swap at low cost
- Negative: Fork has smaller community and uncertain long-term maintenance
- Negative: Fork divergence from upstream may require manual backporting

**Alternatives rejected:**
- Upstream birkir without config plugin: Requires manual AppDelegate edits; breaks EAS Build automation
- Native Swift CarPlay module: Significant native development outside the RN ecosystem; solo developer risk

---

### MADR-005: Queue Model — Rules-Based vs. ML Inference

**Status:** Decided (pre-determined per PRD §7.2)

**Context:** The smart queue is the primary product differentiator. Two approaches were considered: explicit user-defined rules (duration sort, staleness decay, manual pin) or ML-inferred ordering from listening behavior.

**Decision:** Rules-based for v1. User-defined rules are transparent (FR-15 rule attribution is trivially implementable), predictable, debuggable on-device without a backend, and scope-bounded. ML inference requires training data the app does not yet have, a local ML runtime (CoreML), and a more complex evaluation model.

**Consequences:**
- Positive: Predictable, explainable queue ordering; rule attribution label is easy to implement
- Positive: No backend, no CoreML integration required in v1
- Positive: User is in control; rules-based model matches the "configure once" PRD thesis
- Negative: Does not adapt to listening behavior without explicit rule changes

**Alternatives rejected:**
- ML inference (v1): Infrastructure risk; no training data; scope creep; deferred post-v1 explicitly

---

## Runtime Scenarios (Must-Have FRs)

### FR-01 + FR-03: Pre-Drive Refresh Cycle

**Scenario:** iOS fires a BGAppRefreshTask overnight. The RSS parser fetches each subscribed feed in serial batches (concurrency limit 5). New episodes are written to expo-sqlite. The queue engine EvaluationTrigger fires on refresh completion, invoking RuleEvaluator. The sorted QueueEntry array is committed to QueueStore (SQLite + MMKV last-eval timestamp). When the user opens the app or connects to CarPlay, the queue is already ordered. No foreground action required.

**Critical decision points:** (a) BGAppRefreshTask budget — iOS may defer or skip the task if device is low-battery or task history is poor; queue evaluation also runs on app foreground as a safety net. (b) Per-feed error isolation — a malformed feed writes a parse error record and continues; other feeds are unaffected (NFR-04).

---

### FR-05, FR-06, FR-07, FR-08: Episode Playback Core + Background Audio

**Scenario:** User taps an episode. UI calls into RNTP queue with episode URL (or local file path if downloaded), episode metadata, and the per-show speed from MMKV. RNTP activates the AVAudioSession (`.playback` category), begins playback, and pushes Now Playing metadata to MPNowPlayingInfoCenter. When the screen locks or app backgrounds, RNTP's headless service continues playback. Position is written to MMKV on pause, background, and at a regular interval during playback. On relaunch, RNTP state and MMKV position are read; playback resumes from the saved offset.

**Critical decision points:** (a) AVAudioSession must be activated before RNTP starts playback; incorrect sequence causes silent failure on CarPlay. (b) Position write on `applicationWillResignActive` is the safety net against crash data loss (NFR-09).

---

### FR-09: Offline Playback from Download

**Scenario:** Download manager creates a Background URLSession task for the episode file. Progress is tracked in SQLite. On completion, the DownloadRecord is marked complete with the local file path. When RNTP loads the episode, it checks for a local file path in the DownloadRecord; if present, the local path is used instead of the remote URL. In airplane mode, the episode plays from the local file with no network access.

**Critical decision points:** (a) Files must be written to the app's Documents directory (not Caches or Temp) to survive iOS storage reclamation (NFR-09). (b) Background URLSession tasks survive app kill; download state is reconciled from the URLSession delegate on relaunch.

---

### FR-11, FR-12, FR-15, FR-16: Smart Queue Evaluation

**Scenario:** EvaluationTrigger fires (refresh complete, rule change, or app foreground). RuleEvaluator fetches unplayed episodes from SQLite. ExceptionRegistry supplies current pin positions. DurationSortRule sorts episodes by `<itunes:duration>` ascending (or descending per user config). Exception records are re-inserted at their relative anchor positions. Each QueueEntry receives a `.ruleLabel` string. QueueStore commits the sorted array to SQLite and fires a Zustand store update. Phone UI queue list and CarPlay CPListTemplate both observe the store update and re-render.

**Critical decision points:** (a) Exception positions are relative (anchor episode ID), not absolute index — survivable across insertions from new episodes. (b) Queue evaluation must complete before the user connects to CarPlay (NFR-05); the foreground trigger is the CarPlay session start safety net.

---

### FR-17, FR-18, FR-19: CarPlay Session Start

**Scenario:** User connects iPhone to CarPlay head unit. react-native-carplay fires `onConnect`. The CarPlay bridge sets the CPTabBarTemplate as the root with Now Playing and Queue tabs. CPNowPlayingTemplate binds to RNTP playback state (currently playing episode title, artwork, elapsed time). Three custom buttons are registered: skip episode (advances RNTP queue and triggers queue re-evaluation), mark played (writes to SQLite, removes from queue), queue peek (pushes CPListTemplate of current queue). Queue tab CPListTemplate loads from QueueStore. Tap on a queue item calls RNTP to play that track.

**Critical decision points:** (a) The audio session must not drop during the phone↔CarPlay foreground/background transition — RNTP's session remains active across this transition if configured correctly. (b) All CarPlay UI updates must be dispatched on the main thread via the CarPlay bridge API.

---

### FR-21: AVAudioSession Interruption Handling

**Scenario A — Navigation prompt:** AVAudioSession posts an interruption notification with type `.began` and a hint indicating a transient interruption. RNTP (which observes this notification) ducks the audio volume. When the navigation prompt ends, the notification fires with type `.ended` and the `.shouldResume` option. RNTP resumes and restores volume. No user action required (NFR-06).

**Scenario B — Phone call:** AVAudioSession posts `.began` with a non-transient hint. RNTP pauses playback and records the interrupted state. When the call ends, the notification fires with `.ended`. If `.shouldResume` is present, RNTP resumes automatically; if not, a "Resume" prompt is surfaced in the phone UI (≤1 tap, NFR-06). CarPlay CPNowPlayingTemplate reflects the pause state throughout.

**Critical decision points:** (a) The interruption observer must be registered before the first CarPlay session; it is registered during audio engine initialization in M1. (b) Siri activations are treated as transient interruptions by the OS; the same handler covers them without special cases.

---

### FR-25: Episode Played/Unplayed Tracking

**Scenario:** Episode plays to completion (RNTP fires `PlaybackQueueEnded` event for the track). The audio engine writes `played = true` to the Episode record in SQLite. EvaluationTrigger fires. RuleEvaluator excludes played episodes from the next queue sort. The played episode is no longer visible in the queue list. Manual mark-played is available from the phone UI queue list and from the CarPlay Now Playing custom button (FR-18, button 2).

**Critical decision points:** (a) Position must be written to MMKV before the played flag is set, so a crash between the two does not lose position. (b) Played exclusion is the default behavior; the user can mark an episode unplayed to re-enter it into queue evaluation.

---

## Open Items for Discovery

| Item | Question | Impact |
|------|----------|--------|
| **CarPlay entitlement approval** | Apple reviews CarPlay entitlement requests manually. Approval timeline is typically 1–2 weeks but can be longer. Will the request be submitted at project kickoff? | Blocks all on-device CarPlay testing and M1E deliverable. Simulator path available as fallback. |
| **Audio processing decision (post-v1)** | Smart Speed (variable rate with silence removal) requires DSP work beyond RNTP's built-in rate control. If added post-v1, does RNTP's rate API suffice or is a custom AVAudioEngine pipeline needed? | Not a v1 blocker; deferred explicitly (PRD §5.4). Resolution needed before post-v1 audio processing work begins. |
| **@g4rb4g3/react-native-carplay maintenance** | The fork used for Expo SDK 53 compatibility has an uncertain maintenance trajectory. If it falls behind or is abandoned, migration back to upstream birkir requires a config plugin. | Risk is low-medium; mitigated by internal CarPlayBridge interface (MADR-004). Monitor at M1E POC. |
| **Podcast Index API key provisioning** | API key requires registration at podcastindex.org. Rate limits are not publicly documented. For a personal app, limits are unlikely to be hit, but the key must be provisioned before M3 (FR-02). | Should-Have; does not block M1 or M2. Register early to avoid last-minute delays. |
| **Chapter format support scope** | ID3 chapter markers (MP3) and MP4 chapter atoms both exist in the wild. RNTP exposes chapter data from the underlying platform. Does the v1 implementation need to handle both formats, or only the more common ID3 variant? | Scoped to M3 (FR-24). Clarify before 3A begins. |

---

## Technology Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| CarPlay entitlement rejected or delayed by Apple | Medium | High — blocks all on-device CarPlay work | Request at project kickoff; use CarPlay Simulator for M1E POC in parallel; have a documented simulator-only fallback path |
| @g4rb4g3/react-native-carplay fork abandoned or diverges from upstream | Medium | Medium — CarPlay bridge breaks on SDK upgrade | Wrap behind internal CarPlayBridge interface; fallback to upstream birkir + manual config plugin is a documented recovery path (MADR-004) |
| AVAudioSession misconfiguration causes silent CarPlay playback failure | Medium | High — trust-destroying daily failure; NFR-01 fail | Treat as a reliability requirement in M1D+1E; audio session configuration is an acceptance criterion for the CarPlay POC, not a later polish item |
| react-native-track-player Expo compatibility gap | Low (bare workflow mitigates this) | High if hit — blocks audio entirely | Bare workflow removes the managed-workflow constraint; RNTP v4 is documented to work in Expo bare workflow |
| BGAppRefreshTask budget exhaustion by iOS | Medium | Medium — pre-drive refresh may not run; user must foreground app | Supplement with foreground trigger on app launch; keep feed fetch efficient (serial batches, early-exit on no new episodes) |
| expo-sqlite migration failure on app update | Low | High — data loss destroys trust | Forward-only migrations; version tracked in DB; tested in 3C lifecycle kill matrix |
| RSS feed serves plain HTTP (ATS blocked) | Low–Medium | Low — individual feed fails gracefully | Per-feed error isolation (NFR-04); user can remove and re-add feed via HTTPS URL |
| iOS storage reclamation purges episode downloads | Low (with correct implementation) | High — offline playback failure (NFR-02) | Store files in Documents directory, not Caches; verified in 3C lifecycle matrix |
| Solo developer motivation loss before daily driver adoption | Medium | Medium — project stalls | Daily driver bar is personal and concrete; no App Store launch pressure |

---

## Technical Glossary

| Term | Definition |
|------|------------|
| **Expo bare workflow** | An Expo project configuration where the `ios/` (and optionally `android/`) native directory is committed to the repository and native modifications are permitted. Retains EAS Build, expo-modules, and Expo config plugin toolchain. Contrasts with Expo managed workflow (no committed native directories) and raw React Native CLI (no Expo tooling). |
| **EAS Build** | Expo Application Services Build — cloud-based iOS/Android build service. Handles code signing, provisioning profile management, and entitlement injection without requiring Xcode on CI. |
| **expo-dev-client** | A custom Expo development client that includes all native modules used by the project. Required for bare workflow development; replaces Expo Go for projects with custom native code. |
| **CPTemplate** | See PRD §8.1. Architecture note: the CPTemplate tree is owned entirely by the CarPlay bridge component; no React Native UI components render in CarPlay. |
| **CPTabBarTemplate** | The root CarPlay navigation structure. hlyst uses two tabs: Now Playing and Queue. Subscription browse (M3) may add a third tab. |
| **RNTP headless service** | react-native-track-player's background playback architecture. A registered JavaScript service runs in a separate JS context when the app is backgrounded, maintaining audio state without a running React tree. Required for lock screen, Control Center, and CarPlay audio continuity. |
| **AVAudioSession category** | iOS audio session classification. hlyst uses `.playback` — required for background audio, lock screen controls, and CarPlay. Incorrect category (e.g., `.ambient`) causes audio to stop on screen lock. |
| **BGAppRefreshTask** | iOS Background App Refresh mechanism. App registers a task ID; iOS fires the task periodically (subject to OS budget). hlyst uses this for background RSS feed refresh and queue pre-evaluation (NFR-05). |
| **Background URLSession** | An iOS URLSession configuration that survives app termination. Download tasks registered with this session continue in the OS process and deliver results to the app on next launch. Used for episode downloads (FR-09). |
| **MMKV** | Mobile Map Key-Value — a high-performance key-value storage library backed by memory-mapped files. Used via react-native-mmkv for synchronous hot-path writes (playback position, per-show speed). JSI-based; no async overhead. |
| **Drizzle ORM** | A TypeScript ORM with a SQL-first approach. Used with expo-sqlite for type-safe queries and migration management. Migrations are bundled as SQL strings at build time; no runtime schema inference. |
| **ExceptionRegistry** | The internal hlyst component that stores manual queue override (pin) records. Positions are stored as relative anchors ("before episode X") to survive insertions from new feed episodes. |
| **RuleEvaluator** | The internal hlyst component that applies the ordered rule list to unplayed episodes, producing a sorted QueueEntry array. Consulted by EvaluationTrigger on each queue re-evaluation event. |
| **EvaluationTrigger** | The internal hlyst component that subscribes to feed refresh completion, rule change, and app foreground events and dispatches queue re-evaluation to RuleEvaluator. |
| **CarPlayBridge** | The internal hlyst interface abstracting the react-native-carplay library. All CarPlay UI components reference CarPlayBridge, not the library directly, enabling library substitution without touching CarPlay UI code (MADR-004). |
| **QueueStore** | The internal hlyst component that persists the sorted QueueEntry array to SQLite and fires a Zustand store update consumed by both the phone queue list UI and the CarPlay CPListTemplate. |
| **DurationSortRule** | The v1 queue rule implementation that reads `<itunes:duration>` from each unplayed episode and sorts ascending (shortest first) or descending (longest first) per user configuration. |
| **StalenessDecayRule** | The M3 queue rule implementation that reads episode publish date and moves episodes past the user-configured age threshold toward the back of the queue. Pinned episodes are immune. |

---

*Version 1.0 | May 2026 | Complete*

---

## Staffing
_Completed: 2026-05-01_

# Staffing Clarification Q&A

No clarifying questions were required. Context was sufficiently detailed
to generate the staffing plan without ambiguity.

> **Assumptions documented (qa: skip mode):** All decisions below are recorded
> as assumptions rather than confirmed answers, per the execution context.

| # | Question | Answer | Impact |
|---|----------|--------|--------|
| 1 | What is the team size and composition? | Assumption: Solo developer (Jon Yurek). Developer fills all roles: engineer, architect, designer, PM. No parallel workstreams. No shared resources. | All effort estimates collapse to a single person; no coordination overhead. |
| 2 | What is the expected weekly allocation? | Assumption: 20–25% of full-time capacity, reflecting part-time evenings/weekends for a side project. Approximately 4–5 hours/week of focused work. | Calendar duration is significantly longer than engineering effort in person-weeks. Effort estimates from Phase 2b (M1=5wk, M2=8wk, M3=5wk) are used as baseline person-week figures. |
| 3 | What is the development methodology? | Assumption: Agentic engineering. Claude Code is the primary dev toolchain. The developer directs AI agents for code generation, test writing, refactoring, and documentation. Advantage is reduced total effort, not compressed calendar. | Person-week estimates already reflect agentic leverage. Traditional estimates would be materially higher. |
| 4 | Is there a hard deadline? | Assumption: No. The project succeeds when the developer uses hlyst as a daily driver (§6.2). App Store launch is aspirational and not a gate. | Calendar duration is illustrative, not contractual. The developer sets their own pace. |
| 5 | Should a parallel execution map be produced? | Assumption: No. Single-team project; the staffing template explicitly omits parallel execution maps for single-team projects. | Simplifies the staffing plan without loss of information. |

---

## Development Approach: Agentic Engineering

This project uses agentic development. The developer operates with AI agents
as core tooling — not as a supplement. Claude Code directs code generation,
test writing, refactoring, documentation, and boilerplate elimination,
allowing the developer to focus on architecture decisions, integration logic,
and quality validation.

The agentic advantage shows up as reduced total engineering effort
(person-weeks), not a compressed calendar. The project timeline is driven by
sequential dependencies that require wall-clock time regardless of development
speed: native module integration, CarPlay entitlement provisioning, on-device
reliability testing, and daily-driver acceptance criteria.

---

## Team Structure

### Solo Developer Model

This is a one-person project. All roles are fulfilled by a single developer.

| Role | Developer | Effective Allocation | Notes |
|------|-----------|---------------------|-------|
| **Engineer** | Jon Yurek | ~100% of project hours | Primary activity; agentic-assisted |
| **Solution Architect** | Jon Yurek | Embedded in engineering | Architecture decisions made inline; MADRs documented during feature work |
| **UX/UI Designer** | Jon Yurek | Embedded in engineering; front-loaded to M1–M2 | No design system handoff required; developer is also the user |
| **Project Manager** | Jon Yurek | Minimal overhead | No standups, no stakeholder sync; backlog managed as personal notes |
| **QA** | Jon Yurek | Embedded in M3 acceptance gate | Formal QA is the daily-driver acceptance criteria defined in §6.2 |

No shared resources. No parallel workstreams. No coordination overhead.

---

## Timeline & Allocation

### Allocation Model

At 20–25% allocation (4–5 hours/week), one engineering person-week of effort
takes approximately 4–5 calendar weeks to complete. This multiplier converts
the Phase 2b effort baseline into calendar duration.

| Assumption | Value |
|-----------|-------|
| Hours available per week | 4–5 hrs |
| Full-time equivalent week | 40 hrs |
| Effective allocation | ~11–12% of FTE |
| Calendar weeks per person-week of effort | ~8–9 calendar weeks |

> Note: "20–25% allocation" is the conventional framing for a side project.
> The calendar multiplier above uses the more precise 4–5 hrs/week figure.
> At 5 hrs/week, 1 person-week (40 hrs) = 8 calendar weeks.

### Milestone Calendar

Effort baselines from Phase 2b. Calendar duration derived from allocation model above.

| Milestone | Engineering Effort (PW) | Calendar Duration | Calendar Weeks (cumulative) |
|-----------|------------------------|-------------------|-----------------------------|
| **M1: Foundation** | 5 PW | ~40 calendar weeks | Weeks 1–40 |
| **M2: Core Features** | 8 PW | ~64 calendar weeks | Weeks 41–104 |
| **M3: Polish & Daily Driver** | 5 PW | ~40 calendar weeks | Weeks 105–144 |
| **Total** | **18 PW** | **~144 calendar weeks** | **~2.75 years** |

> **Practical note:** The 144-week figure is the raw mechanical output of
> dividing 18 person-weeks by 12.5% FTE. In practice, allocation is not
> perfectly uniform — some weeks will be 0 hours (travel, life), others 10+
> hours. A working estimate of 18–24 months to daily driver is more realistic
> for a motivated solo developer working consistently on evenings and weekends.
> The daily driver bar, not a calendar date, is the completion criterion.

### Engineer Allocation by Phase

Single developer; no combined-per-week calculation needed.

| Phase | Effort (PW) | Hrs @ 5/wk | Calendar Duration | Engineering Intensity |
|-------|-------------|------------|-------------------|-----------------------|
| **M1: Foundation** | 5 PW | 200 hrs | ~40 weeks | High — native module setup, bare workflow, audio engine |
| **M2: Core Features** | 8 PW | 320 hrs | ~64 weeks | Peak — smart queue, CarPlay UX, download manager |
| **M3: Polish & Daily Driver** | 5 PW | 200 hrs | ~40 weeks | Tapering — feature code heavy (3A); human-gated acceptance (3C) |
| **Total** | **18 PW** | **720 hrs** | **~144 weeks** | |

**Why intensity tapers in M3:** The 3C acceptance gate (30 consecutive CarPlay
sessions, 2-week queue accuracy log, daily-driver switch) is bottlenecked by
real calendar time, not engineering hours. The developer cannot compress a
2-week commute log by coding faster. M3 effort is real but paced by daily life.

---

## Effort Summary by Role

Because all roles are filled by one person, the effort table collapses to
a single row. The multi-role overhead (architecture, design, PM) is embedded
in the engineering person-weeks rather than tracked separately.

| Role | Person-Weeks | Notes |
|------|-------------|-------|
| **Engineer (agentic)** | 18 PW | Includes all implementation, testing, architecture decisions |
| **Embedded Architect** | ~1–2 PW equivalent | Absorbed into M1 setup and M2 integration decisions; not additive |
| **Embedded Designer** | ~0.5 PW equivalent | UI patterns decided during feature work; no separate design phase |
| **Embedded PM** | Negligible | Backlog management is personal; no stakeholder coordination |
| **Total (unique effort)** | **~18 PW** | No double-counting; all roles converge on one person |

---

## Milestone Estimates

### M1: Foundation (Weeks 1–40 at 5 hrs/week)

**Effort: 5 person-weeks (200 hours)**

| Deliverable Group | Estimated Effort | Bottleneck | AI Leverage |
|-------------------|-----------------|------------|-------------|
| 1A — Repository Scaffolding | 0.3 PW (12 hrs) | None; highly agentic | Heavy |
| 1B — Local Data Model & Storage | 0.7 PW (28 hrs) | Schema design decisions; migration strategy | Heavy |
| 1C — RSS Feed Parsing | 1.0 PW (40 hrs) | Real-world feed validation; malformed feed handling | Heavy + Moderate |
| 1D — Audio Engine & Playback Foundation | 1.5 PW (60 hrs) | AVAudioSession configuration; RNTP bare workflow setup | Moderate |
| 1E — CarPlay Native Bridge POC | 1.5 PW (60 hrs) | CarPlay entitlement provisioning (human-gated); on-device validation | Moderate + Minimal |
| **M1 Total** | **5.0 PW** | | |

**Critical path:** CarPlay entitlement approval (1–2 weeks Apple review, real
calendar time). Submit the entitlement request on day 1. 1E POC can proceed on
CarPlay Simulator while waiting; on-device validation is blocked until approved.
AVAudioSession configuration in 1D is the reliability foundation for all
subsequent CarPlay work — treat it as an acceptance criterion, not a footnote.

---

### M2: Core Features (Weeks 41–104 at 5 hrs/week)

**Effort: 8 person-weeks (320 hours)**

| Deliverable Group | Estimated Effort | Bottleneck | AI Leverage |
|-------------------|-----------------|------------|-------------|
| 2A — Smart Queue Engine | 2.0 PW (80 hrs) | ExceptionRegistry relative-anchor logic; trigger wiring | Heavy |
| 2B — Episode Downloads | 1.5 PW (60 hrs) | Background URLSession lifecycle; Documents directory storage | Moderate |
| 2C — CarPlay UX (Now Playing + Queue Browse) | 2.5 PW (100 hrs) | Session lifecycle hardening; on-device transition testing | Moderate |
| 2D — Interruption Handling & Reliability | 1.0 PW (40 hrs) | On-device call/navigation interruption scenarios | Moderate |
| 2E — Phone Player UI | 1.0 PW (40 hrs) | Drag-to-reorder queue with exception wiring | Heavy |
| **M2 Total** | **8.0 PW** | | |

**Critical path:** 2C (CarPlay UX) is the longest single group and depends on
1E (bridge proven) + 2A (queue available) + 1D (RNTP wired). It cannot start
until M1 is complete. The 10 consecutive CarPlay session test in 2C (NFR-01
partial gate) requires real driving time — not compressible by coding speed.

---

### M3: Polish & Daily Driver (Weeks 105–144 at 5 hrs/week)

**Effort: 5 person-weeks (200 hours)**

| Deliverable Group | Estimated Effort | Bottleneck | AI Leverage |
|-------------------|-----------------|------------|-------------|
| 3A — Should-Have Feature Completion | 3.0 PW (120 hrs) | Chapter format parsing; OPML import validation against real-world files | Heavy + Moderate |
| 3B — CarPlay Polish | 0.5 PW (20 hrs) | Artwork loading in CarPlay; cold-start depth audit | Heavy + Minimal |
| 3C — Reliability Hardening & Daily Driver Acceptance | 1.5 PW (60 hrs) | 30-session CarPlay log; 2-week queue accuracy log; real calendar time | Minimal |
| **M3 Total** | **5.0 PW** | | |

**Critical path:** 3C is bottlenecked by real-world calendar time, not
engineering hours. The 30-session CarPlay acceptance gate and the 2-week commute
log require a minimum of ~6–8 calendar weeks of daily driving regardless of
coding pace. M3 is the longest phase in calendar duration relative to its
engineering effort. Begin the 30-session log as soon as M2 is functionally
complete; run 3A and 3B in parallel with the acceptance logging period.

---

## Notes

### Solo Developer Prerequisites

- Agentic proficiency (Claude Code as primary dev toolchain) is assumed
- Expo bare workflow familiarity expected; RNTP and react-native-carplay both
  require native module access
- Physical iPhone required for CarPlay entitlement testing and acceptance gate
- CarPlay head unit (or cable + CarPlay Simulator) required for 2C and 3B/3C
  acceptance criteria

### External Dependencies

| Dependency | Owner | Risk | Mitigation |
|-----------|-------|------|------------|
| CarPlay entitlement (com.apple.developer.carplay-audio) | Apple | High — 1–2 week approval; can be longer | Request at project kickoff, before any other work |
| Podcast Index API key | Developer (self-serve) | Low — register at podcastindex.org | Register early; does not block M1 or M2 |
| @g4rb4g3/react-native-carplay fork maintenance | Open-source community | Medium — uncertain trajectory | Internal CarPlayBridge interface allows library swap; monitor at M1E POC |

### Calendar Duration Caveats

- The ~18–24 month working estimate assumes consistent 4–5 hrs/week; real
  life will introduce gaps
- M3 acceptance gate cannot be compressed below ~6–8 calendar weeks regardless
  of engineering pace
- No deadline pressure; the project is complete when the developer uses hlyst
  as their daily podcast app, not when a calendar date arrives
- App Store submission is explicitly out of scope for v1

### Buffer Rationale

- No formal buffer is added; the solo developer adjusts pace organically
- The daily driver acceptance gate in 3C is the natural project boundary;
  it self-calibrates to real-world usage rather than an estimated completion date
- The most important buffer is the CarPlay entitlement lead time — submit
  on day 1 to avoid blocking M1E

### Communication & Quality

- No standups; no external stakeholders
- Architecture decisions documented as MADRs during feature work
- All code merged via feature branches; agentic code reviewed by developer
  before merge
- qa: skip mode in effect — all decisions documented as assumptions throughout

---

## Architecture Validation
_Completed: 2026-05-01_

| # | Check | Severity | Item | Issue | Resolution |
|---|-------|----------|------|-------|------------|
| 1 | REQ-ID traceability — all 42 in Appendix C | Pass | All 42 REQ-IDs | All present | — |
| 2 | Must-Have FRs → stories in Appendix A | Pass | FR-01,03,05–09,11,12,15–19,21,25 (16 Must FRs) | All mapped | — |
| 3 | Must-Have NFRs → stories in Appendix A | Pass | NFR-01–11 (11 Must NFRs) | All mapped | — |
| 4 | Must-Have INTs → stories in Appendix A | Pass | INT-01,03,04,05 (4 Must INTs) | All mapped | — |
| 5 | All stories map to §5 units | Pass | 23 stories across 13 units | All mapped | — |
| 6 | No phantom REQ-IDs in architecture | Pass | All REQ-IDs match PRD §8.3 | None found | — |
| 7 | All 12 Arc42 sections present with content | Pass | §1–§12 | All present | — |
| 8 | §1.2 Quality Goals ≥3 entries | Pass | 5 entries | Satisfied | — |
| 9 | §5 Building Block View has units | Pass | 13 units (1A–3C) | Satisfied | — |
| 10 | §6 Runtime View covers all Must-Have FRs | Pass | 16 Must-Have FRs | All covered in 7 scenarios | — |
| 11 | §9 has ≥1 ADR | Pass | ADR-001–005 (5 ADRs) | Satisfied | — |
| 12 | §10 Quality Scenarios has entries | Pass | QS-01–QS-08 (8 scenarios) | Satisfied | — |
| 13 | §12 Glossary has entries | Pass | 17 technical terms | Satisfied | — |
| 14 | Appendix A has stories for every §5 unit | Pass | All 13 units | All have ≥1 story | — |
| 15 | Appendix D has timeline data | Pass | Milestone calendar + effort table | Present | — |
| 16 | ADR sequential numbering | Pass | ADR-001–005 | Sequential, no gaps | — |
| 17 | Every ADR has Decision Outcome | Pass | ADR-001–005 | All have outcomes | — |
| 18 | ADRs reference quality goals or REQ-IDs | Pass | ADR-001–005 | All reference NFRs or FRs | — |
| 19 | §8.1 tech stack matches §4 Solution Strategy | Pass | All 7 core technologies | Consistent | — |
| 20 | Build order respects dependency matrix | Pass | 8 build-order levels | No violations found | — |

**Summary:** 20 checks run. 0 blockers. 0 warnings. 0 auto-fixes needed. 42 REQ-IDs fully traced. Architecture document is complete and validated.
