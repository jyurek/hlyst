import { useEffect, useState } from 'react'
import { View, ActivityIndicator, StyleSheet } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { openDatabase, type Database } from './src/db/database'
import { createSubscriptionService } from './src/services/subscriptionService'
import { LibraryScreen } from './src/screens/LibraryScreen'

export default function App() {
  const [db, setDb] = useState<Database | null>(null)

  useEffect(() => {
    openDatabase().then(setDb)
  }, [])

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
    <>
      <LibraryScreen subscriptionService={service} subscriptionDao={db.subscriptions} />
      <StatusBar style="auto" />
    </>
  )
}

const styles = StyleSheet.create({
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
})
