import * as ExpoCrypto from 'expo-crypto'
import type { SubscriptionDao } from '../db/dao/subscriptionDao'
import type { EpisodeDao } from '../db/dao/episodeDao'
import type { Subscription } from '../db/types'
import { fetchFeed, ingestEpisodes } from './feedIngestion'

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

      const feed = await fetchFeed(feedUrl)
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

      await ingestEpisodes(subscription.id, feed.episodes, episodeDao, now)
      return subscription
    },

    async unsubscribe(subscriptionId) {
      await subscriptionDao.delete(subscriptionId)
    },
  }
}
