import type { Card } from './Card'
import type { Player } from './Player'
import type { Result } from './Result'

export type Game = {
  deck?: Card[]
  draw: boolean
  id: string
  pile: Card[]
  players: Player[]
  results: Result[]
  turn: string
  token: string
}
