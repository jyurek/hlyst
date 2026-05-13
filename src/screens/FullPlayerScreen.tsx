import { useState } from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native'
import { usePlaybackState, useProgress, State } from 'react-native-track-player'
import type { Episode } from '../db/types'
import type { PlayerService } from '../services/playerService'

export interface FullPlayerScreenProps {
  visible: boolean
  onDismiss: () => void
  episode: Episode
  imageUrl: string | null
  podcastName: string | null
  playerService: PlayerService
}

const SPEEDS = [0.75, 1, 1.25, 1.5, 2] as const
const ARTWORK_SIZE = Math.min(Dimensions.get('window').width - 64, 300)

function fmt(seconds: number): string {
  const s = Math.floor(Math.abs(seconds))
  const m = Math.floor(s / 60)
  const sec = s % 60
  const sign = seconds < 0 ? '-' : ''
  return `${sign}${m}:${String(sec).padStart(2, '0')}`
}

export function FullPlayerScreen({
  visible,
  onDismiss,
  episode,
  imageUrl,
  podcastName,
  playerService,
}: FullPlayerScreenProps) {
  const playbackState = usePlaybackState()
  const progress = useProgress()
  const isPlaying = playbackState.state === State.Playing

  const [speedIndex, setSpeedIndex] = useState(1) // default 1× is index 1
  const currentSpeed = SPEEDS[speedIndex]

  const elapsed = Math.floor(progress.position)
  const total = Math.floor(progress.duration || episode.duration || 0)
  const remaining = elapsed - total // negative

  function handlePlayPause() {
    if (isPlaying) {
      void playerService.pause()
    } else {
      void playerService.play()
    }
  }

  function handleSkip(offset: number) {
    void playerService.seekTo(Math.max(0, progress.position + offset))
  }

  function handleSpeedCycle() {
    const next = (speedIndex + 1) % SPEEDS.length
    setSpeedIndex(next)
    void playerService.setSpeed(SPEEDS[next])
  }

  function formatSpeed(rate: number): string {
    return Number.isInteger(rate) ? `${rate}.0×` : `${rate}×`
  }

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onDismiss}>
      <View style={styles.root}>
        {/* Drag handle */}
        <View style={styles.handleRow}>
          <View style={styles.handle} />
        </View>

        {/* Dismiss button */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={onDismiss} style={styles.dismissBtn}>
            <Text style={styles.dismissText}>⌄</Text>
          </TouchableOpacity>
        </View>

        {/* Artwork */}
        <View style={styles.artworkContainer}>
          {imageUrl ? (
            <Image
              source={{ uri: imageUrl }}
              style={[styles.artwork, { width: ARTWORK_SIZE, height: ARTWORK_SIZE }]}
              resizeMode="cover"
            />
          ) : (
            <View
              style={[
                styles.artwork,
                styles.artworkPlaceholder,
                { width: ARTWORK_SIZE, height: ARTWORK_SIZE },
              ]}
            />
          )}
        </View>

        {/* Metadata */}
        <View style={styles.meta}>
          <Text testID="episode-title" style={styles.episodeTitle} numberOfLines={2}>
            {episode.title}
          </Text>
          <Text testID="podcast-name" style={styles.podcastName} numberOfLines={1}>
            {podcastName ?? ''}
          </Text>
        </View>

        {/* Scrubber — simple touch bar */}
        <View style={styles.scrubberSection}>
          <TouchableWithoutFeedback
            onPress={(e) => {
              const { locationX } = e.nativeEvent
              // We use the hardcoded bar width as a fallback; real scrub requires onLayout
              const barWidth = Dimensions.get('window').width - 32
              const ratio = Math.min(1, Math.max(0, locationX / barWidth))
              void playerService.seekTo(ratio * total)
            }}
          >
            <View style={styles.scrubberTrack} testID="scrubber-track">
              <View style={[styles.scrubberFill, { flex: total > 0 ? elapsed / total : 0 }]} />
              <View style={{ flex: total > 0 ? 1 - elapsed / total : 1 }} />
            </View>
          </TouchableWithoutFeedback>
          <View style={styles.timeRow}>
            <Text style={styles.timeText}>{fmt(elapsed)}</Text>
            <Text style={styles.timeText}>{fmt(remaining)}</Text>
          </View>
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          <TouchableOpacity
            testID="skip-back-10"
            style={styles.skipBtn}
            onPress={() => handleSkip(-10)}
          >
            <Text style={styles.skipText}>-10</Text>
          </TouchableOpacity>

          <TouchableOpacity
            testID="skip-back-15"
            style={styles.skipBtn}
            onPress={() => handleSkip(-15)}
          >
            <Text style={styles.skipText}>-15</Text>
          </TouchableOpacity>

          <TouchableOpacity
            testID="play-pause-btn"
            style={styles.playBtn}
            onPress={handlePlayPause}
          >
            <Text style={styles.playText}>{isPlaying ? '⏸' : '▶'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            testID="skip-fwd-30"
            style={styles.skipBtn}
            onPress={() => handleSkip(30)}
          >
            <Text style={styles.skipText}>+30</Text>
          </TouchableOpacity>

          <TouchableOpacity
            testID="skip-fwd-10"
            style={styles.skipBtn}
            onPress={() => handleSkip(10)}
          >
            <Text style={styles.skipText}>+10</Text>
          </TouchableOpacity>
        </View>

        {/* Speed */}
        <View style={styles.speedRow}>
          <TouchableOpacity testID="speed-btn" style={styles.speedBtn} onPress={handleSpeedCycle}>
            <Text style={styles.speedText}>{formatSpeed(currentSpeed)}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  handleRow: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 4,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#ccc',
  },
  headerRow: {
    alignItems: 'flex-start',
    paddingVertical: 8,
  },
  dismissBtn: {
    padding: 8,
  },
  dismissText: {
    fontSize: 28,
    color: '#888',
    lineHeight: 28,
  },
  artworkContainer: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  artwork: {
    borderRadius: 12,
    backgroundColor: '#e0e0e0',
  },
  artworkPlaceholder: {
    backgroundColor: '#d0d0d0',
  },
  meta: {
    marginBottom: 20,
  },
  episodeTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111',
    marginBottom: 6,
  },
  podcastName: {
    fontSize: 14,
    color: '#888',
  },
  scrubberSection: {
    marginBottom: 24,
  },
  scrubberTrack: {
    flexDirection: 'row',
    height: 4,
    borderRadius: 2,
    backgroundColor: '#e0e0e0',
    overflow: 'hidden',
    marginBottom: 6,
  },
  scrubberFill: {
    backgroundColor: '#007AFF',
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeText: {
    fontSize: 12,
    color: '#888',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 24,
  },
  playBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playText: {
    fontSize: 26,
    color: '#fff',
  },
  skipBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e8e8e8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  skipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },
  speedRow: {
    alignItems: 'flex-start',
  },
  speedBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: '#e8e8e8',
  },
  speedText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
})
