import { createEpisodeDao } from '../../../src/db/dao/episodeDao'
import { type NewEpisode } from '../../../src/db/types'

const makeDb = () => ({
  execAsync: jest.fn(),
  runAsync: jest.fn().mockResolvedValue({ lastInsertRowId: 1, changes: 1 }),
  getAllAsync: jest.fn().mockResolvedValue([]),
  getFirstAsync: jest.fn().mockResolvedValue(null),
})

const newEpisode: NewEpisode = {
  id: 'ep-1',
  subscriptionId: 'sub-1',
  guid: 'guid-1',
  title: 'Episode 1',
  mediaUrl: 'https://example.com/ep1.mp3',
  createdAt: 1000,
}

const dbRow = {
  id: 'ep-1',
  subscription_id: 'sub-1',
  guid: 'guid-1',
  title: 'Episode 1',
  description: null,
  duration: null,
  published_at: null,
  media_url: 'https://example.com/ep1.mp3',
  file_size: null,
  download_status: 'none',
  local_path: null,
  played_at: null,
  is_archived: 0,
  created_at: 1000,
}

describe('episodeDao', () => {
  describe('insert', () => {
    it('inserts and returns the episode with defaults', async () => {
      const db = makeDb()
      const dao = createEpisodeDao(db)
      const result = await dao.insert(newEpisode)
      const [sql, ...args] = (db.runAsync as jest.Mock).mock.calls[0]
      expect(sql).toContain('INSERT OR IGNORE INTO episodes')
      expect(args).toContain('ep-1')
      expect(args).toContain('sub-1')
      expect(args).toContain('none') // default downloadStatus
      expect(result.downloadStatus).toBe('none')
      expect(result.isArchived).toBe(false)
    })

    it('returns the existing DB row when INSERT OR IGNORE silently skips a duplicate', async () => {
      const db = makeDb()
      db.runAsync.mockResolvedValueOnce({ lastInsertRowId: 0, changes: 0 })
      db.getFirstAsync.mockResolvedValueOnce(dbRow)
      const dao = createEpisodeDao(db)
      const result = await dao.insert({ ...newEpisode, id: 'new-uuid-never-written' })
      expect(result.id).toBe('ep-1') // id from the existing DB row, not the caller-supplied UUID
    })
  })

  describe('findById', () => {
    it('maps snake_case row including is_archived boolean conversion', async () => {
      const db = makeDb()
      db.getFirstAsync.mockResolvedValueOnce(dbRow)
      const dao = createEpisodeDao(db)
      const result = await dao.findById('ep-1')
      expect(result?.isArchived).toBe(false)
      expect(result?.downloadStatus).toBe('none')
      expect(result?.subscriptionId).toBe('sub-1')
    })

    it('returns null when not found', async () => {
      const db = makeDb()
      const dao = createEpisodeDao(db)
      expect(await dao.findById('missing')).toBeNull()
    })
  })

  describe('findBySubscriptionId', () => {
    it('queries by subscription_id', async () => {
      const db = makeDb()
      db.getAllAsync.mockResolvedValueOnce([dbRow])
      const dao = createEpisodeDao(db)
      const results = await dao.findBySubscriptionId('sub-1')
      expect(db.getAllAsync).toHaveBeenCalledWith(
        expect.stringContaining('subscription_id = ?'),
        'sub-1',
      )
      expect(results).toHaveLength(1)
    })
  })

  describe('markPlayed', () => {
    it('updates played_at', async () => {
      const db = makeDb()
      const dao = createEpisodeDao(db)
      await dao.markPlayed('ep-1', 9999)
      expect(db.runAsync).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE episodes'),
        9999,
        'ep-1',
      )
    })
  })

  describe('updateDownloadStatus', () => {
    it('updates download_status and local_path', async () => {
      const db = makeDb()
      const dao = createEpisodeDao(db)
      await dao.updateDownloadStatus('ep-1', 'complete', '/local/path.mp3')
      expect(db.runAsync).toHaveBeenCalledWith(
        expect.stringContaining('download_status'),
        'complete',
        '/local/path.mp3',
        'ep-1',
      )
    })
  })
})
