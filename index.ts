import { registerRootComponent } from 'expo'
import TrackPlayer from 'react-native-track-player'
import { PlaybackService } from './src/tasks/playbackService'
import { defineBackgroundRefreshTask } from './src/tasks/backgroundRefreshTask'
import App from './App'

TrackPlayer.registerPlaybackService(() => PlaybackService)
defineBackgroundRefreshTask()

registerRootComponent(App)
