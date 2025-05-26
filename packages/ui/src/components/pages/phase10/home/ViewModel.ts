import { makeAutoObservable, runInAction } from 'mobx'

import { isBrowser } from '@/libs/browser'
import { MessageType } from '@jgames/types'
import { showToast } from '@/components/toast/Toast'
import type { Game, WebSocketMessage } from '@jgames/types'

type State = {
  first: boolean
  hasGame: boolean
  loading: boolean
  name: string
  nameError: string
  players: string[]
  waiting: boolean
}

export class ViewModel {
  private _state: State = {
    first: false,
    hasGame: false,
    loading: false,
    name: '',
    nameError: '',
    players: [],
    waiting: false,
  }
  game: Game
  userId: string
  ws: WebSocket

  constructor() {
    if (isBrowser()) {
      const name = localStorage.getItem('name')

      if (name) {
        this.state.name = name
      }
    }
    this.game = {} as Game
    this.userId = ''
    this.ws = {} as WebSocket
    makeAutoObservable(this, { game: false, ws: false })
  }

  get state(): State {
    return this._state
  }

  createWebSocket = (id: string): void => {
    this.ws = new WebSocket(`ws://192.168.1.22:4444?game=phase10&userId=${id}`)

    this.ws.addEventListener('message', (event) => {
      const message: WebSocketMessage = JSON.parse(event.data)

      if (message.type === MessageType.JOIN) {
        const players = message.data.players as string[]

        runInAction(() => {
          if (!this.state.first && (players).length === 1) {
            this.state.first = true
          }
          this.state.players = players
        })
      }

      if (message.type === MessageType.START) {
        const game = message.data.game as Game

        runInAction(() => {
          this.game = game
          this.state.hasGame = true
          this.state.loading = false
        })
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
      const json = await response.json()

      runInAction(() => {
        localStorage.setItem('name', this.state.name)
        localStorage.setItem('userId', json.id)
        this.state.loading = false
        this.state.waiting = true
        this.userId = json.id
        this.createWebSocket(json.id)
      })
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

  onClickStartGame = async (): Promise<void> => {
    this.state.loading = true

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/phase10/v1/start`, {
      body: JSON.stringify({}),
      credentials: 'include',
      headers: {'Content-Type': 'application/json'},
      method: 'POST',
      mode: 'cors'
    })

    if (response.status === 400) {
      showToast({
        message: 'You need one more players to start',
        type: 'error'
      })

      runInAction(() => {
        this.state.loading = false
      })
    }
  }
}
