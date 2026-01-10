import { logger } from '@/logger'
import type { Card, Phase, Player } from '@jgames/types'

export const play = (phase: Phase<1>, userId: string, players: Player[]): boolean => {
  const player = players.find((p) => p.id === userId)
  if (!player) {
    logger.error('Error playing phase 1 (player not found)')
    return false
  }

  const cards = player.cards as Card[]
  const sets = phase.set3a.concat(phase.set3b)

  for (let i = cards.length - 1; i >= 0; i--) {
    const handCard = cards[i]

    for (let j = sets.length - 1; j >= 0; j--) {
      const setCard = sets[j]

      if (handCard.color === setCard.color && handCard.value === setCard.value) {
        cards.splice(i, 1)
        sets.splice(j, 1)
        break
      }
    }
  }

  if (cards.length !== 5) {
    logger.error('Error playing phase 1 (card move problem)')
    return false
  }

  player.phase = 2
  player.played = phase

  return true
}
