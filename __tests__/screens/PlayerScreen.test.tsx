import React, { createElement } from 'react'
import { create, act } from 'react-test-renderer'
import type { Episode } from '../../src/db/types'
import type { PlayerService } from '../../src/services/playerService'

// Provide simple native-component mocks before importing the component
jest.mock('react-native', () => {
  const React = require('react')
  const mockView = (props: Record<string, unknown>) =>
    React.createElement('View', { testID: props.testID, onPress: props.onPress }, props.children)
  const mockText = (props: Record<string, unknown>) =>
    React.createElement('Text', { testID: props.testID }, props.children)
  const mockImage = (props: Record<string, unknown>) =>
    React.createElement('Image', { testID: props.testID, source: props.source })
  const mockTouchable = (props: Record<string, unknown>) =>
    React.createElement(
      'TouchableOpacity',
      { testID: props.testID, onPress: props.onPress },
      props.children,
    )
  return {
    View: mockView,
    Text: mockText,
    Image: mockImage,
    TouchableOpacity: mockTouchable,
    StyleSheet: { create: (s: unknown) => s, hairlineWidth: 1 },
  }
})

jest.mock('react-native-track-player', () => ({
  usePlaybackState: jest.fn().mockReturnValue({ state: 'playing' }),
  useProgress: jest.fn().mockReturnValue({ position: 30, duration: 3600 }),
  State: { Playing: 'playing', Paused: 'paused' },
  registerPlaybackService: jest.fn(),
  default: { registerPlaybackService: jest.fn() },
}))

// Import after mocks are set up
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PlayerScreen } =
  require('../../src/screens/PlayerScreen') as typeof import('../../src/screens/PlayerScreen')

const mockEpisode: Episode = {
  id: 'ep-1',
  subscriptionId: 'sub-1',
  guid: 'guid-1',
  title: 'Test Episode Title',
  description: null,
  duration: 3600,
  publishedAt: null,
  mediaUrl: 'https://example.com/ep.mp3',
  fileSize: null,
  downloadStatus: 'none',
  localPath: null,
  playedAt: null,
  isArchived: false,
  createdAt: Date.now(),
}

function makePlayerService(overrides: Partial<PlayerService> = {}): PlayerService {
  return {
    setup: jest.fn().mockResolvedValue(undefined),
    loadEpisode: jest.fn().mockResolvedValue(undefined),
    play: jest.fn().mockResolvedValue(undefined),
    pause: jest.fn().mockResolvedValue(undefined),
    seekTo: jest.fn().mockResolvedValue(undefined),
    setSpeed: jest.fn().mockResolvedValue(undefined),
    ...overrides,
  }
}

// Finds a node with a given testID in the rendered tree
function findByTestId(instance: ReturnType<typeof create>, testId: string): unknown {
  const search = (node: unknown): unknown => {
    if (!node || typeof node !== 'object') return null
    const n = node as { props?: Record<string, unknown>; children?: unknown[] }
    if (n.props?.testID === testId) return n
    if (n.children) {
      for (const child of n.children) {
        const found = search(child)
        if (found) return found
      }
    }
    return null
  }
  return search(instance.toJSON())
}

function pressNode(node: unknown) {
  const n = node as { props?: { onPress?: () => void } }
  n.props?.onPress?.()
}

