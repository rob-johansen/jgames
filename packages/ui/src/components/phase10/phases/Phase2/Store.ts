import { makeAutoObservable } from 'mobx'

import { showToast } from '@/components/Toast'
import type { Card } from '@jgames/types'
import type { RootStore } from '@/providers/phase10/RootStore'

type State = {
  left: boolean
  run: Card[]
  set: Card[]
}

export class Phase2Store {
  root: RootStore
  state: State

  constructor(root: RootStore) {
    this.root = root
    this.state = {
      left: true,
      run: [],
      set: []
    }
    makeAutoObservable(this)
  }

  addCardFromHand = (card: Card, index: number) => {
    const left = this.state.left
    const target = left ? this.state.set : this.state.run

    if (left) {
      if (target.length === 3) {
        showToast({
          message: 'You already have 3 cards in that set!',
          type: 'error'
        })
        this.root.game.myCards.splice(index, 0, card)
        return
      }
    } else {
      if (target.length === 4) {
        showToast({
          message: 'You already have 4 cards in that run!',
          type: 'error'
        })
        this.root.game.myCards.splice(index, 0, card)
        return
      }
    }

    target.push(card)
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

    // TODO and WYLO: Validate phase 2...

    console.log('Attempting to play phase 2...')
  }

  onClickRight = () => {
    this.state.left = false
  }

  onClickRunCard = (card: Card) => {
    if (this.root.game.state.playingPhase) return

    const index = this.state.run.findIndex((c) => c.id === card.id)
    if (index === -1) {
      showToast({
        message: 'There was a problem moving that card.',
        type: 'error'
      })
      return
    }

    const [target] = this.state.run.splice(index, 1)
    this.root.game.myCards.push(target)
  }

  onClickSetCard = (card: Card) => {
    if (this.root.game.state.playingPhase) return

    const index = this.state.set.findIndex((c) => c.id === card.id)
    if (index === -1) {
      showToast({
        message: 'There was a problem moving that card.',
        type: 'error'
      })
      return
    }

    const [target] = this.state.set.splice(index, 1)
    this.root.game.myCards.push(target)
  }
}
