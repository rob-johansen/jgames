import { makeAutoObservable } from 'mobx'
import { v4 as uuid } from 'uuid'

import type { Card, Game, Player } from '@jgames/types'
import { SKIP, WILD } from '@jgames/types'

type State = {
  game: Game
}

export class ViewModel {
  private _state: State = {
    game: {} as Game
  }
  userId: string
  ws: WebSocket

  constructor(game: Game, userId: string, ws: WebSocket) {
    this.state.game = game
    this.userId = userId
    this.ws = ws

    for (const card of this.myCards) {
      card.id = uuid()
    }

    makeAutoObservable(this, { userId: false, ws: false })
  }

  get myCards(): Card[] {
    return this.me.cards as Card[]
  }

  get me(): Player {
    return this.state.game.players.find((player) => player.id === this.userId) as Player
  }

  get state(): State {
    return this._state
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
}
