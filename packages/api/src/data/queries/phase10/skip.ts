import { PoolClient } from 'pg'

import type { Game } from '@jgames/types'

export const skip = async (game: Game, client: PoolClient): Promise<boolean> => {
  const sql = `
    UPDATE phase10.games
    SET players = $1,
        turn = $2
    WHERE id = $3
  `

  const players = JSON.stringify(game.players)

  const result = await client.query(sql, [players, game.turn, game.id])
  return result.rowCount === 1
}
