2026-05-01

Ideate Phase
Product Requirements Document
Jon Yurek / Gnar Dog

**Product Requirements Document: hlyst**

## 1.0 Document Overview

| Field                          | Value                                    |
| :----------------------------- | :--------------------------------------- |
| **Version**                    | 1.0                                      |
| **Date**                       | 2026-05-01                               |
| **Status**                     | Complete                                 |
| **Target Release / Milestone** | Personal daily driver (no hard date)     |
| **Authors / Contributors**     | Jon Yurek; hlyst PRD pipeline            |

---

## 2.0 Executive Summary

hlyst is a personal iOS podcast app built on React Native/Expo. Its defining thesis is "the podcast app that gets itself ready before you get in the car": a rules-based smart queue that auto-orders episodes by user-defined priorities, combined with a first-class CarPlay experience designed for the car — not ported from the phone.

### 2.1 The Initiative

Every major podcast app (Apple Podcasts, Castro, Overcast, Pocket Casts) requires manual drag-and-drop queue management. None combines intelligent queue ordering with a first-class CarPlay experience. hlyst exists to fill this compound gap for a single primary user: a heavy podcast listener who commutes by car and wants the queue to work the way their brain works — without daily manual curation.

The app is local-first (no backend, no account), iOS-only for v1, and built to be a daily driver. Public App Store release is aspirational if the app proves valuable enough to share.

### 2.2 Vision & Scope

**Vision:** A podcast app where the queue orders itself. The user configures rules once; the app surfaces the right episode at the right time without daily intervention. In the car, CarPlay is the primary surface — designed for minimal interaction, not adapted from the phone UI.

**In scope (v1):** RSS subscription management, episode playback with full controls, rules-based smart queue, CarPlay integration, offline playback of downloaded episodes.

**Out of scope (v1):** Android support, social/sharing features, video podcasts, paid monetization, backend/cloud sync.

### 2.3 Success Metrics

| Metric | Target |
|--------|--------|
| Daily driver adoption | Developer uses hlyst as primary podcast app within 4 weeks of first usable build |
| Pre-drive ritual | Zero manual queue intervention required on a typical commute day |
| CarPlay reliability | No silent playback failures across 30 consecutive CarPlay sessions |
| Queue accuracy | Smart queue surfaces the developer's preferred episode type ≥80% of the time without manual override |

---

## 3.0 Background & Strategic Fit

### 3.1 Problem Statement

Podcast listening for heavy users involves two distinct problems: **curation** (should I listen to this episode?) and **sequencing** (when should I listen to this episode?). Existing apps solve the first problem poorly and the second problem not at all.

The pre-drive ritual is the core user story: RSS feeds refresh overnight, episodes queue up, and the user gets in the car and presses play — ideally with zero manual intervention. Today, the user must manually drag-and-drop episodes into the desired order before driving, a context-switching task that takes 5–15 minutes daily for heavy listeners (20–100+ episodes in the backlog).

Castro gets closest to solving curation via its inbox/triage model, but queue sequencing remains manual drag-and-drop even after triage. Overcast's playlist filters are the best queue-adjacent tool in the market, but they are static — they rerun their filter on demand without adapting, learning, or dynamically reprioritizing by episode attributes.

**The CarPlay dimension makes the problem acute.** Apple's CarPlay HIG limits interaction to 2 taps for common actions. In-car queue manipulation is architecturally near-impossible: `CPNowPlayingTemplate` exposes 3 custom button slots; `CPListTemplate` does not support reordering gestures; there is no text input. This means the queue must be correct *before* the driver gets in the car — in-car correction is not a viable recovery mechanism. Smart queue automation is not a nice-to-have for CarPlay; it is the prerequisite.

**Operational constraints inherited from the architecture:**
- Local-first means the queue is the source of truth; no sync conflicts, no loading states.
- RSS is the only data source; no structured metadata beyond what feeds provide.
- CarPlay template system (CPTemplate) constrains all UI — no custom gestures, no custom layouts.

### 3.2 Goal & Opportunity

**The opportunity:** A podcast app that combines rules-based smart queue management with a first-class CarPlay experience is genuinely unoccupied in the market. The two needs are individually unserved and mutually reinforcing — a smart queue is most valuable in the car, and CarPlay is only useful if the queue is correct.

**Strategic position:** "Queue-first podcast app" — the queue orders itself by user-defined rules, so the user listens instead of curates. CarPlay is a primary surface, not a port.

**Why now:** React Native/Expo maturity enables a solo developer to build production-quality iOS audio. CarPlay adoption is growing. The smart-queue concept is well-understood by power users but absent from every app on the market.

**Key opportunities:**

| Opportunity | Competitive Gap | hlyst Approach |
|-------------|----------------|----------------|
| Smart queue ordering | No competitor offers rules-based or adaptive queue | User-defined priority rules (v1); duration, staleness, category signals |
| First-class CarPlay | All competitors treat CarPlay as a port; Overcast is best but still limited | CarPlay-native design from architecture stage; minimal-tap interaction model |
| Local-first power features | Pocket Casts requires an account; Castro Plus required for CarPlay | No account, no backend; all features available locally |
| Duration-based sorting | `<itunes:duration>` is in every RSS feed; no competitor uses it | Expose duration as a primary queue sort key in v1 |

