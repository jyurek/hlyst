# AUDIT — Ideate Pipeline Q&A Record

> Debug artifact. Records source inventory and all clarifying Q&A from the ideate pipeline run.

---

## Discovery
_Completed: 2026-05-01_

### Source Inventory

| File | Classification | Key Content |
|------|---------------|-------------|
| _(synthesized)_ | Discovery Q&A | Structured Q&A covering project context, problem space, users, competition, constraints, goals |

### Q&A Log

| # | Question | Answer | Impact |
|---|----------|--------|--------|
| 1 | What type of project is hlyst? | New product | Scopes pipeline to greenfield product, no migration concerns |
| 2 | What prompted building hlyst? | Internal need | Personal itch — developer is primary user |
| 3 | Describe the internal need in more detail | Podcast app in React Native focused on fluid queue management + CarPlay | Core product definition established |
| 4 | What's broken about existing podcast app queue management? | No smart queue features | Primary pain point: lack of intelligent sorting/prioritization |
| 5 | Who is the primary user? | Just me for now; potential public release if useful | Personal tool first, App Store aspirational |
| 6 | Which podcast apps are competitors or reference points? | Apple Podcasts & Castro (used); Overcast & Pocket Casts (to research) | Competitive set defined |
| 7 | What does hlyst do differently? | Both smart queue AND CarPlay | Dual differentiation: smart queue + first-class CarPlay |
| 8 | External integrations needed? | Podcast index / RSS feeds | Standard RSS-based discovery and playback |
| 9 | Technical constraints or preferences? | React Native/Expo, iOS only, local-first, no backend v1 | Stack decided; offline capability required |
| 10 | What does success look like? | I can manage my podcast queue the way I want | Daily-driver queue management = MVP bar |
| 11 | What's explicitly out of scope for v1? | Android, social/sharing, video podcasts, monetization | Clear scope boundaries for v1 |

### Synthesized Discovery

# Discovery: hlyst

> Synthetic source document produced through structured discovery Q&A.
> This document serves as the primary input for the prd pipeline
> when no stakeholder transcripts or research documents are available.

## Project Context

**Client/Org:** Personal project by the developer (Jon Yurek / Gnar Dog)
**Project name:** hlyst
**Type:** New product — greenfield iOS app
**Prompt:** Internal need — the developer wants a podcast app that manages the queue the way their brain works, with strong CarPlay support for in-car listening.

## Problem Space

Existing podcast apps (Apple Podcasts, Castro, Overcast, Pocket Casts) all manage the listening queue manually. Users must drag-and-drop episodes into order, and there is no intelligent sorting, filtering, or prioritization. This makes it hard to surface the right episode at the right time — especially in the car where interaction should be minimal.

**Severity:** Significant personal pain point for a heavy podcast listener who commutes by car.
**Current workaround:** Using Castro or Apple Podcasts manually, tolerating the friction.

## Target Users & Stakeholders

**Primary:** The developer — a heavy podcast listener who uses CarPlay regularly.
**Aspirational:** General public / podcast enthusiasts if the app proves valuable enough to ship publicly.

**Success from user perspective:** Queue feels effortless. The right episode plays at the right time without manual intervention. CarPlay integration is smooth and reliable.

## Competitive Landscape

| App | Known Strengths | Known Weaknesses |
|-----|----------------|-----------------|
| Apple Podcasts | Native iOS/CarPlay integration, free, wide adoption | Basic queue, no smart features |
| Castro | Inbox/triage model, polished UI, good queue control | Limited smart automation, CarPlay is functional but not great |
| Overcast | Smart Speed, Voice Boost, excellent audio processing | Queue management is manual, CarPlay adequate |
| Pocket Casts | Feature-rich, cross-platform, good filtering | Cross-platform tradeoffs, queue still manual |

**Differentiation opportunity:** No app combines intelligent queue management (auto-sort, priority rules, smart filters) with a first-class CarPlay experience. hlyst targets this gap.

## Technical Constraints

- **Stack:** React Native with Expo (decided)
- **Platform:** iOS only for v1
- **Offline:** Local-first; must work without internet (downloaded episodes)
- **Backend:** None in v1 — all data lives on-device
- **Podcast data:** Standard RSS feeds for subscriptions, episode metadata, and playback

## Business Goals & Success Metrics

- **Success definition:** Developer uses hlyst as their daily-driver podcast app — the queue works the way they think
- **KPIs:** Daily active use (personal); potential: app store ratings / retention if publicly released
- **Timeline:** No hard deadline — personal project, ship when ready
- **Budget:** Personal time investment; no external budget

## Key Requirements (Initial)

**Must-have:**
- RSS feed subscription management (add/remove podcasts)
- Episode playback with standard controls (play, pause, skip, speed)
- Smart queue management (rules-based or intelligent ordering)
- CarPlay integration
- Offline playback (downloaded episodes)

**Should-have:**
- Background audio playback
- Sleep timer
- Playback speed control per podcast or globally
- Episode progress sync across restarts

**Explicitly out of scope (v1):**
- Android support
- Social / sharing features (no follows, recommendations, or sharing)
- Video podcast support (audio only)
- Paid subscription or monetization

## Open Questions

- What exactly makes a queue "smart"? (Rules the user sets? Auto-inference? AI-driven?)
- What CarPlay features matter most — browse, now playing, queue view?
- Should episodes be manually downloadable or auto-downloaded per rules?
- Is there a podcast discovery/search feature, or subscriptions-only?

---

## Opportunity
_Completed: 2026-05-01_

### Q&A Log

| # | Question | Options | Answer | Follow-up |
|---|----------|---------|--------|-----------|
| — | Q&A skipped per `qa: skip` execution context. Best-judgment decisions made from source material. Assumptions documented in synthesis below. | — | — | — |

### Synthesized Opportunity

#### 1. Opportunity Overview

The core problem is universal among podcast power users: all major apps (Apple Podcasts, Castro, Overcast, Pocket Casts) require manual drag-and-drop queue ordering. No app automates queue sequencing based on rules, context, or user-defined priorities. The CarPlay use case sharpens this pain acutely — in-car interaction must be minimal, making a smart queue that surfaces the right episode without user intervention especially high-value.

**Why now:** React Native/Expo maturity makes a production-quality iOS audio app achievable for a solo developer. CarPlay adoption is growing alongside iOS market share. The smart-queue concept is well-understood but unoccupied in the market.

**Why compelling:** The developer is the primary user, providing an unusually tight feedback loop and genuine product-market fit from day one. The gap is verifiable across all four named competitors.

#### 2. Pain Points & Unmet Needs

| Pain Point | Who Affected | Current Workaround | Severity | Source |
|------------|--------------|--------------------|----------|--------|
| Manual drag-and-drop queue ordering | All podcast power users | Tolerate friction; mental queue management | High | Discovery Q4, Competitive table |
| Poor CarPlay UX — no app treats it as first-class | In-car listeners | Use voice commands or pull over to interact | High | Discovery Q7, Competitive table |
| No priority or rules-based episode surfacing | Heavy podcast listeners with large backlogs | Manual reorder daily | High | Discovery Q4, Synthesized Discovery problem space |
| Cannot express listening intent ("news first," "short episodes when rushed") | Commuters, time-constrained listeners | Ignored or manually handled | Medium | Inference from Discovery Q4 |

#### 3. Market Gaps as Strategic Opportunities

| Gap | Strategic Advantage | Differentiation Path |
|-----|--------------------|--------------------|
| No competitor owns "intelligent queue" | First-mover positioning in a named feature category | Rules engine + queue model as product anchor |
| CarPlay treated as afterthought by all competitors | Structural differentiator if designed-in from day one | CarPlay as a first-class surface, not a port |
| No local-first podcast app with zero backend | Privacy angle; eliminates trust and monetization concerns | Local-first as a feature, not a constraint |
| No rules-based personalization across any app | Fills gap between Castro's manual triage and full AI inference | Explicit user-defined priority rules in v1 |

#### 4. Value Proposition

**Qualitative:**
- Queue curation without cognitive overhead — the right episode plays without user intervention
- In-car use becomes safer and more effortless — less screen interaction while driving
- Developer-as-user creates maximal product-market fit for the primary persona
- Privacy-respecting by design — no cloud sync, no account, no data leaving the device

**Quantitative (estimated):**
- Heavy podcast listeners may manage 20–100+ queued episodes. Manual daily reordering at scale takes 5–15 minutes/day. Smart automation could eliminate this entirely for power users.
- If publicly released, App Store podcast category is well-established; even modest traction validates the concept and creates a distribution path.

#### 5. Opportunity Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| "Smart queue" definition is undefined — scope could be unbounded | High | High | Define v1 queue model explicitly before implementation (rules-based/explicit weights recommended) |
| CarPlay entitlement and API constraints may pose technical hurdles with RN/Expo | Medium | High | Prototype CarPlay integration as an early technical spike |
| Solo developer scope creep across a wide feature surface | Medium | Medium | Enforce v1 scope discipline; the out-of-scope list is already well-defined |
| RSS ecosystem fragility — feed inconsistencies, Podcast Index API reliability | Low–Medium | Medium | Treat RSS parsing robustly; use Podcast Index as fallback |
| Motivation risk — no external deadline or accountability | Medium | Medium | Define "daily driver" as the MVP bar, not App Store release |

#### 6. Key Takeaways & Recommended Strategic Focus

1. **The opportunity is real and unoccupied.** Smart queue + first-class CarPlay is genuinely differentiated against all four named competitors. No competitor currently holds this position.
2. **Define the queue model first.** The definition of "smart" is the highest-risk design decision. A rules-based v1 (user-defined priority weights and filters) is the recommended starting point — it is concrete, implementable, and extensible.
3. **Design CarPlay in, not on.** CarPlay must be a first-class consideration from the architecture stage, not a feature added after the fact.
4. **Local-first is a strategic simplifier.** No backend in v1 removes an entire class of complexity and is also a meaningful differentiator.
5. **Keep the success bar grounded.** The MVP is "Jon uses this as his daily driver." App Store release is aspirational. This protects scope and motivation.

