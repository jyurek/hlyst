import { createFeedRefreshService } from '../../src/services/feedRefreshService'
import type { SubscriptionDao } from '../../src/db/dao/subscriptionDao'
import type { EpisodeDao } from '../../src/db/dao/episodeDao'
import type { Subscription, Episode } from '../../src/db/types'

const FEED_XML = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd">
  <channel>
    <title>Test Pod</title>
    <description>desc</description>
    <item>
      <title>Ep 1</title>
      <guid>g1</guid>
      <enclosure url="https://example.com/ep1.mp3" type="audio/mpeg" length="1000" />
      <itunes:duration>300</itunes:duration>
    </item>
  </channel>
</rss>`

function makeSub(overrides: Partial<Subscription> = {}): Subscription {
  return {
    id: 'sub-1',
    feedUrl: 'https://example.com/feed.xml',
    title: 'Test Pod',
    imageUrl: null,
    description: 'desc',
    lastFetchedAt: null,
    createdAt: 1000,
    ...overrides,
  }
}

function makeEpisode(overrides: Partial<Episode> = {}): Episode {
  return {
    id: 'ep-1',
    subscriptionId: 'sub-1',
    guid: 'g1',
    title: 'Ep 1',
    description: null,
    duration: 300,
    publishedAt: null,
    mediaUrl: 'https://example.com/ep1.mp3',
    fileSize: 1000,
    downloadStatus: 'none',
    localPath: null,
    playedAt: null,
    isArchived: false,
    createdAt: 1000,
    ...overrides,
  }
}

function makeSubDao(overrides: Partial<SubscriptionDao> = {}): SubscriptionDao {
  return {
    insert: jest.fn().mockResolvedValue(makeSub()),
    findById: jest.fn().mockResolvedValue(null),
    findByFeedUrl: jest.fn().mockResolvedValue(null),
    findAll: jest.fn().mockResolvedValue([makeSub()]),
    delete: jest.fn().mockResolvedValue(undefined),
    updateLastFetchedAt: jest.fn().mockResolvedValue(undefined),
    ...overrides,
  }
}

function makeEpDao(overrides: Partial<EpisodeDao> = {}): EpisodeDao {
  return {
    insert: jest.fn().mockResolvedValue(makeEpisode()),
    findById: jest.fn().mockResolvedValue(null),
    findBySubscriptionId: jest.fn().mockResolvedValue([]),
    findByGuid: jest.fn().mockResolvedValue(null),
    markPlayed: jest.fn().mockResolvedValue(undefined),
    updateDownloadStatus: jest.fn().mockResolvedValue(undefined),
    delete: jest.fn().mockResolvedValue(undefined),
    ...overrides,
  }
}

global.fetch = jest.fn()

describe('feedRefreshService.refreshAll', () => {
  let consoleErrorSpy: jest.SpyInstance

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(FEED_XML),
    })
  })

  afterEach(() => {
    consoleErrorSpy.mockRestore()
  })

  it('fetches each subscription feed URL with the correct Accept header', async () => {
    const sub1 = makeSub({ id: 'sub-1', feedUrl: 'https://example.com/feed1.xml' })
    const sub2 = makeSub({ id: 'sub-2', feedUrl: 'https://example.com/feed2.xml' })
    const subDao = makeSubDao({ findAll: jest.fn().mockResolvedValue([sub1, sub2]) })
    const service = createFeedRefreshService(subDao, makeEpDao())
    await service.refreshAll()
    expect(global.fetch).toHaveBeenCalledWith(
      'https://example.com/feed1.xml',
      expect.objectContaining({
        headers: { Accept: 'application/rss+xml, application/xml, text/xml, */*' },
      }),
    )
    expect(global.fetch).toHaveBeenCalledWith(
      'https://example.com/feed2.xml',
      expect.objectContaining({
        headers: { Accept: 'application/rss+xml, application/xml, text/xml, */*' },
      }),
    )
  })

  it('inserts new episodes from the feed', async () => {
    const epDao = makeEpDao()
    const service = createFeedRefreshService(makeSubDao(), epDao)
    await service.refreshAll()
    expect(epDao.insert).toHaveBeenCalledWith(
      expect.objectContaining({ guid: 'g1', title: 'Ep 1' }),
    )
  })

  it('updates lastFetchedAt on the subscription after a successful fetch', async () => {
    const subDao = makeSubDao()
    const service = createFeedRefreshService(subDao, makeEpDao())
    await service.refreshAll()
    expect(subDao.updateLastFetchedAt).toHaveBeenCalledWith('sub-1', expect.any(Number))
  })

  it('returns correct refreshed and failed counts', async () => {
    const sub1 = makeSub({ id: 'sub-1' })
    const sub2 = makeSub({ id: 'sub-2', feedUrl: 'https://example.com/bad.xml' })
    const subDao = makeSubDao({ findAll: jest.fn().mockResolvedValue([sub1, sub2]) })
    ;(global.fetch as jest.Mock)
      .mockResolvedValueOnce({ ok: true, text: () => Promise.resolve(FEED_XML) })
      .mockResolvedValueOnce({ ok: false, status: 503 })
    const service = createFeedRefreshService(subDao, makeEpDao())
    const result = await service.refreshAll()
    expect(result).toEqual({ refreshed: 1, failed: 1 })
  })

  it('continues processing remaining feeds when one fetch fails', async () => {
    const sub1 = makeSub({ id: 'sub-1', feedUrl: 'https://example.com/bad.xml' })
    const sub2 = makeSub({ id: 'sub-2', feedUrl: 'https://example.com/good.xml' })
    const subDao = makeSubDao({ findAll: jest.fn().mockResolvedValue([sub1, sub2]) })
    ;(global.fetch as jest.Mock)
      .mockResolvedValueOnce({ ok: false, status: 404 })
      .mockResolvedValueOnce({ ok: true, text: () => Promise.resolve(FEED_XML) })
    const service = createFeedRefreshService(subDao, makeEpDao())
    await service.refreshAll()
    expect(subDao.updateLastFetchedAt).toHaveBeenCalledTimes(1)
    expect(subDao.updateLastFetchedAt).toHaveBeenCalledWith('sub-2', expect.any(Number))
  })

  it('continues processing when one feed has malformed XML', async () => {
    const sub1 = makeSub({ id: 'sub-1', feedUrl: 'https://example.com/bad.xml' })
    const sub2 = makeSub({ id: 'sub-2', feedUrl: 'https://example.com/good.xml' })
    const subDao = makeSubDao({ findAll: jest.fn().mockResolvedValue([sub1, sub2]) })
    ;(global.fetch as jest.Mock)
      .mockResolvedValueOnce({ ok: true, text: () => Promise.resolve('<bad xml <<') })
      .mockResolvedValueOnce({ ok: true, text: () => Promise.resolve(FEED_XML) })
    const epDao = makeEpDao()
    const service = createFeedRefreshService(subDao, epDao)
    const result = await service.refreshAll()
    expect(epDao.insert).toHaveBeenCalledTimes(1)
    expect(result).toEqual({ refreshed: 1, failed: 1 })
  })
})
