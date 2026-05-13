import React from 'react'
import { act, create } from 'react-test-renderer'
import { FullPlayerScreen } from '../../src/screens/FullPlayerScreen'
import type { Episode } from '../../src/db/types'
import type { PlayerService } from '../../src/services/playerService'

// react-native 0.81 contains ViewConfigIgnore.js with Flow `const T` type
// parameters that hermes-parser 0.25 cannot handle. Mock the whole module so
// the transform never touches those files.
jest.mock('react-native', () => {
  const React = require('react')

  function View({ children, style, testID, ...rest }: Record<string, unknown>) {
    return React.createElement('View', { style, testID, ...rest }, children)
  }
  function Text({ children, style, testID, numberOfLines, ...rest }: Record<string, unknown>) {
    return React.createElement('Text', { style, testID, numberOfLines, ...rest }, children)
  }
  function TouchableOpacity({
    children,
    style,
    testID,
    onPress,
    ...rest
  }: Record<string, unknown>) {
    return React.createElement('TouchableOpacity', { style, testID, onPress, ...rest }, children)
  }
  function TouchableWithoutFeedback({ children, onPress, ...rest }: Record<string, unknown>) {
    return React.createElement('TouchableWithoutFeedback', { onPress, ...rest }, children)
  }
  function Image({ style, testID, source, resizeMode, ...rest }: Record<string, unknown>) {
    return React.createElement('Image', { style, testID, source, resizeMode, ...rest })
  }
  function Modal({ children, visible, animationType, onRequestClose }: Record<string, unknown>) {
    if (!visible) return null
    return React.createElement('Modal', { animationType, onRequestClose }, children)
  }

  return {
    View,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Image,
    Modal,
    StyleSheet: {
      create: (s: Record<string, unknown>) => s,
      hairlineWidth: 1,
      flatten: (s: unknown) => s,
    },
    Dimensions: {
      get: () => ({ width: 375, height: 812 }),
    },
  }
})

jest.mock('react-native-track-player', () => ({
  registerPlaybackService: jest.fn(),
  default: { registerPlaybackService: jest.fn() },
  usePlaybackState: jest.fn().mockReturnValue({ state: 'playing' }),
  useProgress: jest.fn().mockReturnValue({ position: 300, duration: 3600 }),
  State: { Playing: 'playing', Paused: 'paused', Stopped: 'stopped' },
}))

