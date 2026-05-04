# hlyst

> "The podcast app that gets itself ready before you get in the car."

A personal iOS podcast app built on React Native/Expo (bare workflow). Its defining thesis: a **rules-based smart queue** that auto-orders episodes by user-defined priorities, combined with a **first-class CarPlay experience** designed for the car — not ported from the phone.

## What makes it different

Every major podcast app requires manual drag-and-drop queue management. None combines intelligent queue ordering with a first-class CarPlay experience. hlyst fills this compound gap for one primary user: a heavy podcast listener who commutes by car and wants the queue to work the way their brain works — without daily manual curation.

## v1 Scope

- RSS subscription management + background feed refresh
- Rules-based smart queue (duration sort, staleness decay, manual pin)
- CarPlay integration — CPNowPlayingTemplate + CPListTemplate queue browse (≤2 taps)
- Background audio with AVAudioSession interruption handling
- Episode downloads for offline playback
- Local-first / no backend / no account

## Stack

React Native · Expo bare workflow · TypeScript · react-native-track-player · react-native-carplay · expo-sqlite + Drizzle ORM · MMKV · Zustand · EAS Build

## Getting started

### Prerequisites

| Tool | Version | Notes |
|------|---------|-------|
| Node.js | 20+ | via `nvm` or `volta` |
| Xcode | 16+ | App Store — includes the iOS simulator |
| CocoaPods | 1.15+ | `sudo gem install cocoapods` |
| Ruby | system (2.7+) | CocoaPods dependency |

iOS is the only supported platform for local development (bare workflow, CarPlay target).

### Setup

```bash
git clone git@github.com:<your-org>/hlyst.git
cd hlyst
npm install
cd ios && pod install && cd ..
```

### Running

```bash
# Start the Metro bundler + launch the simulator
npm run ios

# Or start Metro separately (e.g. when iterating without rebuilding native)
npm start
```

The first native build takes a few minutes. Subsequent `npm start` runs (no native changes) are fast — Metro hot-reloads JS.

### Other dev commands

```bash
npm test          # Jest (jest-expo preset)
npm run typecheck # tsc --noEmit
npm run lint      # ESLint
```

### Troubleshooting

- **Pod install fails** — try `cd ios && pod repo update && pod install`.
- **Metro can't find a module** — `npx expo start --clear` to reset the cache.
- **Xcode build errors after a dependency bump** — delete `ios/build/` and rebuild.

## Planning docs

- [`ideate/architecture.md`](ideate/architecture.md) — Arc42 architecture document (milestones, tech decisions, work breakdown)
- [`ideate/PRD.md`](ideate/PRD.md) — Product Requirements Document (42 requirements, personas, success metrics)
