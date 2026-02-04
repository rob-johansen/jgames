import type { Card } from './Card'

export type HitMessage = {
  cards: Card[],
  hitteeId: string,
  hitterId: string,
  phase: number,
  set3a?: boolean
}
