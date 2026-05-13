import { fetchFeed, ingestEpisodes } from '../../src/services/feedIngestion'
import { parseFeed } from '../../src/rss/parser'
import type { EpisodeDao } from '../../src/db/dao/episodeDao'
import type { ParsedEpisode } from '../../src/rss/parser'

jest.mock('../../src/rss/parser', () => ({
  parseFeed: jest.fn(),
}))

jest.mock('expo-crypto', () => ({
  randomUUID: jest.fn().mockReturnValue('test-uuid'),
}))

global.fetch = jest.fn()

function makeEpDao(overrides: Partial<EpisodeDao> = {}): EpisodeDao {
  return {
    insert: jest.fn().mockResolvedValue(undefined),
    findById: jest.fn(),
    findBySubscriptionId: jest.fn(),
    findByGuid: jest.fn(),
    markPlayed: jest.fn(),
    updateDownloadStatus: jest.fn(),
    delete: jest.fn(),
    ...overrides,
  }
}

function makeEpisode(overrides: Partial<ParsedEpisode> = {}): ParsedEpisode {
  return {
    guid: 'g1',
    title: 'Ep 1',
    description: null,
    duration: 300,
    publishedAt: null,
    mediaUrl: 'https://example.com/ep1.mp3',
    fileSize: 1000,
    ...overrides,
  }
}

describe('fetchFeed', () => {
  beforeEach(() => jest.clearAllMocks())

  it('fetches with the RSS/XML Accept header', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      text: jest.fn().mockResolvedValue('<rss/>'),
    })
    ;(parseFeed as jest.Mock).mockReturnValue({ title: 'Test', episodes: [] })
    await fetchFeed('https://example.com/feed.xml')
    expect(global.fetch).toHaveBeenCalledWith(
      'https://example.com/feed.xml',
      expect.objectContaining({
        headers: { Accept: 'application/rss+xml, application/xml, text/xml, */*' },
      }),
    )
  })

  it('passes an AbortSignal to fetch for timeout enforcement', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      text: jest.fn().mockResolvedValue('<rss/>'),
    })
    ;(parseFeed as jest.Mock).mockReturnValue({ title: 'Test', episodes: [] })
    await fetchFeed('https://example.com/feed.xml')
    expect(global.fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    )
  })

  it('aborts the fetch after 10 seconds', () => {
    jest.useFakeTimers()
    let capturedSignal: AbortSignal | undefined
    ;(global.fetch as jest.Mock).mockImplementation((_url, opts: RequestInit) => {
      capturedSignal = opts?.signal as AbortSignal
      return new Promise(() => {})
    })
    void fetchFeed('https://example.com/feed.xml')
    jest.advanceTimersByTime(10_001)
    expect(capturedSignal?.aborted).toBe(true)
    jest.useRealTimers()
  })

  it('throws with status in message when the response is not ok', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValue({ ok: false, status: 503 })
    await expect(fetchFeed('https://example.com/feed.xml')).rejects.toThrow(
      'Failed to fetch feed: HTTP 503',
    )
  })

  it('returns the parsed feed on success', async () => {
    const parsed = {
      feedUrl: 'https://example.com/feed.xml',
      title: 'Test',
      description: null,
      imageUrl: null,
      episodes: [],
    }
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      text: jest.fn().mockResolvedValue('<rss/>'),
    })
    ;(parseFeed as jest.Mock).mockReturnValue(parsed)
    const result = await fetchFeed('https://example.com/feed.xml')
    expect(result).toBe(parsed)
  })
})

describe('ingestEpisodes', () => {
  beforeEach(() => jest.clearAllMocks())

  it('calls insert for every episode (DB handles duplicates via INSERT OR IGNORE)', async () => {
    const epDao = makeEpDao()
    await ingestEpisodes(
      'sub-1',
      [makeEpisode(), makeEpisode({ guid: 'g2', title: 'Ep 2' })],
      epDao,
      1000,
    )
    expect(epDao.insert).toHaveBeenCalledTimes(2)
  })

  it('assigns the subscription ID and a generated UUID to each insert', async () => {
    const epDao = makeEpDao()
    await ingestEpisodes('sub-1', [makeEpisode()], epDao, 1000)
    expect(epDao.insert).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'test-uuid', subscriptionId: 'sub-1', guid: 'g1' }),
    )
  })

  it('uses the provided timestamp as createdAt', async () => {
    const epDao = makeEpDao()
    await ingestEpisodes('sub-1', [makeEpisode()], epDao, 99999)
    expect(epDao.insert).toHaveBeenCalledWith(expect.objectContaining({ createdAt: 99999 }))
  })

  it('does nothing when the episodes list is empty', async () => {
    const epDao = makeEpDao()
    await ingestEpisodes('sub-1', [], epDao, 1000)
    expect(epDao.insert).not.toHaveBeenCalled()
  })
})
