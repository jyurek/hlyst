import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { usePlaybackState, useProgress, State } from 'react-native-track-player'
import type { Episode } from '../db/types'
import type { PlayerService } from '../services/playerService'

interface Props {
  episode: Episode
  playerService: PlayerService
}

const SPEEDS = [0.75, 1, 1.25, 1.5, 2] as const

export function PlayerScreen({ episode, playerService }: Props) {
  const playbackState = usePlaybackState()
  const progress = useProgress()
  const isPlaying = playbackState.state === State.Playing

  const elapsed = Math.floor(progress.position)
  const total = Math.floor(progress.duration || episode.duration || 0)

  function fmt(s: number) {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m}:${String(sec).padStart(2, '0')}`
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title} numberOfLines={2}>
        {episode.title}
      </Text>

      <Text style={styles.time}>
        {fmt(elapsed)} / {fmt(total)}
      </Text>

      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.skipBtn}
          onPress={() => playerService.seekTo(Math.max(0, progress.position - 15))}
        >
          <Text style={styles.skipText}>-15</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.playBtn}
          onPress={() => (isPlaying ? playerService.pause() : playerService.play())}
        >
          <Text style={styles.playText}>{isPlaying ? '⏸' : '▶'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.skipBtn}
          onPress={() => playerService.seekTo(progress.position + 30)}
        >
          <Text style={styles.skipText}>+30</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.speeds}>
        {SPEEDS.map((rate) => (
          <TouchableOpacity
            key={rate}
            style={styles.speedBtn}
            onPress={() => playerService.setSpeed(rate)}
          >
            <Text style={styles.speedText}>{rate}×</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8f8f8',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#ddd',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  title: { fontSize: 15, fontWeight: '600', marginBottom: 6 },
  time: { fontSize: 12, color: '#666', marginBottom: 12 },
  controls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 20 },
  playBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playText: { fontSize: 22, color: '#fff' },
  skipBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  skipText: { fontSize: 13, fontWeight: '600', color: '#333' },
  speeds: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginTop: 12 },
  speedBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    backgroundColor: '#e8e8e8',
  },
  speedText: { fontSize: 13, color: '#333' },
})
