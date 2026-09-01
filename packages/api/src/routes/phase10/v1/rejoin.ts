import { Router } from 'express'
import type { Response } from 'express'

import { rejoinGame } from '@/data/queries/phase10/game'
import { RequestError } from '@jgames/types'
import { validateId, validateName } from '@jgames/validations'
import type { Card, Game, PostRequest } from '@jgames/types'

export const router: Router = Router()

/**
 * Attempts to rejoin a player to an in-progress game by checking
 * whether the player is currently in a game that has no results
 */
router.post('/', async (
  req: PostRequest<{ playerId: string, playerName: string }>,
  res: Response<{ game: Game }>,
): Promise<void> => {
  const playerId = validateId(req.body.playerId)
  const playerName = validateName(req.body.playerName)

  const game = await rejoinGame(playerId, playerName)
  if (!game) throw new RequestError('', 404)

  res.status(200).send({
    game: {
      ...game,
      players: game.players.map((player) => {
        return playerId === player.id ? player : { ...player, cards: (player.cards as Card[]).length }
      })
    }
  })
})
