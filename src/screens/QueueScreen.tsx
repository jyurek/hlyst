import { View, Text, StyleSheet } from 'react-native'

export function QueueScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Queue</Text>
      <Text style={styles.empty}>Nothing queued yet.</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60, paddingHorizontal: 16, backgroundColor: '#fff' },
  heading: { fontSize: 28, fontWeight: '700', marginBottom: 20 },
  empty: { textAlign: 'center', color: '#888', marginTop: 48 },
})
