import { PoolClient } from 'pg'

export const run = async (client: PoolClient): Promise<void> => {
  await client.query(`
    CREATE TABLE IF NOT EXISTS phase10.games (
      id           uuid     NOT NULL DEFAULT gen_random_uuid(),
      deck         jsonb    NOT NULL,
      draw         boolean  NOT NULL,
      pile         jsonb    NOT NULL,
      players      jsonb    NOT NULL,
      results      jsonb,
      token        text     NOT NULL,
      turn         text     NOT NULL,
      PRIMARY KEY  (id)
    )
  `)
}
