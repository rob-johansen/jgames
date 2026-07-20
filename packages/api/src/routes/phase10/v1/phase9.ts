import { Router } from 'express'
import type { PoolClient } from 'pg'
import type { Response } from 'express'

import { endTxn, startTxn } from '@/data/db'
import { hit, play } from '@/libs/phase10/phase9'
import { MessageType } from '@jgames/types'
import { RequestError } from '@jgames/types'
import { selectGame } from '@/data/queries/phase10/game'
import { updatePlayers } from '@/data/queries/phase10/players'
import { validateCard, validateId, validatePhase9 } from '@jgames/validations'
import { wss } from '@/wss/wss'
import type { Card, Phase, PostRequest } from '@jgames/types'

export const router: Router = Router()

router.post('/hit', async (
  req: PostRequest<{
    gameId: string,
    hitteeId: string,
    hitterId: string
  } & Partial<Phase<9>>>,
  res: Response<void>,
) => {
  const gameId = validateId(req.body.gameId)
  const hitteeId = validateId(req.body.hitteeId)
  const hitterId = validateId(req.body.hitterId)

  let cards: Card[] | undefined
  let phasePart = 1

  if (req.body.set5) {
    cards = req.body.set5
  }
  if (req.body.set2) {
    cards = req.body.set2
    phasePart = 2
  }

  if (!cards) throw new RequestError('', 400)
  for (const card of cards) { validateCard(card) }

  let client: PoolClient | undefined
  let commit = false

  try {
    client = await startTxn()

    const game = await selectGame(gameId, hitterId, client)
    if (!game) throw new RequestError('', 400)

    // We pass a copy of the cards, because `hit()` needs to empty it,
    // but we also need to send the cards via `MessageType.HIT` below.
    if (!hit({ cards: [...cards], hitteeId, hitterId, players: game.players, phasePart })) {
      throw new RequestError('', 400)
    }

    commit = await updatePlayers(game, client)
    if (!commit) throw new RequestError('')

    res.status(204).end()

    wss.sendToAll({
      data: {
        cards,
        hitteeId,
        hitterId,
        phase: 9,
        phasePart
      },
      type: MessageType.HIT
    })
  } finally {
    await endTxn(client, { commit })
  }
})

router.post('/play', async (
  req: PostRequest<{ phase: Phase<9>, gameId: string, userId: string }>,
  res: Response<void>,
) => {
  const phase = validatePhase9(req.body.phase)
  const gameId = validateId(req.body.gameId)
  const userId = validateId(req.body.userId)

  for (const card of phase.set5) { validateCard(card) }
  for (const card of phase.set2) { validateCard(card) }

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
        number: 9,
        phase
      },
      type: MessageType.PHASE_PLAY
    })
  } finally {
    await endTxn(client, { commit })
  }
})
