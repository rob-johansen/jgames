import { makeAutoObservable } from 'mobx'
import { v4 as uuid } from 'uuid'

import type { Card, Game, Player } from '@jgames/types'
import type { RootStore } from '@/providers/phase10/RootStore'

type State = {
  arranging: boolean
  game: Game
  movingCard?: string
}

export class GameStore {
  root: RootStore
  state: State
  ws: WebSocket

  constructor(root: RootStore) {
    this.root = root
    this.state = {
      arranging: false,
      game: {} as Game,
      movingCard: '',
    }
    this.ws = root.home.ws

    makeAutoObservable(this, { ws: false })
  }

  get me(): Player {
    return this.state.game.players.find((player) => player.id === this.root.home.userId) as Player
  }

  get myCards(): Card[] {
    return this.me.cards as Card[]
  }

  get myTurn(): boolean {
    const turn = this.state.game.turn
    return typeof turn === 'string' && turn === this.me.id
  }

  get topCardOnPile(): Card | undefined {
    return this.state.game.pile[0]
  }

  onClickCard = (card: Card): void => {
    if (this.state.arranging) {
      this.state.movingCard = card.id
    }
  }

  onKeyDown = (event: KeyboardEvent): void => {
    if (!this.state.movingCard) return

    const cards = this.myCards
    let currentIndex = -1
    let newIndex = -1

    for (let i = 0; i < cards.length; i++) {
      if (cards[i].id === this.state.movingCard) {
        currentIndex = i
        break
      }
    }

    if (event.key === 'ArrowLeft') {
      newIndex = currentIndex - 1
    } else if (event.key === 'ArrowRight') {
      newIndex = currentIndex + 1
    }

    if (currentIndex >= 0) {
      if (newIndex === -1) {
        newIndex = cards.length - 1
      } else if (newIndex === cards.length) {
        newIndex = 0
      }
    }

    if (currentIndex >= 0 && newIndex >= 0) {
      const [card] = this.myCards.splice(currentIndex, 1)
      this.myCards.splice(newIndex, 0, card)
    }
  }

  setGame = (game: Game): void => {
    this.state.game = game
    for (const card of this.myCards) {
      card.id = uuid()
    }
  }

  showMoving = (id?: string): boolean => {
    return id === this.state.movingCard
  }

  toggleArranging = (): void => {
    this.state.arranging = !this.state.arranging

    if (this.state.arranging) {
      window.addEventListener('keydown', this.onKeyDown)
    } else {
      this.state.movingCard = ''
      window.removeEventListener('keydown', this.onKeyDown)
    }
  }
}
