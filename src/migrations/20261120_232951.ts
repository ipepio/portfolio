import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`projects_locales\` ADD \`card_category\` text;`)
  await db.run(sql`ALTER TABLE \`projects_locales\` ADD \`card_tag\` text;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`projects_locales\` DROP COLUMN \`card_category\`;`)
  await db.run(sql`ALTER TABLE \`projects_locales\` DROP COLUMN \`card_tag\`;`)
}
