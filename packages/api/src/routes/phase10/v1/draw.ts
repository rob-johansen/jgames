import { Router } from 'express'
import type { Response } from 'express'

import { drawFromPile } from '@/data/queries/phase10/draw'
import { MessageType } from '@jgames/types'
import { RequestError } from '@jgames/types'
import { validateId } from '@jgames/validations'
import { wss } from '@/wss/wss'
import type { ApiRequest } from '@jgames/types'

export const router: Router = Router()

router.get('/pile', async (
  req: ApiRequest,
  res: Response<void>,
): Promise<void> => {
  const gameId = validateId(req.query.gameId)
  const turnId = validateId(req.query.turnId)

  const success = await drawFromPile(gameId, turnId)
  if (!success) throw new RequestError('There was a problem drawing from the pile.')

  res.status(204).end()

  wss.sendToAll({ data: {}, type: MessageType.PILE_DRAW })
})
