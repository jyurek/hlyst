module.exports = {
  registerPlaybackService: jest.fn(),
  usePlaybackState: jest.fn(() => ({ state: undefined })),
  useProgress: jest.fn(() => ({ position: 0, duration: 0, buffered: 0 })),
  State: { Playing: 'playing', Paused: 'paused', Stopped: 'stopped', None: 'none' },
}
