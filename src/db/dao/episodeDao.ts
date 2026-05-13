import { type Db, type Episode, type NewEpisode, type DownloadStatus } from '../types'

type Row = {
  id: string
  subscription_id: string
  guid: string
  title: string
  description: string | null
  duration: number | null
  published_at: number | null
  media_url: string
  file_size: number | null
  download_status: string
  local_path: string | null
  played_at: number | null
  is_archived: number
  created_at: number
}

function rowToEpisode(row: Row): Episode {
  return {
    id: row.id,
    subscriptionId: row.subscription_id,
    guid: row.guid,
    title: row.title,
    description: row.description,
    duration: row.duration,
    publishedAt: row.published_at,
    mediaUrl: row.media_url,
    fileSize: row.file_size,
    downloadStatus: row.download_status as DownloadStatus,
    localPath: row.local_path,
    playedAt: row.played_at,
    isArchived: row.is_archived === 1,
    createdAt: row.created_at,
  }
}

const COLUMNS =
  'id, subscription_id, guid, title, description, duration, published_at, media_url, file_size, download_status, local_path, played_at, is_archived, created_at'

export interface EpisodeDao {
  insert(episode: NewEpisode): Promise<Episode>
  findById(id: string): Promise<Episode | null>
  findBySubscriptionId(subscriptionId: string): Promise<Episode[]>
  findByGuid(subscriptionId: string, guid: string): Promise<Episode | null>
  markPlayed(id: string, playedAt: number): Promise<void>
  updateDownloadStatus(id: string, status: DownloadStatus, localPath?: string | null): Promise<void>
  delete(id: string): Promise<void>
}

export function createEpisodeDao(db: Db): EpisodeDao {
  return {
    async insert(e) {
      const downloadStatus = e.downloadStatus ?? 'none'
      const isArchived = e.isArchived ?? false
      await db.runAsync(
        `INSERT OR IGNORE INTO episodes (id, subscription_id, guid, title, description, duration, published_at, media_url, file_size, download_status, local_path, played_at, is_archived, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        e.id,
        e.subscriptionId,
        e.guid,
        e.title,
        e.description ?? null,
        e.duration ?? null,
        e.publishedAt ?? null,
        e.mediaUrl,
        e.fileSize ?? null,
        downloadStatus,
        e.localPath ?? null,
        e.playedAt ?? null,
        isArchived ? 1 : 0,
        e.createdAt,
      )
      return {
        id: e.id,
        subscriptionId: e.subscriptionId,
        guid: e.guid,
        title: e.title,
        description: e.description ?? null,
        duration: e.duration ?? null,
        publishedAt: e.publishedAt ?? null,
        mediaUrl: e.mediaUrl,
        fileSize: e.fileSize ?? null,
        downloadStatus,
        localPath: e.localPath ?? null,
        playedAt: e.playedAt ?? null,
        isArchived,
        createdAt: e.createdAt,
      }
    },

    async findById(id) {
      const row = await db.getFirstAsync<Row>(`SELECT ${COLUMNS} FROM episodes WHERE id = ?`, id)
      return row ? rowToEpisode(row) : null
    },

    async findBySubscriptionId(subscriptionId) {
      const rows = await db.getAllAsync<Row>(
        `SELECT ${COLUMNS} FROM episodes WHERE subscription_id = ? ORDER BY published_at DESC`,
        subscriptionId,
      )
      return rows.map(rowToEpisode)
    },

    async findByGuid(subscriptionId, guid) {
      const row = await db.getFirstAsync<Row>(
        `SELECT ${COLUMNS} FROM episodes WHERE subscription_id = ? AND guid = ?`,
        subscriptionId,
        guid,
      )
      return row ? rowToEpisode(row) : null
    },

    async markPlayed(id, playedAt) {
      await db.runAsync('UPDATE episodes SET played_at = ? WHERE id = ?', playedAt, id)
    },

    async updateDownloadStatus(id, status, localPath = null) {
      await db.runAsync(
        'UPDATE episodes SET download_status = ?, local_path = ? WHERE id = ?',
        status,
        localPath,
        id,
      )
    },

    async delete(id) {
      await db.runAsync('DELETE FROM episodes WHERE id = ?', id)
    },
  }
}
