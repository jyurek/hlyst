import { type Db, type QueueEntry, type NewQueueEntry } from '../types'

type Row = { id: string; episode_id: string; position: number; added_at: number }

function rowToEntry(row: Row): QueueEntry {
  return { id: row.id, episodeId: row.episode_id, position: row.position, addedAt: row.added_at }
}

export interface QueueDao {
  insert(entry: NewQueueEntry): Promise<QueueEntry>
  findAll(): Promise<QueueEntry[]>
  remove(id: string): Promise<void>
  removeByEpisodeId(episodeId: string): Promise<void>
  reorder(entries: { id: string; position: number }[]): Promise<void>
}

export function createQueueDao(db: Db): QueueDao {
  return {
    async insert(e) {
      await db.runAsync(
        'INSERT INTO queue_entries (id, episode_id, position, added_at) VALUES (?, ?, ?, ?)',
        e.id,
        e.episodeId,
        e.position,
        e.addedAt,
      )
      return { id: e.id, episodeId: e.episodeId, position: e.position, addedAt: e.addedAt }
    },

    async findAll() {
      const rows = await db.getAllAsync<Row>(
        'SELECT id, episode_id, position, added_at FROM queue_entries ORDER BY position',
      )
      return rows.map(rowToEntry)
    },

    async remove(id) {
      await db.runAsync('DELETE FROM queue_entries WHERE id = ?', id)
    },

    async removeByEpisodeId(episodeId) {
      await db.runAsync('DELETE FROM queue_entries WHERE episode_id = ?', episodeId)
    },

    async reorder(entries) {
      for (const { id, position } of entries) {
        await db.runAsync('UPDATE queue_entries SET position = ? WHERE id = ?', position, id)
      }
    },
  }
}
