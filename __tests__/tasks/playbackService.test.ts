import { PlaybackService } from '../../src/tasks/playbackService'

describe('PlaybackService', () => {
  it('is a function', () => {
    expect(typeof PlaybackService).toBe('function')
  })

  it('resolves without throwing', async () => {
    await expect(PlaybackService()).resolves.toBeUndefined()
  })
})
