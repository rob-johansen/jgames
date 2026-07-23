import { Router } from 'express'
import type { PoolClient } from 'pg'
import type { Response } from 'express'

import { DECK, shuffle } from '@/libs/phase10/card'
import { deleteWaitingPlayers } from '@/data/queries/phase10/waiting'
import { endTxn, startTxn } from '@/data/db'
import { insertGame } from '@/data/queries/phase10/game'
import { MessageType } from '@jgames/types'
import { RequestError } from '@jgames/types'
import { SKIP } from '@jgames/types'
import { wss } from '@/wss/wss'
import type { Card, Game, Phase, PostRequest } from '@jgames/types'

export const router: Router = Router()

router.post('/', async (
  _req: PostRequest,
  res: Response<void>,
): Promise<void> => {
  let client: PoolClient | undefined
  let commit = false

  try {
    client = await startTxn()

    const players = await deleteWaitingPlayers(client)
    if (players.length < 2) throw new RequestError('', 400)

    const deck = DECK.map((card) => card)
    shuffle(deck)

    let autoSkip = false
    let token = ''
    let turn = ''

    for (let i = 1; i <= 10; i++) {
      let number = 1

      for (const player of players) {
        if (number === 1) {
          token = player.id
          turn = player.id
        }

        if (!Array.isArray(player.cards)) {
          player.cards = []
        }
        player.cards.push(deck.shift() as Card)
        player.number = number++
        player.phase = 1
        player.played = { set3a: [], set3b: [] } as Phase<1>
        player.points = 0
        player.skipped = false
      }
    }

    const pile = [deck.shift() as Card]

    if (pile[0].value === SKIP) {
      autoSkip = true
      turn = players[1].id
    }

    const game: Omit<Game, 'id'> = {
      deck,
      draw: true,
      pile,
      players,
      results: [],
      token,
      turn,
    }

    const id = await insertGame(game, client)

    commit = true

    res.status(204).end()

    for (const player of players) {
      wss.sendToPlayer(player.id, {
        data: {
          autoSkip,
          game: {
            draw: game.draw,
            id,
            pile,
            players: players.map((plr) => {
              return plr.id === player.id ? plr : { ...plr, cards: 10 }
            }),
            token: game.token,
            turn: game.turn,
          } as Game
        },
        type: MessageType.START
      })
    }
  } finally {
    await endTxn(client, { commit })
  }
})
