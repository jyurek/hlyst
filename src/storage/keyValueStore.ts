import AsyncStorage from '@react-native-async-storage/async-storage'

const KEYS = {
  playbackPosition: (episodeId: string) => `playback_position:${episodeId}`,
  showSpeed: (subscriptionId: string) => `show_speed:${subscriptionId}`,
}

export async function getPlaybackPosition(episodeId: string): Promise<number | null> {
  const value = await AsyncStorage.getItem(KEYS.playbackPosition(episodeId))
  return value !== null ? parseFloat(value) : null
}

export async function setPlaybackPosition(episodeId: string, position: number): Promise<void> {
  await AsyncStorage.setItem(KEYS.playbackPosition(episodeId), String(position))
}

export async function removePlaybackPosition(episodeId: string): Promise<void> {
  await AsyncStorage.removeItem(KEYS.playbackPosition(episodeId))
}

export async function getShowSpeed(subscriptionId: string): Promise<number | null> {
  const value = await AsyncStorage.getItem(KEYS.showSpeed(subscriptionId))
  return value !== null ? parseFloat(value) : null
}

export async function setShowSpeed(subscriptionId: string, speed: number): Promise<void> {
  await AsyncStorage.setItem(KEYS.showSpeed(subscriptionId), String(speed))
}

export async function removeShowSpeed(subscriptionId: string): Promise<void> {
  await AsyncStorage.removeItem(KEYS.showSpeed(subscriptionId))
}
