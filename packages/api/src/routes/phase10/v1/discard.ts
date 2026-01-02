import { Router } from 'express'
import type { PoolClient } from 'pg'
import type { Response } from 'express'

import { discard, discardSkip } from '@/data/queries/phase10/discard'
import { endTxn, startTxn } from '@/data/db'
import { getNextTurn } from '@/libs/turn'
import { logger } from '@/logger'
import { MessageType } from '@jgames/types'
import { removeCard } from '@/libs/hand'
import { RequestError } from '@jgames/types'
import { selectGame } from '@/data/queries/phase10/game'
import { SKIP } from '@jgames/types'
import { validateCard, validateId } from '@jgames/validations'
import { wss } from '@/wss/wss'
import type { Card, PostRequest } from '@jgames/types'

export const router: Router = Router()

/*
  NOTE: This API is very similar to the /skip API. This API does a
        bit less however, so in the spirit of WET, it lives here.
 */

router.post('/', async (
  req: PostRequest<{ card: Card, gameId: string, userId: string }>,
  res: Response<void>,
) => {
  const card = validateCard(req.body.card)
  const gameId = validateId(req.body.gameId)
  const userId = validateId(req.body.userId)

  let client: PoolClient | undefined
  let commit = false

  try {
    client = await startTxn()

    const game = await selectGame(gameId, userId, client)
    if (!game) {
      throw new RequestError('', 400)
    }

    const turn = getNextTurn(userId, game.players)
    if (!turn) {
      throw new RequestError('')
    }

    removeCard(card, userId, game.players)

    try {
      commit = await discard({ card, client, game, turn })
    } catch (err) {
      logger.error('Error discarding: %O', err)
    }

    if (!commit) {
      throw new RequestError('')
    }

    res.status(204).end()

    wss.sendToAll({
      data: {
        card,
        turn,
      },
      type: MessageType.DISCARD
    })
  } finally {
    await endTxn(client, { commit })
  }
})

/**
 * Discards the SKIP card for a skipped player (not to be confused
 * with the /skip API that allows a player to skip another player)
 */
router.post('/skip', async (
  req: PostRequest<{ gameId: string, userId: string }>,
  res: Response<void>,
) => {
  const gameId = validateId(req.body.gameId)
  const userId = validateId(req.body.userId)

  let client: PoolClient | undefined
  let commit = false

  try {
    client = await startTxn()

    const game = await selectGame(gameId, userId, client)
    if (!game) {
      throw new RequestError('', 400)
    }

    const turn = getNextTurn(userId, game.players)
    if (!turn) {
      throw new RequestError('')
    }

    const player = game.players.find((p) => p.id === userId)
    if (!player || !player.skipped) {
      throw new RequestError('')
    }

    player.skipped = false
    game.pile.unshift({ color: '', value: SKIP })
    game.turn = turn

    commit = await discardSkip(game, client)
    if (!commit) {
      throw new RequestError('')
    }

    res.status(204).end()

    wss.sendToAll({
      data: {
        turn,
        userId,
      },
      type: MessageType.DISCARD_SKIP
    })
  } finally {
    await endTxn(client, { commit })
  }
})
