import {
  BACKGROUND_FETCH_TASK,
  registerBackgroundFetch,
  defineBackgroundRefreshTask,
} from '../../src/tasks/backgroundRefreshTask'
import * as BackgroundFetch from 'expo-background-fetch'
import * as TaskManager from 'expo-task-manager'
import { createFeedRefreshService } from '../../src/services/feedRefreshService'

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
  it('BACKGROUND_FETCH_TASK is the expected identifier', () => {
    expect(BACKGROUND_FETCH_TASK).toBe('hlyst-background-refresh')
  })

  describe('registerBackgroundFetch', () => {
    it('calls BackgroundFetch.registerTaskAsync with the correct options', async () => {
      await registerBackgroundFetch()
      expect(BackgroundFetch.registerTaskAsync).toHaveBeenCalledWith(
        BACKGROUND_FETCH_TASK,
        expect.objectContaining({
          minimumInterval: 30 * 60,
          stopOnTerminate: false,
          startOnBoot: false,
        }),
      )
    })
  })

  describe('task handler', () => {
    function getTaskHandler(): () => Promise<number> {
      return (TaskManager.defineTask as jest.Mock).mock.calls.at(-1)[1]
    }

    beforeEach(() => {
      jest.clearAllMocks()
      defineBackgroundRefreshTask()
    })

    it('returns NewData when episodes were refreshed', async () => {
      ;(createFeedRefreshService as jest.Mock).mockReturnValue({
        refreshAll: jest.fn().mockResolvedValue({ refreshed: 2, failed: 0 }),
      })
      const result = await getTaskHandler()()
      expect(result).toBe(BackgroundFetch.BackgroundFetchResult.NewData)
    })

    it('returns NoData when no episodes were refreshed', async () => {
      ;(createFeedRefreshService as jest.Mock).mockReturnValue({
        refreshAll: jest.fn().mockResolvedValue({ refreshed: 0, failed: 0 }),
      })
      const result = await getTaskHandler()()
      expect(result).toBe(BackgroundFetch.BackgroundFetchResult.NoData)
    })

    it('returns Failed when an error is thrown', async () => {
      ;(createFeedRefreshService as jest.Mock).mockReturnValue({
        refreshAll: jest.fn().mockRejectedValue(new Error('network error')),
      })
      const result = await getTaskHandler()()
      expect(result).toBe(BackgroundFetch.BackgroundFetchResult.Failed)
    })
  })
})
