import { PoolClient } from 'pg'
import type { QueryResult } from 'pg'

import { query } from '@/data/db'
import type { Player } from '@jgames/types'

export const addWaitingPlayer = async (name: string): Promise<string> => {
  const sql = `
    INSERT INTO phase10.waiting (name)
    VALUES ($1)
    RETURNING id
  `

  const result: QueryResult<{ id: string }> = await query(sql, [name])
  return result.rows[0].id
}

export const deleteWaitingPlayers = async (client: PoolClient): Promise<Player[]> => {
  const sql = `
    DELETE FROM
    phase10.waiting
    RETURNING id, name
  `

  const result: QueryResult<Player> = await client.query(sql)
  return result.rows
}

export const getWaitingPlayers = async (): Promise<Player[]> => {
  const sql = `
    SELECT id, name
    FROM phase10.waiting
    ORDER BY name
  `

  const result: QueryResult<Player> = await query(sql)
  return result.rows
}
