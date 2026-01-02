import { makeAutoObservable } from 'mobx'

import { showToast } from '@/components/Toast'
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

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/phase10/v1/discard/skip`, {
      body: JSON.stringify({
        gameId: this.root.game.state.game.id,
        userId: this.root.home.userId,
      }),
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      mode: 'cors'
    })

    // NOTE: The pile (and other game state) is updated by the `updateAfterDiscardSkip()` method
    // in the GameStore, which is called when `MessageType.DISCARD_SKIP` arrives via WebSocket.

    if (!response.ok) {
      showToast({
        message: 'There was an error discarding the SKIP',
        type: 'error',
      })
    }
  }
}