function makeEpisode(overrides: Partial<Episode> = {}): Episode {
  return {
    id: 'ep-1',
    subscriptionId: 'sub-1',
    guid: 'g1',
    title: 'Test Episode Title',
    description: null,
    duration: 3600,
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

type FullPlayerProps = React.ComponentProps<typeof FullPlayerScreen>

function renderPlayer(props: Partial<FullPlayerProps> = {}) {
  const episode = makeEpisode()
  const playerService = makePlayerService()
  const onDismiss = jest.fn()

  let instance: ReturnType<typeof create>
  act(() => {
    instance = create(
      <FullPlayerScreen
        visible={true}
        onDismiss={onDismiss}
        episode={episode}
        imageUrl={null}
        podcastName={null}
        playerService={playerService}
        {...props}
      />,
    )
  })
  return { instance: instance!, episode, playerService, onDismiss }
}

/** Find the first element matching testID in the rendered tree */
function findByTestId(instance: ReturnType<typeof create>, testId: string) {
  return instance.root.findAll((node) => node.props.testID === testId)[0]
}

/** Collect all string content from a node and its descendants */
function getAllText(
  node:
    | ReturnType<typeof create>['root']
    | ReturnType<ReturnType<typeof create>['root']['findAll']>[number],
): string {
  if (typeof node.props.children === 'string') return node.props.children
  // Recurse into child instances
  if ('children' in node && Array.isArray((node as { children: unknown }).children)) {
    return (node as { children: ReturnType<ReturnType<typeof create>['root']['findAll']> }).children
      .map(getAllText)
      .join('')
  }
  if (Array.isArray(node.props.children)) {
    return node.props.children.filter((c: unknown) => typeof c === 'string').join('')
  }
  return ''
}

describe('FullPlayerScreen', () => {
  it('renders the episode title', () => {
    const { instance } = renderPlayer()
    const el = findByTestId(instance, 'episode-title')
    expect(getAllText(el)).toBe('Test Episode Title')
  })

  it('renders the podcast name when provided', () => {
    const { instance } = renderPlayer({ podcastName: 'My Podcast' })
    const el = findByTestId(instance, 'podcast-name')
    expect(getAllText(el)).toBe('My Podcast')
  })

  it('renders an empty string when podcast name is null', () => {
    const { instance } = renderPlayer({ podcastName: null })
    const el = findByTestId(instance, 'podcast-name')
    expect(el).toBeTruthy()
  })

  it('play/pause button calls playerService.pause when playing', () => {
    const playerService = makePlayerService()
    const { instance } = renderPlayer({ playerService })
    const btn = findByTestId(instance, 'play-pause-btn')
    act(() => {
      btn.props.onPress()
    })
    expect(playerService.pause).toHaveBeenCalledTimes(1)
    expect(playerService.play).not.toHaveBeenCalled()
  })

  it('play/pause button calls playerService.play when paused', () => {
    const TrackPlayer = require('react-native-track-player')
    TrackPlayer.usePlaybackState.mockReturnValue({ state: 'paused' })
    const playerService = makePlayerService()
    const { instance } = renderPlayer({ playerService })
    const btn = findByTestId(instance, 'play-pause-btn')
    act(() => {
      btn.props.onPress()
    })
    expect(playerService.play).toHaveBeenCalledTimes(1)
    expect(playerService.pause).not.toHaveBeenCalled()
    TrackPlayer.usePlaybackState.mockReturnValue({ state: 'playing' })
  })

  it('-15 button calls seekTo with position - 15', () => {
    const playerService = makePlayerService()
    const { instance } = renderPlayer({ playerService })
    act(() => {
      findByTestId(instance, 'skip-back-15').props.onPress()
    })
    // position is 300 from mock
    expect(playerService.seekTo).toHaveBeenCalledWith(285)
  })

  it('-10 button calls seekTo with position - 10', () => {
    const playerService = makePlayerService()
    const { instance } = renderPlayer({ playerService })
    act(() => {
      findByTestId(instance, 'skip-back-10').props.onPress()
    })
    expect(playerService.seekTo).toHaveBeenCalledWith(290)
  })

  it('+10 button calls seekTo with position + 10', () => {
    const playerService = makePlayerService()
    const { instance } = renderPlayer({ playerService })
    act(() => {
      findByTestId(instance, 'skip-fwd-10').props.onPress()
    })
    expect(playerService.seekTo).toHaveBeenCalledWith(310)
  })

  it('+30 button calls seekTo with position + 30', () => {
    const playerService = makePlayerService()
    const { instance } = renderPlayer({ playerService })
    act(() => {
      findByTestId(instance, 'skip-fwd-30').props.onPress()
    })
    expect(playerService.seekTo).toHaveBeenCalledWith(330)
  })

  it('speed button cycles through speeds on tap', () => {
    const playerService = makePlayerService()
    const { instance } = renderPlayer({ playerService })
    const btn = () => findByTestId(instance, 'speed-btn')

    // initial speed is 1.0×
    expect(getAllText(btn())).toBe('1.0×')

    // 1 → 1.25
    act(() => btn().props.onPress())
    expect(playerService.setSpeed).toHaveBeenLastCalledWith(1.25)
    expect(getAllText(btn())).toBe('1.25×')

    // 1.25 → 1.5
    act(() => btn().props.onPress())
    expect(playerService.setSpeed).toHaveBeenLastCalledWith(1.5)

    // 1.5 → 2
    act(() => btn().props.onPress())
    expect(playerService.setSpeed).toHaveBeenLastCalledWith(2)

    // 2 → 0.75
    act(() => btn().props.onPress())
    expect(playerService.setSpeed).toHaveBeenLastCalledWith(0.75)

    // 0.75 → 1
    act(() => btn().props.onPress())
    expect(playerService.setSpeed).toHaveBeenLastCalledWith(1)
    expect(getAllText(btn())).toBe('1.0×')
  })
})
