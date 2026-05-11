import { createDownloadDao } from '../../../src/db/dao/downloadDao'
import { type NewDownloadRecord } from '../../../src/db/types'

const makeDb = () => ({
  execAsync: jest.fn(),
  runAsync: jest.fn().mockResolvedValue({ lastInsertRowId: 1, changes: 1 }),
  getAllAsync: jest.fn().mockResolvedValue([]),
  getFirstAsync: jest.fn().mockResolvedValue(null),
})

const newRecord: NewDownloadRecord = {
  id: 'dl-1',
  episodeId: 'ep-1',
  startedAt: 1000,
}

const dbRow = {
  id: 'dl-1',
  episode_id: 'ep-1',
  started_at: 1000,
  completed_at: null,
  bytes_downloaded: 0,
  total_bytes: null,
  status: 'pending',
  error: null,
}

describe('downloadDao', () => {
  describe('insert', () => {
    it('inserts with default status pending', async () => {
      const db = makeDb()
      const dao = createDownloadDao(db)
      const result = await dao.insert(newRecord)
      const [sql] = (db.runAsync as jest.Mock).mock.calls[0]
      expect(sql).toContain('INSERT INTO download_records')
      expect(result.status).toBe('pending')
      expect(result.bytesDownloaded).toBe(0)
    })
  })

  describe('findByEpisodeId', () => {
    it('maps snake_case row to camelCase', async () => {
      const db = makeDb()
      db.getFirstAsync.mockResolvedValueOnce(dbRow)
      const dao = createDownloadDao(db)
      const result = await dao.findByEpisodeId('ep-1')
      expect(result?.episodeId).toBe('ep-1')
      expect(result?.bytesDownloaded).toBe(0)
    })
  })

  describe('updateProgress', () => {
    it('updates bytes_downloaded and total_bytes', async () => {
      const db = makeDb()
      const dao = createDownloadDao(db)
      await dao.updateProgress('dl-1', 500, 1000)
      expect(db.runAsync).toHaveBeenCalledWith(
        expect.stringContaining('bytes_downloaded'),
        500,
        1000,
        'dl-1',
      )
    })
  })

  describe('complete', () => {
    it('sets status to complete with completedAt', async () => {
      const db = makeDb()
      const dao = createDownloadDao(db)
      await dao.complete('dl-1', 9999)
      expect(db.runAsync).toHaveBeenCalledWith(
        expect.stringContaining('status = ?'),
        'complete',
        9999,
        'dl-1',
      )
    })
  })

  describe('fail', () => {
    it('sets status to failed with error message', async () => {
      const db = makeDb()
      const dao = createDownloadDao(db)
      await dao.fail('dl-1', 'network error')
      expect(db.runAsync).toHaveBeenCalledWith(
        expect.stringContaining('status = ?'),
        'failed',
        'network error',
        'dl-1',
      )
    })
  })
})
