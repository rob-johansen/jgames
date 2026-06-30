import { makeAutoObservable } from 'mobx'

import { showToast } from '@/components/Toast'
import { WILD } from '@jgames/types'
import type { Card, Phase, Player } from '@jgames/types'
import type { RootStore } from '@/providers/phase10/RootStore'

type State = {
  added: Card[]
  cards: Card[]
  phaseIndex: number
  playerIndex: number
}

export class HitStore {
  root: RootStore
  state: State

  constructor(root: RootStore) {
    this.root = root
    this.state = {
      added: [],
      cards: [],
      phaseIndex: 0,
      playerIndex: 0,
    }
    makeAutoObservable(this)
  }

  get mustHit(): boolean {
    if (this.state.added.length > 0) {
      showToast({
        message: 'You must confirm your hit or take your card(s) back.',
        type: 'error'
      })
      return true
    }
    return false
  }

  get nextPlayerIndex(): number {
    return this.state.playerIndex + 1 > this.root.game.state.game.players.length - 1 ? 0 : this.state.playerIndex + 1
  }

  get player(): Player {
    return this.root.game.state.game.players[this.state.playerIndex]
  }

  get previousPlayerIndex(): number {
    return this.state.playerIndex - 1 >= 0 ? this.state.playerIndex - 1 : this.root.game.state.game.players.length - 1
  }
  
  addCardFromHand = (card: Card, index: number) => {
    const player = this.player

    if (player.phase === 1) {
      // The player is still on phase 1, meaning they can't use their
      // hit area. Thus, we put the card right back into their hand.
      this.root.game.myCards.splice(index, 0, card)
      return
    }

    if ((player.played as Phase<1>).set3a) {
      // Whether `this.state.phaseIndex` is 0 or 1, `this.state.cards` is a set of 3 and `card`
      // must match it (i.e. it must be a WILD, or match the values of the cards in the set).
      let add = card.value === WILD

      if (!add) {
        for (const played of this.state.cards) {
          if (card.value === played.value) {
            add = true
            break
          }
        }
      }

      if (!add) {
        // The card doesn't match the set, so we put it right back into our
        // hand (making it look like the player was not able to click it).
        this.root.game.myCards.splice(index, 0, card)
        return
      }

      this.state.added.push(card)
      this.state.cards.push(card)
    }

    if ((player.played as Phase<2>).set3) {
      // TODO: If `this.state.phaseIndex` is 0, the player is adding a card to a set
      //       Otherwise, the player is adding a card to a run
      if (this.state.phaseIndex === 0) {
        console.log('Adding a card to the set...')
      } else {
        console.log('Adding a card to the run...so the player must be able to move it...but only to the beginning or end, right?')
      }
    }
  }

  onClickBack = () => {
    if (this.mustHit) return

    const player = this.player

    if (player.phase === 1) {
      return this.setCards(this.previousPlayerIndex, 1)
    }

    const phase1 = (player.played as Phase<1>).set3a
    const phase2 = (player.played as Phase<2>).set3

    if (phase1?.length || phase2?.length) {
      if (this.state.phaseIndex === 1) {
        return this.setCards(this.state.playerIndex, 0)
      }
    }

    return this.setCards(this.nextPlayerIndex, 1)
  }

  onClickCard = (card: Card) => {
    const addedIndex = this.state.added.findIndex((c) => c.id === card.id)
    const cardsIndex = this.state.cards.findIndex((c) => c.id === card.id)
    if (addedIndex === -1 || cardsIndex === -1) return

    this.state.added.splice(addedIndex, 1)
    this.state.cards.splice(cardsIndex, 1)
    this.root.game.myCards.push(card)
  }

  onClickConfirm = async () => {
    if (!this.root.game.myTurn) {
      this.root.game.state.showNotTurnModal = true
      return
    }

    this.root.game.state.hitting = true

    const api = 'phase1' // TODO: Change this to `phase2` if the player is on phase 3 ... and so forth.

    const cards: Card[] = []

    for (const card of this.state.added) {
      const { color, value } = card
      cards.push({ color, value })
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/phase10/v1/${api}/hit`, {
      body: JSON.stringify({
        gameId: this.root.game.state.game.id,
        hitteeId: this.player.id,
        hitterId: this.root.game.me.id,
        ...(this.state.phaseIndex === 0 ? { set3a: cards } : { set3b: cards })
      }),
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      mode: 'cors'
    })

    if (!response.ok) {
      showToast({
        message: 'There was an error hitting',
        type: 'error',
      })
    }
  }

  onClickNext = () => {
    if (this.mustHit) return

    const player = this.player

    if (player.phase === 1) {
      return this.setCards(this.nextPlayerIndex, 0)
    }

    const phase1 = (player.played as Phase<1>).set3a
    const phase2 = (player.played as Phase<2>).set3

    if (phase1?.length || phase2?.length) {
      if (this.state.phaseIndex === 0) {
        return this.setCards(this.state.playerIndex, 1)
      }
    }

    return this.setCards(this.nextPlayerIndex, 0)
  }

  setCards = (playerIndex = 0, phaseIndex = 0) => {
    this.state.cards = []
    this.state.playerIndex = playerIndex
    this.state.phaseIndex = phaseIndex

    const player = this.root.game.state.game.players[playerIndex]

    if (player.phase === 1) return

    if ((player.played as Phase<1>).set3a) {
      const phase = player.played as Phase<1>
      if (phaseIndex === 0 && phase.set3a.length > 0) this.state.cards = phase.set3a
      if (phaseIndex === 1 && phase.set3b.length > 0) this.state.cards = phase.set3b
      return
    }

    if ((player.played as Phase<2>).set3) {
      const phase = player.played as Phase<2>
      if (phaseIndex === 0 && phase.set3.length > 0) this.state.cards = phase.set3
      if (phaseIndex === 1 && phase.run4.length > 0) this.state.cards = phase.run4
      return
    }
  }
}
