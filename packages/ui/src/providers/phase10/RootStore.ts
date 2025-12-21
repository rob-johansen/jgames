import { makeAutoObservable } from 'mobx'

import { GameStore } from '@/components/pages/phase10/game/Store'
import { HomeStore } from '@/components/pages/phase10/home/Store'

export class RootStore {
  game: GameStore
  home: HomeStore

  constructor() {
    // Other stores depend on HomeStore, so it's instantiated first.
    this.home = new HomeStore(this)
    this.game = new GameStore(this)
    makeAutoObservable(this)
  }
}
