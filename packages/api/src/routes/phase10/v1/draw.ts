import { Router } from 'express'
import type { PoolClient } from 'pg'
import type { Response } from 'express'

import { addCard } from '@/libs/phase10/hand'
import { drawFromDeck, drawFromPile } from '@/data/queries/phase10/draw'
import { endTxn, startTxn } from '@/data/db'
import { MessageType } from '@jgames/types'
import { RequestError } from '@jgames/types'
import { selectGame } from '@/data/queries/phase10/game'
import { updatePlayers } from '@/data/queries/phase10/players'
import { validateId } from '@jgames/validations'
import { wss } from '@/wss/wss'
import type { ApiRequest, Card } from '@jgames/types'

export const router: Router = Router()

router.get('/deck', async (
  req: ApiRequest,
  res: Response<Card>,
): Promise<void> => {
  const gameId = validateId(req.query.gameId)
  const turnId = validateId(req.query.turnId)

  let client: PoolClient | undefined
  let commit = false

  try {
    client = await startTxn()

    const card = await drawFromDeck(gameId, turnId, client)
    if (!card) throw new RequestError('There was a problem drawing from the deck.')

    const game = await selectGame(gameId, turnId, client)
    if (!game) {
      throw new RequestError('')
    }

    addCard(card, turnId, game.players)

    commit = await updatePlayers(game, client)
    if (!commit) {
      throw new RequestError('')
    }

    res.status(200).send(card)

    wss.sendToAll({ data: {}, type: MessageType.DECK_DRAW })
  } finally {
    await endTxn(client, { commit })
  }
})

router.get('/pile', async (
  req: ApiRequest,
  res: Response<void>,
): Promise<void> => {
  const gameId = validateId(req.query.gameId)
  const turnId = validateId(req.query.turnId)

  let client: PoolClient | undefined
  let commit = false

  try {
    client = await startTxn()

    const card = await drawFromPile(gameId, turnId, client)
    if (!card) throw new RequestError('There was a problem drawing from the pile.')

    const game = await selectGame(gameId, turnId, client)
    if (!game) {
      throw new RequestError('')
    }

    addCard(card, turnId, game.players)

    commit = await updatePlayers(game, client)
    if (!commit) {
      throw new RequestError('')
    }

    res.status(204).end()

    wss.sendToAll({ data: {}, type: MessageType.PILE_DRAW })
  } finally {
    await endTxn(client, { commit })
  }
})
