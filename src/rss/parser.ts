import { XMLParser } from 'fast-xml-parser'

export interface ParsedEpisode {
  guid: string
  title: string
  description: string | null
  mediaUrl: string
  fileSize: number | null
  duration: number
  publishedAt: number | null
}

export interface ParsedFeed {
  feedUrl: string
  title: string
  description: string | null
  imageUrl: string | null
  episodes: ParsedEpisode[]
}

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  allowBooleanAttributes: true,
  // Treat HTML-bearing nodes as raw text so we never walk their nested tags
  stopNodes: ['*.content:encoded', '*.description', '*.itunes:summary'],
  maxNestedTags: 1000,
})

function parseDuration(raw: unknown): number {
  if (raw === undefined || raw === null || raw === '') return 0
  const str = String(raw)
  if (str.includes(':')) {
    const parts = str.split(':').map(Number)
    if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2]
    if (parts.length === 2) return parts[0] * 60 + parts[1]
  }
  const n = Number(str)
  return isNaN(n) ? 0 : n
}

function extractText(value: unknown): string {
  if (value === null || value === undefined) return ''
  if (typeof value === 'object' && '#text' in (value as object))
    return String((value as Record<string, unknown>)['#text'])
  return String(value)
}

function parseItems(raw: unknown): ParsedEpisode[] {
  if (!raw) return []
  const items = Array.isArray(raw) ? raw : [raw]
  return items
    .filter((item) => item?.enclosure?.['@_url'])
    .map((item) => ({
      guid: extractText(item.guid) || extractText(item.title),
      title: String(item.title ?? ''),
      description: item.description ? String(item.description) : null,
      mediaUrl: String(item.enclosure['@_url']),
      fileSize: item.enclosure['@_length'] ? Number(item.enclosure['@_length']) : null,
      duration: parseDuration(item['itunes:duration']),
      publishedAt: item.pubDate ? new Date(String(item.pubDate)).getTime() : null,
    }))
}

export function parseFeed(feedUrl: string, xml: string): ParsedFeed {
  const result = parser.parse(xml)
  const channel = result?.rss?.channel
  if (!channel) throw new Error('Invalid RSS feed: missing <channel>')

  const imageUrl = channel['itunes:image']?.['@_href'] ?? channel.image?.url ?? null

  return {
    feedUrl,
    title: String(channel.title ?? ''),
    description: channel.description ? String(channel.description) : null,
    imageUrl: imageUrl ? String(imageUrl) : null,
    episodes: parseItems(channel.item),
  }
}
