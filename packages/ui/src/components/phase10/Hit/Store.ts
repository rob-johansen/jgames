import { makeAutoObservable } from 'mobx'

import { showToast } from '@/components/Toast'
import { WILD } from '@jgames/types'
import type { Card, Phase, Player } from '@jgames/types'
import type { RootStore } from '@/providers/phase10/RootStore'

type State = {
  added: Card[]
  cards: Card[]
  phaseIndex: number
  playerIndex: number
  wildCard?: Card
  wildIndex?: number
}

export class HitStore {
  root: RootStore
  state: State

  constructor(root: RootStore) {
    this.root = root
    this.state = {
      added: [],
      cards: [],
      phaseIndex: 0,
      playerIndex: 0,
    }
    makeAutoObservable(this)
  }

  get mustHit(): boolean {
    if (this.state.added.length > 0) {
      showToast({
        message: 'You must confirm your hit or take your card(s) back.',
        type: 'error'
      })
      return true
    }
    return false
  }

  get nextPlayerIndex(): number {
    return this.state.playerIndex + 1 > this.root.game.state.game.players.length - 1 ? 0 : this.state.playerIndex + 1
  }

  get player(): Player {
    return this.root.game.state.game.players[this.state.playerIndex]
  }

  get previousPlayerIndex(): number {
    return this.state.playerIndex - 1 >= 0 ? this.state.playerIndex - 1 : this.root.game.state.game.players.length - 1
  }
  
  addCardFromHand = (card: Card, index: number) => {
    const player = this.player

    if (player.phase === 1) {
      // The player is still on phase 1, meaning they can't use their
      // hit area. Thus, we put the card right back into their hand.
      this.root.game.myCards.splice(index, 0, card)
      return
    }

    if ((player.played as Phase<1>).set3a) {
      this.addCardToSet(card, index)
    }

    if ((player.played as Phase<2>).set3 && (player.played as Phase<2>).run4) {
      if (this.state.phaseIndex === 0) {
        this.addCardToSet(card, index)
      } else {
        this.addCardToRun(card, index)
      }
    }

    if ((player.played as Phase<3>).set4 && (player.played as Phase<3>).run4) {
      if (this.state.phaseIndex === 0) {
        this.addCardToSet(card, index)
      } else {
        this.addCardToRun(card, index)
      }
    }
  }

  addCardToRun = (card: Card, index: number) => {
    if (this.state.cards.length === 12) {
      // The run is full, so we put the card right back into the player's
      // hand (making it look like they weren't able to click the card).
      this.root.game.myCards.splice(index, 0, card)
      return
    }

    if (card.value === WILD) {
      // If the value of the first card is a 1, or a WILD in
      // the position of a 1, this WILD must go to the end.
      let target = 0
      let offset = 0

      for (const kard of this.state.cards) {
        if (kard.value === WILD) {
          offset++
          continue
        }
        target = kard.value
        break
      }

      if (offset > 0) {
        target -= offset
      }

      if (target === 1) {
        this.state.added.push(card)
        this.state.cards.push(card)
        return
      }

      // If the value of the last card is a 12, or a WILD in
      // the position of a 12, this WILD must go to the start.
      target = 0
      offset = 0

      for (let i = this.state.cards.length - 1; i >= 0; i--) {
        const kard = this.state.cards[i]
        if (kard.value === WILD) {
          offset++
          continue
        }
        target = kard.value
        break
      }

      if (offset > 0) {
        target += offset
      }

      if (target === 12) {
        this.state.added.unshift(card)
        this.state.cards.unshift(card)
        return
      }

      // This WILD could go at the start or end,
      // so ask the player where they want it.
      this.state.wildCard = card
      this.state.wildIndex = index
      return
    }

    // The card is a regular number card. Try to place it at the start of the run.
    let start = 0
    let offset = 0

    for (const kard of this.state.cards) {
      if (kard.value === WILD) {
        offset++
        continue
      }
      start = kard.value
      break
    }

    if (offset > 0) {
      start -= offset
    }

    if (start - 1 === card.value) {
      this.state.added.unshift(card)
      this.state.cards.unshift(card)
      return
    }

    // It couldn't be placed at the start, so try the end.
    let end = 0
    offset = 0

    for (let i = this.state.cards.length - 1; i >= 0; i--) {
      const kard = this.state.cards[i]
      if (kard.value === WILD) {
        offset++
        continue
      }
      end = kard.value
      break
    }

    if (offset > 0) {
      end += offset
    }

    if (end + 1 === card.value) {
      this.state.added.push(card)
      this.state.cards.push(card)
      return
    }

    // The card couldn't be placed at the start or end of the run, so we put it right
    // back into the player's hand (making it look like they weren't able to click it).
    this.root.game.myCards.splice(index, 0, card)
  }

  addCardToSet = (card: Card, index: number) => {
    let add = card.value === WILD

    if (!add) {
      for (const played of this.state.cards) {
        if (card.value === played.value) {
          add = true
          break
        }
      }
    }

    if (!add) {
      // The card doesn't match the set, so we put it right back into the
      // player's hand (making it look like they weren't able to click it).
      this.root.game.myCards.splice(index, 0, card)
      return
    }

    this.state.added.push(card)
    this.state.cards.push(card)
  }

