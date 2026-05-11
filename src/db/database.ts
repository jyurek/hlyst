import * as SQLite from 'expo-sqlite'
import { runMigrations } from './migrationRunner'
import { migration001 } from './migrations/001_initial'
import { createSubscriptionDao, type SubscriptionDao } from './dao/subscriptionDao'
import { createEpisodeDao, type EpisodeDao } from './dao/episodeDao'
import { createQueueDao, type QueueDao } from './dao/queueDao'
import { createRuleDao, type RuleDao } from './dao/ruleDao'
import { createDownloadDao, type DownloadDao } from './dao/downloadDao'
import { createPlaybackStateDao, type PlaybackStateDao } from './dao/playbackStateDao'

const MIGRATIONS = [migration001]

export interface Database {
  subscriptions: SubscriptionDao
  episodes: EpisodeDao
  queue: QueueDao
  rules: RuleDao
  downloads: DownloadDao
  playbackState: PlaybackStateDao
}

let _db: Database | null = null

export async function openDatabase(): Promise<Database> {
  if (_db) return _db

  const sqlite = await SQLite.openDatabaseAsync('hlyst.db')
  await runMigrations(sqlite, MIGRATIONS)

  _db = {
    subscriptions: createSubscriptionDao(sqlite),
    episodes: createEpisodeDao(sqlite),
    queue: createQueueDao(sqlite),
    rules: createRuleDao(sqlite),
    downloads: createDownloadDao(sqlite),
    playbackState: createPlaybackStateDao(sqlite),
  }

  return _db
}

/** Reset the singleton — only for testing. */
export function _resetDatabaseForTesting(): void {
  _db = null
}
