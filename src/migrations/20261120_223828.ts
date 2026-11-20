import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`projects_hero_badges\`;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
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
}
