import App from '../App'

jest.mock('../src/screens/LibraryScreen', () => ({ LibraryScreen: () => null }))
jest.mock('../src/screens/PlayerScreen', () => ({ PlayerScreen: () => null }))
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

it('App exports a React component', () => {
  expect(typeof App).toBe('function')
})
