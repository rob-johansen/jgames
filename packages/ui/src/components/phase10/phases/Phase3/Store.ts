import { makeAutoObservable } from 'mobx'

import { showToast } from '@/components/Toast'
import { validatePhase3 } from '@jgames/validations'
import type { Card } from '@jgames/types'
import type { RootStore } from '@/providers/phase10/RootStore'

type State = {
  left: boolean
  run: Card[]
  set: Card[]
}

export class Phase3Store {
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

    if (target.length === 4) {
      showToast({
        message: `You already have 4 cards in that ${left ? 'set' : 'run'}!`,
        type: 'error'
      })
      this.root.game.myCards.splice(index, 0, card)
      return
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

    try {
      validatePhase3({ set4: this.state.set, run4: this.state.run })
    } catch (err) {
      console.log('Error validating phase 3:', err)
      showToast({
        message: 'Something’s not right with your set or run!',
        type: 'error'
      })
      return
    }

    this.root.game.state.playingPhase = true

    // TODO: Fire off the request
    console.log('Firing off the phase 3 request...')

    // TODO: Show a toast if the resonse is not ok
  }

  onClickRight = () => {
    this.state.left = false
  }

  onClickCard = (card: Card, area: 'set' | 'run') => {
    if (this.root.game.state.playingPhase) return

    const cards = area === 'set' ? this.state.set : this.state.run
    const index = cards.findIndex((c) => c.id === card.id)

    if (index === -1) {
      showToast({
        message: 'There was a problem moving that card.',
        type: 'error'
      })
      return
    }

    const [target] = cards.splice(index, 1)
    this.root.game.myCards.push(target)
  }
}
