import type { Card } from './Card'
import type { Phase } from './Phase'

export type Player = {
  cards: Card[] | number
  id: string
  name: string
  number: number
  phase: number
  played: Phase
  points: number
  skipped: boolean
}
