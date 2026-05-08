import { type Migration } from '../migrationRunner'

export const migration001: Migration = {
  version: 1,
  sql: `
    CREATE TABLE IF NOT EXISTS subscriptions (
      id TEXT PRIMARY KEY NOT NULL,
      feed_url TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      image_url TEXT,
      description TEXT,
      last_fetched_at INTEGER,
      created_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS episodes (
      id TEXT PRIMARY KEY NOT NULL,
      subscription_id TEXT NOT NULL,
      guid TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      duration INTEGER,
      published_at INTEGER,
      media_url TEXT NOT NULL,
      file_size INTEGER,
      download_status TEXT NOT NULL DEFAULT 'none',
      local_path TEXT,
      played_at INTEGER,
      is_archived INTEGER NOT NULL DEFAULT 0,
      created_at INTEGER NOT NULL,
      UNIQUE(subscription_id, guid),
      FOREIGN KEY(subscription_id) REFERENCES subscriptions(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS queue_entries (
      id TEXT PRIMARY KEY NOT NULL,
      episode_id TEXT NOT NULL,
      position INTEGER NOT NULL,
      added_at INTEGER NOT NULL,
      FOREIGN KEY(episode_id) REFERENCES episodes(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS rules (
      id TEXT PRIMARY KEY NOT NULL,
      subscription_id TEXT,
      title TEXT NOT NULL,
      action TEXT NOT NULL,
      conditions TEXT NOT NULL DEFAULT '[]',
      priority INTEGER NOT NULL DEFAULT 0,
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at INTEGER NOT NULL,
      FOREIGN KEY(subscription_id) REFERENCES subscriptions(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS download_records (
      id TEXT PRIMARY KEY NOT NULL,
      episode_id TEXT NOT NULL,
      started_at INTEGER NOT NULL,
      completed_at INTEGER,
      bytes_downloaded INTEGER NOT NULL DEFAULT 0,
      total_bytes INTEGER,
      status TEXT NOT NULL DEFAULT 'pending',
      error TEXT,
      FOREIGN KEY(episode_id) REFERENCES episodes(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS playback_state (
      episode_id TEXT PRIMARY KEY NOT NULL,
      position REAL NOT NULL DEFAULT 0,
      speed REAL NOT NULL DEFAULT 1.0,
      updated_at INTEGER NOT NULL,
      FOREIGN KEY(episode_id) REFERENCES episodes(id) ON DELETE CASCADE
    );
  `,
}
