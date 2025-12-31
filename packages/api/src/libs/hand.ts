import { RequestError } from '@jgames/types'
import type { Card, Player } from '@jgames/types'

/**
 * Adds a card to the hand of a given player (intended for draw)
 */
export const addCard = (card: Card, userId: string, players: Player[]) => {
  const player = players.find((p) => p.id === userId)
  if (!player) {
    throw new RequestError('Error adding card to player’s hand (player not found)')
  }
  const cards = player.cards as Card[]
  cards.push(card)
}

/**
 * Removes a card from the hand of a given player (intended for discard)
 */
export const removeCard = (card: Card, userId: string, players: Player[]) => {
  const player = players.find((p) => p.id === userId)
  if (!player) {
    throw new RequestError('Error removing card from player’s hand (player not found)')
  }

  const cards = player.cards as Card[]
  let index = -1

  for (let i = 0; i < cards.length; i++) {
    const c = cards[i]
    if (c.color === card.color && c.value === card.value) {
      index = i
      break
    }
  }

  if (index === -1) {
    throw new RequestError('Error removing card from player’s hand (card not found)')
  }

  cards.splice(index, 1)
}
