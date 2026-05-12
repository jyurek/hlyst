import { registerRootComponent } from 'expo'
import TrackPlayer from 'react-native-track-player'
import { PlaybackService } from './src/tasks/playbackService'
import App from './App'

TrackPlayer.registerPlaybackService(() => PlaybackService)

registerRootComponent(App)
