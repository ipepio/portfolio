import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-sqlite'

/**
 * `projects.longDescription` changed from `richText` to `textarea` (raw markdown).
 *
 * There is no DDL to run in either direction: Payload's SQLite adapter already stored that
 * localized field as `projects_locales.long_description text`, with the lexical document
 * serialized as JSON inside it, and the textarea field writes plain markdown into the very
 * same column. The dev push therefore reported "no schema changes detected", and this
 * migration exists so the semantic change still travels with a version and a recorded run
 * in `payload-migrations` — a deployment reads markdown from the column it already had.
 *
 * `up`/`down` stay empty on purpose: there is nothing to alter, and rewriting the column
 * would be the only way to "change" it.
 */
export async function up(_args: MigrateUpArgs): Promise<void> {
  // No schema change: see the note above.
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  // No schema change to undo: the previous field type used this same column.
}
