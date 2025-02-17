import { Router } from 'express'
import type { Response } from 'express'

import type { PostRequest } from '@jgames/types'

export const router: Router = Router()

router.post('/', async (
  req: PostRequest,
  res: Response<void>,
): Promise<void> => {
  // TODO and WYLO: Make sure there's more than one person waiting ... then create each player's game state and notify them.
  console.log('req:', req)
  console.log('res:', res)
})
