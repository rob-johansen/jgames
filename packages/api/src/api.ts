import cookieParser from 'cookie-parser'
import express from 'express'
import type { NextFunction, Response } from 'express'

import '@/wss/wss' // This import causes the WebSocket server to start up.
import { getFunnyError } from '@/libs/error'
import { logger } from '@/logger'
import { RequestError } from '@jgames/types'
import { router as phase10DiscardV1 } from '@/routes/phase10/v1/discard'
import { router as phase10DrawV1 } from '@/routes/phase10/v1/draw'
import { router as phase10JoinV1 } from '@/routes/phase10/v1/join'
import { router as phase10Phase1V1 } from '@/routes/phase10/v1/phase1'
import { router as phase10Phase2V1 } from '@/routes/phase10/v1/phase2'
import { router as phase10Phase3V1 } from '@/routes/phase10/v1/phase3'
import { router as phase10Phase4V1 } from '@/routes/phase10/v1/phase4'
import { router as phase10SkipV1 } from '@/routes/phase10/v1/skip'
import { router as phase10StartV1 } from '@/routes/phase10/v1/start'
import type { ApiRequest } from '@jgames/types'

const PORT = 2222

const api = express()
api.disable('x-powered-by')
api.use(cookieParser())
api.use(express.json())
api.use(express.urlencoded({ extended: true }))
api.use((_req: ApiRequest, res: Response, next: NextFunction): void => {
  res.set('Access-Control-Allow-Origin', process.env.JGAMES_ORIGIN)
  res.set('Access-Control-Allow-Headers', 'Accept, Content-Type, Origin')
  res.set('Access-Control-Allow-Methods', 'DELETE, GET, OPTIONS, PATCH, POST')
  res.set('Access-Control-Allow-Credentials', 'true')
  res.vary('Origin')
  next()
})

// API Routes
api.use('/api/phase10/v1/discard', phase10DiscardV1)
api.use('/api/phase10/v1/draw', phase10DrawV1)
api.use('/api/phase10/v1/join', phase10JoinV1)
api.use('/api/phase10/v1/phase1', phase10Phase1V1)
api.use('/api/phase10/v1/phase2', phase10Phase2V1)
api.use('/api/phase10/v1/phase3', phase10Phase3V1)
api.use('/api/phase10/v1/phase4', phase10Phase4V1)
api.use('/api/phase10/v1/skip', phase10SkipV1)
api.use('/api/phase10/v1/start', phase10StartV1)

// If no route above matches, naturally it's a 404.
api.use((_req: ApiRequest, res: Response): void => {
  res.status(404).send({error: getFunnyError()})
})

// This handles all errors. Express requires four arguments for it to be considered an
// error handler. We disable the eslint check since we don't use the `_next` argument.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
api.use((err: RequestError, _req: ApiRequest, res: Response, _next: NextFunction): void => {
  // Although `err` is typed as `RequestError`, it might be another type thrown
  // by a third-party API, so we must check for the existence of `statusCode`.
  if (err.statusCode && err.statusCode !== 500) {
    res.status(err.statusCode).send({ error: err.message })
    return
  }

  logger.error('500 error: %O', err)
  res.status(500).send({ error: getFunnyError() })
})

api.listen(PORT, (): void => {
  logger.info(`jGames server listening on ${PORT}`)
})
