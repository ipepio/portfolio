/**
 * One-off: mark an existing migration as already applied on a database whose schema was
 * created by Payload's dev push. Payload records an applied migration as one row in
 * `payload-migrations`, and exposes no CLI command for adopting one, so this writes that
 * row through the Local API — the same write `runMigrationFile` performs afterwards.
 */
import { getPayload } from 'payload'

import config from '../src/payload.config'

const NAME = process.argv[2]

if (!NAME) {
  console.error('usage: tsx scripts/adopt-migration.ts <migration-name>')
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
