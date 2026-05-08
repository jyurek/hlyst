import { type Db } from './types'

export interface Migration {
  version: number
  sql: string
}

export async function runMigrations(db: Db, migrations: Migration[]): Promise<void> {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version INTEGER PRIMARY KEY NOT NULL,
      applied_at INTEGER NOT NULL
    )
  `)

  const applied = await db.getAllAsync<{ version: number }>(
    'SELECT version FROM schema_migrations ORDER BY version',
  )
  const appliedVersions = new Set(applied.map((r) => r.version))

  const pending = migrations
    .filter((m) => !appliedVersions.has(m.version))
    .sort((a, b) => a.version - b.version)

  for (const migration of pending) {
    await db.execAsync(migration.sql)
    await db.runAsync(
      'INSERT INTO schema_migrations (version, applied_at) VALUES (?, ?)',
      migration.version,
      Date.now(),
    )
  }
}
