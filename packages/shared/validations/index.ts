import { ClientError, SKIP, WILD } from '@jgames/types'
import type { Card } from '@jgames/types'

export const MAX_NAME_LENGTH = 25
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

export const validateName = (name?: string): string => {
  if (!name) {
    throw new ClientError('Please provide a name')
  }

  if (name.length > MAX_NAME_LENGTH) {
    throw new ClientError('Really?')
  }

  return name
}

export const validateId = (id?: string): string => {
  if (!id || id.length !== UUID_LENGTH || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
    throw new ClientError('Invalid ID')
  }

  return id
}
