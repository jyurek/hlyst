import { parseFeed } from '../../src/rss/parser'

const VALID_FEED = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd">
  <channel>
    <title>Test Podcast</title>
    <description>A test podcast</description>
    <itunes:image href="https://example.com/image.jpg" />
    <item>
      <title>Episode 1</title>
      <guid>ep1-guid</guid>
      <description>First episode</description>
      <pubDate>Mon, 01 Jan 2024 00:00:00 +0000</pubDate>
      <enclosure url="https://example.com/ep1.mp3" type="audio/mpeg" length="12345" />
      <itunes:duration>3600</itunes:duration>
    </item>
    <item>
      <title>Episode 2</title>
      <guid>ep2-guid</guid>
      <pubDate>Tue, 02 Jan 2024 00:00:00 +0000</pubDate>
      <enclosure url="https://example.com/ep2.mp3" type="audio/mpeg" length="67890" />
    </item>
  </channel>
</rss>`

const FEED_HH_MM_SS_DURATION = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd">
  <channel>
    <title>Duration Podcast</title>
    <item>
      <title>Episode HH:MM:SS</title>
      <guid>ep-hms</guid>
      <enclosure url="https://example.com/ep.mp3" type="audio/mpeg" length="0" />
      <itunes:duration>1:02:03</itunes:duration>
    </item>
  </channel>
</rss>`

describe('parseFeed', () => {
  it('parses channel metadata', () => {
    const result = parseFeed('https://example.com/feed.xml', VALID_FEED)
    expect(result.title).toBe('Test Podcast')
    expect(result.description).toBe('A test podcast')
    expect(result.imageUrl).toBe('https://example.com/image.jpg')
    expect(result.feedUrl).toBe('https://example.com/feed.xml')
  })

  it('parses episodes', () => {
    const result = parseFeed('https://example.com/feed.xml', VALID_FEED)
    expect(result.episodes).toHaveLength(2)
  })

  it('parses episode fields', () => {
    const result = parseFeed('https://example.com/feed.xml', VALID_FEED)
    const ep = result.episodes[0]
    expect(ep.title).toBe('Episode 1')
    expect(ep.guid).toBe('ep1-guid')
    expect(ep.description).toBe('First episode')
    expect(ep.mediaUrl).toBe('https://example.com/ep1.mp3')
    expect(ep.fileSize).toBe(12345)
    expect(ep.duration).toBe(3600)
    expect(ep.publishedAt).toBe(new Date('Mon, 01 Jan 2024 00:00:00 +0000').getTime())
  })

  it('defaults missing duration to 0', () => {
    const result = parseFeed('https://example.com/feed.xml', VALID_FEED)
    const ep = result.episodes[1]
    expect(ep.duration).toBe(0)
  })

  it('parses HH:MM:SS duration format', () => {
    const result = parseFeed('https://example.com/feed.xml', FEED_HH_MM_SS_DURATION)
    expect(result.episodes[0].duration).toBe(3723)
  })

  it('throws on malformed XML', () => {
    expect(() => parseFeed('https://example.com/feed.xml', '<not valid xml <<')).toThrow()
  })

  it('throws when channel element is missing', () => {
    expect(() => parseFeed('https://example.com/feed.xml', '<rss><notchannel/></rss>')).toThrow()
  })
})
