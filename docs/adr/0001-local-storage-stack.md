# Local Storage Stack

Date: 2026-05-08
Status: Accepted

## Context

hlyst needs persistent local storage for relational entities (subscriptions, episodes, queue, rules, downloads, playback state) and hot-path key-value writes (playback position per episode, playback speed per show). The app targets iOS first on the Expo managed workflow with expo-dev-client, so all storage must be available as Expo-compatible native modules.

## Decision Drivers

- Expo managed workflow — no custom native code; dependencies must be installable via `npx expo install`
- Type safety throughout — TypeScript strict mode, no `any` leakage at the call site
- Testability — DAOs must be unit-testable in jest without a real SQLite runtime
- Simplicity — this is a personal app; ceremony should be proportional to scale
- iOS persistence requirements — data must survive force-kill and app updates with schema migration

## Considered Options

### Option A: expo-sqlite with typed DAO factories (chosen)

Raw SQL through `expo-sqlite`, wrapped in factory functions that accept a `Db` interface. Migrations are bundled as TypeScript string constants and applied by a forward-only runner on app init.

- Good, because no build-time code generation step required
- Good, because DAO factories accept a `Db` interface (not `expo-sqlite` directly), so tests pass mock objects without `jest.mock`
- Good, because migrations are plain strings — readable, diffable, and no filesystem access needed at runtime
- Good, because zero runtime overhead from an ORM abstraction layer
- Bad, because SQL strings are not type-checked at compile time; query shape errors surface at runtime
- Bad, because join queries and aggregates require more boilerplate than a query builder

### Option B: Drizzle ORM over expo-sqlite

- Good, because schema is declared in TypeScript — column types and relations are type-checked
- Good, because query builder provides autocomplete and prevents typos in column names
- Bad, because requires a code-generation step (`drizzle-kit generate`) in the development workflow
- Bad, because adds a dependency that wraps expo-sqlite in a way that may lag behind SDK updates
- Bad, because Drizzle's test story requires either a real SQLite runtime or careful mocking of its internal query executor

### Option C: WatermelonDB

- Good, because designed for React Native with observable data and lazy loading
- Bad, because heavyweight — requires native module setup incompatible with Expo managed workflow without ejecting
- Bad, because significantly more complex API surface for a personal app

## Decision Outcome

Chosen option: **Option A (expo-sqlite with typed DAO factories)**, because it offers full type safety at the TypeScript layer, clean testability via dependency injection, and zero build-step complexity. The trade-off of untyped SQL strings is acceptable for a personal app with a stable, small schema.

For hot-path key-value writes (playback position, per-show speed), `@react-native-async-storage/async-storage` is used instead of `react-native-mmkv`. MMKV offers lower write latency via JSI, but it requires a custom native module that cannot be installed in the Expo managed workflow without ejecting. AsyncStorage is sufficient for the write frequency of this use case.

### Consequences

**Good:**
- DAOs are independently unit-testable with plain jest mock objects
- No code-generation step in the development workflow
- Migration history is version-controlled alongside application code as TypeScript constants

**Bad:**
- SQL column names in queries are not type-checked; a typo in a column name fails at runtime, not compile time
- Aggregates and joins require hand-written SQL — no query builder assistance

## Links

- Issue #2: Define local data model and storage layer
- `src/db/types.ts` — entity interfaces and the `Db` interface DAOs depend on
- `src/db/migrationRunner.ts` — forward-only migration runner
- `src/db/database.ts` — singleton that wires DAOs to the live SQLite instance
