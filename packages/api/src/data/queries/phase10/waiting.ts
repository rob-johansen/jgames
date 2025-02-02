import type { QueryResult } from 'pg'

import { query } from '@/data/db'
import type { User } from '@jgames/types'

export const addWaitingPlayer = async (name: string): Promise<string> => {
  const sql = `
    INSERT INTO phase10.waiting (name)
    VALUES ($1)
    RETURNING id
  `

  const result: QueryResult<{ id: string }> = await query(sql, [name])
  return result.rows[0].id
}

export const getWaitingPlayers = async (): Promise<Pick<User, 'name'>[]> => {
  const sql = `
    SELECT name
    FROM phase10.waiting
    ORDER BY name
  `

  const result: QueryResult<Pick<User, 'name'>> = await query(sql)
  return result.rows
}