**Risks:**

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| "Smart queue" scope is undefined | High | High | Define v1 queue model (rules-based) before architecture begins |
| CarPlay API constraints with RN/Expo | Medium | High | Early technical spike on react-native-carplay integration |
| Solo developer scope creep | Medium | Medium | Enforce v1 scope; "daily driver" is the MVP bar, not App Store launch |
| Motivation without external deadline | Medium | Medium | Ground success in personal daily use, not launch milestones |

### 3.3 Dependencies & Constraints

| Constraint | Type | Detail |
|-----------|------|--------|
| React Native / Expo | Technical | Stack decided; CarPlay requires native module bridging (react-native-carplay or equivalent) |
| iOS only | Platform | No Android in v1; Expo enables future Android parity with minimal rewrite |
| Local-first / no backend | Architecture | All state on-device; no sync, no account, no server-side logic |
| RSS / Podcast Index | Data | Only external dependency; feed parsing must handle malformed RSS gracefully |
| CarPlay entitlement | Platform | Requires Apple CarPlay entitlement in provisioning; must be requested early |
| CarPlay HIG | Design | CPTemplate system constrains all CarPlay UI; no custom views, no text input, 3-button limit on Now Playing |
| AVAudioSession | Technical | Audio session management is load-bearing; incorrect implementation causes silent failure in CarPlay |

### 3.4 Pain Points with Existing Systems

Pain points are drawn from the developer's direct experience with Apple Podcasts and Castro, supplemented by domain analysis of Overcast and Pocket Casts.

**KN-01 — Manual queue is the universal failure mode.**
All four competitors require drag-and-drop queue ordering with no automation layer. The cognitive load is highest when it matters most: before getting in the car, when attention is split.

**KN-02 — Castro solves triage but not sequencing.**
Castro's inbox model distinguishes "should I listen?" (inbox) from "when?" (queue position). It solves the first well. The second remains manual drag-and-drop — no rules, no attribute-based ordering. Castro is the philosophical predecessor to hlyst but stops at the triage layer.

**KN-03 — CarPlay in all apps is a phone-UI port, not a car-UI design.**
Specific failure modes: (a) too many taps to resume from cold start; (b) no queue visibility from Now Playing; (c) no safe way to skip an episode mid-listening; (d) search/browse present but unsafe at speed. These are structural problems rooted in the port-not-design approach.

**KN-04 — Smart queue and CarPlay are a compound gap.**
Smart queue without CarPlay means setup friction before driving. CarPlay without smart queue means a polished interface over a wrong queue. Only the combination eliminates the pre-drive setup ritual.

**KN-05 — Playback continuity is fragile.**
Apps silently lose position on crash, reset speed on episode boundaries, or lose queue state when iOS aggressively backgrounds the process. This is a trust-destroying failure mode for a daily-driver app. Episode progress persistence must be treated as a reliability requirement.

### 3.5 Competitive Landscape

**Summary:** The podcast app market is mature with four credible competitors. Queue management is universally manual; CarPlay is universally an afterthought. No app owns the compound position hlyst targets.

#### Competitor Profiles (Summary)

| App | Queue Model | CarPlay Quality | Smart Features | Differentiator |
|-----|------------|----------------|----------------|----------------|
| Apple Podcasts | Manual Up Next | Functional / shallow (native, Siri) | None | Pre-installed; ecosystem integration |
| Castro | Inbox/triage + Queue Boost | Adequate (Plus only) | Queue Boost (binary) | Triage model; polished iOS UI |
| Overcast | Manual playlists with static filters | Good (best in class) | Smart Speed, Voice Boost | Audio processing; no account required |
| Pocket Casts | Manual Up Next + separate filters | Below average | Trim Silence, Volume Boost | Cross-platform; strong discovery |

#### Comparative Feature Table

| Dimension | Apple Podcasts | Castro | Overcast | Pocket Casts | hlyst (target) |
|-----------|---------------|--------|----------|--------------|----------------|
| Smart/auto queue | None | Queue Boost (binary per-show) | None (static filters) | None | Rules engine + dynamic prioritization |
| Queue control from CarPlay | Read-only | Play/pause/skip | Play/pause/skip; playlist select | Play/pause/skip | Queue view + designed-for-car controls |
| CarPlay quality | Floor | Adequate (paywalled) | Best in class | Weakest | First-class (design target) |
| Audio processing | None | Voice Boost | Smart Speed + Voice Boost | Trim Silence + Volume Boost | Deferred (see §5.4) |
| Local-first / no account | No (Apple ID) | Optional | Yes | No (required) | Yes |
| Per-show playback speed | No | Yes | Yes | Yes | Yes |

**Table stakes** (all competitors): background playback, sleep timer, variable speed, chapter support, auto-download, some CarPlay presence, RSS-based podcast catalog.

#### Market Gaps

