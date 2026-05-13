import { useEffect, useState, useRef } from 'react'
import { View, ActivityIndicator, StyleSheet } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { openDatabase, type Database } from './src/db/database'
import { createSubscriptionService } from './src/services/subscriptionService'
import { createPlayerService, type PlayerService } from './src/services/playerService'
import { createFeedRefreshService } from './src/services/feedRefreshService'
import { registerBackgroundFetch } from './src/tasks/backgroundRefreshTask'
import { LibraryScreen } from './src/screens/LibraryScreen'
import { PlayerScreen } from './src/screens/PlayerScreen'
import type { Episode, Subscription } from './src/db/types'

export default function App() {
  const [db, setDb] = useState<Database | null>(null)
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null)
  const playerService = useRef<PlayerService>(createPlayerService())

  useEffect(() => {
    void (async () => {
      const opened = await openDatabase()
      setDb(opened)
      await Promise.all([
        playerService.current.setup(),
        registerBackgroundFetch(),
        createFeedRefreshService(opened.subscriptions, opened.episodes).refreshAll(),
      ])
    })().catch((err) => console.error('[App] startup failed:', err))
  }, [])

  async function handleSelectSubscription(sub: Subscription, episodeDao: Database['episodes']) {
    const episodes = await episodeDao.findBySubscriptionId(sub.id)
    if (!episodes.length) return
    const episode = episodes[0]
    setCurrentEpisode(episode)
    await playerService.current.loadEpisode(episode)
    await playerService.current.play()
  }

  if (!db) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
        <StatusBar style="auto" />
      </View>
    )
  }

  const service = createSubscriptionService(db.subscriptions, db.episodes)

  return (
    <View style={styles.root}>
      <LibraryScreen
        subscriptionService={service}
        subscriptionDao={db.subscriptions}
        onSelectSubscription={(sub) => handleSelectSubscription(sub, db.episodes)}
      />
      {currentEpisode ? (
        <PlayerScreen episode={currentEpisode} playerService={playerService.current} />
      ) : null}
      <StatusBar style="auto" />
    </View>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
})
