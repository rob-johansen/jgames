import type { Card } from './Card'
import type { Player } from './Player'

export type Game = {
  deck?: Card[]
  draw: boolean
  id: string
  pile: Card[]
  players: Player[]
  results?: string[]
  turn: string
}
