# Issue #2 — Define local data model and storage layer

## Header

- **Branch:** feat/data-model-storage
- **Base branch:** main
- **PR strategy:** one
- **Skill-retro:** yes
- **Timestamp:** 2026-05-08

## Plan Summary

Install expo-sqlite and AsyncStorage. Define TypeScript types for all entities. Build a forward-only migration runner. Implement typed DAO factories (dependency injection) for 6 entities. Wrap AsyncStorage with a typed key-value store.

## Stories

- [ ] Foundation: types + migration runner + db init
- [ ] SubscriptionDao
- [ ] EpisodeDao
- [ ] QueueDao
- [ ] RuleDao
- [ ] DownloadDao
- [ ] PlaybackStateDao
- [ ] KeyValueStore

## PR Body Draft

## Summary
Define the local data model and storage layer for hlyst using expo-sqlite with typed DAOs and AsyncStorage for hot-path key-value writes.

## Stories completed
- [ ] Foundation: types, schema migrations, migration runner, DB init (closes #2)

## Test plan
- All DAOs tested with mock db via dependency injection
- Migration runner tested with mock db
- AsyncStorage wrapper tested with jest mock
- tsc --noEmit passes
