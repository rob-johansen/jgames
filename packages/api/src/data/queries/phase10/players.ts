import type { PoolClient } from 'pg'

import type { Game } from '@jgames/types'

export const updatePlayers = async (game: Game, client: PoolClient): Promise<boolean> => {
  const sql = `
    UPDATE phase10.games
    SET players = $1
    WHERE id = $2
  `

  const players = JSON.stringify(game.players)

  const result = await client.query(sql, [players, game.id])
  return result.rowCount === 1
}
