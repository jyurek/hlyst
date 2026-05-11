import { createSubscriptionService } from '../../src/services/subscriptionService'
import type { SubscriptionDao } from '../../src/db/dao/subscriptionDao'
import type { EpisodeDao } from '../../src/db/dao/episodeDao'
import type { Subscription, Episode } from '../../src/db/types'

const FEED_XML = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd">
  <channel>
    <title>Test Pod</title>
    <description>desc</description>
    <itunes:image href="https://example.com/img.jpg" />
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
    imageUrl: 'https://example.com/img.jpg',
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
    findAll: jest.fn().mockResolvedValue([]),
    delete: jest.fn().mockResolvedValue(undefined),
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

describe('subscriptionService.subscribe', () => {
  beforeEach(() => {
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(FEED_XML),
    })
  })

  it('fetches the feed URL', async () => {
    const service = createSubscriptionService(makeSubDao(), makeEpDao())
    await service.subscribe('https://example.com/feed.xml')
    expect(global.fetch).toHaveBeenCalledWith('https://example.com/feed.xml')
  })

  it('inserts the subscription', async () => {
    const subDao = makeSubDao()
    const service = createSubscriptionService(subDao, makeEpDao())
    await service.subscribe('https://example.com/feed.xml')
    expect(subDao.insert).toHaveBeenCalledWith(
      expect.objectContaining({
        feedUrl: 'https://example.com/feed.xml',
        title: 'Test Pod',
        imageUrl: 'https://example.com/img.jpg',
        description: 'desc',
      }),
    )
  })

  it('inserts episodes', async () => {
    const epDao = makeEpDao()
    const service = createSubscriptionService(makeSubDao(), epDao)
    await service.subscribe('https://example.com/feed.xml')
    expect(epDao.insert).toHaveBeenCalledWith(
      expect.objectContaining({
        guid: 'g1',
        title: 'Ep 1',
        duration: 300,
        mediaUrl: 'https://example.com/ep1.mp3',
      }),
    )
  })

  it('skips episodes already in the db (by guid)', async () => {
    const epDao = makeEpDao({
      findByGuid: jest.fn().mockResolvedValue(makeEpisode()),
    })
    const service = createSubscriptionService(makeSubDao(), epDao)
    await service.subscribe('https://example.com/feed.xml')
    expect(epDao.insert).not.toHaveBeenCalled()
  })

  it('throws when the feed URL is already subscribed', async () => {
    const subDao = makeSubDao({
      findByFeedUrl: jest.fn().mockResolvedValue(makeSub()),
    })
    const service = createSubscriptionService(subDao, makeEpDao())
    await expect(service.subscribe('https://example.com/feed.xml')).rejects.toThrow(
      /already subscribed/i,
    )
  })

  it('throws a descriptive error when fetch fails', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValue({ ok: false, status: 404 })
    const service = createSubscriptionService(makeSubDao(), makeEpDao())
    await expect(service.subscribe('https://example.com/feed.xml')).rejects.toThrow(/404/)
  })

  it('throws on malformed XML without corrupting the db', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      text: () => Promise.resolve('<bad xml <<'),
    })
    const subDao = makeSubDao()
    const service = createSubscriptionService(subDao, makeEpDao())
    await expect(service.subscribe('https://example.com/feed.xml')).rejects.toThrow()
    expect(subDao.insert).not.toHaveBeenCalled()
  })
})

describe('subscriptionService.unsubscribe', () => {
  it('deletes the subscription', async () => {
    const subDao = makeSubDao()
    const service = createSubscriptionService(subDao, makeEpDao())
    await service.unsubscribe('sub-1')
    expect(subDao.delete).toHaveBeenCalledWith('sub-1')
  })
})
