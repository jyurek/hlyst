import { type Db, type PlaybackState, type UpsertPlaybackState } from '../types'

type Row = { episode_id: string; position: number; speed: number; updated_at: number }

function rowToState(row: Row): PlaybackState {
  return {
    episodeId: row.episode_id,
    position: row.position,
    speed: row.speed,
    updatedAt: row.updated_at,
  }
}

export interface PlaybackStateDao {
  upsert(state: UpsertPlaybackState): Promise<void>
  findByEpisodeId(episodeId: string): Promise<PlaybackState | null>
  delete(episodeId: string): Promise<void>
}

export function createPlaybackStateDao(db: Db): PlaybackStateDao {
  return {
    async upsert(s) {
      await db.runAsync(
        'INSERT OR REPLACE INTO playback_state (episode_id, position, speed, updated_at) VALUES (?, ?, ?, ?)',
        s.episodeId,
        s.position,
        s.speed,
        s.updatedAt,
      )
    },

    async findByEpisodeId(episodeId) {
      const row = await db.getFirstAsync<Row>(
        'SELECT episode_id, position, speed, updated_at FROM playback_state WHERE episode_id = ?',
        episodeId,
      )
      return row ? rowToState(row) : null
    },

    async delete(episodeId) {
      await db.runAsync('DELETE FROM playback_state WHERE episode_id = ?', episodeId)
    },
  }
}
