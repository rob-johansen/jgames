import { makeAutoObservable } from 'mobx'

import { GameStore } from '@/components/pages/phase10/game/Store'
import { HitStore } from '@/components/phase10/Hit/Store'
import { HomeStore } from '@/components/pages/phase10/home/Store'
import { Phase1Store } from '@/components/phase10/phases/Phase1/Store'
import { Phase2Store } from '@/components/phase10/phases/Phase2/Store'
import { Phase3Store } from '@/components/phase10/phases/Phase3/Store'
import { Phase4Store } from '@/components/phase10/phases/Phase4/Store'
import { Phase5Store } from '@/components/phase10/phases/Phase5/Store'

export class RootStore {
  game: GameStore
  hit: HitStore
  home: HomeStore
  phase1: Phase1Store
  phase2: Phase2Store
  phase3: Phase3Store
  phase4: Phase4Store
  phase5: Phase5Store

  constructor() {
    // Other stores depend on HomeStore, so it's instantiated first.
    this.home = new HomeStore(this)

    this.game = new GameStore(this)
    this.hit = new HitStore(this)
    this.phase1 = new Phase1Store(this)
    this.phase2 = new Phase2Store(this)
    this.phase3 = new Phase3Store(this)
    this.phase4 = new Phase4Store(this)
    this.phase5 = new Phase5Store(this)
    makeAutoObservable(this)
  }
}
