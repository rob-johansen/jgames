import { logger } from '@/logger'
import type { Card, Phase, Player } from '@jgames/types'

type HitProps = {
  added?: Card[]
  cards: Card[]
  hitteeId: string
  hitterId: string
  players: Player[]
}

export const hit = ({ added, cards, hitteeId, hitterId, players }: HitProps): boolean => {
  const hitter = players.find((p) => p.id === hitterId)
  if (!hitter) {
    logger.error('Error hitting phase 3 (hitter not found)')
    return false
  }

  const hittee = players.find((p) => p.id === hitteeId)
  if (!hittee) {
    logger.error('Error hitting phase 3 (hittee not found)')
    return false
  }

  const hitterCards = hitter.cards as Card[]
  const hitteeCards = added ? (hittee.played as Phase<3>).run4 : (hittee.played as Phase<3>).set4

  if (added) {
    // Remove the `added` cards from `hitterCards` (the hit happend on `played.run4`)
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
      logger.error('Error hitting phase 3 (run4 move problem)')
      return false
    }

    // Remove all cards from `hitteeCards` and replace them with those in `cards`
    hitteeCards.length = 0
    for (const card of cards) {
      hitteeCards.push(card)
    }
  } else {
    // Move the `cards` from `hitterCards` to `hitteeCards` (the hit happend on `played.set4`)
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
      logger.error('Error hitting phase 3 (set4 move problem)')
      return false
    }
  }

  return true
}

export const play = (phase: Phase<3>, userId: string, players: Player[]): boolean => {
  const player = players.find((p) => p.id === userId)
  if (!player) {
    logger.error('Error playing phase 3 (player not found)')
    return false
  }

  const cards = player.cards as Card[]
  const phaseCards = phase.set4.concat(phase.run4)

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
    logger.error('Error playing phase 3 (card move problem)')
    return false
  }

  player.phase = 4
  player.played = phase

  return true
}
