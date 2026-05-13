import TrackPlayer, { Capability } from 'react-native-track-player'
import type { Episode } from '../db/types'

export interface PlayerService {
  setup(): Promise<void>
  loadEpisode(episode: Episode): Promise<void>
  play(): Promise<void>
  pause(): Promise<void>
  seekTo(seconds: number): Promise<void>
  setSpeed(rate: number): Promise<void>
}

export function createPlayerService(): PlayerService {
  return {
    async setup() {
      await TrackPlayer.setupPlayer()
      await TrackPlayer.updateOptions({
        capabilities: [Capability.Play, Capability.Pause, Capability.SeekTo],
      })
    },

    async loadEpisode(episode) {
      await TrackPlayer.reset()
      await TrackPlayer.add({
        id: episode.id,
        url: episode.mediaUrl,
        title: episode.title,
        artist: episode.subscriptionId,
      })
    },

    async play() {
      await TrackPlayer.play()
    },

    async pause() {
      await TrackPlayer.pause()
    },

    async seekTo(seconds) {
      await TrackPlayer.seekTo(seconds)
    },

    async setSpeed(rate) {
      await TrackPlayer.setRate(rate)
    },
  }
}
