import type { Card } from './Card'

export type HitMessage = {
  cards: Card[],
  hitCount: number,
  hitteeId: string,
  hitterId: string,
  phase: number,
  phasePart: number
}
