import { logger } from '@/logger'
import type { Card, Phase, Player } from '@jgames/types'

type HitProps = {
  cards: Card[]
  hitteeId: string
  hitterId: string
  players: Player[]
  phasePart: number
}

export const hit = ({ cards, hitteeId, hitterId, players, phasePart }: HitProps): boolean => {
  const hitter = players.find((p) => p.id === hitterId)
  if (!hitter) {
    logger.error('Error hitting phase 1 (hitter not found)')
    return false
  }

  const hittee = players.find((p) => p.id === hitteeId)
  if (!hittee) {
    logger.error('Error hitting phase 1 (hittee not found)')
    return false
  }

  const hitterCards = hitter.cards as Card[]
  const hitteeCards = phasePart === 1 ? (hittee.played as Phase<1>).set3a : (hittee.played as Phase<1>).set3b

  for (let i = hitterCards.length - 1; i >= 0; i--) {
    const handCard = hitterCards[i]

    for (let j = cards.length - 1; j >= 0; j--) {
      const hitCard = cards[j]

      if (handCard.color === hitCard.color && handCard.value === hitCard.value) {
        hitterCards.splice(i, 1)
        hitteeCards.push(...cards.splice(j, 1))
        break
      }
    }
  }

  if (cards.length !== 0) {
    logger.error('Error hitting phase 1 (card move problem)')
    return false
  }

  return true
}

export const play = (phase: Phase<1>, userId: string, players: Player[]): boolean => {
  const player = players.find((p) => p.id === userId)
  if (!player) {
    logger.error('Error playing phase 1 (player not found)')
    return false
  }

  const cards = player.cards as Card[]
  const phaseCards = phase.set3a.concat(phase.set3b)

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

  // The player should have 5 cards left: 11 (hand) - 6 (phase) = 5
  if (cards.length !== 5) {
    logger.error('Error playing phase 1 (card move problem)')
    return false
  }

  player.phase = 2
  player.played = phase

  return true
}
