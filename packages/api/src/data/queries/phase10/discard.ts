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

export const discardSkip = async (game: Game, client: PoolClient): Promise<boolean> => {
  const sql = `
    UPDATE phase10.games
    SET pile = $1,
        players = $2,
        turn = $3
    WHERE id = $4
  `

  const pile = JSON.stringify(game.pile)
  const players = JSON.stringify(game.players)

  const result = await client.query(sql, [pile, players, game.turn, game.id])
  return result.rowCount === 1
}
