import { makeAutoObservable } from 'mobx'

import type { Player } from '@jgames/types'
import type { RootStore } from '@/providers/phase10/RootStore'

type State = {
  checked: string
  error: boolean
  loading: boolean
}

export class ChooseSkipStore {
  root: RootStore
  state: State

  constructor(root: RootStore) {
    this.root = root
    this.state = {
      checked: '',
      error: false,
      loading: false,
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
  }

  onEscape = (open: boolean) => {
    if (!open) {
      this.root.game.state.choosingSkip = false
      this.root.game.state.discardingCard = undefined
    }
  }
}
