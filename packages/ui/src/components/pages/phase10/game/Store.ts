import { makeAutoObservable } from 'mobx'
import { v4 as uuid } from 'uuid'

import { SKIP, WILD } from '@jgames/types'
import type { Card, Game, Player } from '@jgames/types'
import type { RootStore } from '@/providers/phase10/RootStore'

type State = {
  canDragCards: boolean
  game: Game
}

export class GameStore {
  root: RootStore
  state: State
  ws: WebSocket

  constructor(root: RootStore) {
    this.root = root
    this.state = {
      canDragCards: true,
      game: {} as Game,
    }
    this.ws = root.home.ws

    makeAutoObservable(this, { ws: false })
  }

  get myCards(): Card[] {
    return this.me.cards as Card[]
  }

  get me(): Player {
    return this.state.game.players.find((player) => player.id === this.root.home.userId) as Player
  }

  getCardColor = (color: string): string => {
    if (color === 'blue') return 'bg-phase10-card-blue'
    if (color === 'green') return 'bg-phase10-card-green'
    if (color === 'purple') return 'bg-phase10-card-purple'
    if (color === 'red') return 'bg-phase10-card-red'
    return 'bg-phase10-card-black'
  }

  getCardCornerText = (value: number): string => {
    if (value === SKIP) return 'S'
    if (value === WILD) return 'W'
    return `${value}`
  }

  getCardTextColor = (color: string): string => {
    if (color === 'blue') return 'text-phase10-card-blue'
    if (color === 'green') return 'text-phase10-card-green'
    if (color === 'purple') return 'text-phase10-card-purple'
    return 'text-phase10-card-red'
  }

  setGame = (game: Game): void => {
    this.state.game = game
    for (const card of this.myCards) {
      card.id = uuid()
    }
  }
}
