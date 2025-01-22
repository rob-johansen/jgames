import { PoolClient, QueryResult } from 'pg'
import fs from 'fs/promises'

import { endPool, endTxn, query, startTxn } from '../db'
import { logger } from '@/logger'
import Migration from './Migration'
import MigrationFile from './MigrationFile'

const UNDEFINED_TABLE = '42P01'

const getMigrationFiles = async (): Promise<string[] | undefined> => {
  try {
    const files: string[] = await fs.readdir(__dirname)
    return files.filter((file: string): boolean => {
      return (
        !/\.d\.ts$/.test(file) &&
        !/\.map$/.test(file) &&
        !/^\.DS_Store$/.test(file) &&
        !/^migrate\.ts$/.test(file) &&
        !/^Migration\.ts$/.test(file) &&
        !/^MigrationFile\.ts$/.test(file)
      )
    })
  } catch (err) {
    logger.error('Error reading migration files')
    logger.error(err)
  }
}

const getMigrations = async (): Promise<Map<string, boolean> | undefined> => {
  const alreadyRun: Map<string, boolean> = new Map<string, boolean>()

  try {
    const result: QueryResult<Migration> = await query<Migration>('SELECT * FROM migrations')
    for (const migration of result.rows) {
      alreadyRun.set(migration.name, true)
    }
    return alreadyRun
  } catch (err) {
    if (err.code === UNDEFINED_TABLE) return alreadyRun

    logger.error('Error looking up migrations in the database')
    logger.error(err)
  }
}

const insertMigration = async (name: string, client: PoolClient): Promise<void> => {
  await client.query(`
    INSERT INTO migrations (name)
    VALUES ($1)
  `, [name])
}

const migrate = async (): Promise<void> => {
  const files: string[] | undefined = await getMigrationFiles()
  const alreadyRun: Map<string, boolean> | undefined = await getMigrations()

  if (!files || !alreadyRun) {
    await endPool()
    throw new Error('Fatal error attempting to run migrations!')
  }

  let count = 0

  for (const file of files) {
    if (alreadyRun.has(file)) continue

    if (count === 0) {
      logger.info('Running new database migration(s)')
    }

    const client: PoolClient = await startTxn()

    try {
      logger.info(`migration: ${file}`)
      const migrationFile: MigrationFile = (await import(`./${file}`))
      await migrationFile.run(client)
      await insertMigration(file, client)
      await endTxn(client, { commit: true })
      count++
    } catch (err) {
      logger.error(`Error running ${file} database migration`)
      await endTxn(client, { commit: false })
      await endPool()
      throw err
    }
  }

  await endPool()

  logger.info(
    count === 0
      ? 'No new database migrations to run'
      : `Successfully ran ${count} database migration${count > 1 ? 's' : ''}`
  )
}

migrate()
