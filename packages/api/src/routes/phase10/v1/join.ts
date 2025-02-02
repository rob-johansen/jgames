import { Router } from 'express'
import type { Response } from 'express'

import { addWaitingPlayer } from '@/data/queries/phase10/waiting'
import { RequestError } from '@jgames/types'
import { validateName } from '@jgames/validations'
import type { PostRequest, User } from '@jgames/types'

export const router: Router = Router()

/**
 * Adds a player to the Phase 10 waiting table
 */
router.post('/', async (
  req: PostRequest<Pick<User, 'name'>>,
  res: Response<{ id: string }>,
): Promise<void> => {
  const name = validateName(req.body.name)

  try {
    const id = await addWaitingPlayer(name)
    res.status(201).send({ id })
    return
  } catch (err) {
    if (err.code === '23505') {
      throw new RequestError('', 409) // A user with the given name is already waiting.
    }
  }

  throw new RequestError('', 500)
})
