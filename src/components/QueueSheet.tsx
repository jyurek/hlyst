import { useEffect, useRef } from 'react'
import {
  Animated,
  Dimensions,
  Image,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import type { Episode } from '../db/types'

// QueueItem enriches QueueEntry with the resolved Episode record.
// Full drag-to-reorder within the list is a future enhancement; for now we
// use ▲/▼ buttons and display the ☰ icon as a visual affordance only.
export interface QueueItem {
  id: string
  episodeId: string
  episode: Episode
  position: number
}

export interface QueueSheetProps {
  visible: boolean
  onDismiss: () => void
  currentEpisode: Episode | null
  currentPodcastName: string | null
  queueItems: QueueItem[]
  onRemove: (queueItemId: string) => void
  onReorder: (fromIndex: number, toIndex: number) => void
}

const SHEET_HEIGHT = Dimensions.get('window').height * 0.75
const DISMISS_THRESHOLD = -80

export function QueueSheet({
  visible,
  onDismiss,
  currentEpisode,
  currentPodcastName,
  queueItems,
  onRemove,
  onReorder,
}: QueueSheetProps) {
  const translateY = useRef(new Animated.Value(-SHEET_HEIGHT)).current

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: visible ? 0 : -SHEET_HEIGHT,
      duration: 300,
      useNativeDriver: true,
    }).start()
  }, [visible, translateY])

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dy) > 5,
      onPanResponderMove: (_, gestureState) => {
        // Only allow dragging upward (negative dy)
        if (gestureState.dy < 0) {
          translateY.setValue(gestureState.dy)
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy < DISMISS_THRESHOLD) {
          // Dragged far enough up — dismiss
          Animated.timing(translateY, {
            toValue: -SHEET_HEIGHT,
            duration: 200,
            useNativeDriver: true,
          }).start(onDismiss)
        } else {
          // Snap back to open position
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }).start()
        }
      },
    }),
  ).current

  if (!visible) return null

  return (
    <Animated.View style={[styles.sheet, { transform: [{ translateY }] }]} testID="queue-sheet">
      <View style={styles.header}>
        <Text style={styles.headerText}>Queue</Text>
      </View>

      <View style={styles.divider} />

      {currentEpisode ? (
        <View style={styles.nowPlayingRow} testID="now-playing-row">
          <Text style={styles.playIcon}>▶</Text>
          {currentEpisode.localPath || currentEpisode.mediaUrl ? (
            // Artwork placeholder — real artwork lookup comes in a later story
            <View style={styles.artPlaceholder} />
          ) : null}
          <View style={styles.episodeInfo}>
            <Text style={styles.nowPlayingLabel}>Now Playing</Text>
            <Text style={styles.episodeTitle} numberOfLines={1} testID="now-playing-title">
              {currentEpisode.title}
            </Text>
            {currentPodcastName ? (
              <Text style={styles.podcastName} numberOfLines={1}>
                {currentPodcastName}
              </Text>
            ) : null}
          </View>
        </View>
      ) : null}

      <View style={styles.sectionRow}>
        <View style={styles.sectionLine} />
        <Text style={styles.sectionLabel}>Up Next</Text>
        <View style={styles.sectionLine} />
      </View>

      {queueItems.length === 0 ? (
        <View style={styles.emptyState} testID="empty-queue">
          <Text style={styles.emptyText}>Your queue is empty</Text>
        </View>
      ) : (
        queueItems.map((item, index) => (
          <View key={item.id} style={styles.queueRow} testID={`queue-item-${item.id}`}>
            {/* ☰ drag handle — visual affordance only; drag-to-reorder is a future enhancement */}
            <Text style={styles.dragHandle}>☰</Text>
            <View style={styles.artPlaceholder} />
            <Text
              style={styles.queueEpisodeTitle}
              numberOfLines={1}
              testID={`queue-title-${item.id}`}
            >
              {item.episode.title}
            </Text>
            <View style={styles.reorderButtons}>
              <Pressable
                onPress={() => onReorder(index, index - 1)}
                disabled={index === 0}
                testID={`move-up-${item.id}`}
                accessibilityLabel="Move up"
              >
                <Text style={[styles.reorderIcon, index === 0 && styles.disabledIcon]}>▲</Text>
              </Pressable>
              <Pressable
                onPress={() => onReorder(index, index + 1)}
                disabled={index === queueItems.length - 1}
                testID={`move-down-${item.id}`}
                accessibilityLabel="Move down"
              >
                <Text
                  style={[
                    styles.reorderIcon,
                    index === queueItems.length - 1 && styles.disabledIcon,
                  ]}
                >
                  ▼
                </Text>
              </Pressable>
            </View>
            <Pressable
              onPress={() => onRemove(item.id)}
              testID={`remove-${item.id}`}
              accessibilityLabel="Remove from queue"
            >
              <Text style={styles.removeIcon}>✕</Text>
            </Pressable>
          </View>
        ))
      )}

      {/* Drag handle at the bottom of the sheet */}
      <View style={styles.dragHandleContainer} {...panResponder.panHandlers}>
        <View style={styles.dragHandlePill} />
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  sheet: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: SHEET_HEIGHT,
    backgroundColor: '#1a1a2e',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    paddingTop: 48,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  headerText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
  },
  divider: {
    height: 1,
    backgroundColor: '#333',
    marginHorizontal: 20,
    marginBottom: 16,
  },
  nowPlayingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 12,
  },
  playIcon: {
    fontSize: 16,
    color: '#7c8cff',
  },
  artPlaceholder: {
    width: 48,
    height: 48,
    backgroundColor: '#333',
    borderRadius: 6,
  },
  episodeInfo: {
    flex: 1,
  },
  nowPlayingLabel: {
    fontSize: 11,
    color: '#7c8cff',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 2,
  },
  episodeTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  podcastName: {
    fontSize: 12,
    color: '#aaa',
    marginTop: 2,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  sectionLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#333',
  },
  sectionLabel: {
    fontSize: 12,
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#888',
  },
  queueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 10,
  },
  dragHandle: {
    fontSize: 18,
    color: '#555',
  },
  queueEpisodeTitle: {
    flex: 1,
    fontSize: 13,
    color: '#ddd',
  },
  reorderButtons: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 2,
  },
  reorderIcon: {
    fontSize: 14,
    color: '#888',
    paddingHorizontal: 4,
  },
  disabledIcon: {
    color: '#333',
  },
  removeIcon: {
    fontSize: 18,
    color: '#888',
    paddingHorizontal: 4,
  },
  dragHandleContainer: {
    alignItems: 'center',
    paddingVertical: 16,
    marginTop: 'auto',
  },
  dragHandlePill: {
    width: 40,
    height: 4,
    backgroundColor: '#555',
    borderRadius: 2,
  },
})