1. **No app has a genuinely smart queue.** Rules-based or adaptive queue ordering does not exist in any competitor.
2. **CarPlay is an afterthought for every competitor.** No app owns the in-car podcast experience as a primary UX surface.
3. **The compound gap is unoccupied.** Smart queue + first-class CarPlay combined is a coherent, defensible, and genuinely differentiated product thesis.
4. **Local-first / no-account for power features.** Pocket Casts requires an account; Castro paywalls CarPlay. No-account power features are a differentiator.

**Key takeaways:**
- Overcast sets the audio quality bar (Smart Speed + Voice Boost); hlyst defers audio processing to post-v1 and accepts the tradeoff explicitly (see §5.4, §7.0).
- Castro's triage model is the philosophical predecessor; hlyst extends it by making sequencing automatic.
- Pocket Casts iOS users are a natural secondary acquisition target if hlyst ships strong CarPlay.
- The compound differentiation is defensible: hard for incumbents to copy (CarPlay investment + data model rethink required).

---

## 4.0 Target Audience & Personas

### 4.1 Personas

#### Persona A — Jon (Primary): The Daily-Driver Commuter

**Description:** Solo developer and primary user of hlyst. Heavy podcast listener with a large subscription catalog (20–50+ shows). Commutes by car regularly and uses CarPlay as the primary listening interface. Currently uses Castro and Apple Podcasts but tolerates manual queue friction as a daily annoyance.

**Goals:**
- Start the car and press play — no pre-drive queue manipulation
- Hear the right type of episode for the commute length without thinking about it
- Per-show playback speeds remembered and applied automatically
- Reliable playback that doesn't lose position or silently fail in CarPlay

**Pain Points:**
- Spending 5–15 minutes daily reordering the queue before driving
- CarPlay interfaces require too many taps or don't show the queue
- Apps lose playback position after crashes or app updates
- No app lets him express intent: "short episodes today," "finish news before interviews"

**Relevant Notes:** Developer-as-user provides the tightest possible feedback loop. The daily driver bar — "Jon uses hlyst as his primary podcast app" — is the v1 success criterion. All design decisions should be evaluated against the pre-drive ritual first.

---

#### Persona B — The Switcher: Power User from Overcast or Castro

**Description:** Heavy podcast listener currently on Overcast or Castro who discovers hlyst via App Store. Listens primarily on commute. Has configured per-show speeds and a large subscription catalog they don't want to re-enter manually. Values audio quality but is willing to trade Smart Speed for a smarter queue and better CarPlay.

**Goals:**
- Migrate existing subscriptions via OPML import without re-entering feeds
- Smart queue that gets the "right" episode ready for the commute length
- First-class CarPlay experience — better than what Overcast or Castro offers
- Privacy: no account, no data leaving device

**Pain Points:**
- Overcast playlists require manual filter tuning; they don't adapt
- Castro's Queue Boost is too blunt (binary per-show, no episode-level rules)
- Overcast's CarPlay is adequate but not excellent; Castro's requires a paid subscription
- Switching apps means losing per-show speed config and feed positions

**Relevant Notes:** This persona is aspirational for App Store launch, not the daily driver milestone. OPML import (FR-26) and per-subscription speed persistence (FR-06) are the primary hooks for this persona. Audio processing absence (deferred from §5.4) is the primary objection risk — acknowledged tradeoff.

---

#### Persona C — The Occasional Car Listener: Casual Podcast User

**Description:** Listens to 3–5 podcasts, mostly in the car. Uses Apple Podcasts currently. Queue management is not a pain point because the backlog is small enough to manage manually. CarPlay reliability matters more than queue intelligence.

**Goals:**
- Reliable CarPlay experience with minimal setup
- Automatic downloads so episodes are ready offline
- Simple subscription management

**Pain Points:**
- Apple Podcasts CarPlay is shallow; no queue visibility
- Occasionally episodes disappear from Up Next with no explanation

**Relevant Notes:** This persona is a possible App Store user but not the design target. Features driven primarily by Personas A and B will likely satisfy this persona as a side effect. No design decisions should be driven by this persona at the expense of A or B.

---

### 4.2 User Stories

**Persona A — Jon (Primary)**

- As Jon, I want the queue to order itself by my rules overnight so that I can get in the car and press play without touching my phone.
- As Jon, I want to see which rule placed each episode at its position so that I can trust the smart queue and build confidence in it over time.
- As Jon, I want per-show playback speeds remembered permanently so that I never have to reconfigure them after an app update or reinstall.
- As Jon, I want to skip an episode from CarPlay in one tap so that I can advance the queue without taking my eyes off the road.
- As Jon, I want queue browse accessible within 2 taps from the CarPlay home so that I can see what's coming up without pulling over.
- As Jon, I want audio to resume automatically after navigation prompts so that map directions don't interrupt a commute.
- As Jon, I want manual queue overrides that don't destroy my rules so that I can move one episode without resetting the entire order.

**Persona B — The Switcher**

- As a switcher from Overcast, I want to import my subscriptions via OPML so that I can migrate in minutes rather than re-entering 40+ feeds.
- As a switcher, I want duration-based queue sorting so that short-commute mornings automatically surface shorter episodes without manual filtering.
- As a switcher from Castro Plus, I want CarPlay available without a subscription so that I'm not paying a fee for a feature I consider basic.
- As a switcher, I want all my app state to stay on-device so that my listening history and rules don't depend on a server I can't control.

