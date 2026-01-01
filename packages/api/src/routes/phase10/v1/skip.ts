import { Router } from 'express'
import type { PoolClient } from 'pg'
import type { Response } from 'express'

import { discard } from '@/data/queries/phase10/discard'
import { endTxn, startTxn } from '@/data/db'
import { getNextTurn, skipPlayer } from '@/libs/turn'
import { logger } from '@/logger'
import { MessageType } from '@jgames/types'
import { removeCard } from '@/libs/hand'
import { RequestError } from '@jgames/types'
import { selectGame } from '@/data/queries/phase10/game'
import { SKIP } from '@jgames/types'
import { validateId } from '@jgames/validations'
import { wss } from '@/wss/wss'
import type { Card, PostRequest } from '@jgames/types'

export const router: Router = Router()

/*
  NOTE: This API is very similar to the /discard API. This API does
        a bit more however, so in the spirit of WET, it lives here.
 */

router.post('/', async (
  req: PostRequest<{ gameId: string, skipId: string, userId: string }>,
  res: Response<void>,
) => {
  const gameId = validateId(req.body.gameId)
  const skipId = validateId(req.body.skipId)
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

    const card: Card = { color: '', value: SKIP }

    removeCard(card, userId, game.players)

    if (!skipPlayer(skipId, game.players)) {
      throw new RequestError('', 400)
    }

    try {
      commit = await discard({ card, client, game, turn })
    } catch (err) {
      logger.error('Error discarding SKIP: %O', err)
    }

    if (!commit) {
      throw new RequestError('')
    }

    res.status(204).end()

    for (const player of game.players) {
      wss.sendToPlayer(player.id, {
        data: { skipId, turn },
        type: MessageType.SKIP
      })
    }
  } finally {
    await endTxn(client, { commit })
  }
})
