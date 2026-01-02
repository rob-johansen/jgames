import { makeAutoObservable } from 'mobx'

import type { RootStore } from '@/providers/phase10/RootStore'

type State = {
  loading: boolean
}

export class SkippedStore {
  root: RootStore
  state: State

  constructor(root: RootStore) {
    this.root = root
    this.state = {
      loading: false
    }
    makeAutoObservable(this)
  }

  onClickDiscard = async () => {
    this.state.loading = true
  }
}