---

## 5.0 Key Features & Requirements

### 5.1 Functional Requirements

#### Must-Have

| REQ-ID | Feature | User Story | Acceptance Criteria | Notes |
|--------|---------|------------|---------------------|-------|
| FR-01 | RSS Subscription Management | As a user, I can add and remove podcast subscriptions via RSS URL | Given a valid RSS URL, the podcast and episodes appear in library. Removal deletes subscription and episodes. | Pre-condition for all functionality |
| FR-03 | Episode Feed Fetch & Background Refresh | As a user, my feeds refresh in the background so new episodes are available before I open the app | Background refresh runs without the app open; new episodes appear automatically. Interval is configurable. | Enables the pre-drive ritual |
| FR-05 | Episode Playback Core Controls | As a user, I can play, pause, seek, skip forward/back, and adjust speed for any episode | Play, pause, seek, skip forward, and skip back each produce the expected state change. Speed changes take effect within 1 second of user action. | Table stakes |
| FR-06 | Per-Subscription Playback Speed Persistence | As a user, my playback speed per podcast is remembered permanently | Speed persists across restarts, updates, and device restores. Applies automatically when an episode begins. | KN-10: loyalty-generating; per-subscription field in data model |
| FR-07 | Episode Progress Persistence | As a user, my playback position in every episode is saved so I never lose my place | Position restored exactly on return. Survives crashes, background kills, and reboots. | KN-05: trust-critical |
| FR-08 | Background Audio Playback | As a user, audio continues when I lock the screen or switch apps | Audio continues uninterrupted when screen locks or app is backgrounded. Now Playing appears in lock screen and Control Center. | Required for CarPlay |
| FR-09 | Episode Download for Offline Playback | As a user, I can download episodes to play without internet | Downloaded episodes play offline. Available in CarPlay. The app displays storage used by downloaded episodes in the settings UI. | PRD 2.2 explicit scope |
| FR-11 | Smart Queue: Rules-Based Auto-Ordering | As a user, I define priority rules and my queue orders itself | Given rules are configured, queue is ordered automatically on feed refresh and on rule change. Manual overrides are respected as exceptions. | Core product thesis (KN-04) |
| FR-12 | Queue Rule: Duration-Based Sorting | As a user, I can sort my queue by episode duration | Episodes ordered by `<itunes:duration>` ascending or descending. | KN-07: highest-ROI signal; no competitor has it |
| FR-15 | Queue Rule Transparency | As a user, I can see which rule placed each episode at its queue position | Each episode in queue shows rule attribution (e.g., "Sorted by: shortest first"). | KN-06: trust prerequisite for smart automation |
| FR-16 | Manual Queue Override (non-destructive) | As a user, I can reorder the queue without losing my rule configuration | Manual drag creates an exception; rule remains intact for subsequent episodes. | KN-06: rules as defaults, overrides as exceptions |
| FR-17 | CarPlay Integration (Core Session) | As a user, I can control playback from CarPlay with correct audio session behavior | App appears in CarPlay home. Audio session does not interrupt, reset, or drop during foreground-to-background and background-to-foreground transitions during a CarPlay session. | Requires Apple CarPlay entitlement (request early) |
| FR-18 | CarPlay Now Playing Controls (3-button) | As a user, the CarPlay Now Playing screen exposes essential queue actions in 1 tap | CPNowPlayingTemplate shows: (1) skip episode + advance queue, (2) mark played, (3) queue peek. All accessible without eyes off road. | KN-14: 3-button constraint is binding |
| FR-19 | CarPlay Queue Browse (≤2 taps) | As a user, I can see and navigate the current queue from CarPlay in ≤2 taps | Queue reachable from CarPlay home in 2 taps. Shows episode title, podcast, duration. Tap plays. | KN-12 HIG mandate; KN-03 gap |
| FR-21 | AVAudioSession Interruption Handling | As a user, audio resumes automatically after interruptions (calls, navigation) | Audio ducks (volume reduction) for navigation prompts; audio pauses for phone calls. Playback resumes automatically when interruption ends. | KN-15: silent failure is trust-destroying |
| FR-25 | Episode Played / Unplayed Tracking | As a user, the app tracks which episodes I've played so they don't re-enter my queue | Finished episodes are marked played and excluded from queue auto-ordering by default. Manual mark played/unplayed available. | Foundational for queue correctness |

#### Should-Have

