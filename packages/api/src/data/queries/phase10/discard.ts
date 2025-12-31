import { PoolClient } from 'pg'

import type { Card, Game } from '@jgames/types'

type DiscardProps = {
  card: Card
  client: PoolClient
  game: Game
  turn: string
}

export const discard = async (props: DiscardProps): Promise<boolean> => {
  const { card, client, game, turn } = props

  const sql = `
    UPDATE phase10.games
    SET draw = TRUE,
        pile = jsonb_build_array(jsonb_build_object('color', $1::text, 'value', $2::integer)) || pile,
        players = $3,
        turn = $4
    WHERE id = $5
  `

  const players = JSON.stringify(game.players)

  const result = await client.query(sql, [card.color, card.value, players, turn, game.id])
  return result.rowCount === 1
}
