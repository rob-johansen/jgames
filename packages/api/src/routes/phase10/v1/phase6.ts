import { type Response, Router } from 'express'
import type { PoolClient } from 'pg'

import { endTxn, startTxn } from '@/data/db'
import { hit, play } from '@/libs/phase10/phase6'
import { MessageType, RequestError } from '@jgames/types'
import { selectGame } from '@/data/queries/phase10/game'
import { updatePlayers } from '@/data/queries/phase10/players'
import { validateCard, validateId, validatePhase6 } from '@jgames/validations'
import { wss } from '@/wss/wss'
import type { Card, Phase, PostRequest } from '@jgames/types'

export const router: Router = Router()

router.post('/hit', async (
  req: PostRequest<{
    added: Card[]
    gameId: string,
    hitteeId: string,
    hitterId: string
  } & Partial<Phase<6>>>,
  res: Response<void>,
) => {
  const gameId = validateId(req.body.gameId)
  const hitteeId = validateId(req.body.hitteeId)
  const hitterId = validateId(req.body.hitterId)

  if (!req.body.added || !req.body.run9) {
    throw new RequestError('', 400)
  }

  const added: Card[] = req.body.added
  const cards: Card[] = req.body.run9

  for (const card of added) { validateCard(card) }
  for (const card of cards) { validateCard(card) }

  let client: PoolClient | undefined
  let commit = false

  try {
    client = await startTxn()

    const game = await selectGame(gameId, hitterId, client)
    if (!game) throw new RequestError('', 400)

    // We pass a copy of the cards, because `hit()` needs to empty it,
    // but we also need to send the cards via `MessageType.HIT` below.
    if (!hit({ added, cards: [...cards], hitteeId, hitterId, players: game.players })) {
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
        phase: 6
      },
      type: MessageType.HIT
    })
  } finally {
    await endTxn(client, { commit })
  }
})

router.post('/play', async (
  req: PostRequest<{ phase: Phase<6>, gameId: string, userId: string }>,
  res: Response<void>,
) => {
  const phase = validatePhase6(req.body.phase)
  const gameId = validateId(req.body.gameId)
  const userId = validateId(req.body.userId)

  for (const card of phase.run9) { validateCard(card) }

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
        number: 6,
        phase
      },
      type: MessageType.PHASE_PLAY
    })
  } finally {
    await endTxn(client, { commit })
  }
})
