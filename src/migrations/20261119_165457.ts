import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`about\` ADD \`cv_id\` integer REFERENCES media(id);`)
  await db.run(sql`CREATE INDEX \`about_cv_idx\` ON \`about\` (\`cv_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_about\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`photo_id\` integer,
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`photo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new_about\`("id", "name", "photo_id", "updated_at", "created_at") SELECT "id", "name", "photo_id", "updated_at", "created_at" FROM \`about\`;`)
  await db.run(sql`DROP TABLE \`about\`;`)
  await db.run(sql`ALTER TABLE \`__new_about\` RENAME TO \`about\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`about_photo_idx\` ON \`about\` (\`photo_id\`);`)
}
