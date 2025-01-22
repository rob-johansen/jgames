import { PoolClient } from 'pg'

export default interface MigrationFile {
  run (client: PoolClient): Promise<void>
}
