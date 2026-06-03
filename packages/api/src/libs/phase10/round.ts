import { DECK, shuffle } from '@/libs/phase10/card'
import { SKIP, WILD } from '@jgames/types'
import type { Card, Game, Phase } from '@jgames/types'

export const endRound = (game: Game) => {
  const deck = DECK.map((card) => card)
  shuffle(deck)
  let turnNumber = 0

  for (const player of game.players) {
    for (const card of player.cards as Card[]) {
      if (card.value < 10) player.points += 5
      if (card.value >= 10 && card.value <= 12) player.points += 10
      if (card.value === SKIP) player.points += 15
      if (card.value === WILD) player.points += 25
    }
    player.cards = []
    if (player.phase === 1) player.played = { set3a: [], set3b: [] } as Phase<1>
    if (player.phase === 2) player.played = { set3: [], run4: [] } as Phase<2>
    if (player.phase === 3) player.played = { set4: [], run4: [] } as Phase<3>
    if (player.phase === 4) player.played = { run7: [] } as Phase<4>
    if (player.phase === 5) player.played = { run8: [] } as Phase<5>
    if (player.phase === 6) player.played = { run9: [] } as Phase<6>
    if (player.phase === 7) player.played = { set4a: [], set4b: [] } as Phase<7>
    if (player.phase === 8) player.played = { color7: [] } as Phase<8>
    if (player.phase === 9) player.played = { set5: [], set2: [] } as Phase<9>
    if (player.phase === 10) player.played = { set5: [], set3: [] } as Phase<10>
    player.skipped = false

    if (game.turn === player.id) {
      turnNumber = player.number
    }
  }

  turnNumber++
  if (turnNumber > game.players.length) turnNumber = 1

  let turn = ''
  for (const player of game.players) {
    if (player.number === turnNumber) {
      turn = player.id
    }
  }

  for (let i = 1; i <= 10; i++) {
    for (const player of game.players) {
      (player.cards as Card[]).push(deck.shift() as Card)
    }
  }

  const pile = [deck.shift() as Card]

  game.deck = deck
  game.draw = true
  game.pile = pile
  game.token = turn
  game.turn = turn
}
