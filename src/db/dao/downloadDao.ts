import {
  type Db,
  type DownloadRecord,
  type NewDownloadRecord,
  type DownloadRecordStatus,
} from '../types'

type Row = {
  id: string
  episode_id: string
  started_at: number
  completed_at: number | null
  bytes_downloaded: number
  total_bytes: number | null
  status: string
  error: string | null
}

function rowToRecord(row: Row): DownloadRecord {
  return {
    id: row.id,
    episodeId: row.episode_id,
    startedAt: row.started_at,
    completedAt: row.completed_at,
    bytesDownloaded: row.bytes_downloaded,
    totalBytes: row.total_bytes,
    status: row.status as DownloadRecordStatus,
    error: row.error,
  }
}

const COLUMNS =
  'id, episode_id, started_at, completed_at, bytes_downloaded, total_bytes, status, error'

export interface DownloadDao {
  insert(record: NewDownloadRecord): Promise<DownloadRecord>
  findByEpisodeId(episodeId: string): Promise<DownloadRecord | null>
  findActive(): Promise<DownloadRecord[]>
  updateProgress(id: string, bytesDownloaded: number, totalBytes: number | null): Promise<void>
  complete(id: string, completedAt: number): Promise<void>
  fail(id: string, error: string): Promise<void>
  delete(id: string): Promise<void>
}

export function createDownloadDao(db: Db): DownloadDao {
  return {
    async insert(r) {
      const status = r.status ?? 'pending'
      const bytesDownloaded = r.bytesDownloaded ?? 0
      await db.runAsync(
        `INSERT INTO download_records (id, episode_id, started_at, completed_at, bytes_downloaded, total_bytes, status, error)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        r.id,
        r.episodeId,
        r.startedAt,
        r.completedAt ?? null,
        bytesDownloaded,
        r.totalBytes ?? null,
        status,
        r.error ?? null,
      )
      return {
        id: r.id,
        episodeId: r.episodeId,
        startedAt: r.startedAt,
        completedAt: r.completedAt ?? null,
        bytesDownloaded,
        totalBytes: r.totalBytes ?? null,
        status,
        error: r.error ?? null,
      }
    },

    async findByEpisodeId(episodeId) {
      const row = await db.getFirstAsync<Row>(
        `SELECT ${COLUMNS} FROM download_records WHERE episode_id = ? ORDER BY started_at DESC`,
        episodeId,
      )
      return row ? rowToRecord(row) : null
    },

    async findActive() {
      const rows = await db.getAllAsync<Row>(
        `SELECT ${COLUMNS} FROM download_records WHERE status IN ('pending', 'downloading') ORDER BY started_at`,
      )
      return rows.map(rowToRecord)
    },

    async updateProgress(id, bytesDownloaded, totalBytes) {
      await db.runAsync(
        'UPDATE download_records SET bytes_downloaded = ?, total_bytes = ? WHERE id = ?',
        bytesDownloaded,
        totalBytes,
        id,
      )
    },

    async complete(id, completedAt) {
      await db.runAsync(
        'UPDATE download_records SET status = ?, completed_at = ? WHERE id = ?',
        'complete',
        completedAt,
        id,
      )
    },

    async fail(id, error) {
      await db.runAsync(
        'UPDATE download_records SET status = ?, error = ? WHERE id = ?',
        'failed',
        error,
        id,
      )
    },

    async delete(id) {
      await db.runAsync('DELETE FROM download_records WHERE id = ?', id)
    },
  }
}