#### Assumptions (qa: skip)

- "Smart queue" is assumed to mean explicit rules and priority weights set by the user, not ML inference, for v1.
- CarPlay's most valuable surfaces are assumed to be Now Playing and queue browse (not full library navigation).
- Auto-download is assumed to be rules-based (e.g., auto-download new episodes from priority podcasts), not purely manual.
- Podcast discovery/search is assumed to be out of scope for v1; subscriptions are managed by direct RSS URL entry or Podcast Index search.

---

## Knowledge
_Completed: 2026-05-01_

> Source note: No external stakeholder transcripts exist. This section synthesizes domain knowledge from the `### Synthesized Discovery` section of `prd-audit.md` (primary source) combined with analyst knowledge about podcast app UX patterns, CarPlay HIG constraints, and competitive app behavior. Web search was unavailable (permissions blocked); all findings are drawn from the discovery Q&A and training-time domain knowledge of the podcast / CarPlay space. Findings labeled [DISCOVERY] trace directly to the Q&A record; findings labeled [DOMAIN] are analyst knowledge applied to the problem.

### Q&A Log

| # | Question | Options | Answer | Follow-up |
|---|----------|---------|--------|-----------|
| — | Q&A skipped | — | `qa: skip` in execution context | Assumptions documented below |

**Assumptions made under `qa: skip`:**
1. "Smart queue" means rules-based prioritization the user configures, not ML inference — consistent with the local-first, no-backend constraint.
2. CarPlay needs cover: subscription browse, now-playing controls, and queue peek as the minimum viable surface set.
3. Auto-download per subscription rule is in scope as a natural companion to smart queue.
4. No podcast discovery/search in v1 — subscriptions-only, consistent with stated scope boundaries.

---

### Knowledge Extraction

#### Category 1: Pain Points with Existing Apps

**KN-01 — Manual queue is the universal failure mode across all competitors**
[DISCOVERY] Every major podcast app (Apple Podcasts, Castro, Overcast, Pocket Casts) requires the user to manually drag episodes into queue order. There is no automation layer. [DOMAIN] This forces a context-switch: the user must think like a scheduler ("what do I want to hear next?") rather than a listener. The cognitive load is highest when it matters most — before getting in the car, when attention is split. None of the four competitors has addressed this in any meaningful way.

**KN-02 — Castro's inbox model solves triage but not ordering**
[DISCOVERY] Castro is acknowledged as polished but has "limited smart automation" as a known weakness. [DOMAIN] Castro's inbox/triage model distinguishes between "should I listen to this?" (inbox) and "when should I listen to this?" (queue position). It solves the first problem well — episodes are starred or trashed. But the second problem remains fully manual. Once an episode enters the queue, position is drag-and-drop only. There are no rules like "short episodes first on Monday mornings" or "always play news before entertainment." Castro is the closest competitor but stops at the triage layer.

**KN-03 — CarPlay in existing apps is a port of the phone UI, not designed for driving**
[DISCOVERY] Castro's CarPlay is "functional but not great"; Apple Podcasts has "basic queue, no smart features." [DOMAIN] Specific failure modes present in existing apps: (a) too many taps to resume or switch episodes from cold start; (b) no queue visibility from the Now Playing screen; (c) no way to skip a podcast mid-episode and continue the queue without looking away from the road; (d) search and browse are present but unsafe to use while driving. These are structural problems rooted in treating CarPlay as a port rather than a primary surface.

**KN-04 — No app combines smart queue with CarPlay — this is a compound gap**
[DISCOVERY] Explicitly identified as the differentiation opportunity. [DOMAIN] This is more than additive — it is a compound gap. Smart queue without CarPlay means setup happens on the phone before driving. CarPlay without smart queue means the in-car interface is polished but the queue is still wrong. The combination — rules execute automatically so the queue is already correct before the driver gets in the car — eliminates the pre-drive setup ritual entirely. Neither half alone delivers this.

**KN-05 — Playback continuity is fragile across restarts and audio interruptions**
[DOMAIN] A known reliability pain point in the category: apps lose playback position on crash, reset speed settings on episode boundaries, or lose queue state when aggressively backgrounded by iOS. "Episode progress sync across restarts" is listed as a should-have in the discovery, but this is load-bearing for a daily-driver app. Losing your place mid-commute is a trust-destroying experience that causes users to abandon apps.

---

#### Category 2: Domain Heuristics for Smart Queue UX

**KN-06 — Queue rules must be transparent and overridable**
[DOMAIN] Smart automation creates anxiety when it is opaque. Users need to see *why* an episode is at position N (which rule placed it there), and be able to override it temporarily without destroying the rule. The mental model: rules set defaults, manual actions set exceptions. The queue UI should show rule attribution ("sorted by: newest first, News category") so users can build trust incrementally. Without this transparency, smart queues feel magical but untrustworthy — and users revert to manual control.

**KN-07 — Episode duration is the highest-ROI queue sorting signal**
[DOMAIN] Duration is the most actionable piece of metadata for queue intelligence. Short commute? Surface episodes under 25 minutes. Long drive? Surface the 90-minute interview. Every episode RSS feed includes `<itunes:duration>`, making this a zero-backend signal available immediately. No existing app exposes duration as a queue sort key despite its obvious utility. This is a low-implementation-cost, high-perceived-value differentiator.

**KN-08 — Staleness decay is a real user behavior pattern**
[DOMAIN] Podcast listeners frequently abandon episodes that feel stale — an episode that mattered on Monday loses urgency by Wednesday. Smart queue should model this by surfacing "time-sensitive" episodes (daily news, event recaps) early and deprioritizing episodes past a configurable staleness threshold. This is analogous to email inbox zero behavior. Castro partially addresses this with "top" vs. "new" labels but has no time-decay logic. An explicit staleness model would be a novel, defensible heuristic.

**KN-09 — Category interleaving prevents listener fatigue**
[DOMAIN] Users who subscribe to many feeds experience pile-up — 6 news episodes queue after a news cycle, producing burnout. A smart queue should interleave categories (news, interview, storytelling, educational) to maintain variety. This is a standard heuristic in music playlist design (Spotify uses it explicitly) applied to podcast queues. No podcast app currently implements this. It requires per-subscription category tagging, which hlyst could expose as a first-class data field.

**KN-10 — Per-podcast playback speed is operational knowledge, not a preference**
[DOMAIN] Heavy podcast listeners maintain distinct playback speeds per show: 1.0x for dense technical content, 1.5x for interview shows, 2.0x for news recaps. This is operational knowledge that must survive app reinstalls and device migrations. It should be stored as a per-subscription setting, not a global toggle, and must persist as a first-class field in the local data model. Overcast has global Smart Speed processing but does not store per-feed speed memory. This is a loyalty-generating feature: users who configure per-feed speeds will not switch apps because they would lose that configuration.

---

#### Category 3: CarPlay HIG Constraints (Binding Design Requirements)

**KN-11 — CarPlay template system constrains all UI freedom**
[DOMAIN] CarPlay apps cannot render arbitrary UIKit or SwiftUI views. They must use Apple's CPTemplate system: `CPListTemplate` (lists/browse), `CPNowPlayingTemplate` (playback), `CPTabBarTemplate` (tab navigation), `CPGridTemplate` (grid), `CPInformationTemplate` (info). React Native CarPlay libraries (react-native-carplay) wrap these templates. This means the hlyst CarPlay UI is fully constrained to what these templates support — no custom gestures, no custom layouts, no swipe-to-reorder in the CarPlay context. All queue manipulation that can't be expressed through list selection must happen on the phone.

**KN-12 — Interaction depth must be shallow by HIG mandate**
[DOMAIN] Apple's CarPlay HIG specifies that apps should require no more than 2 taps to reach the most common action from the CarPlay home screen. For a podcast app: "resume playback" (0 taps if audio is active; 1 tap to Now Playing) and "skip to next episode" (1 tap from Now Playing) must be within this budget. Browse flows (find a specific episode) are acceptable at 3 taps but must not be required for normal daily use. This constraint means the queue must already be correct before the user gets in the car — deep CarPlay navigation is the fallback, not the workflow.

**KN-13 — CarPlay does not support text input**
[DOMAIN] No keyboard or text entry is available in CarPlay. All navigation is via list selection or Now Playing controls. Search-to-play is unavailable in the CarPlay context — the queue and subscription list are the only navigation primitives. Siri integration is the only text-equivalent pathway and requires a separate entitlement and SiriKit intent implementation. For v1, the practical implication is: anything the user cannot reach by tapping a list item in CarPlay must be pre-configured on the phone.

**KN-14 — Now Playing template has exactly 3 custom button slots**
[DOMAIN] `CPNowPlayingTemplate` exposes a fixed set of controls: playback rate indicator, repeat, shuffle, and up to 3 custom action buttons. The playback bar (play/pause, skip forward/back with configurable intervals) is always present. Custom buttons are the only mechanism for app-specific CarPlay actions. Candidate buttons for hlyst: (1) skip this episode and advance queue, (2) mark played, (3) queue peek / "what's next." This is a binding design constraint — not all phone-side actions can be exposed in CarPlay, and button selection requires explicit prioritization before implementation.

**KN-15 — Audio session management is load-bearing in the CarPlay context**
[DOMAIN] iOS audio session interruptions (phone calls, navigation prompts, Siri) must be handled correctly or CarPlay will silently lose playback state. The app must implement `AVAudioSession` interruption notifications, duck audio for navigation prompts, and resume cleanly after interruptions end. This is a known implementation pain point for React Native audio libraries (react-native-track-player) — incorrect session category causes playback to stop when the screen locks or a call arrives, with no visible error to the user. This must be treated as a reliability must-have, not a polish item.

---

#### Category 4: Implicit Design Requirements (Inferred from Discovery)

