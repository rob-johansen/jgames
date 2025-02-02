import { makeAutoObservable, runInAction } from 'mobx'

import { isBrowser } from '@/libs/browser'
import { MessageType } from '@jgames/types'
import type { WebSocketMessage } from '@jgames/types'

type State = {
  loading: boolean
  name: string
  nameError: string
}

export class ViewModel {
  private _state: State = {
    loading: false,
    name: '',
    nameError: '',
  }

  constructor () {
    if (isBrowser()) {
      const name = localStorage.getItem('name')

      if (name) {
        this.state.name = name
      }
    }

    makeAutoObservable(this)
  }

  get state(): State {
    return this._state
  }

  createWebSocket = (id: string): void => {
    const ws = new WebSocket(`ws://192.168.1.22:4444?game=phase10&userId=${id}`)

    ws.addEventListener('message', (event) => {
      const { data, type }: WebSocketMessage = JSON.parse(event.data)

      if (type === MessageType.JOIN) {
        console.log(data.players)
        /*
          TODO:
            1. Show the list of waiting players.
            2. If there's only one player in `data.players`, show the "Start Game" button.
         */
      }
    })
  }

  onChangeName = (value: string): void => {
    this.state.name = value
    this.state.nameError = ''
  }

  onClickJoin = async (): Promise<void> => {
    if (this.state.name.length === 0) {
      this.state.nameError = 'Please enter your name'
      return
    }

    this.state.loading = true

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/phase10/v1/join`, {
      body: JSON.stringify({
        name: this.state.name,
      }),
      credentials: 'include',
      headers: {'Content-Type': 'application/json'},
      method: 'POST',
      mode: 'cors'
    })

    if (response.ok) {
      localStorage.setItem('name', this.state.name)

      const json = await response.json()
      localStorage.setItem('userId', json.id)

      this.createWebSocket(json.id)
    } else {
      runInAction(() => {
        this.state.loading = false
        this.state.nameError = response.status === 409
          ? 'This player already joined'
          : 'There was an error (try again)'
        document.getElementById('name')?.focus()
      })
    }
  }
}
