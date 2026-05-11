import { createSubscriptionDao } from '../../../src/db/dao/subscriptionDao'
import { type NewSubscription } from '../../../src/db/types'

const makeDb = () => ({
  execAsync: jest.fn(),
  runAsync: jest.fn().mockResolvedValue({ lastInsertRowId: 1, changes: 1 }),
  getAllAsync: jest.fn().mockResolvedValue([]),
  getFirstAsync: jest.fn().mockResolvedValue(null),
})

const newSub: NewSubscription = {
  id: 'sub-1',
  feedUrl: 'https://example.com/feed.rss',
  title: 'Test Podcast',
  createdAt: 1000,
}

describe('subscriptionDao', () => {
  describe('insert', () => {
    it('calls runAsync with correct SQL and values', async () => {
      const db = makeDb()
      const dao = createSubscriptionDao(db)
      const result = await dao.insert(newSub)
      expect(db.runAsync).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO subscriptions'),
        'sub-1',
        'https://example.com/feed.rss',
        'Test Podcast',
        null,
        null,
        null,
        1000,
      )
      expect(result.id).toBe('sub-1')
      expect(result.feedUrl).toBe('https://example.com/feed.rss')
    })
  })

  describe('findById', () => {
    it('calls getFirstAsync and maps snake_case row to camelCase', async () => {
      const db = makeDb()
      db.getFirstAsync.mockResolvedValueOnce({
        id: 'sub-1',
        feed_url: 'https://example.com/feed.rss',
        title: 'Test Podcast',
        image_url: null,
        description: null,
        last_fetched_at: null,
        created_at: 1000,
      })
      const dao = createSubscriptionDao(db)
      const result = await dao.findById('sub-1')
      expect(result?.feedUrl).toBe('https://example.com/feed.rss')
      expect(result?.createdAt).toBe(1000)
    })

    it('returns null when not found', async () => {
      const db = makeDb()
      const dao = createSubscriptionDao(db)
      const result = await dao.findById('missing')
      expect(result).toBeNull()
    })
  })

  describe('findAll', () => {
    it('returns mapped rows', async () => {
      const db = makeDb()
      db.getAllAsync.mockResolvedValueOnce([
        {
          id: 'sub-1',
          feed_url: 'https://example.com/feed.rss',
          title: 'Test Podcast',
          image_url: null,
          description: null,
          last_fetched_at: null,
          created_at: 1000,
        },
      ])
      const dao = createSubscriptionDao(db)
      const results = await dao.findAll()
      expect(results).toHaveLength(1)
      expect(results[0].feedUrl).toBe('https://example.com/feed.rss')
    })
  })

  describe('delete', () => {
    it('calls runAsync with DELETE statement', async () => {
      const db = makeDb()
      const dao = createSubscriptionDao(db)
      await dao.delete('sub-1')
      expect(db.runAsync).toHaveBeenCalledWith(
        expect.stringContaining('DELETE FROM subscriptions'),
        'sub-1',
      )
    })
  })
})
