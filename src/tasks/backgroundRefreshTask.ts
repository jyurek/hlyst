import * as BackgroundTask from 'expo-background-task'
import { BackgroundTaskResult, BackgroundTaskStatus } from 'expo-background-task'
import * as TaskManager from 'expo-task-manager'
import type { TaskManagerTaskBody } from 'expo-task-manager'
import { openDatabase } from '../db/database'
import { createFeedRefreshService } from '../services/feedRefreshService'

export const BACKGROUND_FETCH_TASK = 'hlyst-background-refresh'

const MINIMUM_FETCH_INTERVAL_MINUTES = 30

export function defineBackgroundRefreshTask(): void {
  TaskManager.defineTask(
    BACKGROUND_FETCH_TASK,
    async ({ error }: TaskManagerTaskBody): Promise<BackgroundTaskResult> => {
      if (error) {
        console.error('[backgroundRefresh] Task launched with error:', error)
        return BackgroundTaskResult.Failed
      }
      try {
        const db = await openDatabase()
        const service = createFeedRefreshService(db.subscriptions, db.episodes)
        const { refreshed, failed } = await service.refreshAll()
        if (failed > 0) console.warn(`[backgroundRefresh] ${failed} feed(s) failed to refresh`)
        return failed > 0 && refreshed === 0
          ? BackgroundTaskResult.Failed
          : BackgroundTaskResult.Success
      } catch (err) {
        console.error('[backgroundRefresh] Task failed:', err)
        return BackgroundTaskResult.Failed
      }
    },
  )
}

export async function registerBackgroundFetch(): Promise<void> {
  const status = await BackgroundTask.getStatusAsync()
  if (status !== BackgroundTaskStatus.Available) {
    console.warn('[backgroundRefresh] Background tasks unavailable (status:', status, ')')
    return
  }
  await BackgroundTask.registerTaskAsync(BACKGROUND_FETCH_TASK, {
    minimumInterval: MINIMUM_FETCH_INTERVAL_MINUTES,
  })
}
