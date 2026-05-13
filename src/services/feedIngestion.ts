import * as ExpoCrypto from 'expo-crypto'
import { parseFeed, type ParsedFeed, type ParsedEpisode } from '../rss/parser'
import type { EpisodeDao } from '../db/dao/episodeDao'

const FEED_REQUEST_HEADERS = { Accept: 'application/rss+xml, application/xml, text/xml, */*' }

export async function fetchFeed(feedUrl: string): Promise<ParsedFeed> {
  const response = await fetch(feedUrl, { headers: FEED_REQUEST_HEADERS })
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  const xml = await response.text()
  return parseFeed(feedUrl, xml)
}

export async function ingestEpisodes(
  subscriptionId: string,
  episodes: ParsedEpisode[],
  episodeDao: EpisodeDao,
  now: number,
): Promise<void> {
  for (const ep of episodes) {
    const exists = await episodeDao.findByGuid(subscriptionId, ep.guid)
    if (exists) continue
    await episodeDao.insert({
      id: ExpoCrypto.randomUUID(),
      subscriptionId,
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
}
