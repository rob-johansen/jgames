import type { QueryResult } from 'pg'

import { query } from '@/data/db'
import type { Card } from '@jgames/types'

export const drawFromDeck = async (gameId: string, turnId: string): Promise<Card | undefined> => {
  const sql = `
    WITH t AS (
      SELECT
        id AS tid,
        deck -> 0 AS card,
        deck - 0 AS new_deck
      FROM phase10.games
      WHERE id = $1
      AND turn = $2
      FOR UPDATE
    )
    UPDATE phase10.games
    SET deck = t.new_deck, draw = FALSE
    FROM t
    WHERE id = t.tid
    RETURNING t.card
  `

  const result: QueryResult<{ card: Card }> = await query(sql, [gameId, turnId])
  return result.rows[0]?.card
}

export const drawFromPile = async (gameId: string, turnId: string): Promise<boolean> => {
  const sql = `
    UPDATE phase10.games
    SET pile = pile - 0, draw = FALSE
    WHERE id = $1
    AND turn = $2
  `

  const result = await query(sql, [gameId, turnId])
  return result.rowCount === 1
}
