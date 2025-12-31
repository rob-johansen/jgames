import { makeAutoObservable } from 'mobx'

import type { Player } from '@jgames/types'
import type { RootStore } from '@/providers/phase10/RootStore'

export class ChooseSkipStore {
  root: RootStore

  constructor(root: RootStore) {
    this.root = root
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

  onEscape = (open: boolean) => {
    if (!open) {
      this.root.game.state.choosingSkip = false
    }
  }
}
