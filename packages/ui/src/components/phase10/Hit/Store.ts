import { makeAutoObservable } from 'mobx'

import type { Card, Phase, Player } from '@jgames/types'
import type { RootStore } from '@/providers/phase10/RootStore'

type State = {
  cards: Card[]
  phaseIndex: number
  playerIndex: number
}

export class HitStore {
  root: RootStore
  state: State

  constructor(root: RootStore) {
    this.root = root
    this.state = {
      cards: [],
      phaseIndex: 0,
      playerIndex: 0,
    }
    makeAutoObservable(this)
  }

  get nextPlayerIndex(): number {
    return this.state.playerIndex + 1 > this.root.game.state.game.players.length - 1 ? 0 : this.state.playerIndex + 1
  }

  get player(): Player {
    return this.root.game.state.game.players[this.state.playerIndex]
  }

  onClickBack = () => {
    // TODO and WYLO: Add logic for moving back to the previous `phaseIndex` or the previous `playerIndex` (then wire up the left arrow button)...
  }

  onClickCard = (card: Card) => {
    // TODO: If it's the player's card, and he just placed it into the hit area, move it back to the player's hand.
    console.log('The player clicked a card while hitting:', card)
  }

  onClickNext = () => {
    const player = this.player

    if (player.phase === 1) {
      return this.setCards(this.nextPlayerIndex, 0)
    }

    if (player.phase === 2) {
      if ((player.played as Phase<1>).set3a.length > 0) {
        if (this.state.phaseIndex === 0) {
          return this.setCards(this.state.playerIndex, 1)
        }
      }
      return this.setCards(this.nextPlayerIndex, 0)
    }
  }

  setCards = (playerIndex = 0, phaseIndex = 0) => {
    this.state.cards = []
    this.state.playerIndex = playerIndex
    this.state.phaseIndex = phaseIndex

    const player = this.root.game.state.game.players[playerIndex]

    if (player.phase === 1) return

    if (player.phase === 2) {
      if (phaseIndex === 0 && (player.played as Phase<1>).set3a.length > 0) {
        this.state.cards = (player.played as Phase<1>).set3a
      }
      if (phaseIndex === 1 && (player.played as Phase<1>).set3b.length > 0) {
        this.state.cards = (player.played as Phase<1>).set3b
      }
    }
  }
}
