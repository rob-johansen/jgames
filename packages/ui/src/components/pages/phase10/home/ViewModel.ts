import { makeAutoObservable } from 'mobx'

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
    makeAutoObservable(this)
  }

  get state(): State {
    return this._state
  }

  onChangeName = (value: string): void => {
    this.state.name = value
    this.state.nameError = ''
  }

  onClickJoin = (): void => {
    if (this.state.name.length === 0) {
      this.state.nameError = 'Please enter your name'
      return
    }

    this.state.loading = true

    // TODO: Save the name to localStorage

    // TODO: Hit an API that adds this player to the queue
  }
}
