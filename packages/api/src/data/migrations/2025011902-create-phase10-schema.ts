import { PoolClient } from 'pg'

export const run = async (client: PoolClient): Promise<void> => {
  await client.query(`CREATE SCHEMA IF NOT EXISTS phase10`)
}
