import { makeAutoObservable, runInAction } from 'mobx'
import { v4 as uuid } from 'uuid'

import { showToast } from '@/components/toast/Toast'
import { SKIP, WILD } from '@jgames/types'
import type { Card, Game, Player } from '@jgames/types'
import type { RootStore } from '@/providers/phase10/RootStore'

type State = {
  arranging: boolean
  choosingSkip: boolean
  discarding: boolean
  discardingCard?: Card
  discardLoading: boolean
  drawDeckLoading: boolean
  drawPileLoading: boolean
  game: Game
  movingCard?: string
  showDrawModal: boolean
  showNotTurnModal: boolean
}

export class GameStore {
  root: RootStore
  state: State
  ws: WebSocket

  constructor(root: RootStore) {
    this.root = root
    this.state = {
      arranging: false,
      choosingSkip: false,
      discarding: false,
      discardLoading: false,
      drawDeckLoading: false,
      drawPileLoading: false,
      game: {} as Game,
      movingCard: '',
      showDrawModal: false,
      showNotTurnModal: false,
    }
    this.ws = root.home.ws

    makeAutoObservable(this, { ws: false })
  }

  get canDiscard(): boolean {
    return this.myTurn && !this.state.game.draw
  }

  get discardDescription(): string {
    const card = this.state.discardingCard
    if (!card) return ''

    if (card.value === SKIP) return 'SKIP'
    if (card.value === WILD) return 'WILD'
    return `${card.color} ${card.value}`
  }

  get me(): Player {
    return this.state.game.players.find((player) => player.id === this.root.home.userId) as Player
  }

  get myCards(): Card[] {
    return this.me.cards as Card[]
  }

  get myTurn(): boolean {
    return this.state.game.turn === this.me.id
  }

  get scaling(): boolean {
    return this.state.arranging || this.state.discarding
  }

  get showDraw(): boolean {
    return this.myTurn && this.state.game.draw
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
    } else if (this.state.discarding) {
      this.state.choosingSkip = card.value === SKIP
      this.state.discardingCard = card
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
      headers: { 'Content-Type': 'application/json' },
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
        // NOTE: The card is added to the player's hand in the `drawFromPile()` method
        // above, which is called when `MessageType.PILE_DRAW` arrives via WebSocket.
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

  onCloseDrawModal = () => {
    this.state.showDrawModal = false
  }

  onCloseDiscardConfirm = () => {
    this.state.discardingCard = undefined
  }

  onCloseNotTurnModal = () => {
    this.state.showNotTurnModal = false
  }

  onConfirmDiscard = async (): Promise<void> => {
    this.state.discardLoading = true
    const discardId = this.state.discardingCard?.id

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/phase10/v1/discard`, {
      body: JSON.stringify({
        card: {
          color: this.state.discardingCard?.color,
          value: this.state.discardingCard?.value,
        },
        gameId: this.state.game.id,
        userId: this.root.home.userId,
      }),
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      mode: 'cors'
    })

    if (response.ok) {
      const cards = this.myCards
      let index = -1

      for (let i = 0; i < cards.length; i++) {
        const card = cards[i]
        if (card.id === discardId) {
          index = i
          break
        }
      }

      if (index !== -1) {
        runInAction(() => {
          cards.splice(index, 1)
        })
      }

      // NOTE: The pile (and other game state) is updated by the `updateAfterDiscard()`
      // method below, which is called when `MessageType.DISCARD` arrives via WebSocket.
    } else {
      showToast({
        message: 'There was an error discarding',
        type: 'error',
      })
    }
  }

  onEscapeDiscardConfirm = (open: boolean) => {
    if (!open) {
      this.state.discardingCard = undefined
    }
  }

  onEscapeDraw = (open: boolean) => {
    if (!open) {
      this.state.showDrawModal = false
    }
  }

  onEscapeNotTurnModal = (open: boolean) => {
    if (!open) {
      this.state.showNotTurnModal = false
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
    } else {
      return
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
    this.state.discarding = false
    this.state.discardingCard = undefined

    if (this.state.arranging) {
      window.addEventListener('keydown', this.onKeyDown)
    } else {
      this.state.movingCard = ''
      window.removeEventListener('keydown', this.onKeyDown)
    }
  }

  toggleDiscarding = () => {
    this.state.arranging = false
    this.state.movingCard = ''

    if (!this.myTurn) {
      this.state.showNotTurnModal = true
      return
    }

    if (!this.canDiscard) {
      this.state.showDrawModal = true
      return
    }

    this.state.discarding = !this.state.discarding

    if (!this.state.discarding) {
      this.state.discardingCard = undefined
    }
  }

  updateAfterDiscard = (card: Card, turn: string) => {
    card.id = uuid()
    this.state.game.draw = true
    this.state.game.pile.unshift(card)
    this.state.game.turn = turn

    this.state.discarding = false
    this.state.discardingCard = undefined
    this.state.discardLoading = false
  }
}
