import type { Card } from './Card'
import type { Player } from './Player'

export type Game = {
  deck?: Card[]
  pile: Card[]
  players: Player[]
  results?: string[]
  turn: string
}
