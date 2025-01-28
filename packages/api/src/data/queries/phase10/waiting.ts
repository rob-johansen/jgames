import type { QueryResult } from 'pg'

import { query } from '@/data/db'

export const addWaitingPlayer = async (name: string): Promise<string> => {
  const sql = `
    INSERT INTO phase10.waiting (name)
    VALUES ($1)
    RETURNING id
  `

  const result: QueryResult<{ id: string }> = await query(sql, [name])
  return result.rows[0].id
}
