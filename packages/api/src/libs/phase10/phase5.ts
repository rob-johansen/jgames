import { logger } from '@/logger'
import type { Card, Phase, Player } from '@jgames/types'

type HitProps = {
  added: Card[]
  cards: Card[]
  hitteeId: string
  hitterId: string
  players: Player[]
}

export const hit = ({ added, cards, hitteeId, hitterId, players }: HitProps): boolean => {
  const hitter = players.find((p) => p.id === hitterId)
  if (!hitter) {
    logger.error('Error hitting phase 5 (hitter not found)')
    return false
  }

  const hittee = players.find((p) => p.id === hitteeId)
  if (!hittee) {
    logger.error('Error hitting phase 5 (hittee not found)')
    return false
  }

  const hitterCards = hitter.cards as Card[]
  const hitteeCards = (hittee.played as Phase<5>).run8

  // Remove the `added` cards from `hitterCards`
  for (let i = hitterCards.length - 1; i >= 0; i--) {
    const handCard = hitterCards[i]

    for (let j = added.length - 1; j >= 0; j--) {
      const hitCard = added[j]

      if (handCard.color === hitCard.color && handCard.value === hitCard.value) {
        hitterCards.splice(i, 1)
        added.splice(j, 1)
        break
      }
    }
  }

  if (added.length !== 0) {
    logger.error('Error hitting phase 5 (run8 move problem)')
    return false
  }

  // Remove all cards from `hitteeCards` and replace them with those in `cards`
  hitteeCards.length = 0
  for (const card of cards) {
    hitteeCards.push(card)
  }

  return true
}

export const play = (phase: Phase<5>, userId: string, players: Player[]): boolean => {
  const player = players.find((p) => p.id === userId)
  if (!player) {
    logger.error('Error playing phase 5 (player not found)')
    return false
  }

  const cards = player.cards as Card[]
  const phaseCards = structuredClone(phase.run8)

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

  // The player should have 3 cards left: 11 (hand) - 8 (phase) = 3
  if (cards.length !== 3) {
    logger.error('Error playing phase 5 (card move problem)')
    return false
  }

  player.phase = 6
  player.played = phase

  return true
}