| REQ-ID | Feature | User Story | Acceptance Criteria | Notes |
|--------|---------|------------|---------------------|-------|
| FR-02 | Podcast Index Search for Subscribe | As a user, I can search for podcasts by name instead of pasting an RSS URL | Search returns matching podcasts with metadata. Selecting subscribes via RSS feed. | RSS URL fallback covers v1 |
| FR-04 | Per-Feed RSS Refresh Cadence | As a user, I can set how frequently each feed is checked for new episodes | Per-feed cadence setting (15min / 30min / 1hr / manual). Default: 30 min. | KN-18: news feeds need faster polling |
| FR-10 | Auto-Download Rules per Subscription | As a user, I can configure which subscriptions auto-download new episodes on Wi-Fi | Auto-download per subscription; configurable episode count to retain. | Companion to smart queue |
| FR-13 | Queue Rule: Staleness Decay | As a user, old episodes are deprioritized after a configurable age | The smart queue engine moves episodes whose age exceeds the user-configured staleness threshold toward the back of the queue, unless the episode is pinned. | KN-08 |
| FR-20 | CarPlay Subscription Browse | As a user, I can browse subscriptions from CarPlay to find a specific episode | Subscriptions reachable via CPListTemplate; episodes listed per show. | Overcast parity |
| FR-23 | Sleep Timer | As a user, I can set a sleep timer to stop playback after a duration | Playback stops at set time. Timer survives screen lock. | Table stakes |
| FR-24 | Chapter Support | As a user, chapter markers are displayed and I can skip between chapters | Chapters shown in player UI. Chapter skip controls available. | Power-user expectation |
| FR-26 | OPML Import / Export | As a user, I can import subscriptions from another app and export mine | OPML import: all valid feeds become subscriptions. Export: valid OPML of current subscriptions. | Migration from Castro/Overcast |

#### Could-Have

| REQ-ID | Feature | Notes |
|--------|---------|-------|
| FR-14 | Queue Rule: Category Interleaving | Requires category tagging per subscription as a prerequisite (no FR for that yet) |
| FR-22 | Episode Inbox / Triage Model | Contradicts "zero intervention" thesis; valid power-user extension for v2 |

### 5.2 Non-Functional Requirements

All NFRs are **Must-Have**.

| REQ-ID | Quality Attribute | Requirement | Measurement Method | Target |
|--------|-----------------|-------------|-------------------|--------|
| NFR-01 | Reliability | No silent playback failures in CarPlay | 30 consecutive CarPlay sessions | 0 silent failures |
| NFR-02 | Availability | Core playback and queue management work offline | Airplane mode test with downloaded episodes | 100% of downloaded episodes playable offline |
| NFR-03 | Privacy | No data leaves device except RSS and Podcast Index API calls | Architecture review; network traffic audit | No server calls beyond RSS/Podcast Index |
| NFR-04 | Reliability | Malformed RSS feeds cannot crash the app or corrupt other feeds | Feed fuzzing with malformed XML | App handles bad XML gracefully per-feed |
| NFR-05 | Performance | Queue is re-evaluated before user opens CarPlay (background) | Background task audit | Queue evaluates on each background refresh completion |
| NFR-06 | Reliability | Playback resumes after interruptions with ≤1 tap | Interruption test matrix (calls, nav, Siri) | Auto-resume after nav prompts; ≤1 tap after calls |
| NFR-07 | Compliance | All CarPlay UI uses CPTemplate system only — no custom views | App Review simulation | CPListTemplate, CPNowPlayingTemplate, CPTabBarTemplate only |
| NFR-08 | Usability | Common CarPlay actions reachable in ≤2 taps | HIG depth audit | Resume, skip, queue browse all ≤2 taps from CarPlay home |
| NFR-09 | Reliability | All local state survives restarts, crashes, OS kills, app updates | Kill + relaunch test matrix | No data loss across any lifecycle event |
| NFR-10 | Maintainability | All dependencies are React Native / Expo compatible | Dependency audit pre-build | No dependency requires ejecting from Expo managed workflow to bare workflow |
| NFR-11 | Portability | iOS only in v1 | Build configuration review | No Android, watchOS, or other targets in v1 |

### 5.3 Key Integrations

| REQ-ID | Priority | System | Purpose | Interface | Known Constraints |
|--------|----------|--------|---------|-----------|-------------------|
| INT-01 | Must | RSS / iTunes RSS namespace | Subscription feed fetch; episode metadata; `<itunes:duration>` for queue sorting | HTTP polling | Must handle malformed XML, encoding errors, and missing fields gracefully |
| INT-02 | Should | Podcast Index API | Search-based subscription discovery (Should) | REST API | Requires API key; RSS URL entry is the v1 fallback |
| INT-03 | Must | Apple CarPlay CPTemplate | In-car audio interface — browse, queue, Now Playing | Native module bridge (react-native-carplay or equivalent) | CarPlay entitlement required early; 3-button Now Playing limit; no custom views |
| INT-04 | Must | AVAudioSession | Background audio, interruption handling, audio session lifecycle | iOS SDK via react-native-track-player | Must handle calls, navigation duck/resume, Siri; incorrect config = silent CarPlay failure |
| INT-05 | Must | react-native-track-player (or equivalent) | Background audio engine, Now Playing metadata, queue state | RN native module | Must support Expo managed workflow or bare with minimal ejection |

### 5.4 Out of Scope

