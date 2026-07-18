import { makeAutoObservable, runInAction } from 'mobx'
import { v4 as uuid } from 'uuid'

import { showToast } from '@/components/Toast'
import { SKIP, WILD } from '@jgames/types'
import type { Card, Game, HitMessage, Phase, Player } from '@jgames/types'
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
  hitting: boolean
  playedPhase: boolean
  playingPhase: boolean
  roundEnded: string
  showDrawModal: boolean
  showHit: boolean
  showNotTurnModal: boolean
  showPhase: boolean
  updatedGame: Game
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
      hitting: false,
      playedPhase: false,
      playingPhase: false,
      roundEnded: '',
      showDrawModal: false,
      showHit: false,
      showNotTurnModal: false,
      showPhase: false,
      updatedGame: {} as Game,
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
    return this.state.drawPileLoading || this.me.skipped || this.state.playingPhase || this.state.hitting
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
      } else if (this.me.phase === 2) {
        this.root.phase2.addCardFromHand(target, index)
      } else if (this.me.phase === 3) {
        this.root.phase3.addCardFromHand(target, index)
      } else if (this.me.phase === 4) {
        this.root.phase4.addCardFromHand(target, index)
      } else if (this.me.phase === 5) {
        this.root.phase5.addCardFromHand(target, index)
      } else if (this.me.phase === 6) {
        this.root.phase6.addCardFromHand(target, index)
      } else if (this.me.phase === 7) {
        this.root.phase7.addCardFromHand(target, index)
      } else if (this.me.phase === 8) {
        this.root.phase8.addCardFromHand(target, index)
      } else if (this.me.phase === 9) {
        this.root.phase9.addCardFromHand(target, index)
      }
    } else if (this.state.showHit) {
      if (this.state.hitting) return

      if (!this.state.playedPhase) {
        showToast({
          message: 'You must play your phase before you can hit.',
          type: 'error'
        })
        return
      }

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
        // SKIP can't be added to a hit area. If the player clicked a SKIP with a hit area visible, we
        // just put it back in their hand at the same spot (so it looks like the click had no effect).
        cards.splice(index, 0, target)
        return
      }

      this.root.hit.addCardFromHand(target, index)
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
    if (this.state.showHit && this.root.hit.mustHit) {
      // The hit area is currently visible, and you've added a card to it, so you
      // can't close the hit area yet (and the `mustHit` getter shows a toast).
      return
    }

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
    if (this.state.showHit && this.root.hit.mustHit) {
      // The hit area is currently visible, and you've added a card to it, so you
      // can't close the hit area yet (and the `mustHit` getter shows a toast).
      return
    }

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
    if (this.state.showHit && this.root.hit.mustHit) {
      // The hit area is currently visible, and you've added a card to it, so you
      // can't close the hit area yet (and the `mustHit` getter shows a toast).
      return
    }

    if (!this.state.showHit) {
      // The hit area is not currently visible, which
      // means it's about to be, so we set the cards.
      this.root.hit.setCards()
    }

    this.state.arranging = false
    this.state.arrangingCard = ''
    this.state.discarding = false
    this.state.showHit = !this.state.showHit
    this.state.showPhase = false
  }

  togglePhase = () => {
    if (this.state.showHit && this.root.hit.mustHit) {
      // The hit area is currently visible, and you've added a card to it, so you
      // can't close the hit area yet (and the `mustHit` getter shows a toast).
      return
    }

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

  updateAfterHit = (props: HitMessage) => {
    const { cards, hitteeId, hitterId, phase, phasePart } = props
    const hitter = this.state.game.players.find((player) => player.id === hitterId)
    const hittee = this.state.game.players.find((player) => player.id === hitteeId)

    if (!hitter) {
      showToast({
        message: `There was an error after hitting (22)`,
        type: 'error',
      })
      return
    }

    if (!hittee) {
      showToast({
        message: `There was an error after hitting (44)`,
        type: 'error',
      })
      return
    }

    if (this.state.game.turn !== this.me.id) {
      if (phase === 1) {
        const played = phasePart === 1 ? (hittee.played as Phase<1>).set3a : (hittee.played as Phase<1>).set3b
        for (const card of cards) {
          card.id = uuid()
          played.push(card)
        }
      } else if (phase === 2) {
        const played = phasePart === 1 ? (hittee.played as Phase<2>).set3 : (hittee.played as Phase<2>).run4
        if (phasePart === 2) {
          played.length = 0 // The run must be in order, so we reset it and just take what the WebSocket gave us.
        }
        for (const card of cards) {
          card.id = uuid()
          played.push(card)
        }
      } else if (phase === 3) {
        const played = phasePart === 1 ? (hittee.played as Phase<3>).set4 : (hittee.played as Phase<3>).run4
        if (phasePart === 2) {
          played.length = 0 // The run must be in order, so we reset it and just take what the WebSocket gave us.
        }
        for (const card of cards) {
          card.id = uuid()
          played.push(card)
        }
      } else if (phase === 4) {
        const played = (hittee.played as Phase<4>).run7
        played.length = 0 // The run must be in order, so we reset it and just take what the WebSocket gave us.
        for (const card of cards) {
          card.id = uuid()
          played.push(card)
        }
      } else if (phase === 5) {
        const played = (hittee.played as Phase<5>).run8
        played.length = 0 // The run must be in order, so we reset it and just take what the WebSocket gave us.
        for (const card of cards) {
          card.id = uuid()
          played.push(card)
        }
      } else if (phase === 6) {
        const played = (hittee.played as Phase<6>).run9
        played.length = 0 // The run must be in order, so we reset it and just take what the WebSocket gave us.
        for (const card of cards) {
          card.id = uuid()
          played.push(card)
        }
      } else if (phase === 7) {
        const played = phasePart === 1 ? (hittee.played as Phase<7>).set4a : (hittee.played as Phase<7>).set4b
        for (const card of cards) {
          card.id = uuid()
          played.push(card)
        }
      } else if (phase === 8) {
        const played = (hittee.played as Phase<8>).color7
        for (const card of cards) {
          card.id = uuid()
          played.push(card)
        }
      }
    }

    if (this.state.game.turn === this.me.id) {
      this.root.hit.state.added = []
      this.state.hitting = false
    } else {
      showToast({
        duration: 7500,
        message: `${hitter.name} hit ${hittee.name}’s cards!`,
        type: 'info',
      })
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
      const phaze = player.played as Phase<1>
      for (const card of phaze.set3a) { card.id = uuid() }
      for (const card of phaze.set3b) { card.id = uuid() }
    } else if ((player.played as Phase<2>).set3 && (player.played as Phase<2>).run4) {
      const phaze = player.played as Phase<2>
      for (const card of phaze.set3) { card.id = uuid() }
      for (const card of phaze.run4) { card.id = uuid() }
    } else if ((player.played as Phase<3>).set4 && (player.played as Phase<2>).run4) {
      const phaze = player.played as Phase<3>
      for (const card of phaze.set4) { card.id = uuid() }
      for (const card of phaze.run4) { card.id = uuid() }
    } else if ((player.played as Phase<4>).run7) {
      const phaze = player.played as Phase<4>
      for (const card of phaze.run7) { card.id = uuid() }
    } else if ((player.played as Phase<5>).run8) {
      const phaze = player.played as Phase<5>
      for (const card of phaze.run8) { card.id = uuid() }
    } else if ((player.played as Phase<6>).run9) {
      const phaze = player.played as Phase<6>
      for (const card of phaze.run9) { card.id = uuid() }
    } else if ((player.played as Phase<7>).set4a) {
      const phaze = player.played as Phase<7>
      for (const card of phaze.set4a) { card.id = uuid() }
      for (const card of phaze.set4b) { card.id = uuid() }
    } else if ((player.played as Phase<8>).color7) {
      const phaze = player.played as Phase<8>
      for (const card of phaze.color7) { card.id = uuid() }
    } else if ((player.played as Phase<9>).set2) {
      const phaze = player.played as Phase<9>
      for (const card of phaze.set5) { card.id = uuid() }
      for (const card of phaze.set2) { card.id = uuid() }
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

  updateAfterRoundEnd = (userId: string, game: Game) => {
    const player = game.players.find((player) => player.id === this.root.home.userId)

    if (!player) {
      showToast({
        message: `There was a player error (round end)`,
        type: 'error',
      })
      return
    }

    for (const card of player.cards as Card[]) {
      card.id = uuid()
    }

    this.state.discarding = false
    this.state.discardingCard = undefined
    this.state.discardLoading = false
    this.state.playedPhase = false
    this.state.roundEnded = userId
    this.state.updatedGame = game
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
