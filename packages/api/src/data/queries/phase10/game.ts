import { PoolClient } from 'pg'
import type { QueryResult } from 'pg'

import type { Game } from '@jgames/types'

export const insertGame = async (game: Omit<Game, 'id'>, client: PoolClient): Promise<string> => {
  const sql = `
    INSERT INTO phase10.games (deck, pile, players, results, turn)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id
  `

  // Insertion fails if arrays are not stringified
  const deck = JSON.stringify(game.deck)
  const pile = JSON.stringify(game.pile)
  const players = JSON.stringify(game.players)
  const results = JSON.stringify(game.results)

  const result: QueryResult<{ id: string }> = await client.query(sql, [deck, pile, players, results, game.turn])
  return result.rows[0].id
}