| Item | Rationale | Future Condition |
|------|-----------|-----------------|
| Android support | iOS-only for v1; Expo enables v2 without full rewrite | v2 if daily-driver value is proven |
| Social / sharing features | Personal tool; no follows, recommendations, or sharing | Post-App Store launch if applicable |
| Video podcast support | Audio-only; video adds significant complexity for marginal v1 value | Revisit if App Store launch shows demand |
| Paid subscription / monetization | Personal tool; App Store release is aspirational | Only relevant if public release happens |
| Cloud sync / backend | Local-first is a design principle; no backend simplifies v1 entirely | v2+ if multi-device becomes a need |
| Podcast editorial discovery | Search-to-subscribe via Podcast Index covers v1 | Post-v1 |
| Siri / SiriKit integration | Requires separate entitlement and SiriKit intent implementation | Post-v1 |
| Audio processing (Smart Speed equivalent) | Significant DSP engineering effort; Overcast's moat. Accepted tradeoff: smart queue + CarPlay differentiation is stronger than audio processing for the primary use case. Switcher persona objection is acknowledged. | Post-v1 |
| ML-based queue inference | Scope risk; rules-based first | Only after rules-based model is validated |
| iPadOS-optimized layout | iPhone only for v1 | Post-v1 |
| Cross-device sync | Follows from no-backend constraint | v2+ if backend ever added |
| watchOS companion | Separate app target; not a core use case | Post-v1 |

---

## 6.0 Verification & Validation

### 6.1 Outcome Metrics

Drawn from PRD §2.3 success metrics and §3.2 opportunity assessment. Each metric is tied to a measurement method and a pass/fail threshold.

| Outcome | Metric | Measurement Method | Target |
|---------|--------|-------------------|--------|
| Daily driver adoption | Developer uses hlyst as primary app | Self-reported switch from Castro/Apple Podcasts | Within 4 weeks of first usable build |
| Pre-drive ritual | Zero manual queue intervention on a typical commute day | Developer daily log; count of manual queue edits per commute day | 0 manual edits on ≥80% of commute days over a 2-week window |
| CarPlay reliability | No silent playback failures | Consecutive CarPlay session log; explicit failure note per session | 0 silent failures across 30 consecutive sessions |
| Queue accuracy | Smart queue surfaces preferred episode type | Developer rating after each commute (thumbs up/down whether the lead episode was correct) | ≥80% correct without manual override over a 2-week window |
| Playback continuity | No position loss across lifecycle events | Kill + relaunch test matrix; commute diary notes | 0 position loss events in 30 days of daily use |

### 6.2 Acceptance Criteria

High-level project acceptance criteria for v1. Detailed per-requirement criteria are in §5.1.

The v1 release is accepted when all of the following are true:

1. **Daily driver:** The developer has replaced Castro and Apple Podcasts with hlyst as the primary podcast app for commutes.
2. **Smart queue operational:** The queue reorders itself on background refresh without any manual intervention required before a typical commute.
3. **CarPlay stable:** The developer completes 30 consecutive CarPlay sessions (full commute, in-car) with zero silent playback failures.
4. **Queue accuracy:** The smart queue surfaces the developer's preferred episode type (by duration or recency rule) ≥80% of the time without manual override.
5. **Offline ready:** All downloaded episodes play in airplane mode with no errors.
6. **State durable:** After a forced app kill and relaunch, all subscriptions, queue state, playback position, per-show speeds, and rules are intact.
7. **Interruption handling:** Audio ducks for navigation prompts and resumes automatically; resumes within 1 tap after a phone call.
8. **CarPlay depth:** Resume playback and skip episode are reachable in ≤2 taps from the CarPlay home screen.
9. **Privacy clean:** A network traffic capture during normal use shows no requests beyond RSS feed URLs and Podcast Index API.

---

## 7.0 Risks, Assumptions, & Mitigations

### 7.1 Risks

Consolidates risks from §3.2 (strategic), §3.3 (technical constraints), and validation report findings.

| Risk | Impact | Likelihood | Risk Score | Mitigation |
|------|--------|-----------|-----------|------------|
| CarPlay entitlement and native module complexity with RN/Expo | High — blocks entire CarPlay surface | Medium | **High** | Prototype react-native-carplay integration as the first technical spike, before any other feature work. Request CarPlay entitlement from Apple early. |
| AVAudioSession misconfiguration causes silent playback failure | High — trust-destroying daily failure | Medium | **High** | Treat audio session configuration as a reliability requirement, not a polish item. Add to acceptance criteria for CarPlay integration milestone. |
| Smart queue scope creep (rules engine grows unbounded) | Medium — delays daily driver milestone | Medium | **Medium** | Lock v1 queue model to: duration sort, staleness decay, manual pin. Defer category interleaving (FR-14) and ML inference to post-v1 explicitly. |
| Audio processing gap (no Smart Speed equivalent) | Medium — Overcast/Castro switchers may reject | Low (primary user is the developer) | **Medium** | Accepted tradeoff; documented in §5.4. Compound differentiation (smart queue + CarPlay) is the value argument. Revisit post-v1 if App Store launch happens. |
| RSS ecosystem fragility (malformed feeds, Podcast Index downtime) | Medium — bad feed could degrade trust | Low–Medium | **Low–Medium** | NFR-04 requires malformed RSS tolerance. Podcast Index outage falls back to direct RSS URL entry (INT-02). |
| Solo developer motivation risk (no external deadline) | Medium — project stalls before daily driver milestone | Medium | **Medium** | Success bar grounded in personal daily use, not App Store launch. "Daily driver within 4 weeks of first usable build" is a concrete, personal milestone. |
| Local state durability on iOS (OS may purge caches) | High — data loss is trust-destroying | Low (with correct implementation) | **Low–Medium** | NFR-09 requires correct storage location (not NSTemporaryDirectory). KN-10 flags per-show speed loss as a known app-switching trigger. |

