/**
 * One-off: mark an existing migration as already applied on a database whose schema was
 * created by Payload's dev push. Payload records an applied migration as one row in
 * `payload-migrations`, and exposes no CLI command for adopting one, so this writes that
 * row through the Local API — the same write `runMigrationFile` performs afterwards.
 */
import { existsSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { getPayload } from 'payload'

import config from '../src/payload.config'

const NAME = process.argv[2]

if (!NAME) {
  console.error('usage: tsx scripts/adopt-migration.ts <migration-name>')
  process.exit(1)
}

// `src/migrations/index.ts` is the registry, not a migration, and recording it poisons the
// state so `migrate` tries to run a module that exports no up/down. Only a generated pair
// (name.ts + name.json) with the expected exports may be adopted.
const MIGRATIONS_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'migrations')
const sourcePath = join(MIGRATIONS_DIR, `${NAME}.ts`)

if (!existsSync(sourcePath) || !existsSync(join(MIGRATIONS_DIR, `${NAME}.json`))) {
  console.error(`not a migration: ${NAME} (needs both ${NAME}.ts and ${NAME}.json)`)
  process.exit(1)
}

const source = readFileSync(sourcePath, 'utf8')

if (!/export (async )?function up\b/.test(source)) {
  console.error(`not a migration: ${NAME}.ts exports no up() function`)
  process.exit(1)
}

const payload = await getPayload({ config })

const existing = await payload.find({
  collection: 'payload-migrations',
  where: { name: { equals: NAME } },
  limit: 1,
})

if (existing.totalDocs > 0) {
  console.log(`already recorded: ${NAME}`)
} else {
  const row = await payload.create({
    collection: 'payload-migrations',
    data: { name: NAME, batch: 1 } as never,
  })
  console.log(`recorded: ${row.name} (batch 1)`)
}

await payload.destroy()
process.exit(0)
