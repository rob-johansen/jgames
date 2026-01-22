import { makeAutoObservable } from 'mobx'

import type { Card, Phase, Player } from '@jgames/types'
import type { RootStore } from '@/providers/phase10/RootStore'

type State = {
  cards: Card[]
  phaseIndex: number
  player: Player
}

export class HitStore {
  root: RootStore
  state: State

  constructor(root: RootStore) {
    this.root = root
    this.state = {
      cards: [],
      phaseIndex: 0,
      player: {} as Player,
    }
    makeAutoObservable(this)
  }

  onClickCard = (card: Card) => {
    // TODO: If it's the player's card, and he just placed it into the hit area, move it back to the player's hand.
    console.log('Player click card while hitting:', card)
  }

  onClickNext = () => {
    // TODO and WYLO: Add logic for moving to the next player (then wire up a right arrow button)...
  }

  setCards = () => {
    for (const player of this.root.game.state.game.players) {
      if (this.state.player.id !== player.id) {
        if (player.phase === 2 && (player.played as Phase<1>).set3a.length > 0) {
          this.state.cards = (player.played as Phase<1>).set3a
          this.state.player = player
          break
        }
      }
    }
  }
}
