import { useEffect, useState, useRef } from 'react'
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { openDatabase, type Database } from './src/db/database'
import { createSubscriptionService } from './src/services/subscriptionService'
import { createPlayerService, type PlayerService } from './src/services/playerService'
import { createFeedRefreshService } from './src/services/feedRefreshService'
import { registerBackgroundFetch } from './src/tasks/backgroundRefreshTask'
import { LibraryScreen } from './src/screens/LibraryScreen'
import { PlayerScreen } from './src/screens/PlayerScreen'
import { QueueScreen } from './src/screens/QueueScreen'
import { FullPlayerScreen } from './src/screens/FullPlayerScreen'
import { QueueSheet } from './src/components/QueueSheet'
import type { Episode, Subscription } from './src/db/types'

type Tab = 'library' | 'queue'

export default function App() {
  const [db, setDb] = useState<Database | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null)
  const [currentSubscriptionImageUrl, setCurrentSubscriptionImageUrl] = useState<string | null>(
    null,
  )
  const [currentPodcastName, setCurrentPodcastName] = useState('')
  const [activeTab, setActiveTab] = useState<Tab>('library')
  const [showQueue, setShowQueue] = useState(false)
  const [showFullPlayer, setShowFullPlayer] = useState(false)
  const playerService = useRef<PlayerService>(createPlayerService())

  useEffect(() => {
    void (async () => {
      const opened = await openDatabase()
      setDb(opened)
      const results = await Promise.allSettled([
        playerService.current.setup(),
        registerBackgroundFetch(),
        createFeedRefreshService(opened.subscriptions, opened.episodes)
          .refreshAll()
          .then(({ refreshed }) => {
            if (refreshed > 0) setRefreshKey((k) => k + 1)
          }),
      ])
      for (const result of results) {
        if (result.status === 'rejected') {
          console.error('[App] startup task failed:', result.reason)
        }
      }
    })().catch((err) => console.error('[App] failed to open database:', err))
  }, [])

  async function handleSelectSubscription(sub: Subscription, episodeDao: Database['episodes']) {
    const episodes = await episodeDao.findBySubscriptionId(sub.id)
    if (!episodes.length) return
    const episode = episodes[0]
    setCurrentEpisode(episode)
    setCurrentSubscriptionImageUrl(sub.imageUrl)
    setCurrentPodcastName(sub.title)
    try {
      await playerService.current.loadEpisode(episode)
      await playerService.current.play()
    } catch (err) {
      console.error('[App] failed to start playback:', err)
    }
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
      <View style={styles.screenArea}>
        {activeTab === 'library' ? (
          <LibraryScreen
            subscriptionService={service}
            subscriptionDao={db.subscriptions}
            refreshKey={refreshKey}
            onSelectSubscription={(sub) => handleSelectSubscription(sub, db.episodes)}
          />
        ) : (
          <QueueScreen />
        )}
      </View>

      <QueueSheet
        visible={showQueue}
        onDismiss={() => setShowQueue(false)}
        currentEpisode={currentEpisode}
        currentPodcastName={currentPodcastName || null}
        queueItems={[]}
        onRemove={() => {}}
        onReorder={() => {}}
      />

      {currentEpisode ? (
        <PlayerScreen
          episode={currentEpisode}
          playerService={playerService.current}
          imageUrl={currentSubscriptionImageUrl}
          podcastName={currentPodcastName}
          onQueuePress={() => setShowQueue(true)}
          onExpand={() => setShowFullPlayer(true)}
        />
      ) : null}

      {currentEpisode ? (
        <FullPlayerScreen
          visible={showFullPlayer}
          onDismiss={() => setShowFullPlayer(false)}
          episode={currentEpisode}
          imageUrl={currentSubscriptionImageUrl}
          podcastName={currentPodcastName}
          playerService={playerService.current}
        />
      ) : null}

      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tab} onPress={() => setActiveTab('library')}>
          <Text style={[styles.tabText, activeTab === 'library' && styles.tabTextActive]}>
            Library
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab} onPress={() => setActiveTab('queue')}>
          <Text style={[styles.tabText, activeTab === 'queue' && styles.tabTextActive]}>Queue</Text>
        </TouchableOpacity>
      </View>

      <StatusBar style="auto" />
    </View>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  screenArea: { flex: 1 },
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#ddd',
    backgroundColor: '#fff',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 15,
    color: '#888',
  },
  tabTextActive: {
    color: '#007AFF',
    fontWeight: '700',
  },
})
