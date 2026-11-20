import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`projects_hero_badges\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`projects\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`projects_hero_badges_order_idx\` ON \`projects_hero_badges\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`projects_hero_badges_parent_id_idx\` ON \`projects_hero_badges\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`projects_hero_badges_locale_idx\` ON \`projects_hero_badges\` (\`_locale\`);`)
  await db.run(sql`ALTER TABLE \`projects\` ADD \`hero_hero_layout\` text DEFAULT 'split';`)
  await db.run(sql`ALTER TABLE \`projects\` ADD \`hero_card_label\` text;`)
  await db.run(sql`ALTER TABLE \`projects\` ADD \`hero_show_card_label\` integer DEFAULT false;`)
  await db.run(sql`ALTER TABLE \`projects_locales\` ADD \`hero_hero_eyebrow\` text;`)
  await db.run(sql`ALTER TABLE \`projects_locales\` ADD \`hero_hero_lead\` text;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`projects_hero_badges\`;`)
  await db.run(sql`ALTER TABLE \`projects\` DROP COLUMN \`hero_hero_layout\`;`)
  await db.run(sql`ALTER TABLE \`projects\` DROP COLUMN \`hero_card_label\`;`)
  await db.run(sql`ALTER TABLE \`projects\` DROP COLUMN \`hero_show_card_label\`;`)
  await db.run(sql`ALTER TABLE \`projects_locales\` DROP COLUMN \`hero_hero_eyebrow\`;`)
  await db.run(sql`ALTER TABLE \`projects_locales\` DROP COLUMN \`hero_hero_lead\`;`)
}
