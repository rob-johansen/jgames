import { makeAutoObservable, runInAction } from 'mobx'
import { v4 as uuid } from 'uuid'

import { showToast } from '@/components/toast/Toast'
import type { Card, Game, Player } from '@jgames/types'
import type { RootStore } from '@/providers/phase10/RootStore'

type State = {
  arranging: boolean
  drawDeckLoading: boolean
  drawPileLoading: boolean
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
      drawDeckLoading: false,
      drawPileLoading: false,
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

  get showDraw(): boolean {
    const turn = this.state.game.turn
    return typeof turn === 'string' && turn === this.me.id && this.state.game.draw
  }

  get topCardOnPile(): Card | undefined {
    return this.state.game.pile[0]
  }

  drawFromPile = () => {
    const me = this.me
    const cards = me.cards as Card[]
    const pileCard = this.state.game.pile.shift() as Card

    if (this.state.game.turn === me.id) {
      pileCard.id = uuid()
      cards.push(pileCard)
    }
  }

  onClickCard = (card: Card): void => {
    if (this.state.arranging) {
      this.state.movingCard = card.id
    }
  }

  onClickDrawFromDeck = async (): Promise<void> => {
    this.state.drawDeckLoading = true

    const params = new URLSearchParams({
      gameId: this.state.game.id,
      turnId: this.root.home.userId
    })

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/phase10/v1/draw/deck?${params.toString()}`, {
      credentials: 'include',
      headers: {'Content-Type': 'application/json'},
      mode: 'cors'
    })

    if (response.ok) {
      const card = await response.json() as Card

      runInAction(() => {
        card.id = uuid()
        this.myCards.push(card)
        this.state.game.draw = false
      })
    } else {
      showToast({
        message: 'There was a problem drawing from the deck.',
        type: 'error'
      })
    }

    runInAction(() => {
      this.state.drawDeckLoading = false
    })
  }

  onClickDrawFromPile = async (): Promise<void> => {
    this.state.drawPileLoading = true

    const params = new URLSearchParams({
      gameId: this.state.game.id,
      turnId: this.root.home.userId
    })

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/phase10/v1/draw/pile?${params.toString()}`, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      mode: 'cors'
    })

    if (response.ok) {
      runInAction(() => {
        this.state.game.draw = false
        // NOTE: The card is added to the player's hand in the `drawFromPile()` method above,
        //       which is called when `MessageType.PILE_DRAW` arrives via WebSocket.
      })
    } else {
      showToast({
        message: 'There was a problem drawing from the pile.',
        type: 'error'
      })
    }

    runInAction(() => {
      this.state.drawPileLoading = false
    })
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

  notifyDeckDraw = () => {
    if (this.state.game.turn !== this.me.id) {
      const player = this.state.game.players.find((player) => player.id === this.state.game.turn)
      const message = player ? `${player.name} drew a card from the deck` : 'A card was drawn from the deck'

      showToast({
        duration: 7500,
        message,
        type: 'info',
      })
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
