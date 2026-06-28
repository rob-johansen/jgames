import { ClientError, SKIP, WILD } from '@jgames/types'
import type { Card, Phase } from '@jgames/types'

export const MAX_NAME_LENGTH = 25
export const PHASE_CARDS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, WILD]
export const UUID_LENGTH = 36

export const validateCard = (card?: Card): Card => {
  if (!card) {
    throw new ClientError('Please provide a card')
  }

  if (typeof card.value !== 'number' || ![1,2,3,4,5,6,7,8,9,10,11,12,SKIP,WILD].includes(card.value)) {
    throw new ClientError('Invalid card')
  }

  if (card.value === SKIP || card.value === WILD) {
    if (card.color !== '') {
      throw new ClientError('Invalid card')
    }
  } else {
    if (!['blue', 'green', 'purple', 'red'].includes(card.color)) {
      throw new ClientError('Invalid card')
    }
  }

  return card
}

export const validateId = (id?: string): string => {
  if (!id || id.length !== UUID_LENGTH || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
    throw new ClientError('Invalid ID')
  }

  return id
}

export const validateName = (name?: string): string => {
  if (!name) {
    throw new ClientError('Please provide a name')
  }

  if (name.length > MAX_NAME_LENGTH) {
    throw new ClientError('Really?')
  }

  return name
}

export const validatePhase1 = (phase?: Phase<1>): Phase<1> => {
  if (!phase || !Array.isArray(phase.set3a) || !Array.isArray(phase.set3b) || phase.set3a.length !== 3 || phase.set3b.length !== 3) {
    throw new ClientError('Invalid phase 1')
  }

  const set1 = new Set(phase.set3a.map(c => c.value))
  const set2 = new Set(phase.set3b.map(c => c.value))

  if (
    (set1.size === 1 || (set1.size === 2 && set1.has(WILD))) &&
    (set2.size === 1 || (set2.size === 2 && set2.has(WILD)))
  ) {
    return phase
  }

  throw new ClientError('Invalid phase 1')
}

export const validatePhase2 = (phase?: Phase<2>): Phase<2> => {
  if (!phase || !Array.isArray(phase.set3) || !Array.isArray(phase.run4) || phase.set3.length !== 3 || phase.run4.length !== 4) {
    throw new ClientError('Invalid phase 2')
  }

  const set = new Set(phase.set3.map(c => c.value))
  const run = phase.run4.map(c => c.value)

  if (set.size === 1 || (set.size === 2 && set.has(WILD))) {
    let num1 = 0
    let offset = 0

    for (const number of run) {
      if (number === WILD) {
        offset++
        continue
      }
      num1 = number
      break
    }

    if (num1 === 0) {
      throw new ClientError('A run must have more than just WILD cards.')
    }

    if (offset > 0) {
      num1 -= offset
    }

    if (num1 <= 0 || num1 >= 10) {
      throw new ClientError('Invalid phase 2')
    }

    const num2 = run[1]
    const num3 = run[2]
    const num4 = run[3]

    if (
      (num2 === num1 + 1 || num2 === WILD) &&
      (num3 === num1 + 2 || num3 === WILD) &&
      (num4 === num1 + 3 || num4 === WILD)
    ) {
      return phase
    }
  }

  throw new ClientError('Invalid phase 2')
}
