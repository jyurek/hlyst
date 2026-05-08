export type DownloadStatus = 'none' | 'queued' | 'downloading' | 'complete' | 'failed'
export type RuleAction = 'auto_download' | 'auto_play' | 'skip' | 'archive'
export type DownloadRecordStatus = 'pending' | 'downloading' | 'complete' | 'failed' | 'cancelled'

export interface Subscription {
  id: string
  feedUrl: string
  title: string
  imageUrl: string | null
  description: string | null
  lastFetchedAt: number | null
  createdAt: number
}

export interface NewSubscription {
  id: string
  feedUrl: string
  title: string
  imageUrl?: string | null
  description?: string | null
  lastFetchedAt?: number | null
  createdAt: number
}

export interface Episode {
  id: string
  subscriptionId: string
  guid: string
  title: string
  description: string | null
  duration: number | null
  publishedAt: number | null
  mediaUrl: string
  fileSize: number | null
  downloadStatus: DownloadStatus
  localPath: string | null
  playedAt: number | null
  isArchived: boolean
  createdAt: number
}

export interface NewEpisode {
  id: string
  subscriptionId: string
  guid: string
  title: string
  description?: string | null
  duration?: number | null
  publishedAt?: number | null
  mediaUrl: string
  fileSize?: number | null
  downloadStatus?: DownloadStatus
  localPath?: string | null
  playedAt?: number | null
  isArchived?: boolean
  createdAt: number
}

export interface QueueEntry {
  id: string
  episodeId: string
  position: number
  addedAt: number
}

export interface NewQueueEntry {
  id: string
  episodeId: string
  position: number
  addedAt: number
}

export interface RuleCondition {
  field: string
  operator: 'eq' | 'neq' | 'contains' | 'gt' | 'lt'
  value: string | number | boolean
}

export interface Rule {
  id: string
  subscriptionId: string | null
  title: string
  action: RuleAction
  conditions: RuleCondition[]
  priority: number
  isActive: boolean
  createdAt: number
}

export interface NewRule {
  id: string
  subscriptionId?: string | null
  title: string
  action: RuleAction
  conditions?: RuleCondition[]
  priority?: number
  isActive?: boolean
  createdAt: number
}

export interface DownloadRecord {
  id: string
  episodeId: string
  startedAt: number
  completedAt: number | null
  bytesDownloaded: number
  totalBytes: number | null
  status: DownloadRecordStatus
  error: string | null
}

export interface NewDownloadRecord {
  id: string
  episodeId: string
  startedAt: number
  completedAt?: number | null
  bytesDownloaded?: number
  totalBytes?: number | null
  status?: DownloadRecordStatus
  error?: string | null
}

export interface PlaybackState {
  episodeId: string
  position: number
  speed: number
  updatedAt: number
}

export type UpsertPlaybackState = PlaybackState

/** Minimal DB interface satisfied by expo-sqlite's SQLiteDatabase */
export interface Db {
  execAsync(sql: string): Promise<void>
  runAsync(
    sql: string,
    ...params: (string | number | null | boolean)[]
  ): Promise<{ lastInsertRowId: number; changes: number }>
  getAllAsync<T>(sql: string, ...params: (string | number | null | boolean)[]): Promise<T[]>
  getFirstAsync<T>(sql: string, ...params: (string | number | null | boolean)[]): Promise<T | null>
}
