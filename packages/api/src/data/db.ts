/* eslint-disable @typescript-eslint/no-require-imports */

import { logger } from '@/logger'
import pg, { Pool, PoolClient, QueryResult, QueryResultRow } from 'pg'
const pgCamelCase = require('pg-camelcase')

// Convert the columns of a query result from snake_case to camelCase.
pgCamelCase.inject(pg)

// Convert bigints to integers. Otherwise pg will return bigints as strings.
pg.types.setTypeParser(20, (value: string): number => Number(value))

const pool = new Pool({
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  idleTimeoutMillis: 60000,
  password: process.env.DB_PASSWORD,
  port: 5432,
  user: process.env.DB_USER
})

pool.on('error', (err: Error): void => {
  logger.error('Database pool error!')
  logger.error(err.message)
})

export interface PoolTxnOptions {
  commit: boolean
}

export const endPool = async (): Promise<void> => {
  try {
    return await pool.end()
  } catch (err) {
    logger.error('Failed to end connection pool')
    logger.error(err.message)
  }
}

export const endTxn = async (client?: PoolClient, { commit }: PoolTxnOptions = { commit: true }): Promise<void> => {
  if (!client) return

  try {
    await client.query(commit ? 'COMMIT' : 'ROLLBACK')
  } catch (err) {
    logger.error('Failed to commit or rollback transaction')
    logger.error(err.message)
  } finally {
    client.release()
  }
}

export const query = <T extends QueryResultRow> (sql: string, params?: unknown[]): Promise<QueryResult<T>> => {
  return pool.query<T>(sql, params)
}

export const startTxn = async (): Promise<PoolClient> => {
  try {
    const client: PoolClient = await pool.connect()
    await client.query('BEGIN')
    return client
  } catch (err) {
    logger.error('Error starting database transaction!')
    logger.error(err.message)
    throw err
  }
}
