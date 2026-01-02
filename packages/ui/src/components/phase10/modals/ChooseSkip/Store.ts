import { makeAutoObservable, runInAction } from 'mobx'

import { showToast } from '@/components/Toast'
import type { Player } from '@jgames/types'
import type { RootStore } from '@/providers/phase10/RootStore'

type State = {
  checked: string
  error: boolean
}

export class ChooseSkipStore {
  root: RootStore
  state: State

  constructor(root: RootStore) {
    this.root = root
    this.state = {
      checked: '',
      error: false,
    }
    makeAutoObservable(this)
  }

  get players(): Player[] {
    const players: Player[] = []

    for (const player of this.root.game.state.game.players) {
      if (player.id !== this.root.home.userId) {
        players.push(player)
      }
    }

    return players
  }

  onChange = (playerId: string) => {
    this.state.checked = playerId
    this.state.error = false
  }

  onClickSkip = async () => {
    if (!this.state.checked) {
      this.state.error = true
      return
    }

    this.root.game.state.discardLoading = true
    const discardId = this.root.game.state.discardingCard?.id

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/phase10/v1/skip`, {
      body: JSON.stringify({
        gameId: this.root.game.state.game.id,
        skipId: this.state.checked,
        userId: this.root.home.userId,
      }),
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      mode: 'cors'
    })

    if (response.ok) {
      const cards = this.root.game.myCards
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

      // NOTE: The other game state is updated by the `updateAfterSkip()` method in the
      // GameStore, which is called when `MessageType.SKIP` arrives via WebSocket.
    } else {
      showToast({
        message: 'There was an error skipping',
        type: 'error',
      })
    }
  }

  onEscape = (open: boolean) => {
    if (!open && !this.root.game.state.discardLoading) {
      this.root.game.state.choosingSkip = false
      this.root.game.state.discardingCard = undefined
    }
  }
}
