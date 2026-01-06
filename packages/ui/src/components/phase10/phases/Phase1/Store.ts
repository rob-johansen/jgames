import { makeAutoObservable } from 'mobx'

import { showToast } from '@/components/Toast'
import type { Card } from '@jgames/types'
import type { RootStore } from '@/providers/phase10/RootStore'

type State = {
  left: boolean
  loading: boolean
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
      loading: false,
      set1: [],
      set2: [],
    }
    makeAutoObservable(this)
  }

  addCardFromHand = (card: Card, index: number) => {
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
    if (this.state.loading) return

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
  }

  onClickRight = () => {
    this.state.left = false
  }
}
