import { type Db, type Subscription, type NewSubscription } from '../types'

type Row = {
  id: string
  feed_url: string
  title: string
  image_url: string | null
  description: string | null
  last_fetched_at: number | null
  created_at: number
}

function rowToSubscription(row: Row): Subscription {
  return {
    id: row.id,
    feedUrl: row.feed_url,
    title: row.title,
    imageUrl: row.image_url,
    description: row.description,
    lastFetchedAt: row.last_fetched_at,
    createdAt: row.created_at,
  }
}

export interface SubscriptionDao {
  insert(subscription: NewSubscription): Promise<Subscription>
  findById(id: string): Promise<Subscription | null>
  findByFeedUrl(feedUrl: string): Promise<Subscription | null>
  findAll(): Promise<Subscription[]>
  delete(id: string): Promise<void>
}

export function createSubscriptionDao(db: Db): SubscriptionDao {
  return {
    async insert(s) {
      await db.runAsync(
        'INSERT INTO subscriptions (id, feed_url, title, image_url, description, last_fetched_at, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
        s.id,
        s.feedUrl,
        s.title,
        s.imageUrl ?? null,
        s.description ?? null,
        s.lastFetchedAt ?? null,
        s.createdAt,
      )
      return {
        id: s.id,
        feedUrl: s.feedUrl,
        title: s.title,
        imageUrl: s.imageUrl ?? null,
        description: s.description ?? null,
        lastFetchedAt: s.lastFetchedAt ?? null,
        createdAt: s.createdAt,
      }
    },

    async findById(id) {
      const row = await db.getFirstAsync<Row>(
        'SELECT id, feed_url, title, image_url, description, last_fetched_at, created_at FROM subscriptions WHERE id = ?',
        id,
      )
      return row ? rowToSubscription(row) : null
    },

    async findByFeedUrl(feedUrl) {
      const row = await db.getFirstAsync<Row>(
        'SELECT id, feed_url, title, image_url, description, last_fetched_at, created_at FROM subscriptions WHERE feed_url = ?',
        feedUrl,
      )
      return row ? rowToSubscription(row) : null
    },

    async findAll() {
      const rows = await db.getAllAsync<Row>(
        'SELECT id, feed_url, title, image_url, description, last_fetched_at, created_at FROM subscriptions ORDER BY title',
      )
      return rows.map(rowToSubscription)
    },

    async delete(id) {
      await db.runAsync('DELETE FROM subscriptions WHERE id = ?', id)
    },
  }
}
