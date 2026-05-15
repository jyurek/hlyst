import React, { createElement } from 'react'
import { create, act } from 'react-test-renderer'
import App from '../App'
import { createPlayerService } from '../src/services/playerService'
import { openDatabase } from '../src/db/database'
import { createSubscriptionService } from '../src/services/subscriptionService'

jest.mock('react-native', () => {
  const React = require('react')
  const mockView = (props: Record<string, unknown>) =>
    React.createElement('View', { testID: props.testID, style: props.style }, props.children)
  const mockText = (props: Record<string, unknown>) =>
    React.createElement('Text', { testID: props.testID }, props.children)
  const mockTouchable = (props: Record<string, unknown>) =>
    React.createElement(
      'TouchableOpacity',
      { testID: props.testID, onPress: props.onPress },
      props.children,
    )
  const mockActivityIndicator = () => React.createElement('ActivityIndicator', {})
  return {
    View: mockView,
    Text: mockText,
    TouchableOpacity: mockTouchable,
    ActivityIndicator: mockActivityIndicator,
    StyleSheet: { create: (s: unknown) => s, hairlineWidth: 1 },
  }
})

jest.mock('../src/screens/LibraryScreen', () => ({ LibraryScreen: jest.fn(() => null) }))
jest.mock('../src/screens/PlayerScreen', () => ({ PlayerScreen: () => null }))
jest.mock('../src/screens/QueueScreen', () => ({ QueueScreen: () => null }))
jest.mock('../src/db/database', () => ({ openDatabase: jest.fn() }))
jest.mock('../src/services/subscriptionService', () => ({
  createSubscriptionService: jest.fn(),
}))
jest.mock('../src/services/playerService', () => ({
  createPlayerService: jest.fn().mockReturnValue({
    setup: jest.fn().mockResolvedValue(undefined),
    loadEpisode: jest.fn().mockResolvedValue(undefined),
    play: jest.fn().mockResolvedValue(undefined),
    pause: jest.fn().mockResolvedValue(undefined),
    seekTo: jest.fn().mockResolvedValue(undefined),
    setSpeed: jest.fn().mockResolvedValue(undefined),
  }),
}))
jest.mock('react-native-track-player', () => ({
  registerPlaybackService: jest.fn(),
  default: { registerPlaybackService: jest.fn() },
}))
jest.mock('../src/services/feedRefreshService', () => ({
  createFeedRefreshService: jest
    .fn()
    .mockReturnValue({ refreshAll: jest.fn().mockResolvedValue({ refreshed: 0, failed: 0 }) }),
}))
jest.mock('../src/tasks/backgroundRefreshTask', () => ({
  registerBackgroundFetch: jest.fn().mockResolvedValue(undefined),
}))
jest.mock('expo-status-bar', () => ({ StatusBar: () => null }))

it('App exports a React component', () => {
  expect(typeof App).toBe('function')
})

it('does not propagate when playerService.play rejects', async () => {
  const mockEpisode = {
    id: 'ep1',
    subscriptionId: 'sub1',
    guid: 'guid1',
    title: 'Ep 1',
    description: null,
    duration: 100,
    publishedAt: null,
    mediaUrl: 'http://example.com/ep1.mp3',
    fileSize: null,
    downloadStatus: 'none',
    localPath: null,
    playedAt: null,
    isArchived: false,
    createdAt: Date.now(),
  }
  const mockSub = {
    id: 'sub1',
    title: 'Pod',
    feedUrl: 'http://example.com/feed.xml',
    imageUrl: null,
  }

  const mockEpisodesDao = { findBySubscriptionId: jest.fn().mockResolvedValue([mockEpisode]) }
  const mockSubscriptionsDao = {}
  const mockDb = { subscriptions: mockSubscriptionsDao, episodes: mockEpisodesDao }
  ;(openDatabase as jest.Mock).mockResolvedValue(mockDb)
  ;(createSubscriptionService as jest.Mock).mockReturnValue({})

  const playerServiceInstance = {
    setup: jest.fn().mockResolvedValue(undefined),
    loadEpisode: jest.fn().mockResolvedValue(undefined),
    play: jest.fn().mockRejectedValue(new Error('playback failed')),
    pause: jest.fn().mockResolvedValue(undefined),
    seekTo: jest.fn().mockResolvedValue(undefined),
    setSpeed: jest.fn().mockResolvedValue(undefined),
  }
  ;(createPlayerService as jest.Mock).mockReturnValue(playerServiceInstance)

  const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

  const { LibraryScreen } = jest.requireMock('../src/screens/LibraryScreen') as {
    LibraryScreen: jest.Mock
  }
  let capturedOnSelectSubscription: ((sub: unknown) => void) | undefined
  LibraryScreen.mockImplementation(
    ({ onSelectSubscription }: { onSelectSubscription: (sub: unknown) => void }) => {
      capturedOnSelectSubscription = onSelectSubscription
      return null
    },
  )

  await act(async () => {
    create(createElement(App))
  })

  await act(async () => {
    capturedOnSelectSubscription?.(mockSub)
  })

  await act(async () => {})

  expect(consoleSpy).toHaveBeenCalledWith('[App] failed to start playback:', expect.any(Error))

  consoleSpy.mockRestore()
  LibraryScreen.mockReset()
})
