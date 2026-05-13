import * as ExpoCrypto from 'expo-crypto'
import { parseFeed, type ParsedFeed, type ParsedEpisode } from '../rss/parser'
import type { EpisodeDao } from '../db/dao/episodeDao'

const FEED_REQUEST_HEADERS = { Accept: 'application/rss+xml, application/xml, text/xml, */*' }
const FETCH_TIMEOUT_MS = 10_000

export async function fetchFeed(feedUrl: string): Promise<ParsedFeed> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)
  try {
    const response = await fetch(feedUrl, {
      headers: FEED_REQUEST_HEADERS,
      signal: controller.signal,
    })
    if (!response.ok) throw new Error(`Failed to fetch feed: HTTP ${response.status}`)
    const xml = await response.text()
    return parseFeed(feedUrl, xml)
  } finally {
    clearTimeout(timeout)
  }
}

export async function ingestEpisodes(
  subscriptionId: string,
  episodes: ParsedEpisode[],
  episodeDao: EpisodeDao,
  now: number,
): Promise<void> {
  for (const ep of episodes) {
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
