import * as ExpoCrypto from 'expo-crypto'
import { parseFeed } from '../rss/parser'
import type { SubscriptionDao } from '../db/dao/subscriptionDao'
import type { EpisodeDao } from '../db/dao/episodeDao'
import type { Subscription } from '../db/types'

export interface SubscriptionService {
  subscribe(feedUrl: string): Promise<Subscription>
  unsubscribe(subscriptionId: string): Promise<void>
}

export function createSubscriptionService(
  subscriptionDao: SubscriptionDao,
  episodeDao: EpisodeDao,
): SubscriptionService {
  return {
    async subscribe(feedUrl) {
      const existing = await subscriptionDao.findByFeedUrl(feedUrl)
      if (existing) throw new Error('Already subscribed to this feed')

      const response = await fetch(feedUrl, {
        headers: { Accept: 'application/rss+xml, application/xml, text/xml, */*' },
      })
      if (!response.ok) throw new Error(`Failed to fetch feed: HTTP ${response.status}`)

      const xml = await response.text()
      const feed = parseFeed(feedUrl, xml)

      const now = Date.now()
      const subscription = await subscriptionDao.insert({
        id: ExpoCrypto.randomUUID(),
        feedUrl: feed.feedUrl,
        title: feed.title,
        imageUrl: feed.imageUrl,
        description: feed.description,
        lastFetchedAt: now,
        createdAt: now,
      })

      for (const ep of feed.episodes) {
        const exists = await episodeDao.findByGuid(subscription.id, ep.guid)
        if (exists) continue
        await episodeDao.insert({
          id: ExpoCrypto.randomUUID(),
          subscriptionId: subscription.id,
          guid: ep.guid,
          title: ep.title,
          description: ep.description,
          duration: ep.duration,
          publishedAt: ep.publishedAt,
          mediaUrl: ep.mediaUrl,
          fileSize: ep.fileSize,
          createdAt: now,
        })
      }

      return subscription
    },

    async unsubscribe(subscriptionId) {
      await subscriptionDao.delete(subscriptionId)
    },
  }
}
