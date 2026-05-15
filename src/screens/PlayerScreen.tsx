import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native'
import { usePlaybackState, useProgress, State } from 'react-native-track-player'
import type { Episode } from '../db/types'
import type { PlayerService } from '../services/playerService'

interface Props {
  episode: Episode
  playerService: PlayerService
  imageUrl: string | null
  podcastName: string
  onQueuePress?: () => void
  onExpand?: () => void
}

export function PlayerScreen({
  episode,
  playerService,
  imageUrl,
  podcastName,
  onQueuePress,
  onExpand,
}: Props) {
  const playbackState = usePlaybackState()
  const progress = useProgress()
  const isPlaying = playbackState.state === State.Playing

  const elapsed = progress.position
  const total = progress.duration || episode.duration || 0
  const progressFraction = total > 0 ? Math.min(elapsed / total, 1) : 0

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <TouchableOpacity
          testID="expand-btn"
          style={styles.expandArea}
          onPress={onExpand}
          activeOpacity={0.7}
        >
          {imageUrl ? (
            <Image testID="artwork-image" source={{ uri: imageUrl }} style={styles.artwork} />
          ) : (
            <View testID="artwork-placeholder" style={styles.artworkPlaceholder} />
          )}
          <View style={styles.textArea}>
            <Text style={styles.title} numberOfLines={1}>
              {episode.title}
            </Text>
            <Text style={styles.subtitle} numberOfLines={1}>
              {podcastName}
            </Text>
          </View>
        </TouchableOpacity>

        <View style={styles.controls}>
          <TouchableOpacity testID="queue-btn" style={styles.iconBtn} onPress={onQueuePress}>
            <Text style={styles.iconText}>≡</Text>
          </TouchableOpacity>

          <TouchableOpacity
            testID="play-pause-btn"
            style={styles.iconBtn}
            onPress={() => (isPlaying ? playerService.pause() : playerService.play())}
          >
            <Text style={styles.iconText}>{isPlaying ? '⏸' : '▶'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            testID="skip-forward-btn"
            style={styles.iconBtn}
            onPress={() => playerService.seekTo(progress.position + 30)}
          >
            <Text style={styles.iconText}>⏩</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View testID="progress-bar" style={styles.progressTrack}>
        <View style={[styles.progressFill, { flex: progressFraction }]} />
        <View style={{ flex: 1 - progressFraction }} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8f8f8',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#ddd',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  expandArea: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minWidth: 0,
  },
  artwork: {
    width: 48,
    height: 48,
    borderRadius: 4,
    backgroundColor: '#ccc',
  },
  artworkPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 4,
    backgroundColor: '#ccc',
  },
  textArea: {
    flex: 1,
    minWidth: 0,
  },
  title: { fontSize: 14, fontWeight: '600', color: '#111' },
  subtitle: { fontSize: 12, color: '#888', marginTop: 2 },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  iconBtn: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: { fontSize: 18 },
  progressTrack: {
    height: 2,
    flexDirection: 'row',
    backgroundColor: '#e0e0e0',
  },
  progressFill: {
    backgroundColor: '#007AFF',
  },
})
