import {
  getPlaybackPosition,
  setPlaybackPosition,
  getShowSpeed,
  setShowSpeed,
  removePlaybackPosition,
  removeShowSpeed,
} from '../../src/storage/keyValueStore'

describe('keyValueStore', () => {
  describe('playback position', () => {
    it('stores and retrieves a position', async () => {
      await setPlaybackPosition('ep-1', 42.5)
      const result = await getPlaybackPosition('ep-1')
      expect(result).toBe(42.5)
    })

    it('returns null for unknown episode', async () => {
      const result = await getPlaybackPosition('unknown')
      expect(result).toBeNull()
    })

    it('removes the stored position', async () => {
      await setPlaybackPosition('ep-2', 100)
      await removePlaybackPosition('ep-2')
      const result = await getPlaybackPosition('ep-2')
      expect(result).toBeNull()
    })
  })

  describe('show speed', () => {
    it('stores and retrieves a speed', async () => {
      await setShowSpeed('sub-1', 1.5)
      const result = await getShowSpeed('sub-1')
      expect(result).toBe(1.5)
    })

    it('returns null for unknown subscription', async () => {
      const result = await getShowSpeed('unknown')
      expect(result).toBeNull()
    })

    it('removes the stored speed', async () => {
      await setShowSpeed('sub-2', 2.0)
      await removeShowSpeed('sub-2')
      const result = await getShowSpeed('sub-2')
      expect(result).toBeNull()
    })
  })
})
