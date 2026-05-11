import * as ExpoCrypto from 'expo-crypto'
import { parseFeed } from '../rss/parser'
import type { SubscriptionDao } from '../db/dao/subscriptionDao'
import type { EpisodeDao } from '../db/dao/episodeDao'

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
          const response = await fetch(sub.feedUrl, {
            headers: { Accept: 'application/rss+xml, application/xml, text/xml, */*' },
          })
          if (!response.ok) throw new Error(`HTTP ${response.status}`)

          const xml = await response.text()
          const feed = parseFeed(sub.feedUrl, xml)

          const now = Date.now()
          for (const ep of feed.episodes) {
            const exists = await episodeDao.findByGuid(sub.id, ep.guid)
            if (exists) continue
            await episodeDao.insert({
              id: ExpoCrypto.randomUUID(),
              subscriptionId: sub.id,
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
