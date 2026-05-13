import { useState, useEffect, useCallback } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from 'react-native'
import type { Subscription } from '../db/types'
import type { SubscriptionService } from '../services/subscriptionService'
import type { SubscriptionDao } from '../db/dao/subscriptionDao'

interface Props {
  subscriptionService: SubscriptionService
  subscriptionDao: SubscriptionDao
  onSelectSubscription?: (sub: Subscription) => void
}

export function LibraryScreen({
  subscriptionService,
  subscriptionDao,
  onSelectSubscription,
}: Props) {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadSubscriptions = useCallback(async () => {
    const all = await subscriptionDao.findAll()
    setSubscriptions(all)
  }, [subscriptionDao])

  useEffect(() => {
    loadSubscriptions()
  }, [loadSubscriptions])

  async function handleAdd() {
    if (!url.trim()) return
    setLoading(true)
    setError(null)
    try {
      await subscriptionService.subscribe(url.trim())
      setUrl('')
      await loadSubscriptions()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to add podcast')
    } finally {
      setLoading(false)
    }
  }

  function handleDelete(sub: Subscription) {
    Alert.alert('Remove podcast', `Remove "${sub.title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: async () => {
          await subscriptionService.unsubscribe(sub.id)
          await loadSubscriptions()
        },
      },
    ])
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Library</Text>

      <View style={styles.addRow}>
        <TextInput
          style={styles.input}
          value={url}
          onChangeText={setUrl}
          placeholder="RSS feed URL"
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="url"
          editable={!loading}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAdd} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.addButtonText}>Add</Text>
          )}
        </TouchableOpacity>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <FlatList
        data={subscriptions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.row}
            onPress={() => onSelectSubscription?.(item)}
            disabled={!onSelectSubscription}
          >
            <View style={styles.rowText}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.feedUrl} numberOfLines={1}>
                {item.feedUrl}
              </Text>
            </View>
            <TouchableOpacity onPress={() => handleDelete(item)}>
              <Text style={styles.remove}>Remove</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No podcasts yet. Add one above.</Text>}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60, paddingHorizontal: 16, backgroundColor: '#fff' },
  heading: { fontSize: 28, fontWeight: '700', marginBottom: 20 },
  addRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
  },
  addButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingHorizontal: 18,
    justifyContent: 'center',
  },
  addButtonText: { color: '#fff', fontWeight: '600', fontSize: 15 },
  error: { color: '#d00', marginBottom: 8, fontSize: 13 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e0e0e0',
  },
  rowText: { flex: 1 },
  title: { fontSize: 16, fontWeight: '600' },
  feedUrl: { fontSize: 12, color: '#888', marginTop: 2 },
  remove: { color: '#d00', fontSize: 14, paddingLeft: 12 },
  empty: { textAlign: 'center', color: '#888', marginTop: 48 },
})