### 7.2 Assumptions

| Assumption | Basis | Risk if Wrong |
|-----------|-------|--------------|
| "Smart queue" means explicit rules set by the user, not ML inference, for v1 | Stated local-first constraint makes ML infrastructure impractical | Scope expands significantly; defer ML to v2+ |
| CarPlay's minimum viable surface is Now Playing + queue browse; full library navigation is secondary | KN-12, KN-13: daily use requires only 2-tap depth; browse is the fallback | More CarPlay screens needed; complexity increases |
| Auto-download defaults to all new episodes from subscribed feeds; per-subscription override is a Should | Simplest path to offline readiness for the pre-drive ritual | Storage pressure from large feeds; needs per-subscription control sooner |
| OPML import handles standard OPML 2.0 only; per-app extended fields (e.g., Castro speed settings) are ignored | Scoped to migration, not settings portability | Extended field import may be needed for the Switcher persona |
| react-native-track-player (or equivalent) supports Expo managed workflow without ejection | NFR-10 requires this; known RN ecosystem risk | Bare workflow required; increases build complexity for solo developer |

---

## 8.0 Appendix

### 8.1 Glossary

| Term | Definition |
|------|------------|
| **Smart queue** | The rules-based queue engine in hlyst. Automatically orders episodes by user-configured priority rules (duration, recency, staleness) without manual drag-and-drop. Distinct from static playlist filters (Overcast) or binary show-level boosts (Castro). |
| **Pre-drive ritual** | The core hlyst use case: RSS feeds refresh overnight, the smart queue re-orders, and the user gets in the car and presses play with zero manual intervention. All design decisions are evaluated against this workflow. |
| **CPTemplate** | Apple's CarPlay template system. All CarPlay UI must be built from Apple-provided templates (CPListTemplate, CPNowPlayingTemplate, CPTabBarTemplate, CPGridTemplate, CPInformationTemplate). Custom UIKit/SwiftUI views are not permitted in CarPlay. |
| **CPNowPlayingTemplate** | The CarPlay "Now Playing" screen. Exposes standard playback controls (play/pause, skip forward/back) plus up to 3 custom action button slots. Rate indicator, repeat, and shuffle are also available. |
| **CPListTemplate** | CarPlay list/browse screen. Used for queue browse and subscription browse. Does not support drag-to-reorder gestures. |
| **CPTabBarTemplate** | CarPlay tab bar for top-level navigation. Used as the root navigation structure for the CarPlay app. |
| **AVAudioSession** | iOS audio session management API. Must be configured with `.playback` category for background audio and CarPlay. Incorrect configuration causes silent playback failure when screen locks or calls arrive. |
| **CarPlay HIG** | Apple's Human Interface Guidelines for CarPlay. Mandates ≤2 taps to common actions, prohibits text input, constrains all UI to CPTemplate system. Binding design constraint for all CarPlay surfaces. |
| **Duration sort** | Queue ordering by `<itunes:duration>` value from the episode RSS feed. The highest-ROI smart queue signal: available in every feed, no backend required, no competitor exposes it as a queue sort key. |
| **Staleness decay** | Queue heuristic that deprioritizes episodes past a configurable age threshold. Models the real behavior pattern that time-sensitive episodes (daily news, event recaps) lose value if not heard promptly. |
| **Category interleaving** | Queue heuristic that distributes episodes across user-assigned show categories (news, interview, storytelling) to prevent genre pile-up. Could-Have for v1; requires category tagging prerequisite. |
| **Queue Boost** | Castro's binary per-show automation: a boosted show's episodes jump to the front of the queue. The closest competitor analog to hlyst's smart queue, but binary and show-level only. |
| **Local-first** | Architecture principle: all application state (subscriptions, queue, playback progress, rules, settings) resides on-device. No backend, no account, no server-side logic. Enables offline operation, eliminates sync conflicts, and is a privacy differentiator. |
| **OPML** | Outline Processor Markup Language. Standard format for podcast subscription list export/import across apps. Used by all major podcast apps for subscription portability. |
| **Podcast Index** | Open podcast directory API (podcastindex.org). Used for search-based podcast discovery (FR-02). Requires API key. RSS URL direct entry is the v1 fallback when Podcast Index is unavailable. |
| **react-native-carplay** | React Native library that bridges Apple's CarPlay CPTemplate system for RN/Expo apps. Reference implementation for INT-03. |
| **react-native-track-player** | React Native library for background audio playback, AVAudioSession management, and Now Playing metadata (Lock Screen, CarPlay). Reference implementation for INT-05. |
| **REQ-ID format** | Requirements in this PRD use semantic prefix notation: `FR-XX` (functional requirement), `NFR-XX` (non-functional requirement), `INT-XX` (integration requirement). This format encodes requirement type and is the project standard. |
| **Daily driver bar** | The v1 success criterion: the developer uses hlyst as their primary podcast app for daily commutes. App Store launch is aspirational and not required to meet the daily driver bar. |

