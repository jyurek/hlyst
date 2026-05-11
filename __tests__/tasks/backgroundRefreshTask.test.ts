import { BACKGROUND_FETCH_TASK } from '../../src/tasks/backgroundRefreshTask'

jest.mock('expo-background-fetch', () => ({
  registerTaskAsync: jest.fn().mockResolvedValue(undefined),
  BackgroundFetchResult: { NewData: 1, NoData: 2, Failed: 3 },
}))

jest.mock('expo-task-manager', () => ({
  defineTask: jest.fn(),
}))

jest.mock('../../src/db/database', () => ({
  openDatabase: jest.fn().mockResolvedValue({
    subscriptions: {},
    episodes: {},
  }),
}))

jest.mock('../../src/services/feedRefreshService', () => ({
  createFeedRefreshService: jest.fn().mockReturnValue({
    refreshAll: jest.fn().mockResolvedValue({ refreshed: 0, failed: 0 }),
  }),
}))

describe('backgroundRefreshTask', () => {
  it('exports BACKGROUND_FETCH_TASK constant', () => {
    expect(typeof BACKGROUND_FETCH_TASK).toBe('string')
    expect(BACKGROUND_FETCH_TASK.length).toBeGreaterThan(0)
  })

  it('registerBackgroundFetch calls BackgroundFetch.registerTaskAsync', async () => {
    const BackgroundFetch = require('expo-background-fetch')
    const { registerBackgroundFetch } = require('../../src/tasks/backgroundRefreshTask')
    await registerBackgroundFetch()
    expect(BackgroundFetch.registerTaskAsync).toHaveBeenCalledWith(
      BACKGROUND_FETCH_TASK,
      expect.objectContaining({
        minimumInterval: expect.any(Number),
        stopOnTerminate: false,
        startOnBoot: false,
      }),
    )
  })
})
