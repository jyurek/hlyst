import { createRuleDao } from '../../../src/db/dao/ruleDao'
import { type NewRule } from '../../../src/db/types'

const makeDb = () => ({
  execAsync: jest.fn(),
  runAsync: jest.fn().mockResolvedValue({ lastInsertRowId: 1, changes: 1 }),
  getAllAsync: jest.fn().mockResolvedValue([]),
  getFirstAsync: jest.fn().mockResolvedValue(null),
})

const newRule: NewRule = {
  id: 'rule-1',
  title: 'Auto-download new episodes',
  action: 'auto_download',
  createdAt: 1000,
}

const dbRow = {
  id: 'rule-1',
  subscription_id: null,
  title: 'Auto-download new episodes',
  action: 'auto_download',
  conditions: '[]',
  priority: 0,
  is_active: 1,
  created_at: 1000,
}

describe('ruleDao', () => {
  describe('insert', () => {
    it('serializes conditions to JSON', async () => {
      const db = makeDb()
      const dao = createRuleDao(db)
      await dao.insert(newRule)
      const [, , , , , conditions] = (db.runAsync as jest.Mock).mock.calls[0]
      expect(typeof conditions).toBe('string')
      expect(JSON.parse(conditions as string)).toEqual([])
    })
  })

  describe('findAll', () => {
    it('deserializes conditions from JSON', async () => {
      const db = makeDb()
      db.getAllAsync.mockResolvedValueOnce([dbRow])
      const dao = createRuleDao(db)
      const results = await dao.findAll()
      expect(Array.isArray(results[0].conditions)).toBe(true)
      expect(results[0].isActive).toBe(true)
    })
  })

  describe('findBySubscriptionId', () => {
    it('queries global and subscription-specific rules', async () => {
      const db = makeDb()
      const dao = createRuleDao(db)
      await dao.findBySubscriptionId('sub-1')
      expect(db.getAllAsync).toHaveBeenCalledWith(
        expect.stringContaining('subscription_id IS NULL OR subscription_id = ?'),
        'sub-1',
      )
    })
  })

  describe('setActive', () => {
    it('updates is_active flag', async () => {
      const db = makeDb()
      const dao = createRuleDao(db)
      await dao.setActive('rule-1', false)
      expect(db.runAsync).toHaveBeenCalledWith(expect.stringContaining('is_active'), 0, 'rule-1')
    })
  })
})
