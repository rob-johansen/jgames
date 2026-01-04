import { makeAutoObservable } from 'mobx'

import type { Card } from '@jgames/types'
import type { RootStore } from '@/providers/phase10/RootStore'

type State = {
  left: boolean
  loading: boolean
  set1: Card[]
  set2: Card[]
}

export class Phase1Store {
  root: RootStore
  state: State

  constructor(root: RootStore) {
    this.root = root
    this.state = {
      left: true,
      loading: false,
      set1: [
        { color: 'red', id: '123', value: 11 },
        { color: 'purple', id: '456', value: 11 },
        { color: 'purple', id: '789', value: 11 },
      ],
      set2: [],
    }
    makeAutoObservable(this)
  }

  onClickCancel = () => {
    this.root.game.state.showPhase = false
  }

  onClickLeft = () => {
    this.state.left = true
  }

  onClickPlay = async () => {

  }

  onClickRight = () => {
    this.state.left = false
  }
}
