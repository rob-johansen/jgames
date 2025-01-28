import { PoolClient } from 'pg'

export const run = async (client: PoolClient): Promise<void> => {
  await client.query(`
    CREATE TABLE IF NOT EXISTS phase10.waiting (
      id           uuid    NOT NULL DEFAULT gen_random_uuid(),
      name         text    NOT NULL UNIQUE,
      PRIMARY KEY  (id)
    )
  `)
}