**KN-16 — Local-first means the queue is the source of truth, and that is a UX advantage**
[DISCOVERY + DOMAIN] No backend in v1 means all queue state, playback progress, and rules live on-device. This shapes the UX contract: the app owns the queue completely, with no sync conflicts, no loading states, no server round-trips before playback. This is a UX advantage over cloud-syncing apps (instant response, works in tunnels and airplane mode) and should be treated as a design principle and a marketing claim, not an apologetic constraint.

**KN-17 — The pre-drive ritual is the core use case and the design anchor**
[DISCOVERY + DOMAIN] The primary user commutes by car and uses CarPlay regularly. The implicit daily workflow is: (a) new episodes arrive via RSS overnight; (b) triage happens (inbox model or automatic); (c) the queue is ordered by rules; (d) user gets in the car and presses play — zero manual intervention on a typical day. Every design decision should be evaluated against this ritual: background RSS refresh, automatic queue re-ordering, CarPlay session continuation. The app should excel at this workflow first; podcast discovery is secondary.

**KN-18 — RSS polling cadence is a hidden quality signal**
[DOMAIN] Episode freshness depends on RSS poll frequency. Hourly polling is standard; 15-minute polling is aggressive but acceptable for time-sensitive feeds. Daily polling will frustrate users whose news feeds publish at 6am if they want episodes ready by 7am commute. This is an operational detail invisible in most app UIs but a real quality differentiator. Per-feed refresh frequency should be an exposed advanced setting, defaulting to a sensible interval (e.g., every 30 minutes for feeds marked "time-sensitive").

---

### Loss Risk Assessment

| Knowledge Item | Risk if Lost | Transmission Path |
|----------------|-------------|-------------------|
| KN-11: CarPlay template system constraints | Builds wrong UI; rejected by App Store review or broken at runtime | Developer discovers on first CarPlay build attempt — late |
| KN-15: Audio session management | Silent playback failure in CarPlay; trust-destroying for daily-driver use | Surfaces in testing but easy to ship with subtle bugs |
| KN-14: Now Playing 3-button limit | Over-engineers CarPlay controls; forced redesign under pressure | Apple documentation; commonly discovered after initial implementation |
| KN-06: Rules transparency heuristic | Smart queue feels untrustworthy; users revert to manual | UX design principle easy to skip under schedule pressure |
| KN-10: Per-podcast speed as persistent data | Speed preferences lost on reinstall; users abandon app | Discovered by user after first reinstall, often too late |
| KN-08: Staleness decay model | Stale episodes clog queue; undermines "effortless" promise | Emerges from real usage over weeks, not in initial testing |

### Key Takeaways

1. **The compound gap is real and buildable.** Smart queue + first-class CarPlay is genuinely unoccupied across all four competitors. The CarPlay constraints are known and navigable (template system, 3-button limit, no text input).

2. **CarPlay is a hard constraint on queue design, not an add-on.** The queue must be correct *before* the user gets in the car, because in-car queue manipulation is severely limited by HIG. Smart queue automation is the prerequisite for CarPlay to be useful, not a separate feature.

3. **Episode duration and category interleaving are the highest-ROI queue signals.** Both are available in RSS metadata with no backend required, and neither is exploited by any competitor.

4. **Audio session reliability is a hidden load-bearing must-have.** Getting it wrong silently breaks the CarPlay experience. It must be architected correctly from the first audio integration, not retrofitted.

5. **The pre-drive ritual is the user story.** All design decisions should be evaluated against: "does this make the morning commute queue effortless?" not "does this make podcast discovery richer?"

---

## Competitors
_Completed: 2026-05-01_

> **Research note:** Web search was unavailable in this environment (permission denied). Competitor profiles are synthesized from (a) the Synthesized Discovery section of this audit, which captures the developer's direct experience with Apple Podcasts and Castro, and (b) training knowledge through August 2025 covering Overcast and Pocket Casts. Gaps that would benefit from live app verification are flagged inline.

### Q&A Log

| # | Question | Options | Answer | Follow-up |
|---|----------|---------|--------|-----------|
| — | Q&A skipped per `qa: skip` execution context. Best-judgment decisions made from source material. Assumptions documented in profiles below. | — | — | — |

---

### Competitor Profiles

#### 1. Apple Podcasts

**Description:** Apple's built-in podcast client, shipping on every iPhone and iPad. Default choice for a large fraction of iOS users by virtue of pre-installation.

**Target audience:** Casual to moderate podcast listeners; anyone who wants zero setup on a new iPhone.

**Pricing:** Free, no subscription tier.

**Strengths:**
- Zero friction entry — pre-installed, uses Apple ID sign-in
- Deep iOS/iPadOS/macOS/watchOS/CarPlay system integration (Apple owns the CarPlay APIs)
- Siri integration for voice control
- Podcast directory is large and well-maintained
- Automatic episode downloads on Wi-Fi
- iCloud sync of subscriptions and playback position across devices
- Shared-with-you integration (episodes sent via iMessage)

**Weaknesses:**
- Queue management is rudimentary: a single "Up Next" list, entirely manual drag-to-reorder
- No smart or rules-based queue ordering
- No audio enhancement (no smart speed or voice boost equivalent)
- CarPlay shows a flat Up Next list with no browse-by-podcast or filtering; no ability to reorder from the car
- No per-podcast playback speed settings (speed is global only)
- History and progress tracking is shallow

**Queue management detail:** Up Next is the only queue concept. Users add episodes manually via context menu. No automated prioritization, no rules, no smart sort. On CarPlay, Up Next is read-only — users cannot reorder or add episodes from the car.

**CarPlay quality:** Functional but minimal. Native, so it loads reliably and responds to Siri. UI is a simple Now Playing + Up Next list; no podcast library browse from the car. Considered the floor for CarPlay implementation quality — present but not useful for heavy users.

**Source:** Synthesized Discovery (direct use by developer); training knowledge.

---

#### 2. Castro

**Description:** iOS-only podcast app built around an "inbox + triage" philosophy. Episodes arrive in an inbox; the user triages each one to the queue, archive, or later list. Developed by Supertop, later acquired by Tiny.

**Target audience:** Power podcast listeners who subscribe to many shows and want intentional, curated control over what enters their listening queue.

**Pricing:** Free tier with Castro Plus subscription (~$18.99/year or ~$2.99/month as of 2024–2025) unlocking CarPlay, Queue Boost, enhanced chapter support, and other power features.

**Strengths:**
- Inbox/triage model is distinctive and well-loved — forces intentional curation, prevents queue bloat
- Queue Boost: lets users pin certain shows so their episodes jump to the front of the queue automatically — the closest thing to smart queue ordering in the competitive set
- Polished, opinionated iOS-native UI
- Per-episode and per-show playback speed
- Chapter support (Plus), sleep timer, Voice Boost
- Active community

**Weaknesses:**
- Queue Boost is the extent of automation — binary (boosted or not), not a multi-factor rules engine
- No dynamic queue reordering based on episode attributes (length, age, topic, listen history)
- CarPlay is functional but limited: requires Castro Plus; shows queue and a small podcast browser; experience assessed as "functional but not great" by the developer (corroborates Discovery Q6)
- CarPlay does not expose the triage inbox — users cannot triage from the car
- Subscription required for CarPlay is a friction point

**Queue management detail:** Triage model: inbox -> queue or archive. Queue Boost auto-promotes specific shows to the front. Beyond that, reordering is manual drag-and-drop. No rules beyond "boost yes/no." No smart sorting by episode properties.

**CarPlay quality:** Available on Plus tier only. Shows queue list and limited podcast browse. Standard Now Playing controls. Reliable but not differentiated. Queue management from CarPlay is play/pause/skip; no reordering or triage from the car.

**Source:** Synthesized Discovery (direct use by developer); training knowledge.

---

#### 3. Overcast

**Description:** Independent iOS podcast app by Marco Arment. Widely regarded as the gold standard for audio quality enhancement among iOS podcast apps.

**Target audience:** Audio-quality-focused listeners and power users who want fine-grained playback control; iOS and macOS.

**Pricing:** Free with ads; Overcast Premium (~$9.99/year) removes ads and enables personal audio file uploads. All features free — no feature gating behind subscription.

**Strengths:**
- Smart Speed: silently trims silence in a way that sounds natural — the industry benchmark
- Voice Boost: normalizes and enhances vocal clarity, especially useful in noisy cars
- Per-podcast and per-episode playback speed with fine increments
- Playlists with filters: can filter by unplayed/in-progress status, specific shows, date range, duration range — the most flexible queue-adjacent feature in the competitive set
- Strong CarPlay support: playlists appear in CarPlay, now-playing controls are clean, browse-by-playlist works from the car
- Chapter support, OPML import/export
- Reliable, lean app — known for stability

**Weaknesses:**
- Playlists are manually configured filter sets, not a dynamic smart queue that self-prioritizes
- No single canonical "queue" — users manage multiple playlists instead, adding cognitive overhead
- Auto-downloading rules are coarse (recent N episodes per show)
- No inbox/triage — all episodes land in a show feed
- CarPlay playlist navigation can be cumbersome with many playlists
- No cross-platform sync (iOS/macOS only)

**Queue management detail:** Playlists are the queue mechanism. Each playlist has configurable filters (include/exclude shows, played status, date range, duration) and execution order (oldest first, newest first, shortest first, etc.). This is the most powerful static filtering in the competitive set, but not adaptive — the playlist reruns its filter on demand, it does not learn or dynamically reprioritize.

**CarPlay quality:** Best in class among the four competitors. Playlists surface directly in CarPlay. Voice Boost and Smart Speed continue in CarPlay (audio processing is app-level). Browse depth is limited to playlists and individual shows, but the experience is considered reliable and polished.

**Source:** Synthesized Discovery (research target identified by developer); training knowledge.

---

#### 4. Pocket Casts

**Description:** Cross-platform podcast app (iOS, Android, web, desktop) originally by Shifty Jelly, acquired by NPR/public radio consortium, later sold to Automattic (WordPress). The most feature-complete cross-platform option.

