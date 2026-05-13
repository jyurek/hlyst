import * as BackgroundFetch from 'expo-background-fetch'
import * as TaskManager from 'expo-task-manager'
import { openDatabase } from '../db/database'
import { createFeedRefreshService } from '../services/feedRefreshService'

export const BACKGROUND_FETCH_TASK = 'hlyst-background-refresh'

const MINIMUM_FETCH_INTERVAL_SECONDS = 30 * 60

export function defineBackgroundRefreshTask(): void {
  TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
    try {
      const db = await openDatabase()
      const service = createFeedRefreshService(db.subscriptions, db.episodes)
      const { refreshed } = await service.refreshAll()
      return refreshed > 0
        ? BackgroundFetch.BackgroundFetchResult.NewData
        : BackgroundFetch.BackgroundFetchResult.NoData
    } catch (err) {
      console.error('[backgroundRefresh] Task failed:', err)
      return BackgroundFetch.BackgroundFetchResult.Failed
    }
  })
}

export async function registerBackgroundFetch(): Promise<void> {
  defineBackgroundRefreshTask()
  await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
    minimumInterval: MINIMUM_FETCH_INTERVAL_SECONDS,
    stopOnTerminate: false,
    startOnBoot: false,
  })
}
