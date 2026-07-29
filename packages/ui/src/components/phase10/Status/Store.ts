import { makeAutoObservable } from 'mobx'

import type { Player } from '@jgames/types'
import type { RootStore } from '@/providers/phase10/RootStore'

type State = {
  open: boolean
}

export class StatusStore {
  root: RootStore
  state: State

  constructor(root: RootStore) {
    this.root = root
    this.state = { open: true }
    makeAutoObservable(this)
  }

  hand = (player: Player): number => {
    return Array.isArray(player.cards) ? player.cards.length : player.cards
  }

  isPlayerTurn = (player: Player): boolean => {
    return this.root.game.state.game.turn === player.id
  }

  get players(): Player[] {
    return this.root.game.state.game.players
  }

  setOpen = (value: boolean) => {
    this.state.open = value
  }
}
