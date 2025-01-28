import { ClientError } from '@jgames/types'

export const MAX_NAME_LENGTH = 25

export const validateName = (name?: string): string => {
  if (!name) {
    throw new ClientError('Please provide a name')
  }

  if (name.length > MAX_NAME_LENGTH) {
    throw new ClientError('Really?')
  }

  return name
}
