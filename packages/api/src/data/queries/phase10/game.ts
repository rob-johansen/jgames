import { PoolClient } from 'pg'
import type { QueryResult } from 'pg'

import type { Game } from '@jgames/types'

export const insertGame = async (game: Omit<Game, 'id'>, client: PoolClient): Promise<string> => {
  const sql = `
    INSERT INTO phase10.games (deck, draw, pile, players, results, turn)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id
  `

  // Insertion fails if arrays are not stringified
  const deck = JSON.stringify(game.deck)
  const pile = JSON.stringify(game.pile)
  const players = JSON.stringify(game.players)
  const results = JSON.stringify(game.results)

  const result: QueryResult<{ id: string }> = await client.query(sql, [deck, game.draw, pile, players, results, game.turn])
  return result.rows[0].id
}

export const selectGame = async (gameId: string, userId: string, client: PoolClient): Promise<Game | undefined> => {
  const sql = `
    SELECT *
    FROM phase10.games
    WHERE id = $1
    AND turn = $2
  `

  const result: QueryResult<Game> = await client.query(sql, [gameId, userId])
  return result.rows[0]
}