**Target audience:** Listeners who use multiple device platforms (iOS + Android + web); power users who want deep filtering and cross-device sync.

**Pricing:** Free (account required); Pocket Casts Plus (~$3.99/month or ~$39.99/year) for desktop apps, themes, cloud storage for personal audio files, and early-access features.

**Strengths:**
- Filters: highly configurable episode filters (played status, starred, downloaded, show, duration, release date) — comparable to Overcast playlists
- Up Next queue supports "play next" / "play last" shortcuts from episode context menus
- Cross-platform sync: subscriptions, playback position, and Up Next sync via Pocket Casts account
- Trim Silence and Volume Boost (analogous to Overcast's features, somewhat less well-regarded)
- Chapter support, sleep timer, auto-download rules per show
- Strong podcast discovery (Top Charts, curated lists, staff picks)
- Client apps open-sourced in 2023

**Weaknesses:**
- Up Next queue is still manual: no smart prioritization, no rules-based ordering
- Filters and Up Next are separate concepts — no mechanism to auto-populate Up Next from a filter in priority order
- CarPlay support is consistently reported as one of the weakest implementations among major podcast apps — limited browse depth, occasional reliability issues
- Cross-platform focus means UI decisions sometimes feel like compromises vs iOS-native apps
- Account required even for free tier — introduces server dependency counter to local-first philosophy
- Automattic ownership has introduced uncertainty about long-term product direction

**Queue management detail:** Up Next is the primary queue (manual). Filters are separate views, not a queue. Users can add individual episodes from filter results to Up Next, but there is no mechanism to say "auto-populate Up Next from this filter in this priority order." Queue management from CarPlay is play/pause/skip only.

**CarPlay quality:** Below average for the category. CarPlay loads the app but browse is shallow. Reliability complaints are more frequent than for Overcast or Castro. The cross-platform codebase likely contributes to the weaker native CarPlay integration.

**Source:** Synthesized Discovery (research target identified by developer); training knowledge.

---

### Comparative Feature Table

| Dimension | Apple Podcasts | Castro | Overcast | Pocket Casts | hlyst (target) |
|-----------|---------------|--------|----------|--------------|----------------|
| **Queue model** | Manual Up Next list | Inbox/triage + Queue Boost | Manual playlists with static filters | Manual Up Next + separate filters | Smart queue: rules-based auto-ordering |
| **Smart/auto queue** | None | Queue Boost (binary per-show) | None (static filters, not adaptive) | None | Rules engine + dynamic prioritization |
| **Queue control from CarPlay** | Read-only, no reorder | Play/pause/skip only | Play/pause/skip; playlist select | Play/pause/skip only | Queue view + designed-for-car controls |
| **CarPlay quality rating** | Functional / shallow | Adequate (Plus only) | Good (best in class) | Below average | First-class (design target) |
| **Audio processing** | None | Voice Boost | Smart Speed + Voice Boost (best-in-class) | Trim Silence + Volume Boost | TBD |
| **Offline / local-first** | Auto-download; iCloud sync | Auto-download per show | Auto-download per show (last N eps) | Auto-download per show; cloud sync | Local-first, no backend v1 |
| **Cross-platform** | Apple ecosystem only | iOS only | iOS/macOS | iOS, Android, web, desktop | iOS only (v1) |
| **Pricing** | Free | Free + Plus ~$19/yr | Free + Premium ~$10/yr | Free + Plus ~$40/yr | TBD (personal tool; App Store TBD) |
| **Podcast directory** | Apple Podcasts (large) | Apple Podcasts | Overcast directory | Pocket Casts + Apple | RSS / Podcast Index |
| **Chapter support** | Yes | Yes (Plus) | Yes | Yes | Should-have |
| **Per-show playback speed** | No (global only) | Yes | Yes | Yes | Yes |
| **Sleep timer** | Yes | Yes | Yes | Yes | Should-have |
| **Background playback** | Yes | Yes | Yes | Yes | Must-have |
| **Account required** | Apple ID (ambient) | Optional | No | Yes | No (local-first) |

**Table stakes** (all competitors have): background playback, sleep timer, variable playback speed, chapter support, auto-download, some CarPlay presence, podcast directory integration.

**Differentiators in the competitive set** (where apps diverge): audio processing quality (Overcast leads), queue intelligence (Castro's Boost is the only attempt; Overcast's playlists are the closest to filter-based queuing), CarPlay depth (Overcast best; Pocket Casts worst), cross-platform parity (Pocket Casts only), inbox/triage model (Castro only).

---

### Market Gaps hlyst Can Exploit

**Gap 1: No app has a genuinely smart queue.**
Every competitor's queue is manual at its core. Castro's Queue Boost is the only nod toward automation, and it is binary (show is boosted or not). Overcast's playlists are the most flexible filtering but static — they don't adapt, learn, or self-prioritize. A queue that orders episodes by user-defined rules (e.g., "short episodes first on weekdays," "always finish in-progress before starting new," "deprioritize shows I haven't listened to in 30 days") does not exist anywhere in the market.

**Gap 2: CarPlay is an afterthought for every competitor.**
Apple Podcasts ships a native but shallow CarPlay experience. Castro's CarPlay requires a paid subscription and offers minimal control. Overcast's CarPlay is the best of the group but remains limited to playlist selection and standard now-playing. Pocket Casts CarPlay is the weakest. None of the competitors has designed CarPlay as a primary UX surface — it is universally an extension of the phone UI, not a designed-for-the-car experience.

**Gap 3: The combination of smart queue + great CarPlay does not exist.**
This is the compound gap. The two individually unserved needs reinforce each other: a smart queue is most valuable in the car, where manual reordering is impossible or dangerous. A queue that gets itself in order before you get in the car, paired with a CarPlay UI designed to show and navigate that queue, addresses a real and unmet need that no competitor has targeted.

**Gap 4: Local-first / no-account for power features.**
Pocket Casts requires an account. Castro's best features are behind a subscription. Overcast is the most liberal (no account, all features free). There is space for an app that provides powerful features with no server dependency and no account — particularly appealing to privacy-conscious users and developers who distrust cloud sync.

**Gap 5: No competitor is built on React Native / Expo (strategic, not user-facing).**
The React Native podcast ecosystem (react-native-track-player, expo-av, CarPlay bridging) has matured significantly. Building on this stack means faster iteration for a solo developer and the possibility of Android parity in v2 without a full rewrite — a future option none of the iOS-native competitors can easily replicate.

---

### Key Takeaways

1. **Queue management is the primary competitive opportunity.** Every major competitor has gestured at it (Castro's Boost, Overcast's playlists) but none has solved it. The market is primed for a queue-first app.

2. **CarPlay is under-invested across the board.** The car is a high-value listening context and every competitor treats CarPlay as a checkbox. A first-class CarPlay experience is a genuine differentiator with no current owner.

3. **Overcast sets the audio quality bar.** Smart Speed and Voice Boost are well-loved. hlyst should either adopt equivalent open-source audio processing or explicitly acknowledge the tradeoff. This is a table-stakes expectation for power users who might consider switching.

4. **Castro's triage model is the philosophical predecessor.** The inbox/triage metaphor resonates with heavy podcast listeners. hlyst's smart queue is a complementary and arguably superior approach — instead of requiring the user to triage manually, the queue triages itself by rules. This is a meaningful evolution of Castro's philosophy.

5. **Pocket Casts users are a natural acquisition target** if hlyst ships a strong CarPlay experience. Pocket Casts CarPlay is the weakest in the category, and Pocket Casts users on iOS are potentially open to switching to a better iOS-native option.

6. **The compound differentiation is defensible.** Smart queue + first-class CarPlay is not just two features — it is a coherent product thesis: "the podcast app that gets itself ready before you get in the car." That thesis is easy to communicate and hard for incumbents to copy quickly (CarPlay investment requires significant native development effort; smart queue requires rethinking the data model from the ground up).

7. **Pricing and account friction are secondary but worth noting.** The market has trained users to accept freemium pricing. hlyst as a personal tool has no immediate monetization pressure, but a no-account, no-subscription baseline is a differentiator worth maintaining and communicating.

---

## Requirements
_Completed: 2026-05-01_

> Source note: All requirements are extracted from `PRD.md` (sections 2.0–5.4) and prior audit sections (Discovery, Opportunity, Knowledge, Competitors). MoSCoW prioritization is autonomous (qa: skip). Reasoning for each priority decision is documented inline. The primary bar is "daily driver quality"; CarPlay is first-class, not an add-on; local-first/no-backend is a hard constraint.

---

### Q&A Log

| # | Question | Options | Answer | Follow-up |
|---|----------|---------|--------|-----------|
| — | Q&A skipped per `qa: skip` execution context. MoSCoW decisions made autonomously from source material. Reasoning documented per requirement. | — | — | — |

---

### 5.1 Functional Requirements

#### FR-01 — RSS Subscription Management
**MoSCoW: Must**
The app must allow the user to add podcast subscriptions via direct RSS URL entry. Removing subscriptions must also be supported. Without this there is no content pipeline. Direct RSS URL and Podcast Index search are the only two subscription pathways; curated discovery is explicitly out of scope.

**Reasoning:** The entire app depends on a subscription catalog. No subscriptions = no episodes = nothing functions. This is pre-condition to every other functional requirement.

**Source:** PRD 2.2, 3.3, 5.4; Discovery Q3, Q8; Opportunity assumption 4.

---

#### FR-02 — Podcast Index / RSS Search for Subscription Add
**MoSCoW: Should**
The app should allow searching the Podcast Index API to find and subscribe to podcasts by name or topic, not just by direct RSS URL. RSS URL entry alone is functional but unfriendly.

**Reasoning:** A heavy listener managing many subscriptions will benefit from search-based add. However, bare RSS URL entry satisfies the daily-driver bar since the user already knows their feeds. Elevated to Should rather than Must based on the daily-driver framing — not a blocker, but meaningfully improves UX.

**Source:** PRD 3.3, 5.3; Discovery Q8; Opportunity assumption 4.

---

#### FR-03 — Episode Feed Fetch and Refresh
**MoSCoW: Must**
The app must fetch RSS feeds for all subscriptions and parse episode metadata (title, description, duration, publication date, enclosure URL). Refresh must run in the background on a configurable per-feed cadence.

**Reasoning:** Without feed refresh, no new episodes arrive. Background refresh is non-negotiable for the pre-drive ritual (KN-17): episodes must be ready when the user gets in the car, not fetched on demand. Malformed RSS graceful handling is also required (PRD 5.3).

**Source:** PRD 3.3, 5.3; KN-17, KN-18; Discovery Q8.

---

#### FR-04 — Per-Feed RSS Refresh Cadence Setting
**MoSCoW: Should**
The user should be able to configure the RSS polling frequency per feed, with a sensible default (e.g., 30 minutes for feeds flagged as time-sensitive). A global default must exist; per-feed override is the Should element.

**Reasoning:** KN-18 identifies this as a hidden quality signal. For the primary use case (commute), time-sensitive news feeds must arrive before the morning commute. A global default alone is insufficient for a heavy listener managing feeds with different freshness requirements. Elevated to Should because it directly enables the core use case; demoted from Must because a single aggressive global default is an acceptable v1 fallback.

**Source:** KN-18; PRD 3.3.

---

#### FR-05 — Episode Playback (Core Controls)
**MoSCoW: Must**
The app must support: play, pause, seek, skip forward/back (configurable intervals), and variable playback speed. These are table stakes across all competitors and required for any usable podcast app.

**Reasoning:** No podcast app ships without these. Non-negotiable baseline.

**Source:** PRD 2.2, 5.3; Discovery synthesized requirements; Competitor table.

---

#### FR-06 — Per-Subscription Playback Speed Persistence
**MoSCoW: Must**
Each podcast subscription must store an independently configured playback speed. Speed must survive app restarts, updates, and device migrations. The data model must store this as a first-class per-subscription field.

**Reasoning:** KN-10 explicitly flags this as a loyalty-generating feature and a trust-destroying failure point if absent. Heavy listeners maintain distinct speeds per show (e.g., 1.0x for dense technical content, 2.0x for news recaps). Losing this configuration on reinstall is a deal-breaker for daily-driver adoption. Elevated to Must because it directly affects the daily-driver success bar.

**Source:** KN-10; PRD 3.5 comparative table; KN-05.

---

#### FR-07 — Episode Progress Persistence
**MoSCoW: Must**
The app must persist playback position for every episode across app restarts, crashes, and background kills. Position must be restored automatically on resume. Position must be stored at meaningful intervals (not just on app close).

**Reasoning:** KN-05 identifies this as a "trust-destroying failure mode." Losing position mid-commute causes users to abandon apps. For daily-driver adoption this is a reliability must-have, not a polish item. The primary success bar includes "no silent playback failures across 30 consecutive CarPlay sessions" (PRD 2.3), which subsumes position persistence.

**Source:** KN-05; PRD 2.3; Discovery synthesized should-have list (elevated to Must given daily-driver bar).

---

#### FR-08 — Background Audio Playback
**MoSCoW: Must**
Audio must continue playing when the app is backgrounded, the screen is locked, or the user switches to another app. This includes CarPlay sessions where the phone is in the user's pocket.

**Reasoning:** All four competitors support this; it is a table-stakes baseline. Without it the app is not functional for any in-car use.

**Source:** PRD 5.3; Competitor table; Discovery synthesized must-have list.

---

#### FR-09 — Episode Download for Offline Playback
**MoSCoW: Must**
The app must support downloading episodes to local storage for offline playback. Downloaded episodes must be playable with no network connection. Auto-download per subscription rules is part of this requirement.

**Reasoning:** PRD 2.2 lists offline playback explicitly in v1 scope. The car context (tunnels, dead zones) makes offline capability non-negotiable for daily-driver use. Local-first architecture (no backend) means local storage is the only option.

**Source:** PRD 2.2; Discovery Q9; KN-16.

---

#### FR-10 — Auto-Download Rules per Subscription
**MoSCoW: Should**
The app should support configuring auto-download behavior per subscription: always auto-download new episodes, only download manually, or download when episode enters the queue. A global default must exist; per-subscription override is the Should element.

**Reasoning:** Auto-download is companion to the smart queue — episodes must be present locally before the drive. An explicit manual-only option is also needed for subscriptions the user wants to triage before downloading. Elevated to Should rather than Must because a reasonable global default (auto-download all) satisfies the daily-driver use case in the absence of per-subscription control.

**Source:** Opportunity assumption 3; KN-17; PRD 2.2; Competitor table.

---

#### FR-11 — Smart Queue: Rules-Based Auto-Ordering
**MoSCoW: Must**
The app must implement a rules-based queue engine that automatically orders episodes according to user-configured priority rules. Rules must operate on available RSS metadata signals: episode duration, publication date, podcast subscription, and user-assigned episode category. The queue must re-evaluate and reorder automatically when new episodes arrive or rule parameters change.

**Reasoning:** This is the core product thesis. PRD 2.1 states it explicitly: "a rules-based smart queue that auto-orders episodes by user-defined priorities." Every success metric ties back to this. Without it, hlyst is just another manual-queue podcast app. CarPlay is only valuable if the queue is already correct (KN-04, KN-12). This is the reason the app exists.

**Source:** PRD 2.1, 2.2, 3.1, 3.2; KN-04, KN-07, KN-17; Discovery Q4, Q7.

---

#### FR-12 — Queue Rule: Duration-Based Sorting
**MoSCoW: Must**
The smart queue must support sorting or filtering episodes by duration. At minimum: surface episodes under a user-specified threshold (e.g., "short commute mode: episodes under 25 minutes") or sort by duration ascending/descending.

**Reasoning:** KN-07 identifies duration as the highest-ROI queue sorting signal. `<itunes:duration>` is available in every RSS feed — no backend required. No competitor exposes this. It is the single lowest-cost, highest-value queue differentiator. Must.

**Source:** KN-07; PRD 3.2 opportunity table.

---

#### FR-13 — Queue Rule: Staleness / Age-Based Decay
**MoSCoW: Should**
The smart queue should model episode staleness: time-sensitive episodes (e.g., daily news, event recaps) should be surfaced earlier; episodes past a configurable age threshold should be deprioritized automatically.

**Reasoning:** KN-08 identifies this as a real behavior pattern. Loss risk is "stale episodes clog queue; undermines effortless promise" (KN loss table). However, a simpler recency sort achieves much of the value; a full staleness decay model is a Should enhancement rather than Must for v1.

**Source:** KN-08; PRD 3.2.

---

#### FR-14 — Queue Rule: Category Interleaving
**MoSCoW: Could**
The smart queue could interleave episodes across user-assigned categories (news, interview, storytelling, educational) to prevent category pile-up.

**Reasoning:** KN-09 identifies this as valuable but it requires per-subscription category tagging as a prerequisite. While the value is real (listener fatigue reduction), the complexity of building category tagging + interleaving logic makes this a v1 Could rather than Should. It is defensible to defer to post-daily-driver-validation.

**Source:** KN-09.

---

#### FR-15 — Queue Rule Transparency (Rule Attribution Display)
**MoSCoW: Must**
The app must display which rule placed each episode at its current queue position. The queue UI must show rule attribution (e.g., "sorted by: shortest first, News category"). Users must be able to understand why an episode is at position N without investigating rule settings.

**Reasoning:** KN-06 explicitly flags this as a trust-building requirement: "smart queues feel untrustworthy when opaque; users revert to manual control." For a product whose core thesis is "trust the queue," opacity is fatal. Elevated to Must because without it the smart queue feature fails to achieve adoption regardless of its accuracy.

**Source:** KN-06; Loss risk table (KN-06 loss = "users revert to manual").

---

#### FR-16 — Manual Queue Override (without destroying rules)
**MoSCoW: Must**
The user must be able to manually reorder, skip, or remove episodes from the queue without permanently disabling the smart queue rules. Manual overrides must be temporary exceptions, not mode switches. The queue should return to rules-based ordering on the next refresh cycle unless the user explicitly locks a position.

**Reasoning:** KN-06 specifies: "rules set defaults, manual actions set exceptions." A smart queue that users cannot override creates anxiety and distrust. A queue that loses all rules when the user manually moves one episode is equally broken. Both failures destroy adoption. The explicit and overridable model is a Must.

**Source:** KN-06; PRD 3.1 ("in-car correction is not a viable recovery mechanism" — pre-implies override must happen on phone pre-drive).

---

#### FR-17 — CarPlay Integration (Core Session)
**MoSCoW: Must**
The app must present a functional CarPlay interface using the CPTemplate system. At minimum: Now Playing template with playback controls, and a queue list accessible from Now Playing. The CarPlay session must initialize cleanly from a cold start and resume correctly after interruptions.

**Reasoning:** CarPlay is the primary success surface (PRD 2.1, 2.2). Without it, the pre-drive ritual is broken at the last mile. The CarPlay entitlement must be provisioned early (PRD 3.3). KN-11 through KN-15 all address CarPlay as load-bearing requirements.

**Source:** PRD 2.1, 2.2, 3.3; KN-11 through KN-15; KN-04, KN-17.

---

#### FR-18 — CarPlay Now Playing Controls
**MoSCoW: Must**
The CarPlay Now Playing template must expose: play/pause, skip forward, skip back, and at minimum 2 of the 3 custom button slots. Custom button candidates (in priority order): (1) skip this episode and advance queue, (2) mark as played, (3) queue peek. Button selection must be made explicit before implementation per KN-14.

**Reasoning:** KN-14 specifies the 3-button limit as a binding design constraint. Button selection requires intentional prioritization. Skip episode (advance queue) is the highest-priority custom action for the driving use case. Must-have because CarPlay is not functional for queue management without at least the skip-episode action.

**Source:** KN-14; PRD 3.1, 3.3; KN-03 failure mode analysis.

---

#### FR-19 — CarPlay Queue Browse (2-Tap Depth)
**MoSCoW: Must**
The user must be able to see the next N episodes in the queue from CarPlay within 2 taps of the CarPlay home screen. This satisfies the HIG interaction depth requirement (KN-12) and the core "queue visibility from Now Playing" gap identified in KN-03.

**Reasoning:** KN-12 mandates 2-tap depth for common actions. KN-03 identifies "no queue visibility from Now Playing" as a specific CarPlay failure mode across competitors. A queue peek that requires 3+ taps is a HIG violation and a UX failure. Must.

**Source:** KN-12, KN-03; PRD 3.3 CarPlay HIG constraint.

---

#### FR-20 — CarPlay Subscription Browse
**MoSCoW: Should**
The user should be able to browse subscriptions and jump to a specific podcast's episode list from CarPlay, allowing manual episode selection when the queue has the wrong episode.

**Reasoning:** Competitor analysis (Overcast) shows playlist/subscription browse in CarPlay is achievable and valued. However, the smart queue is designed to make this unnecessary for normal use. Elevated to Should rather than Must because the pre-drive ritual thesis holds that the queue should already be correct. Browse is the fallback, not the workflow (KN-12).

**Source:** KN-12; KN-03; PRD 3.1; Competitor analysis (Overcast CarPlay).

---

#### FR-21 — Audio Interruption Handling (AVAudioSession)
**MoSCoW: Must**
The app must correctly implement AVAudioSession interruption handling: duck audio for navigation prompts, suspend on phone calls, and resume cleanly when interruptions end. The audio session category must be configured correctly to prevent silent playback failure on screen lock or call arrival.

**Reasoning:** KN-15 labels this a "reliability must-have, not a polish item." PRD 3.3 calls it "load-bearing." The primary success metric (PRD 2.3) targets "no silent playback failures across 30 consecutive CarPlay sessions" — this requirement is the mechanism. Loss risk: "silent playback failure in CarPlay; trust-destroying for daily-driver use" (knowledge loss table).

**Source:** KN-15; PRD 3.3, 2.3; KN-05.

---

#### FR-22 — Episode Inbox / Triage Model
**MoSCoW: Could**
The app could implement a triage inbox (analogous to Castro's model) where new episodes arrive in a holding area before entering the smart queue, allowing the user to explicitly approve, skip, or defer each episode.

**Reasoning:** Castro's inbox is identified as a philosophical predecessor (PRD 3.4, KN-02). However, the hlyst thesis diverges: the smart queue triages automatically by rules. An explicit inbox creates manual overhead that contradicts the "zero manual intervention on a typical commute day" goal (PRD 2.3). A Could rating because it may be valuable for users who want more curation control, but it is not on the critical path for daily-driver adoption.

**Source:** KN-02; PRD 3.4; Opportunity section 6.

---

#### FR-23 — Sleep Timer
**MoSCoW: Should**
The app should include a sleep timer that stops playback after a user-specified duration.

**Reasoning:** Table stakes across all four competitors. Discovery synthesized should-have list. Not a Must because the daily-driver use case is driving (where sleep timers are not relevant), but it is a standard feature expectation for any podcast app and trivial to implement.

**Source:** Discovery synthesized requirements; Competitor table.

---

#### FR-24 — Chapter Support
**MoSCoW: Should**
The app should parse and display podcast chapter markers where present in the RSS feed or audio file, and allow navigation between chapters during playback.

**Reasoning:** All four competitors offer this (Castro requires Plus). It is a standard power-user expectation. Not a Must because the core use case does not depend on chapters; elevated to Should because its absence would be a notable gap for a daily-driver app.

**Source:** Discovery synthesized requirements; Competitor table.

---

#### FR-25 — Episode Played / Unplayed Tracking
**MoSCoW: Must**
The app must track played/unplayed status per episode and expose this as a queue filter signal. Marking played must dismiss the episode from the active queue. The smart queue must not resurface played episodes without explicit user action.

**Reasoning:** Played status is prerequisite to meaningful queue management. Without it, the queue re-fills with already-heard episodes on every refresh. This is a foundational data requirement for any podcast app, and especially for the smart queue which must know which episodes are new.

**Source:** PRD 2.2; Discovery synthesized requirements; Competitor table (all competitors have this).

---

#### FR-26 — OPML Import / Export
**MoSCoW: Should**
The app should support importing podcast subscriptions from an OPML file (for migration from other apps) and exporting subscriptions to OPML (for backup and portability).

**Reasoning:** A user switching from Castro or Overcast will want to import their existing subscription list. Without OPML import, adoption friction is high. OPML export is a portability expectation for a local-first app with no cloud backup. Should rather than Must because direct RSS URL entry is a functional fallback.

**Source:** Competitor profiles (Overcast supports OPML); PRD 2.2; local-first constraint (KN-16).

---

### 5.2 Non-Functional Requirements

#### NFR-01 — Playback Reliability (CarPlay Sessions)
**MoSCoW: Must**
The app must not produce silent playback failures across 30 consecutive CarPlay sessions. This is a stated success metric (PRD 2.3). Silent failure — audio stops with no visible error — is the most trust-destroying failure mode in the daily-driver context.

**Reasoning:** Directly from PRD 2.3 success metrics. AVAudioSession implementation (FR-21) is the primary mechanism.

**Source:** PRD 2.3; KN-15; KN-05.

---

#### NFR-02 — Offline Operation
**MoSCoW: Must**
All core playback and queue management functionality must operate with zero network connectivity. The app must not require network access to play downloaded episodes, navigate the queue, or apply queue rules. Network is required only for feed refresh and episode download initiation.

**Reasoning:** Local-first is a hard architectural constraint (PRD 3.3). Car use frequently encounters dead zones and tunnels. An app that requires connectivity to play is not a daily driver.

**Source:** PRD 2.2, 3.3; Discovery Q9; KN-16.

---

#### NFR-03 — No Backend / No Account
**MoSCoW: Must**
The app must operate with no server-side components, no user account, and no network calls except to RSS feeds and Podcast Index search. All application state — subscriptions, queue, playback progress, rules, settings — must reside on-device.

**Reasoning:** Local-first / no backend is a stated hard constraint, not optional (PRD 3.3). It is also a differentiator (PRD 3.2 opportunity table).

**Source:** PRD 3.3, 2.2; Discovery Q9; KN-16.

---

#### NFR-04 — Malformed RSS Tolerance
**MoSCoW: Must**
The RSS parser must handle malformed, partially-valid, and non-standard podcast feeds gracefully. Feed parse errors must not crash the app, lose other subscription data, or prevent the app from refreshing healthy feeds.

**Reasoning:** PRD 3.3 and 5.3 both call this out explicitly. RSS ecosystem fragility is identified as a risk (PRD 3.2). A daily-driver app cannot be destabilized by one bad feed.

**Source:** PRD 3.3, 5.3, 3.2.

---

#### NFR-05 — Background Queue Re-Evaluation
**MoSCoW: Must**
The smart queue must re-evaluate and reorder in the background without requiring the app to be in the foreground. Queue state must be correct when the user opens CarPlay, not computed on demand when CarPlay connects.

**Reasoning:** The pre-drive ritual (KN-17) depends on the queue being ready before the user gets in the car. If queue re-evaluation only happens in the foreground, the user must open the app before driving to trigger it — this defeats the "zero manual intervention" goal.

**Source:** KN-17; PRD 2.3 (zero manual queue intervention); FR-03, FR-11.

---

#### NFR-06 — Playback Continuity on Audio Interruption
**MoSCoW: Must**
The app must resume playback automatically after transient audio interruptions (navigation prompts, notification sounds) and require at most one user action to resume after sustained interruptions (phone calls). Playback position must be preserved through all interruptions.

**Reasoning:** Subsumes KN-05 and KN-15 into a measurable non-functional requirement. The daily-driver bar requires that commute playback survives Google Maps / Apple Maps navigation prompts without user intervention.

**Source:** KN-15, KN-05; PRD 2.3, 3.3.

---

#### NFR-07 — CarPlay Template Compliance
**MoSCoW: Must**
All CarPlay UI must use Apple's CPTemplate system exclusively. No custom views, no UIKit/SwiftUI rendering in the CarPlay context. The implementation must pass App Store review CarPlay guidelines.

**Reasoning:** KN-11 describes this as a binding technical constraint. Any non-template approach will fail at App Store review or at runtime.

**Source:** KN-11; PRD 3.3.

---

#### NFR-08 — CarPlay Interaction Depth (2-Tap Rule)
**MoSCoW: Must**
The most common daily actions (resume playback, skip to next episode) must require no more than 2 taps from the CarPlay home screen. Queue browse may require up to 3 taps. No common action may require text input.

**Reasoning:** KN-12, KN-13 both specify this as a binding HIG constraint, not a design preference.

**Source:** KN-12, KN-13; PRD 3.3.

---

#### NFR-09 — Local Data Durability
**MoSCoW: Must**
Subscriptions, queue state, playback progress, per-subscription speed settings, and queue rules must survive: app restarts, crashes, OS kills, and app updates. Data must not be stored in locations iOS may purge (e.g., NSTemporaryDirectory, offloadable caches without proper protection flags).

**Reasoning:** Per-subscription speed (KN-10 loss risk: "discovered by user after first reinstall"), playback position (KN-05), and queue rules are all identified as trust-destroying loss scenarios. Local-first means there is no cloud backup — on-device durability is the only guarantee.

**Source:** KN-10, KN-05; PRD 3.3; NFR-03.

---

#### NFR-10 — React Native / Expo Compatibility
**MoSCoW: Must**
The implementation must be compatible with the React Native / Expo stack. CarPlay integration must use a compatible native module bridge (react-native-carplay or equivalent). Audio must use react-native-track-player or equivalent. Dependencies must not require Expo bare workflow features that conflict with the managed workflow if managed is chosen.

**Reasoning:** Stack is decided (PRD 3.3). This is an architectural constraint, not a preference. Incompatible dependencies discovered late create rewrite risk.

**Source:** PRD 3.3; KN-15 (react-native-track-player note); PRD 3.2 risk table.

---

#### NFR-11 — iOS Only (v1)
**MoSCoW: Must**
The v1 app targets iOS only. No Android, iPadOS-specific, or watchOS features are required.

**Reasoning:** PRD 3.3 explicit platform constraint.

**Source:** PRD 3.3, 2.2, 5.4.

---

### 5.3 Integration Requirements

#### INT-01 — RSS Feed Parsing
**MoSCoW: Must**
The app must parse standard RSS 2.0 podcast feeds. Required fields: `<title>`, `<description>`, `<enclosure>`, `<pubDate>`, `<itunes:duration>`, `<itunes:episode>`, `<itunes:season>`, `<itunes:image>`. Missing optional fields must not cause parse failure.

**Source:** PRD 5.3; FR-03, FR-12.

---

#### INT-02 — Podcast Index API (Search)
**MoSCoW: Should**
The app should integrate with the Podcast Index API for podcast search during subscription add flow. The integration must handle API unavailability gracefully (fall back to direct RSS URL entry).

**Source:** PRD 5.3; FR-02.

---

#### INT-03 — Apple CarPlay (CPTemplate Bridge)
**MoSCoW: Must**
The app must integrate with Apple CarPlay via a native module bridge (react-native-carplay or equivalent). The integration requires a CarPlay audio entitlement in the provisioning profile. The CarPlay session lifecycle (connect, disconnect, session restore) must be handled explicitly.

**Source:** PRD 5.3, 3.3; FR-17 through FR-20; KN-11.

---

#### INT-04 — AVAudioSession (iOS Audio Session)
**MoSCoW: Must**
The app must configure AVAudioSession with the correct category (`.playback` with appropriate options) and respond to interruption notifications. The session must be activated before CarPlay session initialization.

**Source:** PRD 5.3, 3.3; FR-21; KN-15; NFR-01, NFR-06.

---

#### INT-05 — react-native-track-player (or equivalent)
**MoSCoW: Must**
Background audio playback, AVAudioSession management, and Now Playing metadata (for Lock Screen and CarPlay) must be implemented via a well-maintained RN audio library. react-native-track-player is the reference implementation; any substitute must provide equivalent background playback and CarPlay metadata capabilities.

**Source:** PRD 3.3; KN-15; FR-05 through FR-09.

---

### 5.4 Out of Scope (v1)

| Item | Rationale | Source |
|------|-----------|--------|
| Android support | iOS-only for v1; Expo enables v2 expansion with minimal rewrite | PRD 3.3, 5.4 |
| Social / sharing features | Personal tool; no follows, recommendations, or sharing intended | PRD 5.4; Discovery Q11 |
| Video podcast support | Audio-only; video adds significant complexity for marginal v1 value | PRD 5.4; Discovery Q11 |
| Paid subscription / monetization | Personal tool; App Store release is aspirational, not required | PRD 5.4; Discovery Q5 |
| Cloud sync / backend | Local-first is a design principle; removing it would invalidate the architecture | PRD 5.4, 3.3 |
| Podcast discovery / curated browse | Subscriptions via RSS URL or Podcast Index search only; no editorial curation | PRD 5.4; Opportunity assumption 4 |
| Siri / SiriKit integration | Requires SiriKit entitlement and intent implementation; separate effort | PRD 5.4, 3.3 |
| iPadOS-optimized layout | iOS phone target only for v1 | PRD 3.3 |
| Audio processing (Smart Speed / Voice Boost) | TBD in PRD 3.5; not committed for v1; Overcast sets the bar | PRD 3.5 competitive table |
| ML-based queue inference | Smart queue is rules-based for v1; ML requires data infrastructure incompatible with local-first | Opportunity section 6; local-first constraint |
| watchOS companion | Out of scope; no mention in any source material | Implied by iOS-only platform constraint |
| Cross-device sync | Local-first means no sync; single-device is the v1 model | PRD 3.3, 5.4 |

---

### Requirements Traceability Index

| REQ-ID | Description | Priority | PRD Section | Key Source(s) |
|--------|-------------|----------|-------------|---------------|
| FR-01 | RSS Subscription Management | Must | 2.2, 5.1 | Discovery Q3, Q8; PRD 3.3 |
| FR-02 | Podcast Index Search for Subscribe | Should | 5.1, 5.3 | PRD 3.3; Opp. assumption 4 |
| FR-03 | Episode Feed Fetch and Background Refresh | Must | 5.1, 5.3 | KN-17, KN-18; PRD 3.3 |
| FR-04 | Per-Feed RSS Refresh Cadence Setting | Should | 5.1 | KN-18 |
| FR-05 | Episode Playback Core Controls | Must | 2.2, 5.1 | Discovery; Competitor table |
| FR-06 | Per-Subscription Playback Speed Persistence | Must | 5.1 | KN-10; PRD 3.5 |
| FR-07 | Episode Progress Persistence | Must | 5.1 | KN-05; PRD 2.3 |
| FR-08 | Background Audio Playback | Must | 5.1, 5.3 | Discovery; Competitor table |
| FR-09 | Episode Download for Offline Playback | Must | 2.2, 5.1 | PRD 2.2; KN-16 |
| FR-10 | Auto-Download Rules per Subscription | Should | 5.1 | Opp. assumption 3; KN-17 |
| FR-11 | Smart Queue: Rules-Based Auto-Ordering | Must | 2.1, 2.2, 5.1 | PRD 2.1; KN-04, KN-07, KN-17 |
| FR-12 | Queue Rule: Duration-Based Sorting | Must | 5.1 | KN-07; PRD 3.2 |
| FR-13 | Queue Rule: Staleness / Age-Based Decay | Should | 5.1 | KN-08 |
| FR-14 | Queue Rule: Category Interleaving | Could | 5.1 | KN-09 |
| FR-15 | Queue Rule Transparency (Rule Attribution) | Must | 5.1 | KN-06; Loss risk table |
| FR-16 | Manual Queue Override (non-destructive) | Must | 5.1 | KN-06; PRD 3.1 |
| FR-17 | CarPlay Integration (Core Session) | Must | 5.1, 5.3 | PRD 2.1; KN-11–KN-15 |
| FR-18 | CarPlay Now Playing Controls (3-button) | Must | 5.1 | KN-14; PRD 3.1 |
| FR-19 | CarPlay Queue Browse (2-tap depth) | Must | 5.1 | KN-12, KN-03 |
| FR-20 | CarPlay Subscription Browse | Should | 5.1 | KN-12; Competitor (Overcast) |
| FR-21 | AVAudioSession Interruption Handling | Must | 5.1, 5.3 | KN-15; PRD 3.3, 2.3 |
| FR-22 | Episode Inbox / Triage Model | Could | 5.1 | KN-02; PRD 3.4 |
| FR-23 | Sleep Timer | Should | 5.1 | Discovery; Competitor table |
| FR-24 | Chapter Support | Should | 5.1 | Discovery; Competitor table |
| FR-25 | Episode Played / Unplayed Tracking | Must | 5.1 | PRD 2.2; Competitor table |
| FR-26 | OPML Import / Export | Should | 5.1 | Competitor (Overcast); KN-16 |
| NFR-01 | Playback Reliability (CarPlay Sessions) | Must | 5.2 | PRD 2.3; KN-15 |
| NFR-02 | Offline Operation | Must | 5.2 | PRD 3.3; KN-16 |
| NFR-03 | No Backend / No Account | Must | 5.2 | PRD 3.3 |
| NFR-04 | Malformed RSS Tolerance | Must | 5.2, 5.3 | PRD 3.3, 5.3 |
| NFR-05 | Background Queue Re-Evaluation | Must | 5.2 | KN-17; PRD 2.3 |
| NFR-06 | Playback Continuity on Interruption | Must | 5.2 | KN-15, KN-05; PRD 2.3 |
| NFR-07 | CarPlay Template Compliance | Must | 5.2 | KN-11; PRD 3.3 |
| NFR-08 | CarPlay Interaction Depth (2-tap rule) | Must | 5.2 | KN-12, KN-13 |
| NFR-09 | Local Data Durability | Must | 5.2 | KN-10, KN-05; PRD 3.3 |
| NFR-10 | React Native / Expo Compatibility | Must | 5.2 | PRD 3.3 |
| NFR-11 | iOS Only (v1) | Must | 5.2 | PRD 3.3 |
| INT-01 | RSS Feed Parsing | Must | 5.3 | PRD 5.3 |
| INT-02 | Podcast Index API (Search) | Should | 5.3 | PRD 5.3 |
| INT-03 | Apple CarPlay CPTemplate Bridge | Must | 5.3 | PRD 5.3, 3.3 |
| INT-04 | AVAudioSession Configuration | Must | 5.3 | PRD 5.3, 3.3; KN-15 |
| INT-05 | react-native-track-player (or equivalent) | Must | 5.3 | PRD 3.3; KN-15 |

---

### MoSCoW Summary

| Priority | Count | Requirements |
|----------|-------|-------------|
| Must | 31 | FR-01, FR-03, FR-05, FR-06, FR-07, FR-08, FR-09, FR-11, FR-12, FR-15, FR-16, FR-17, FR-18, FR-19, FR-21, FR-25; NFR-01 through NFR-11; INT-01, INT-03, INT-04, INT-05 |
| Should | 9 | FR-02, FR-04, FR-10, FR-13, FR-20, FR-23, FR-24, FR-26; INT-02 |
| Could | 2 | FR-14, FR-22 |
| Won't | 0 | (All explicit deferrals captured in Out of Scope table) |

---

### Gaps and Ambiguities

| Gap | Impact | Recommended Resolution |
|-----|--------|----------------------|
| Audio processing (Smart Speed / Voice Boost equivalent) is TBD in PRD 3.5. No requirement written because scope is unresolved. | Medium — Overcast users considering switch expect this. | Decide in PRD synthesis whether to include as Should or defer to post-v1. |
| CarPlay Now Playing custom button priority (FR-18) requires explicit design decision before implementation. The 3-button slots are: skip episode, mark played, queue peek — but the ordering/inclusion is unvalidated. | High — wrong buttons = poor in-car UX | Owner should validate button selection against actual driving scenarios before architecture begins. |
| Per-feed category tagging (prerequisite for FR-14, category interleaving) has no dedicated requirement written. If FR-14 is ever promoted, a category tagging requirement must be added. | Low (FR-14 is Could) | Note as a dependency if FR-14 priority is revisited. |
| OPML import format compatibility: some apps use extended OPML fields (Castro's per-feed settings). Standard OPML only, or attempt extended field import? | Low | Scoped to standard OPML for v1 in FR-26. |

---

## Requirements Validation
_Completed: 2026-05-01_

| # | Check | Severity | REQ-ID | Issue | Resolution |
|---|-------|----------|--------|-------|------------|
| 1 | REQ-ID format | Info | ALL (42 IDs) | IDs use FR-XX / NFR-XX / INT-XX format rather than the REQ-NNN pattern required by validation spec | Not auto-fixed. FR/NFR/INT prefixes encode semantic type (functional / non-functional / integration). Renaming to REQ-NNN would lose that signal. Logged for orchestrator decision. |
| 2 | MoSCoW column missing in §5.3 | Warning | INT-01–INT-05 | §5.3 Integration table had no Priority/MoSCoW column; priorities only visible in §8.3 traceability table | Auto-fixed: Priority column added to §5.3 table. INT-01/03/04/05 = Must; INT-02 = Should. Values inferred from §8.3. |
| 3 | Ambiguous acceptance criterion | Warning | FR-05 | "All playback controls work correctly" — "correctly" is untestable without defining what correct means | Suggested replacement: "Play, pause, seek, skip forward, skip back each produce the expected state change; speed changes take effect within 1 second." Auto-fix not applied (would change meaning). |
| 4 | Ambiguous acceptance criterion | Warning | FR-05 | "Speed changes are immediate" — no quantified latency threshold | Suggested replacement: "Speed changes take effect within 1 second of user action." Auto-fix not applied. |
| 5 | Ambiguous acceptance criterion | Warning | FR-17 | "Audio session maintained correctly across foreground/background transitions" — "correctly" is untestable | Suggested replacement: "Audio session does not interrupt, reset, or drop during foreground-to-background and background-to-foreground transitions during a CarPlay session." Auto-fix not applied. |
| 6 | Ambiguous acceptance criterion | Warning | FR-21 | "Audio ducks or pauses appropriately on interruption" — "appropriately" does not distinguish duck-vs-pause rule by interruption type | Suggested replacement: "Audio ducks (volume reduction) for navigation prompts; audio pauses for phone calls. Playback resumes automatically when interruption ends." Auto-fix not applied. |
| 7 | Passive voice / missing actor | Warning | FR-09 | "Storage usage is visible" — no actor specified | Suggested replacement: "The app displays storage used by downloaded episodes in the settings UI." Auto-fix not applied. |
| 8 | Passive voice / missing actor | Warning | FR-13 | "Episodes older than threshold move toward back of queue unless pinned" — no actor | Suggested replacement: "The smart queue engine moves episodes whose age exceeds the user-configured staleness threshold toward the back of the queue, unless the episode is pinned." Auto-fix not applied. |
| 9 | Vague NFR language | Warning | NFR-10 | "No dependency requires unplanned Expo workflow changes" — "unplanned" is subjective and not testable | Suggested replacement: "No dependency requires ejecting from Expo managed workflow to bare workflow." Auto-fix not applied. |
| 10 | §4.0 persona cross-references absent | Warning | FR-01, FR-03, FR-05, FR-06, FR-07, FR-08, FR-09, FR-11, FR-12, FR-15, FR-16, FR-17, FR-18, FR-19, FR-21, FR-25 | §4.0 (Personas) is a placeholder. Every Must-Have FR has a User Story column but no persona ID cross-reference. | Assumption (qa: skip): Persona cross-references deferred to Wave 3 PRD Synthesis. All Must-Have FRs have User Story column populated with "As a user, I..." stories; this is accepted as proxy for persona tracing until §4.0 is populated. |
| 11 | §8.3 source column absent | Info | ALL | §8.3 traceability table has no Source column; source traceability is captured only in prd-audit.md ## Requirements, not in PRD.md itself | Note only. Source detail is available in prd-audit.md. Wave 3 may add a Source column to §8.3 if orchestrator requires PRD-self-contained traceability. |
| 12 | Audio processing gap | Info | (no REQ-ID) | Audio processing (Smart Speed equivalent) is TBD in §3.5 competitive table. No FR written. §5.4 documents it as explicitly out-of-scope with rationale (DSP engineering effort; Overcast's moat). | Properly documented deferral. No blocker. Orchestrator note: if audio processing is later promoted to Should, a new FR-27 (or similar) must be drafted with measurement method and target. |
| 13 | FR-14 prerequisite gap | Info | FR-14 | FR-14 (Category Interleaving, Could) requires per-subscription category tagging but no FR exists for category tagging. | Note only. FR-14 is Could; gap is acceptable. If FR-14 priority is ever raised, a category tagging FR must be added first. |
| 14 | Could-Have items lack acceptance criteria | Info | FR-14, FR-22 | §5.1 Could-Have table omits Acceptance Criteria column. | Acceptable: Could-Have items do not require acceptance criteria before Wave 3. No fix required. |
| 15 | MoSCoW column absent in §5.2 | Info | NFR-01–NFR-11 | §5.2 table has no Priority column; priority stated narratively as "All NFRs are Must-Have" in the section header | Acceptable: narrative statement is clear and unambiguous. Adding a column would be cosmetic only. No fix required. |

**Summary:** 42 requirements checked across §5.1 (26 FRs), §5.2 (11 NFRs), §5.3 (5 INTs), and §5.4 (12 out-of-scope items with rationale). 0 blockers. 9 warnings (none auto-fixed due to meaning-change risk; all logged for Wave 3 authoring). 1 auto-fix applied (Priority column added to §5.3). 5 info findings logged. Persona cross-reference gap (§4.0 placeholder) logged as assumption per qa: skip directive.

---

## PRD Synthesis
_Completed: 2026-05-01 (Wave 3)_

### Sections Added

| Section | Content |
|---------|---------|
| §1.0 Document Overview | Status updated to "Complete"; Version updated to "1.0" |
| §4.0 Target Audience & Personas | Three personas synthesized from all research phases |
| §4.1 User Stories | Key user stories per persona in standard format |
| §6.0 Verification & Validation | Populated with outcome metrics and high-level acceptance criteria |
| §6.1 Outcome Metrics | Five measurable outcomes with measurement methods drawn from §2.3 and §3.2 |
| §6.2 Acceptance Criteria | Nine high-level project acceptance criteria for v1 |
| §7.0 Risks, Assumptions, & Mitigations | Consolidated risk register + assumptions table |
| §8.1 Glossary | 18 domain terms covering CarPlay template names, queue heuristics, podcast domain, and project conventions |
| §8.2 References | Source document inventory expanded to include Requirements and Validation phases |

### Acceptance Criteria Fixes Applied

All 9 validation warnings from the Requirements Validation section were resolved in §5.1 and §5.2:

| REQ-ID | Change |
|--------|--------|
| FR-05 | "works correctly" replaced with specific state-change and 1-second latency criteria |
| FR-09 | "Storage usage is visible" (passive) replaced with "The app displays storage used by downloaded episodes in the settings UI" |
| FR-13 | Passive voice replaced with "The smart queue engine moves episodes whose age exceeds the user-configured staleness threshold toward the back of the queue, unless the episode is pinned" |
| FR-17 | "maintained correctly" replaced with explicit non-interruption criterion during foreground/background transitions |
| FR-21 | "appropriately" replaced with explicit duck-vs-pause rule by interruption type with auto-resume spec |
| NFR-10 | "unplanned Expo workflow changes" replaced with "requires ejecting from Expo managed workflow to bare workflow" |

### Synthesis Decisions

1. **Three personas, not two.** A third persona (Casual Car Listener) was included to make explicit that design decisions should not be driven by casual users at the expense of the primary persona. This clarifies priority for any future trade-off discussions.

2. **Audio processing tradeoff made explicit in §5.4 and §7.0.** The original PRD had "TBD" in §3.5's competitive table. This was resolved to an explicit accepted tradeoff with rationale: compound smart queue + CarPlay differentiation is the value argument; DSP engineering is Overcast's moat and not a v1 priority. The risk (Switcher persona objection) is acknowledged and tracked.

3. **REQ-ID format documented in §8.1 rather than migrated.** Validation check #1 flagged the FR/NFR/INT prefix format as non-standard. Decision: retain the semantic prefixes (they encode requirement type), document the convention in the Glossary, and note it as the project standard. Renaming to REQ-NNN would lose type signal.

4. **§6.2 acceptance criteria are project-level, not per-requirement.** Per-requirement acceptance criteria live in §5.1. The nine project-level criteria in §6.2 are the "done" checklist for v1 as a whole, directly traceable to §2.3 success metrics.

5. **§7.2 assumptions made explicit.** Several assumptions were implicit in the audit (qa: skip decisions) across the Discovery, Opportunity, and Knowledge phases. These are now surfaced as named assumptions with risk-if-wrong analysis, making them reviewable rather than buried in audit notes.

6. **Final line count: 482 lines** (under 500-line target). Document is self-contained; no dangling references to external files except prd-audit.md in §8.2 (intentional — audit is the source record).
