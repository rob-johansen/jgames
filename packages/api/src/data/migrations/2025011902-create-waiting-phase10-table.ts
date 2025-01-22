import { PoolClient } from 'pg'

export const run = async (client: PoolClient): Promise<void> => {
  await client.query(`
    CREATE TABLE IF NOT EXISTS codes (
      id           uuid    NOT NULL DEFAULT generate_ulid(),
      code         text    NOT NULL,
      nonce        text    NOT NULL,
      email        text    NOT NULL UNIQUE,
      expires      bigint  NOT NULL,
      PRIMARY KEY  (id)
    )
  `)

  await client.query('CREATE INDEX ON codes (expires)')
}
