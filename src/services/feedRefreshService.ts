import type { SubscriptionDao } from '../db/dao/subscriptionDao'
import type { EpisodeDao } from '../db/dao/episodeDao'
import { fetchFeed, ingestEpisodes } from './feedIngestion'

export interface FeedRefreshService {
  refreshAll(): Promise<{ refreshed: number; failed: number }>
}

export function createFeedRefreshService(
  subscriptionDao: SubscriptionDao,
  episodeDao: EpisodeDao,
): FeedRefreshService {
  return {
    async refreshAll() {
      const subscriptions = await subscriptionDao.findAll()
      let refreshed = 0
      let failed = 0

      for (const sub of subscriptions) {
        try {
          const now = Date.now()
          const feed = await fetchFeed(sub.feedUrl)
          await ingestEpisodes(sub.id, feed.episodes, episodeDao, now)
          await subscriptionDao.updateLastFetchedAt(sub.id, now)
          refreshed++
        } catch (err) {
          console.error(`[feedRefresh] Failed to refresh "${sub.feedUrl}":`, err)
          failed++
        }
      }

      return { refreshed, failed }
    },
  }
}
