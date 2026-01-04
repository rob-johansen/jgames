import { makeAutoObservable } from 'mobx'

import { GameStore } from '@/components/pages/phase10/game/Store'
import { HomeStore } from '@/components/pages/phase10/home/Store'
import { Phase1Store } from '@/components/phase10/phases/Phase1/Store'

export class RootStore {
  game: GameStore
  home: HomeStore
  phase1: Phase1Store

  constructor() {
    // Other stores depend on HomeStore, so it's instantiated first.
    this.home = new HomeStore(this)
    this.game = new GameStore(this)
    this.phase1 = new Phase1Store(this)
    makeAutoObservable(this)
  }
}
