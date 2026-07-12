import { Router } from 'express'
import type { PoolClient } from 'pg'
import type { Response } from 'express'

import { endTxn, startTxn } from '@/data/db'
import { play } from '@/libs/phase10/phase7'
import { MessageType } from '@jgames/types'
import { RequestError } from '@jgames/types'
import { selectGame } from '@/data/queries/phase10/game'
import { updatePlayers } from '@/data/queries/phase10/players'
import { validateCard, validateId, validatePhase7 } from '@jgames/validations'
import { wss } from '@/wss/wss'
import type { Phase, PostRequest } from '@jgames/types'

export const router: Router = Router()

router.post('/play', async (
  req: PostRequest<{ phase: Phase<7>, gameId: string, userId: string }>,
  res: Response<void>,
) => {
  const phase = validatePhase7(req.body.phase)
  const gameId = validateId(req.body.gameId)
  const userId = validateId(req.body.userId)

  for (const card of phase.set4a) { validateCard(card) }
  for (const card of phase.set4b) { validateCard(card) }

  let client: PoolClient | undefined
  let commit = false

  try {
    client = await startTxn()

    const game = await selectGame(gameId, userId, client)
    if (!game) throw new RequestError('', 400)

    if (!play(phase, userId, game.players)) {
      throw new RequestError('', 400)
    }

    commit = await updatePlayers(game, client)
    if (!commit) throw new RequestError('')

    res.status(204).end()

    wss.sendToAll({
      data: {
        number: 7,
        phase
      },
      type: MessageType.PHASE_PLAY
    })
  } finally {
    await endTxn(client, { commit })
  }
})
