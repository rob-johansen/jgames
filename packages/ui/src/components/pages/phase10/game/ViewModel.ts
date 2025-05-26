import { makeAutoObservable } from 'mobx'
import { v4 as uuid } from 'uuid'
import type { DragEvent } from 'react'

import { SKIP, WILD } from '@jgames/types'
import type { Card, Game, Player } from '@jgames/types'

type State = {
  canDragCards: boolean
  game: Game
}

export class ViewModel {
  private _state: State = {
    canDragCards: true,
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

  onDragCard = (event: DragEvent<HTMLDivElement>, dragCardIndex: number): void => {
    event.dataTransfer.setData('text/plain', `${dragCardIndex}`)
  }

  onDropCard = (event: DragEvent<HTMLDivElement>, targetCardIndex: number): void => {
    const dragCardIndex = Number.parseInt(event.dataTransfer.getData('text/plain'))
    if (dragCardIndex !== targetCardIndex) {
      const dragCard = this.myCards[dragCardIndex]
      let cards: Card[] = []

      for (let i = 0; i < this.myCards.length; i++) {
        if (targetCardIndex < dragCardIndex) { // dragged to the left
          cards = [...this.myCards.slice(0, targetCardIndex), dragCard, ...this.myCards.slice(targetCardIndex, dragCardIndex), ...this.myCards.slice(dragCardIndex + 1)]
        } else { // dragged to the right
          cards = [...this.myCards.slice(0, dragCardIndex), ...this.myCards.slice(dragCardIndex + 1, targetCardIndex + 1), dragCard, ...this.myCards.slice(targetCardIndex + 1)]
        }
      }

      this.me.cards = cards
      event.preventDefault()
    }
  }
}
