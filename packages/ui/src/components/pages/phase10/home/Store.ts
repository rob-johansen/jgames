import { makeAutoObservable, runInAction } from 'mobx'

import { isBrowser } from '@/libs/browser'
import { MessageType } from '@jgames/types'
import { showToast } from '@/components/Toast'
import type { Card, Game, Phase, WebSocketMessage } from '@jgames/types'
import type { RootStore } from '@/providers/phase10/RootStore'

type State = {
  first: boolean
  hasGame: boolean
  loading: boolean
  name: string
  nameError: string
  players: string[]
  waiting: boolean
}

export class HomeStore {
  root: RootStore
  state: State
  userId: string
  ws: WebSocket

  constructor(root: RootStore) {
    this.root = root
    this.state = {
      first: false,
      hasGame: false,
      loading: false,
      name: '',
      nameError: '',
      players: [],
      waiting: false,
    }
    this.userId = ''
    this.ws = {} as WebSocket

    if (isBrowser()) {
      const name = localStorage.getItem('name')
      if (name) {
        this.state.name = name
      }
    }

    makeAutoObservable(this, { ws: false })
  }

  createWebSocket = (id: string): void => {
    this.ws = new WebSocket(`${process.env.NEXT_PUBLIC_WS_HOST}?game=phase10&userId=${id}`)

    this.ws.addEventListener('message', (event) => {
      const message: WebSocketMessage = JSON.parse(event.data)

      if (message.type === MessageType.DECK_DRAW) {
        this.root.game.notifyDeckDraw()
      }

      if (message.type === MessageType.DISCARD) {
        const card = message.data.card as Card
        const turn = message.data.turn as string
        this.root.game.updateAfterDiscard(card, turn)
      }

      if (message.type === MessageType.DISCARD_SKIP) {
        const userId = message.data.userId as string
        const turn = message.data.turn as string
        this.root.game.updateAfterDiscardSkip(userId, turn)
      }

      if (message.type === MessageType.HIT) {
        const cards = message.data.cards as Card[]
        const hitteeId = message.data.hitteeId as string
        const hitterId = message.data.hitterId as string
        const phase = message.data.phase as number
        const set3a = message.data.set3a as boolean | undefined
        this.root.game.updateAfterHit({ cards, hitteeId, hitterId, phase, set3a })
      }

      if (message.type === MessageType.JOIN) {
        const players = message.data.players as string[]

        runInAction(() => {
          if (!this.state.first && (players).length === 1) {
            this.state.first = true
          }
          this.state.players = players
        })
      }

      if (message.type === MessageType.PHASE_PLAY) {
        const number = message.data.number as number
        const phase = message.data.phase as Phase
        this.root.game.updateAfterPhasePlay(number, phase)
      }

      if (message.type === MessageType.PILE_DRAW) {
        runInAction(() => {
          this.root.game.drawFromPile()
        })
      }

      if (message.type === MessageType.ROUND_END) {
        const game = message.data.game as Game
        const userId = message.data.userId as string

        runInAction(() => {
          this.root.game.updateAfterRoundEnd(userId, game)
        })
      }

      if (message.type === MessageType.SKIP) {
        const skipId = message.data.skipId as string
        const turn = message.data.turn as string
        this.root.game.updateAfterSkip(skipId, turn)
      }

      if (message.type === MessageType.START) {
        const game = message.data.game as Game

        runInAction(() => {
          this.root.game.setGame(game)
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
      headers: { 'Content-Type': 'application/json' },
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
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      mode: 'cors'
    })

    if (response.status === 400) {
      showToast({
        message: 'You need another player!',
        type: 'error'
      })

      runInAction(() => {
        this.state.loading = false
      })
    }
  }
}
