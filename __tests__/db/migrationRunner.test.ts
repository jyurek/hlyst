import { runMigrations, type Migration } from '../../src/db/migrationRunner'

import { type Db } from '../../src/db/types'

const makeDb = () => {
  const appliedVersions: number[] = []
  const execLog: string[] = []

  const mock = {
    execAsync: jest.fn(async (sql: string) => {
      execLog.push(sql)
    }),
    runAsync: jest.fn(async (sql: string, ...params: unknown[]) => {
      if (sql.includes('INSERT INTO schema_migrations')) {
        appliedVersions.push(params[0] as number)
      }
      return { lastInsertRowId: 1, changes: 1 }
    }),
    getAllAsync: jest.fn(async (sql: string) => {
      if (sql.includes('FROM schema_migrations')) {
        return appliedVersions.map((v) => ({ version: v }))
      }
      return []
    }),
    getFirstAsync: jest.fn(async () => null),
    _execLog: execLog,
    _appliedVersions: appliedVersions,
  }
  return mock as unknown as typeof mock & Db
}

const migrations: Migration[] = [
  { version: 1, sql: 'CREATE TABLE t1 (id TEXT PRIMARY KEY)' },
  { version: 2, sql: 'CREATE TABLE t2 (id TEXT PRIMARY KEY)' },
]

describe('runMigrations', () => {
  it('creates schema_migrations table on first run', async () => {
    const db = makeDb()
    await runMigrations(db, [])
    expect(db.execAsync).toHaveBeenCalledWith(
      expect.stringContaining('CREATE TABLE IF NOT EXISTS schema_migrations'),
    )
  })

  it('applies all migrations when none have been applied', async () => {
    const db = makeDb()
    await runMigrations(db, migrations)
    expect(db._appliedVersions).toEqual([1, 2])
  })

  it('applies only pending migrations when some are already applied', async () => {
    const db = makeDb()
    db._appliedVersions.push(1)
    await runMigrations(db, migrations)
    expect(db._appliedVersions).toEqual([1, 2])
  })

  it('skips all migrations when all are already applied', async () => {
    const db = makeDb()
    db._appliedVersions.push(1, 2)
    await runMigrations(db, migrations)
    expect(db.execAsync).toHaveBeenCalledTimes(1) // only the CREATE TABLE call
  })

  it('applies migrations in version order regardless of input order', async () => {
    const db = makeDb()
    await runMigrations(db, [migrations[1], migrations[0]])
    expect(db._appliedVersions).toEqual([1, 2])
  })
})
