import { type Response, Router } from 'express'
import type { PoolClient } from 'pg'

import { endTxn, startTxn } from '@/data/db'
import { MessageType, RequestError } from '@jgames/types'
import { play } from '@/libs/phase10/phase4'
import { selectGame } from '@/data/queries/phase10/game'
import { updatePlayers } from '@/data/queries/phase10/players'
import { validateCard, validateId, validatePhase4 } from '@jgames/validations'
import { wss } from '@/wss/wss'
import type { Phase, PostRequest } from '@jgames/types'

export const router: Router = Router()

router.post('/play', async (
  req: PostRequest<{ phase: Phase<4>, gameId: string, userId: string }>,
  res: Response<void>,
) => {
  const phase = validatePhase4(req.body.phase)
  const gameId = validateId(req.body.gameId)
  const userId = validateId(req.body.userId)

  for (const card of phase.run7) { validateCard(card) }

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
        number: 4,
        phase
      },
      type: MessageType.PHASE_PLAY
    })
  } finally {
    await endTxn(client, { commit })
  }
})
