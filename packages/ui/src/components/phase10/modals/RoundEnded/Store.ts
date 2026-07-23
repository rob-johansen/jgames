import { makeAutoObservable } from 'mobx'

import { showToast } from '@/components/Toast'
import type { Game, Player } from '@jgames/types'
import type { RootStore } from '@/providers/phase10/RootStore'

export class RoundEndedStore {
  root: RootStore

  constructor(root: RootStore) {
    this.root = root
    makeAutoObservable(this)
  }

  get players(): Player[] {
    return this.root.game.state.game.players
  }

  get roundEndedBy(): string {
    const player = this.players.find((player) => player.id === this.root.game.state.roundEnded)
    return player?.name ?? ''
  }

  getRoundPoints = (player: Player): number => {
    const updatePlayer = this.root.game.state.updatedGame.players.find((playa) => playa.id === player.id)
    if (!updatePlayer) return -1

    return updatePlayer?.points - player.points
  }

  onClickClose = () => {
    this.root.game.state.game = this.root.game.state.updatedGame
    this.root.game.state.roundEnded = ''
    this.root.game.state.updatedGame = {} as Game

    if (this.root.game.state.autoSkip) {
      this.root.game.state.autoSkip = false

      const game = this.root.game.state.game
      const player = game.players.find((player) => game.token === player.id)
      const name = player?.name ?? 'the first player'

      showToast({
        duration: 7500,
        message: `The discard pile started with a SKIP, so ${name} was skipped!`,
        type: 'info',
      })
    }
  }
}
