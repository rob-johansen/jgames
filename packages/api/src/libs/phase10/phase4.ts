import { logger } from '@/logger'
import type { Card, Phase, Player } from '@jgames/types'

export const play = (phase: Phase<4>, userId: string, players: Player[]): boolean => {
  const player = players.find((p) => p.id === userId)
  if (!player) {
    logger.error('Error playing phase 4 (player not found)')
    return false
  }

  const cards = player.cards as Card[]
  const phaseCards = phase.run7

  for (let i = cards.length - 1; i >= 0; i--) {
    const handCard = cards[i]

    for (let j = phaseCards.length - 1; j >= 0; j--) {
      const phaseCard = phaseCards[j]

      if (handCard.color === phaseCard.color && handCard.value === phaseCard.value) {
        cards.splice(i, 1)
        phaseCards.splice(j, 1)
        break
      }
    }
  }

  // The player should have 4 cards left: 11 (hand) - 7 (phase) = 4
  if (cards.length !== 4) {
    logger.error('Error playing phase 4 (card move problem)')
    return false
  }

  player.phase = 5
  player.played = phase

  return true
}
