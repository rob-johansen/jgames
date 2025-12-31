import type { PoolClient, QueryResult } from 'pg'

import type { Card } from '@jgames/types'

export const drawFromDeck = async (gameId: string, turnId: string, client: PoolClient): Promise<Card | undefined> => {
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

  const result: QueryResult<{ card: Card }> = await client.query(sql, [gameId, turnId])
  return result.rows[0]?.card
}

export const drawFromPile = async (gameId: string, turnId: string, client: PoolClient): Promise<Card | undefined> => {
  const sql = `
    WITH t AS (
      SELECT
        id AS tid,
        pile -> 0 AS card,
        pile - 0 AS new_pile
      FROM phase10.games
      WHERE id = $1
      AND turn = $2
      FOR UPDATE
    )
    UPDATE phase10.games
    SET pile = t.new_pile, draw = FALSE
    FROM t
    WHERE id = t.tid
    RETURNING t.card
  `

  const result: QueryResult<{ card: Card }> = await client.query(sql, [gameId, turnId])
  return result.rows[0]?.card
}
