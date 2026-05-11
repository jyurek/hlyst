import { createQueueDao } from '../../../src/db/dao/queueDao'
import { type NewQueueEntry } from '../../../src/db/types'

const makeDb = () => ({
  execAsync: jest.fn(),
  runAsync: jest.fn().mockResolvedValue({ lastInsertRowId: 1, changes: 1 }),
  getAllAsync: jest.fn().mockResolvedValue([]),
  getFirstAsync: jest.fn().mockResolvedValue(null),
})

const entry: NewQueueEntry = {
  id: 'q-1',
  episodeId: 'ep-1',
  position: 0,
  addedAt: 1000,
}

const dbRow = { id: 'q-1', episode_id: 'ep-1', position: 0, added_at: 1000 }

describe('queueDao', () => {
  describe('insert', () => {
    it('inserts and returns the entry', async () => {
      const db = makeDb()
      const dao = createQueueDao(db)
      const result = await dao.insert(entry)
      expect(db.runAsync).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO queue_entries'),
        'q-1',
        'ep-1',
        0,
        1000,
      )
      expect(result.episodeId).toBe('ep-1')
    })
  })

  describe('findAll', () => {
    it('returns entries ordered by position', async () => {
      const db = makeDb()
      db.getAllAsync.mockResolvedValueOnce([dbRow])
      const dao = createQueueDao(db)
      const results = await dao.findAll()
      expect(db.getAllAsync).toHaveBeenCalledWith(expect.stringContaining('ORDER BY position'))
      expect(results[0].episodeId).toBe('ep-1')
    })
  })

  describe('remove', () => {
    it('deletes the entry', async () => {
      const db = makeDb()
      const dao = createQueueDao(db)
      await dao.remove('q-1')
      expect(db.runAsync).toHaveBeenCalledWith(
        expect.stringContaining('DELETE FROM queue_entries'),
        'q-1',
      )
    })
  })

  describe('reorder', () => {
    it('updates positions for each entry', async () => {
      const db = makeDb()
      const dao = createQueueDao(db)
      await dao.reorder([
        { id: 'q-1', position: 0 },
        { id: 'q-2', position: 1 },
      ])
      expect(db.runAsync).toHaveBeenCalledTimes(2)
      expect(db.runAsync).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE queue_entries SET position'),
        0,
        'q-1',
      )
    })
  })
})