  onClickBack = () => {
    if (this.mustHit) return

    const player = this.player

    if (player.phase === 1) {
      return this.setCards(this.previousPlayerIndex, 1)
    }

    const phase1 = (player.played as Phase<1>).set3a?.length > 0
    const phase2 = (player.played as Phase<2>).set3?.length > 0 && (player.played as Phase<2>).run4?.length > 0
    const phase3 = (player.played as Phase<3>).set4?.length > 0 && (player.played as Phase<3>).run4?.length > 0

    if (phase1 || phase2 || phase3) {
      if (this.state.phaseIndex === 1) {
        return this.setCards(this.state.playerIndex, 0)
      }
    }

    return this.setCards(this.nextPlayerIndex, 1)
  }

  onClickCard = (card: Card) => {
    const addedIndex = this.state.added.findIndex((c) => c.id === card.id)
    const cardsIndex = this.state.cards.findIndex((c) => c.id === card.id)
    if (addedIndex === -1 || cardsIndex === -1) return

    this.state.added.splice(addedIndex, 1)
    this.state.cards.splice(cardsIndex, 1)
    this.root.game.myCards.push(card)
  }

  onClickConfirm = async () => {
    if (!this.root.game.myTurn) {
      this.root.game.state.showNotTurnModal = true
      return
    }

    this.root.game.state.hitting = true

    const player = this.player
    const added: Card[] = this.state.added.map((c) => ({ color: c.color, value: c.value }))
    let api = ''
    let body: Partial<Phase> & { added?: Card[] } = {}

    if ((player.played as Phase<1>).set3a) {
      api = 'phase1'
      body = this.state.phaseIndex === 0 ? { set3a: added } : { set3b: added }
    } else if ((player.played as Phase<2>).set3 && (player.played as Phase<2>).run4) {
      api = 'phase2'
      if (this.state.phaseIndex === 0) {
        body = { set3: added } as Pick<Phase<2>, 'set3'>
      } else {
        body = { added, run4: this.state.cards.map((c) => ({ color: c.color, value: c.value })) }
      }
    } else if ((player.played as Phase<3>).set4 && (player.played as Phase<3>).run4) {
      api = 'phase3'
      if (this.state.phaseIndex === 0) {
        body = { set4: added } as Pick<Phase<3>, 'set4'>
      } else {
        body = { added, run4: this.state.cards.map((c) => ({ color: c.color, value: c.value })) }
      }
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/phase10/v1/${api}/hit`, {
      body: JSON.stringify({
        gameId: this.root.game.state.game.id,
        hitteeId: this.player.id,
        hitterId: this.root.game.me.id,
        ...body
      }),
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      mode: 'cors'
    })

    if (!response.ok) {
      showToast({
        message: 'There was an error hitting',
        type: 'error',
      })
    }
  }

  onClickNext = () => {
    if (this.mustHit) return

    const player = this.player

    if (player.phase === 1) {
      return this.setCards(this.nextPlayerIndex, 0)
    }

    const phase1 = (player.played as Phase<1>).set3a?.length > 0
    const phase2 = (player.played as Phase<2>).set3?.length > 0 && (player.played as Phase<2>).run4?.length > 0
    const phase3 = (player.played as Phase<3>).set4?.length > 0 && (player.played as Phase<3>).run4?.length > 0

    if (phase1 || phase2 || phase3) {
      if (this.state.phaseIndex === 0) {
        return this.setCards(this.state.playerIndex, 1)
      }
    }

    return this.setCards(this.nextPlayerIndex, 0)
  }

  onEscapePromptCard = (open: boolean) => {
    if (!open && this.state.wildCard && typeof this.state.wildIndex !== 'undefined') {
      this.root.game.myCards.splice(this.state.wildIndex, 0, this.state.wildCard)
      this.state.wildCard = undefined
      this.state.wildIndex = undefined
    }
  }

  onPlaceWild = (pos: 'start' | 'end') => {
    if (!this.state.wildCard || typeof this.state.wildIndex === 'undefined') return

    if (pos === 'start') {
      this.state.added.unshift(this.state.wildCard)
      this.state.cards.unshift(this.state.wildCard)
    } else {
      this.state.added.push(this.state.wildCard)
      this.state.cards.push(this.state.wildCard)
    }

    this.state.wildCard = undefined
    this.state.wildIndex = undefined
  }

  setCards = (playerIndex = 0, phaseIndex = 0) => {
    this.state.cards = []
    this.state.playerIndex = playerIndex
    this.state.phaseIndex = phaseIndex

    const player = this.root.game.state.game.players[playerIndex]

    if (player.phase === 1) return

    if ((player.played as Phase<1>).set3a) {
      const phase = player.played as Phase<1>
      if (phaseIndex === 0 && phase.set3a.length > 0) this.state.cards = phase.set3a
      if (phaseIndex === 1 && phase.set3b.length > 0) this.state.cards = phase.set3b
      return
    }

    if ((player.played as Phase<2>).set3 && (player.played as Phase<2>).run4) {
      const phase = player.played as Phase<2>
      if (phaseIndex === 0 && phase.set3.length > 0) this.state.cards = phase.set3
      if (phaseIndex === 1 && phase.run4.length > 0) this.state.cards = phase.run4
      return
    }

    if ((player.played as Phase<3>).set4 && (player.played as Phase<3>).run4) {
      const phase = player.played as Phase<3>
      if (phaseIndex === 0 && phase.set4.length > 0) this.state.cards = phase.set4
      if (phaseIndex === 1 && phase.run4.length > 0) this.state.cards = phase.run4
      return
    }
  }
}
