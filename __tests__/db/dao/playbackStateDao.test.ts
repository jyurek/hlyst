import { createPlaybackStateDao } from '../../../src/db/dao/playbackStateDao'
import { type UpsertPlaybackState } from '../../../src/db/types'

const makeDb = () => ({
  execAsync: jest.fn(),
  runAsync: jest.fn().mockResolvedValue({ lastInsertRowId: 1, changes: 1 }),
  getAllAsync: jest.fn().mockResolvedValue([]),
  getFirstAsync: jest.fn().mockResolvedValue(null),
})

const state: UpsertPlaybackState = {
  episodeId: 'ep-1',
  position: 120.5,
  speed: 1.5,
  updatedAt: 9999,
}

const dbRow = {
  episode_id: 'ep-1',
  position: 120.5,
  speed: 1.5,
  updated_at: 9999,
}

describe('playbackStateDao', () => {
  describe('upsert', () => {
    it('uses INSERT OR REPLACE', async () => {
      const db = makeDb()
      const dao = createPlaybackStateDao(db)
      await dao.upsert(state)
      const [sql] = (db.runAsync as jest.Mock).mock.calls[0]
      expect(sql).toMatch(/INSERT OR REPLACE/i)
      expect(sql).toContain('playback_state')
    })
  })

  describe('findByEpisodeId', () => {
    it('maps snake_case row to camelCase', async () => {
      const db = makeDb()
      db.getFirstAsync.mockResolvedValueOnce(dbRow)
      const dao = createPlaybackStateDao(db)
      const result = await dao.findByEpisodeId('ep-1')
      expect(result?.episodeId).toBe('ep-1')
      expect(result?.position).toBe(120.5)
      expect(result?.speed).toBe(1.5)
    })

    it('returns null when not found', async () => {
      const db = makeDb()
      const dao = createPlaybackStateDao(db)
      expect(await dao.findByEpisodeId('missing')).toBeNull()
    })
  })

  describe('delete', () => {
    it('deletes by episode_id', async () => {
      const db = makeDb()
      const dao = createPlaybackStateDao(db)
      await dao.delete('ep-1')
      expect(db.runAsync).toHaveBeenCalledWith(
        expect.stringContaining('DELETE FROM playback_state'),
        'ep-1',
      )
    })
  })
})
