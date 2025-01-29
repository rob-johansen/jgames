import { makeAutoObservable, runInAction } from 'mobx'

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
    const name = localStorage.getItem('name')

    if (name) {
      this.state.name = name
    }

    makeAutoObservable(this)
  }

  get state(): State {
    return this._state
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

      // TODO: Connect to the WebSocket server and show the waiting UI
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
