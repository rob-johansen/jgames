import { PoolClient } from 'pg'

import type { Card } from '@jgames/types'

type DiscardProps = {
  card: Card
  client: PoolClient
  gameId: string
  turn: string
}

export const discard = async (props: DiscardProps): Promise<boolean> => {
  const { card, client, gameId, turn } = props

  const sql = `
    UPDATE phase10.games
    SET pile = jsonb_build_array(jsonb_build_object('color', $1, 'value', $2)) || pile,
        turn = $3
    WHERE id = $4
  `

  const result = await client.query(sql, [card.color, card.value, turn, gameId])
  return result.rowCount === 1
}
