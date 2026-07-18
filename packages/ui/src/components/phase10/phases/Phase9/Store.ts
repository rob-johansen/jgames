import { makeAutoObservable } from 'mobx'

import { showToast } from '@/components/Toast'
import { validatePhase9 } from '@jgames/validations'
import type { Card, Phase } from '@jgames/types'
import type { RootStore } from '@/providers/phase10/RootStore'

type State = Phase<9> & { left: boolean }

export class Phase9Store {
  root: RootStore
  state: State

  constructor(root: RootStore) {
    this.root = root
    this.state = {
      left: true,
      set5: [],
      set2: [],
    }
    makeAutoObservable(this)
  }

  addCardFromHand = (card: Card, index: number) => {
    const left = this.state.left
    const set = left ? this.state.set5 : this.state.set2
    let limit = 0

    if (left) {
      if (set.length === 5) limit = 5
    } else {
      if (set.length === 2) limit = 2
    }

    if (limit) {
      showToast({
        message: `You already have ${limit} cards in that set!`,
        type: 'error'
      })
      this.root.game.myCards.splice(index, 0, card)
      return
    }

    set.push(card)
  }

  onClickCard = (card: Card) => {
    if (this.root.game.state.playingPhase) return

    let index = this.state.set5.findIndex((c) => c.id === card.id)
    let set: Card[] = []

    if (index !== -1) {
      set = this.state.set5
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
      validatePhase9(this.state)
    } catch (err) {
      console.log('Error validating phase 9:', err)
      showToast({
        message: 'That’s not a sets of 5 and a set of 2!',
        type: 'error'
      })
      return
    }

    this.root.game.state.playingPhase = true

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/phase10/v1/phase9/play`, {
      body: JSON.stringify({
        gameId: this.root.game.state.game.id,
        phase: {
          set5: this.state.set5.map(({ color, value }) => ({ color, value })),
          set2: this.state.set2.map(({ color, value }) => ({ color, value })),
        } as Phase<9>,
        userId: this.root.home.userId,
      }),
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      mode: 'cors'
    })

    if (!response.ok) {
      showToast({
        message: 'There was an error playing phase 9',
        type: 'error',
      })
    }
  }

  onClickRight = () => {
    this.state.left = false
  }
}
