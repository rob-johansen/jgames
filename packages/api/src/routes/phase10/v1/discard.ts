import { Router } from 'express'
import type { PoolClient } from 'pg'
import type { Response } from 'express'

import { discard } from '@/data/queries/phase10/discard'
import { endTxn, startTxn } from '@/data/db'
import { getNextTurn } from '@/libs/turn'
import { logger } from '@/logger'
import { MessageType } from '@jgames/types'
import { RequestError } from '@jgames/types'
import { selectGame } from '@/data/queries/phase10/game'
import { validateCard, validateId } from '@jgames/validations'
import { wss } from '@/wss/wss'
import type { Card, PostRequest } from '@jgames/types'

export const router: Router = Router()

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

    // TODO: Remove the card from the requester's hand!

    try {
      commit = await discard({card, client, gameId, turn})
    } catch (err) {
      logger.error('Error discarding: %O', err)
    }

    if (!commit) {
      throw new RequestError('')
    }

    res.status(204).end()

    for (const player of game.players) {
      wss.sendToPlayer(player.id, {
        data: {
          card,
          turn,
        },
        type: MessageType.DISCARD
      })
    }
  } finally {
    await endTxn(client, { commit })
  }
})
