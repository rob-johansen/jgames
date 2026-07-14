import { makeAutoObservable } from 'mobx'

import { showToast } from '@/components/Toast'
import { validatePhase8 } from '@jgames/validations'
import type { Card, Phase } from '@jgames/types'
import type { RootStore } from '@/providers/phase10/RootStore'

type State = {
  color7: Card[]
}

export class Phase8Store {
  root: RootStore
  state: State

  constructor(root: RootStore) {
    this.root = root
    this.state = {
      color7: []
    }
    makeAutoObservable(this)
  }

  addCardFromHand = (card: Card, index: number) => {
    if (this.state.color7.length === 7) {
      showToast({
        message: 'You already have 7 cards!',
        type: 'error'
      })
      this.root.game.myCards.splice(index, 0, card)
      return
    }

    this.state.color7.push(card)
  }

  onClickCard = (card: Card) => {
    if (this.root.game.state.playingPhase) return

    const index = this.state.color7.findIndex((c) => c.id === card.id)

    if (index === -1) {
      showToast({
        message: 'There was a problem moving that card.',
        type: 'error'
      })
      return
    }

    const [target] = this.state.color7.splice(index, 1)
    this.root.game.myCards.push(target)
  }

  onClickClose = () => {
    this.root.game.state.showPhase = false
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
      validatePhase8({ color7: this.state.color7 })
    } catch (err) {
      console.log('Error validating phase 8:', err)
      showToast({
        message: 'Something’s not right with your cards!',
        type: 'error'
      })
      return
    }

    this.root.game.state.playingPhase = true

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/phase10/v1/phase8/play`, {
      body: JSON.stringify({
        gameId: this.root.game.state.game.id,
        phase: {
          color7: this.state.color7.map(({ color, value }) => ({ color, value })),
        } as Phase<8>,
        userId: this.root.home.userId,
      }),
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      mode: 'cors'
    })

    if (!response.ok) {
      showToast({
        message: 'There was an error playing phase 8',
        type: 'error',
      })
    }
  }
}