### 8.2 References

| Source | Type | Used By |
|--------|------|---------|
| Synthesized Discovery (prd-audit.md ## Discovery) | Q&A-derived source document | All phases |
| Competitive analysis (prd-audit.md ## Competitors) | Training knowledge + developer experience | §3.5, §3.0, §2.0 |
| Knowledge extraction (prd-audit.md ## Knowledge) | Domain analysis + CarPlay HIG | §3.1, §3.4 |
| Opportunity assessment (prd-audit.md ## Opportunity) | Strategic synthesis | §3.2, §2.0 |
| Requirements extraction (prd-audit.md ## Requirements) | MoSCoW prioritization + rationale | §5.1–§5.4 |
| Requirements validation (prd-audit.md ## Requirements Validation) | Automated check findings | §5.1 acceptance criteria fixes; §8.1 REQ-ID note |
| Apple CarPlay HIG (training knowledge) | Platform design guidelines | §3.3, §5.1 (FR-17–FR-19), §5.2 (NFR-07–NFR-08) |

### 8.3 Requirements Traceability

| REQ-ID | Description | Priority | PRD Section |
|--------|-------------|----------|-------------|
| FR-01 | RSS Subscription Management | Must | 5.1 |
| FR-02 | Podcast Index Search for Subscribe | Should | 5.1 |
| FR-03 | Episode Feed Fetch and Background Refresh | Must | 5.1 |
| FR-04 | Per-Feed RSS Refresh Cadence Setting | Should | 5.1 |
| FR-05 | Episode Playback Core Controls | Must | 5.1 |
| FR-06 | Per-Subscription Playback Speed Persistence | Must | 5.1 |
| FR-07 | Episode Progress Persistence | Must | 5.1 |
| FR-08 | Background Audio Playback | Must | 5.1 |
| FR-09 | Episode Download for Offline Playback | Must | 5.1 |
| FR-10 | Auto-Download Rules per Subscription | Should | 5.1 |
| FR-11 | Smart Queue: Rules-Based Auto-Ordering | Must | 5.1 |
| FR-12 | Queue Rule: Duration-Based Sorting | Must | 5.1 |
| FR-13 | Queue Rule: Staleness Decay | Should | 5.1 |
| FR-14 | Queue Rule: Category Interleaving | Could | 5.1 |
| FR-15 | Queue Rule Transparency (Rule Attribution) | Must | 5.1 |
| FR-16 | Manual Queue Override (non-destructive) | Must | 5.1 |
| FR-17 | CarPlay Integration (Core Session) | Must | 5.1 |
| FR-18 | CarPlay Now Playing Controls (3-button) | Must | 5.1 |
| FR-19 | CarPlay Queue Browse (≤2 taps) | Must | 5.1 |
| FR-20 | CarPlay Subscription Browse | Should | 5.1 |
| FR-21 | AVAudioSession Interruption Handling | Must | 5.1 |
| FR-22 | Episode Inbox / Triage Model | Could | 5.1 |
| FR-23 | Sleep Timer | Should | 5.1 |
| FR-24 | Chapter Support | Should | 5.1 |
| FR-25 | Episode Played / Unplayed Tracking | Must | 5.1 |
| FR-26 | OPML Import / Export | Should | 5.1 |
| NFR-01 | Playback Reliability (30 CarPlay sessions, 0 silent failures) | Must | 5.2 |
| NFR-02 | Offline Operation (downloaded episodes 100% playable) | Must | 5.2 |
| NFR-03 | No data leaves device except RSS / Podcast Index calls | Must | 5.2 |
| NFR-04 | Malformed RSS tolerance (no crashes, no corruption) | Must | 5.2 |
| NFR-05 | Background queue re-evaluation before CarPlay session | Must | 5.2 |
| NFR-06 | Playback resumes after interruptions (≤1 tap after calls) | Must | 5.2 |
| NFR-07 | CarPlay UI: CPTemplate system only, no custom views | Must | 5.2 |
| NFR-08 | CarPlay interaction depth ≤2 taps for common actions | Must | 5.2 |
| NFR-09 | All local state survives restarts, crashes, OS kills | Must | 5.2 |
| NFR-10 | React Native / Expo compatible dependency stack | Must | 5.2 |
| NFR-11 | iOS only in v1 | Must | 5.2 |
| INT-01 | RSS Feed Parsing (RSS 2.0 + iTunes namespace) | Must | 5.3 |
| INT-02 | Podcast Index API (search-to-subscribe) | Should | 5.3 |
| INT-03 | Apple CarPlay CPTemplate native module bridge | Must | 5.3 |
| INT-04 | AVAudioSession configuration and interruption lifecycle | Must | 5.3 |
| INT-05 | react-native-track-player (or equivalent) for background audio | Must | 5.3 |
