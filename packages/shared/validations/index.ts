import { ClientError } from '@jgames/types'

export const MAX_NAME_LENGTH = 25
export const UUID_LENGTH = 36

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
