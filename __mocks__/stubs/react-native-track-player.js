module.exports = {
  registerPlaybackService: () => {},
  usePlaybackState: () => ({ state: undefined }),
  useProgress: () => ({ position: 0, duration: 0, buffered: 0 }),
  State: { Playing: 'playing', Paused: 'paused', Stopped: 'stopped', None: 'none' },
}
