import type { Card } from './Card'

export type Player = {
  cards: Card[] | number
  id: string
  name: string
  phase: number
  played: Card[]
  points: number
  skipped: boolean
}
