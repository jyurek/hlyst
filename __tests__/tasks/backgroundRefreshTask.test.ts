import {
  BACKGROUND_FETCH_TASK,
  registerBackgroundFetch,
  defineBackgroundRefreshTask,
} from '../../src/tasks/backgroundRefreshTask'
import * as BackgroundTask from 'expo-background-task'
import { BackgroundTaskResult } from 'expo-background-task'
import * as TaskManager from 'expo-task-manager'
import { createFeedRefreshService } from '../../src/services/feedRefreshService'

jest.mock('expo-background-task', () => ({
  getStatusAsync: jest.fn().mockResolvedValue(2), // BackgroundTaskStatus.Available
  registerTaskAsync: jest.fn().mockResolvedValue(undefined),
  BackgroundTaskStatus: { Restricted: 1, Available: 2 },
  BackgroundTaskResult: { Success: 1, Failed: 2 },
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

function makeBody(overrides: Record<string, unknown> = {}) {
  return {
    data: {},
    error: null,
    executionInfo: { taskName: BACKGROUND_FETCH_TASK, eventId: '' },
    ...overrides,
  }
}

describe('backgroundRefreshTask', () => {
  it('BACKGROUND_FETCH_TASK is the expected identifier', () => {
    expect(BACKGROUND_FETCH_TASK).toBe('hlyst-background-refresh')
  })

  describe('registerBackgroundFetch', () => {
    it('calls BackgroundTask.registerTaskAsync with the task name and interval in minutes', async () => {
      await registerBackgroundFetch()
      expect(BackgroundTask.registerTaskAsync).toHaveBeenCalledWith(
        BACKGROUND_FETCH_TASK,
        expect.objectContaining({ minimumInterval: 30 }),
      )
    })
  })

  describe('task handler', () => {
    let handler: (body: ReturnType<typeof makeBody>) => Promise<BackgroundTaskResult>
    let consoleErrorSpy: jest.SpyInstance
    let consoleWarnSpy: jest.SpyInstance

    beforeAll(() => {
      defineBackgroundRefreshTask()
      handler = (TaskManager.defineTask as jest.Mock).mock.calls.at(-1)[1]
    })

    beforeEach(() => {
      jest.clearAllMocks()
      consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
      consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {})
    })

    afterEach(() => {
      consoleErrorSpy.mockRestore()
      consoleWarnSpy.mockRestore()
    })

    it('returns Success when episodes were refreshed', async () => {
      ;(createFeedRefreshService as jest.Mock).mockReturnValue({
        refreshAll: jest.fn().mockResolvedValue({ refreshed: 2, failed: 0 }),
      })
      expect(await handler(makeBody())).toBe(BackgroundTaskResult.Success)
    })

    it('returns Success when no episodes were refreshed and no failures', async () => {
      ;(createFeedRefreshService as jest.Mock).mockReturnValue({
        refreshAll: jest.fn().mockResolvedValue({ refreshed: 0, failed: 0 }),
      })
      expect(await handler(makeBody())).toBe(BackgroundTaskResult.Success)
    })

    it('returns Success when some feeds refreshed even with partial failures', async () => {
      ;(createFeedRefreshService as jest.Mock).mockReturnValue({
        refreshAll: jest.fn().mockResolvedValue({ refreshed: 1, failed: 1 }),
      })
      expect(await handler(makeBody())).toBe(BackgroundTaskResult.Success)
    })

    it('returns Failed when all feeds failed to refresh', async () => {
      ;(createFeedRefreshService as jest.Mock).mockReturnValue({
        refreshAll: jest.fn().mockResolvedValue({ refreshed: 0, failed: 2 }),
      })
      expect(await handler(makeBody())).toBe(BackgroundTaskResult.Failed)
    })

    it('returns Failed when an exception is thrown', async () => {
      ;(createFeedRefreshService as jest.Mock).mockReturnValue({
        refreshAll: jest.fn().mockRejectedValue(new Error('network error')),
      })
      expect(await handler(makeBody())).toBe(BackgroundTaskResult.Failed)
    })

    it('returns Failed immediately when the task body carries an error', async () => {
      const result = await handler(makeBody({ error: new Error('task launch error') }))
      expect(result).toBe(BackgroundTaskResult.Failed)
    })
  })
})
