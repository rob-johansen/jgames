import { makeAutoObservable } from 'mobx'

import type { Result } from '@jgames/types'
import type { RootStore } from '@/providers/phase10/RootStore'

export class ResultsStore {
  root: RootStore

  constructor(root: RootStore) {
    this.root = root
    makeAutoObservable(this)
  }

  get rank(): number {
    const myName = this.root.game.me.name
    for (const result of this.results) {
      if (myName === result.name) {
        return result.rank
      }
    }
    return -1
  }

  get results(): Result[] {
    return this.root.home.state.results
  }

  get title(): string {
    const rank = this.rank
    if (rank === 1) return 'Winner!'
    if (rank === 2) return '2nd Place'
    if (rank === 3) return '3rd Place'
    if (rank === 4) return '4th Place'
    if (rank === 5) return '5th Place'
    return '6th Place'
  }
}