describe('PlayerScreen', () => {
  it('renders artwork placeholder when imageUrl is null', () => {
    let instance!: ReturnType<typeof create>
    act(() => {
      instance = create(
        createElement(PlayerScreen, {
          episode: mockEpisode,
          playerService: makePlayerService(),
          imageUrl: null,
          podcastName: 'Test Podcast',
        }),
      )
    })
    expect(findByTestId(instance, 'artwork-placeholder')).toBeTruthy()
  })

  it('renders Image when imageUrl is provided', () => {
    let instance!: ReturnType<typeof create>
    act(() => {
      instance = create(
        createElement(PlayerScreen, {
          episode: mockEpisode,
          playerService: makePlayerService(),
          imageUrl: 'https://example.com/art.png',
          podcastName: 'Test Podcast',
        }),
      )
    })
    expect(findByTestId(instance, 'artwork-image')).toBeTruthy()
  })

  it('renders the episode title in the JSON output', () => {
    let instance!: ReturnType<typeof create>
    act(() => {
      instance = create(
        createElement(PlayerScreen, {
          episode: mockEpisode,
          playerService: makePlayerService(),
          imageUrl: null,
          podcastName: 'Test Podcast',
        }),
      )
    })
    expect(JSON.stringify(instance.toJSON())).toContain('Test Episode Title')
  })

  it('renders the podcast name in the JSON output', () => {
    let instance!: ReturnType<typeof create>
    act(() => {
      instance = create(
        createElement(PlayerScreen, {
          episode: mockEpisode,
          playerService: makePlayerService(),
          imageUrl: null,
          podcastName: 'My Podcast',
        }),
      )
    })
    expect(JSON.stringify(instance.toJSON())).toContain('My Podcast')
  })

  it('renders the progress bar', () => {
    let instance!: ReturnType<typeof create>
    act(() => {
      instance = create(
        createElement(PlayerScreen, {
          episode: mockEpisode,
          playerService: makePlayerService(),
          imageUrl: null,
          podcastName: 'Test Podcast',
        }),
      )
    })
    expect(findByTestId(instance, 'progress-bar')).toBeTruthy()
  })

  it('calls playerService.pause when play/pause pressed while playing', () => {
    const service = makePlayerService()
    let instance!: ReturnType<typeof create>
    act(() => {
      instance = create(
        createElement(PlayerScreen, {
          episode: mockEpisode,
          playerService: service,
          imageUrl: null,
          podcastName: 'Test Podcast',
        }),
      )
    })
    act(() => {
      pressNode(findByTestId(instance, 'play-pause-btn'))
    })
    expect(service.pause).toHaveBeenCalled()
  })

  it('calls playerService.play when play/pause pressed while paused', () => {
    const mockRntp = require('react-native-track-player') as {
      usePlaybackState: jest.Mock
    }
    mockRntp.usePlaybackState.mockReturnValueOnce({ state: 'paused' })
    const service = makePlayerService()
    let instance!: ReturnType<typeof create>
    act(() => {
      instance = create(
        createElement(PlayerScreen, {
          episode: mockEpisode,
          playerService: service,
          imageUrl: null,
          podcastName: 'Test Podcast',
        }),
      )
    })
    act(() => {
      pressNode(findByTestId(instance, 'play-pause-btn'))
    })
    expect(service.play).toHaveBeenCalled()
  })

  it('calls seekTo with position + 30 when +30 button pressed', () => {
    const service = makePlayerService()
    let instance!: ReturnType<typeof create>
    act(() => {
      instance = create(
        createElement(PlayerScreen, {
          episode: mockEpisode,
          playerService: service,
          imageUrl: null,
          podcastName: 'Test Podcast',
        }),
      )
    })
    act(() => {
      pressNode(findByTestId(instance, 'skip-forward-btn'))
    })
    // progress.position is 30 from mock, so seekTo should be called with 60
    expect(service.seekTo).toHaveBeenCalledWith(60)
  })

  it('calls onQueuePress when queue button is pressed', () => {
    const service = makePlayerService()
    const onQueuePress = jest.fn()
    let instance!: ReturnType<typeof create>
    act(() => {
      instance = create(
        createElement(PlayerScreen, {
          episode: mockEpisode,
          playerService: service,
          imageUrl: null,
          podcastName: 'Test Podcast',
          onQueuePress,
        }),
      )
    })
    act(() => {
      pressNode(findByTestId(instance, 'queue-btn'))
    })
    expect(onQueuePress).toHaveBeenCalled()
  })

  it('calls onExpand when expand button is pressed', () => {
    const service = makePlayerService()
    const onExpand = jest.fn()
    let instance!: ReturnType<typeof create>
    act(() => {
      instance = create(
        createElement(PlayerScreen, {
          episode: mockEpisode,
          playerService: service,
          imageUrl: null,
          podcastName: 'Test Podcast',
          onExpand,
        }),
      )
    })
    act(() => {
      pressNode(findByTestId(instance, 'expand-btn'))
    })
    expect(onExpand).toHaveBeenCalled()
  })
})
