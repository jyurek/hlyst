import { createPlayerService } from '../../src/services/playerService'
import type { Episode } from '../../src/db/types'

jest.mock('react-native-track-player', () => ({
  setupPlayer: jest.fn().mockResolvedValue(undefined),
  updateOptions: jest.fn().mockResolvedValue(undefined),
  reset: jest.fn().mockResolvedValue(undefined),
  add: jest.fn().mockResolvedValue(undefined),
  play: jest.fn().mockResolvedValue(undefined),
  pause: jest.fn().mockResolvedValue(undefined),
  seekTo: jest.fn().mockResolvedValue(undefined),
  setRate: jest.fn().mockResolvedValue(undefined),
  Capability: { Play: 'play', Pause: 'pause', SeekTo: 'seekTo' },
  RepeatMode: { Off: 0 },
}))

function makeEpisode(overrides: Partial<Episode> = {}): Episode {
  return {
    id: 'ep-1',
    subscriptionId: 'sub-1',
    guid: 'g1',
    title: 'Test Episode',
    description: null,
    duration: 300,
    publishedAt: null,
    mediaUrl: 'https://example.com/ep1.mp3',
    fileSize: null,
    downloadStatus: 'none',
    localPath: null,
    playedAt: null,
    isArchived: false,
    createdAt: 1000,
    ...overrides,
  }
}

describe('playerService', () => {
  let TrackPlayer: ReturnType<typeof jest.mocked<typeof import('react-native-track-player').default>>

  beforeEach(() => {
    TrackPlayer = require('react-native-track-player')
    jest.clearAllMocks()
  })

  it('setup calls setupPlayer and updateOptions', async () => {
    const service = createPlayerService()
    await service.setup()
    expect(TrackPlayer.setupPlayer).toHaveBeenCalledTimes(1)
    expect(TrackPlayer.updateOptions).toHaveBeenCalledWith(
      expect.objectContaining({ capabilities: expect.any(Array) }),
    )
  })

  it('loadEpisode calls reset then add with episode mediaUrl and title', async () => {
    const service = createPlayerService()
    const ep = makeEpisode()
    await service.loadEpisode(ep)
    expect(TrackPlayer.reset).toHaveBeenCalledTimes(1)
    expect(TrackPlayer.add).toHaveBeenCalledWith(
      expect.objectContaining({ url: ep.mediaUrl, title: ep.title }),
    )
  })

  it('play calls TrackPlayer.play', async () => {
    const service = createPlayerService()
    await service.play()
    expect(TrackPlayer.play).toHaveBeenCalledTimes(1)
  })

  it('pause calls TrackPlayer.pause', async () => {
    const service = createPlayerService()
    await service.pause()
    expect(TrackPlayer.pause).toHaveBeenCalledTimes(1)
  })

  it('seekTo calls TrackPlayer.seekTo with the given position', async () => {
    const service = createPlayerService()
    await service.seekTo(120)
    expect(TrackPlayer.seekTo).toHaveBeenCalledWith(120)
  })

  it('setSpeed calls TrackPlayer.setRate with the given rate', async () => {
    const service = createPlayerService()
    await service.setSpeed(1.5)
    expect(TrackPlayer.setRate).toHaveBeenCalledWith(1.5)
  })
})
