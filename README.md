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

## Planning docs

- [`ideate/architecture.md`](ideate/architecture.md) — Arc42 architecture document (milestones, tech decisions, work breakdown)
- [`ideate/PRD.md`](ideate/PRD.md) — Product Requirements Document (42 requirements, personas, success metrics)
