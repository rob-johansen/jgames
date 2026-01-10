import { makeAutoObservable } from 'mobx'

import { showToast } from '@/components/Toast'
import { validatePhase1 } from '@jgames/validations'
import type { Card } from '@jgames/types'
import type { RootStore } from '@/providers/phase10/RootStore'

type State = {
  left: boolean
  set1: Card[]
  set2: Card[]
}

export class Phase1Store {
  root: RootStore
  state: State

  constructor(root: RootStore) {
    this.root = root
    this.state = {
      left: true,
      set1: [],
      set2: [],
    }
    makeAutoObservable(this)
  }

  addCardFromHand = (card: Card, index: number) => {
    // TODO: If `card.value` is `SKIP`, put the card back in their hand and show an error toast about it.

    const set = this.state.left ? this.state.set1 : this.state.set2

    if (set.length === 3) {
      showToast({
        message: 'You already have 3 cards in that set!',
        type: 'error'
      })
      this.root.game.myCards.splice(index, 0, card)
    } else {
      set.push(card)
    }
  }

  onClickCard = (card: Card) => {
    if (this.root.game.state.playingPhase) return

    let index = this.state.set1.findIndex((c) => c.id === card.id)
    let set: Card[] = []

    if (index !== -1) {
      set = this.state.set1
    } else {
      index = this.state.set2.findIndex((c) => c.id === card.id)
      if (index !== -1) {
        set = this.state.set2
      }
    }

    if (set.length === 0) {
      showToast({
        message: 'There was a problem moving that card.',
        type: 'error'
      })
      return
    }

    const [target] = set.splice(index, 1)
    this.root.game.myCards.push(target)
  }

  onClickClose = () => {
    this.root.game.state.showPhase = false
  }

  onClickLeft = () => {
    this.state.left = true
  }

  onClickPlay = async () => {
    if (!this.root.game.myTurn) {
      this.root.game.state.showNotTurnModal = true
      return
    }

    if (this.root.game.mustDraw) {
      this.root.game.state.showDrawModal = true
      return
    }

    try {
      validatePhase1({ set3a: this.state.set1, set3b: this.state.set2 })
    } catch (err) {
      console.log('Error validating phase 1:', err)
      showToast({
        message: 'That’s not two sets of 3!',
        type: 'error'
      })
      return
    }

    this.root.game.state.playingPhase = true

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/phase10/v1/phase1/play`, {
      body: JSON.stringify({
        gameId: this.root.game.state.game.id,
        phase: {
          set3a: this.state.set1.map(({ color, value }) => ({ color, value })),
          set3b: this.state.set2.map(({ color, value }) => ({ color, value })),
        },
        userId: this.root.home.userId,
      }),
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      mode: 'cors'
    })

    if (!response.ok) {
      showToast({
        message: 'There was an error playing phase 1',
        type: 'error',
      })
    }
  }

  onClickRight = () => {
    this.state.left = false
  }
}
