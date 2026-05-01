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
