import { makeAutoObservable, runInAction } from 'mobx'
import { v4 as uuid } from 'uuid'

import { showToast } from '@/components/Toast'
import { SKIP, WILD } from '@jgames/types'
import type { Card, Game, Phase, Player } from '@jgames/types'
import type { RootStore } from '@/providers/phase10/RootStore'

type State = {
  arranging: boolean
  arrangingCard?: string
  choosingSkip: boolean
  discarding: boolean
  discardingCard?: Card
  discardLoading: boolean
  drawDeckLoading: boolean
  drawPileLoading: boolean
  game: Game
  playedPhase: boolean
  playingPhase: boolean
  showDrawModal: boolean
  showHit: boolean
  showNotTurnModal: boolean
  showPhase: boolean
}

export class GameStore {
  root: RootStore
  state: State
  ws: WebSocket

  constructor(root: RootStore) {
    this.root = root
    this.state = {
      arranging: false,
      arrangingCard: '',
      choosingSkip: false,
      discarding: false,
      discardLoading: false,
      drawDeckLoading: false,
      drawPileLoading: false,
      game: {} as Game,
      playedPhase: false,
      playingPhase: false,
      showDrawModal: false,
      showHit: false,
      showNotTurnModal: false,
      showPhase: false,
    }
    this.ws = root.home.ws

    makeAutoObservable(this, { ws: false })
  }

  get discardDescription(): string {
    const card = this.state.discardingCard
    if (!card) return ''

    if (card.value === SKIP) return 'SKIP'
    if (card.value === WILD) return 'WILD'
    return `${card.color} ${card.value}`
  }

  get discardDisabled(): boolean {
    return this.state.drawPileLoading || this.me.skipped || this.state.playingPhase
  }

  get me(): Player {
    return this.state.game.players.find((player) => player.id === this.root.home.userId) as Player
  }

  get mustDraw(): boolean {
    return this.myTurn && this.state.game.draw
  }

  get myCards(): Card[] {
    return this.me.cards as Card[]
  }

  get myTurn(): boolean {
    return this.state.game.turn === this.me.id
  }

  get scaling(): boolean {
    return this.state.arranging || this.state.discarding || (this.state.showPhase && !this.state.playingPhase)
  }

  get showDeckDraw(): boolean {
    return this.myTurn && this.state.game.draw && !this.me.skipped
  }

  get showPileDraw(): boolean {
    return this.myTurn && this.state.game.draw && !this.me.skipped && this.topCardOnPile?.value !== SKIP
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
      this.state.arrangingCard = card.id
    } else if (this.state.discarding) {
      this.state.choosingSkip = card.value === SKIP
      this.state.discardingCard = card
    } else if (this.state.showPhase) {
      if (this.state.playingPhase) return

      const cards = this.myCards
      const index = cards.findIndex((c) => c.id === card.id)

      if (index === -1) {
        showToast({
          message: 'There was a problem moving that card.',
          type: 'error'
        })
        return
      }

      const [target] = cards.splice(index, 1)

      if (target.value === SKIP) {
        // SKIP is not part of any phase. If the player clicked a SKIP with the phase area visible, we
        // just put it back in their hand at the same spot (so it looks like the click had no effect).
        cards.splice(index, 0, target)
        return
      }

      if (this.me.phase === 1) {
        this.root.phase1.addCardFromHand(target, index)
      }
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
    if (!this.state.arrangingCard) return

    const cards = this.myCards
    let currentIndex = -1
    let newIndex = -1

    for (let i = 0; i < cards.length; i++) {
      if (cards[i].id === this.state.arrangingCard) {
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
      if (!player) {
        showToast({
          message: 'There was a player error (deck draw)',
          type: 'error',
        })
        return
      }

      showToast({
        duration: 7500,
        message: `${player.name} drew a card from the deck`,
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

  showArranging = (id?: string): boolean => {
    return id === this.state.arrangingCard
  }

  toggleArranging = (): void => {
    this.state.arranging = !this.state.arranging
    this.state.discarding = false
    this.state.discardingCard = undefined
    this.state.showHit = false
    this.state.showPhase = false

    if (this.state.arranging) {
      window.addEventListener('keydown', this.onKeyDown)
    } else {
      this.state.arrangingCard = ''
      window.removeEventListener('keydown', this.onKeyDown)
    }
  }

  toggleDiscarding = () => {
    this.state.arranging = false
    this.state.arrangingCard = ''
    this.state.showHit = false
    this.state.showPhase = false

    if (!this.myTurn) {
      this.state.showNotTurnModal = true
      return
    }

    if (this.mustDraw) {
      this.state.showDrawModal = true
      return
    }

    this.state.discarding = !this.state.discarding

    if (!this.state.discarding) {
      this.state.discardingCard = undefined
    }
  }

  toggleHit = () => {
    this.root.hit.setCards()

    this.state.arranging = false
    this.state.arrangingCard = ''
    this.state.discarding = false
    this.state.showHit = !this.state.showHit
    this.state.showPhase = false
  }

  togglePhase = () => {
    this.state.arranging = false
    this.state.arrangingCard = ''
    this.state.discarding = false
    this.state.showHit = false
    this.state.showPhase = !this.state.showPhase
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

  updateAfterDiscardSkip = (userId: string, turn: string) => {
    this.state.game.pile.unshift({ color: '', id: uuid(), value: SKIP })
    this.state.game.turn = turn

    for (const player of this.state.game.players) {
      if (player.id === userId) {
        player.skipped = false
        break
      }
    }
  }

  updateAfterPhasePlay = (number: number, phase: Phase) => {
    const player = this.state.game.players.find((player) => player.id === this.state.game.turn)

    if (!player) {
      showToast({
        message: `There was a player error (phase ${number} played)`,
        type: 'error',
      })
      return
    }

    player.phase = number === 10 ? 10 : number + 1
    player.played = phase

    if ((player.played as Phase<1>).set3a) {
      const phaze: Phase<1> = player.played as Phase<1>
      for (const card of phaze.set3a) { card.id = uuid() }
      for (const card of phaze.set3b) { card.id = uuid() }
    }

    if (this.state.game.turn === this.me.id) {
      this.state.playedPhase = true
      this.state.playingPhase = false
      this.state.showPhase = false
    } else {
      showToast({
        duration: 7500,
        message: `${player.name} played phase ${number}!`,
        type: 'info',
      })
    }
  }

  updateAfterSkip = (skipId: string, turn: string) => {
    this.state.game.draw = true
    this.state.game.turn = turn

    this.state.choosingSkip = false
    this.state.discarding = false
    this.state.discardingCard = undefined
    this.state.discardLoading = false

    for (const player of this.state.game.players) {
      if (player.id === skipId) {
        player.skipped = true
        break
      }
    }
  }
}
