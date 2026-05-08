import { type Db, type Rule, type NewRule, type RuleCondition, type RuleAction } from '../types'

type Row = {
  id: string
  subscription_id: string | null
  title: string
  action: string
  conditions: string
  priority: number
  is_active: number
  created_at: number
}

function rowToRule(row: Row): Rule {
  return {
    id: row.id,
    subscriptionId: row.subscription_id,
    title: row.title,
    action: row.action as RuleAction,
    conditions: JSON.parse(row.conditions) as RuleCondition[],
    priority: row.priority,
    isActive: row.is_active === 1,
    createdAt: row.created_at,
  }
}

const COLUMNS = 'id, subscription_id, title, action, conditions, priority, is_active, created_at'

export interface RuleDao {
  insert(rule: NewRule): Promise<Rule>
  findAll(): Promise<Rule[]>
  findBySubscriptionId(subscriptionId: string): Promise<Rule[]>
  setActive(id: string, isActive: boolean): Promise<void>
  delete(id: string): Promise<void>
}

export function createRuleDao(db: Db): RuleDao {
  return {
    async insert(r) {
      const conditions = JSON.stringify(r.conditions ?? [])
      const priority = r.priority ?? 0
      const isActive = r.isActive ?? true
      await db.runAsync(
        `INSERT INTO rules (id, subscription_id, title, action, conditions, priority, is_active, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        r.id,
        r.subscriptionId ?? null,
        r.title,
        r.action,
        conditions,
        priority,
        isActive ? 1 : 0,
        r.createdAt,
      )
      return {
        id: r.id,
        subscriptionId: r.subscriptionId ?? null,
        title: r.title,
        action: r.action,
        conditions: r.conditions ?? [],
        priority,
        isActive,
        createdAt: r.createdAt,
      }
    },

    async findAll() {
      const rows = await db.getAllAsync<Row>(`SELECT ${COLUMNS} FROM rules ORDER BY priority DESC`)
      return rows.map(rowToRule)
    },

    async findBySubscriptionId(subscriptionId) {
      const rows = await db.getAllAsync<Row>(
        `SELECT ${COLUMNS} FROM rules WHERE subscription_id IS NULL OR subscription_id = ? ORDER BY priority DESC`,
        subscriptionId,
      )
      return rows.map(rowToRule)
    },

    async setActive(id, isActive) {
      await db.runAsync('UPDATE rules SET is_active = ? WHERE id = ?', isActive ? 1 : 0, id)
    },

    async delete(id) {
      await db.runAsync('DELETE FROM rules WHERE id = ?', id)
    },
  }
}
