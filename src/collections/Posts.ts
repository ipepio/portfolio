import type { CollectionAfterChangeHook, CollectionConfig } from 'payload'

import type { Post } from '../payload-types'
import type { RichTextDocument, TranslationLocale } from '../lib/translation'
import { hashOf, translateBatch, translateRichText, translationConfig } from '../lib/translation'

/** Plain-text fields the translator fills, in the order their strings are batched. */
const TRANSLATED_FIELDS = ['title', 'subtitle', 'excerpt', 'category'] as const

/** Last text this hook wrote, per field and target locale; a field absent here is human-owned. */
type TranslationState = Partial<Record<string, Partial<Record<TranslationLocale, string>>>>

/** The subset of a post document this hook reads, independent of the generated types. */
type TranslationDoc = {
  title?: unknown
  subtitle?: unknown
  excerpt?: unknown
  category?: unknown
  body?: unknown
  translationState?: TranslationState | null
}

const isEmptyText = (value: unknown): boolean =>
  value === null || value === undefined || (typeof value === 'string' && value.trim() === '')

const isEmptyRichText = (value: unknown): boolean => {
  const root = (value as RichTextDocument | null | undefined)?.root
  return !root || !Array.isArray(root.children) || root.children.length === 0
}

/**
 * Builds the write for the target locale: which fields are still machine-owned, their
 * translations and the hashes to remember. Returns `null` when there is nothing to write.
 */
async function buildTranslation(
  sourceDoc: TranslationDoc,
  targetDoc: TranslationDoc,
  source: TranslationLocale,
  target: TranslationLocale,
): Promise<{ data: Record<string, unknown>; hashes: TranslationState } | null> {
  const state: TranslationState = structuredClone(targetDoc.translationState ?? {})

  /** A field is machine-owned while it is empty or still hashes to what we last wrote. */
  const isMachineOwned = (field: string, current: unknown): boolean => {
    if (isEmptyText(current)) return true
    const lastWritten = state[field]?.[target]
    return lastWritten !== undefined && hashOf(current) === lastWritten
  }

  const data: Record<string, unknown> = {}
  const hashes: TranslationState = structuredClone(state)

  const pending = TRANSLATED_FIELDS.filter(
    (field) => !isEmptyText(sourceDoc[field]) && isMachineOwned(field, targetDoc[field]),
  )

  if (pending.length > 0) {
    const translations = await translateBatch(
      pending.map((field) => sourceDoc[field] as string),
      source,
      target,
    )

    for (const [index, field] of pending.entries()) {
      const translated = translations[index]
      if (translated === targetDoc[field]) continue
      data[field] = translated
      hashes[field] = { ...hashes[field], [target]: hashOf(translated) }
    }
  }

  if (!isEmptyRichText(sourceDoc.body) && isMachineOwned('body', targetDoc.body)) {
    const translatedBody = await translateRichText(
      sourceDoc.body as RichTextDocument,
      source,
      target,
    )
    // A body with no prose comes back byte-identical; there is nothing worth writing.
    if (hashOf(translatedBody) !== hashOf(targetDoc.body)) {
      data.body = translatedBody
      hashes.body = { ...hashes.body, [target]: hashOf(translatedBody) }
    }
  }

  return Object.keys(data).length === 0 ? null : { data, hashes }
}

/**
 * Copies the source locale into the other one after every save. It is deliberately
 * conservative: a target field is written only when it is still empty or still exactly
 * the text this hook produced last time (compared by hash), so a human correction is
 * never overwritten. Any failure is logged and swallowed — a translation is never a
 * reason for a save to fail, and a partially translated document is never written
 * because every translation is collected before the single update runs.
 */
const translatePost: CollectionAfterChangeHook = async ({ doc, req }) => {
  // The hook's own write re-enters this hook; the context flag is what stops the loop.
  if (req.context?.skipTranslation === true) return doc

  // No translator configured: this is the normal state of a local environment.
  if (!translationConfig()) return doc

  const source: TranslationLocale = req.locale === 'en' ? 'en' : 'es'
  const target: TranslationLocale = source === 'en' ? 'es' : 'en'
  const id = doc.id

  try {
    // `fallbackLocale: 'none'` matters: with the default fallback an empty English field
    // would read back as its Spanish text and look like a human edit. `req` keeps both
    // reads and the write inside the transaction of the save that triggered them.
    const readOptions = {
      collection: 'posts' as const,
      depth: 0 as const,
      fallbackLocale: 'none' as const,
      id,
      req,
    }

    // SAFETY: the generated Post type describes the whole document while these reads only
    // need the five localized fields, so they are read through the hook's own narrow shape.
    const sourceDoc = (await req.payload.findByID({
      ...readOptions,
      locale: source,
    })) as unknown as TranslationDoc
    // SAFETY: same narrow shape as the source read; the two reads differ only by locale.
    const targetDoc = (await req.payload.findByID({
      ...readOptions,
      locale: target,
    })) as unknown as TranslationDoc

    const update = await buildTranslation(sourceDoc, targetDoc, source, target)
    if (!update) return doc

    await req.payload.update({
      collection: 'posts',
      id,
      locale: target,
      // SAFETY: `translationState` only exists in the generated Post type after the next
      // `payload generate:types` run; the runtime accepts it as a plain JSON field.
      data: { ...update.data, translationState: update.hashes } as unknown as Partial<Post>,
      // Without the flag the update above would trigger this same hook again.
      context: { skipTranslation: true },
      req,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    req.payload.logger.warn(`[translation] post ${String(id)} not translated: ${message}`)
  }

  return doc
}

/**
 * Blog entries. Every text the archive, the article page and the metadata render is
 * localized; the structural data (slug, cover, reading time, dates, state) is shared by
 * both locales because it describes the note itself, not its wording.
 */
export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: {
    singular: 'Artículo',
    plural: 'Artículos',
  },
  admin: {
    useAsTitle: 'title',
  },
  defaultSort: '-publishedAt',
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [translatePost],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      localized: true,
      required: true,
      label: 'Título',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      label: 'Slug',
      admin: {
        description: 'Parte de la URL del artículo (por ejemplo, «agentes-no-son-chatbots»).',
      },
    },
    {
      name: 'subtitle',
      type: 'text',
      localized: true,
      label: 'Subtítulo',
    },
    {
      name: 'excerpt',
      type: 'textarea',
      localized: true,
      required: true,
      label: 'Extracto',
      admin: {
        description: 'Resumen que muestra la tarjeta del archivo.',
      },
    },
    {
      name: 'body',
      type: 'richText',
      localized: true,
      label: 'Cuerpo',
    },
    {
      name: 'cover',
      type: 'upload',
      relationTo: 'media',
      label: 'Imagen de cabecera',
    },
    {
      name: 'category',
      type: 'text',
      localized: true,
      label: 'Categoría',
    },
    {
      name: 'readMinutes',
      type: 'number',
      label: 'Minutos de lectura',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
      label: 'Fecha de publicación',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      label: 'Estado',
      options: [
        { label: 'Borrador', value: 'draft' },
        { label: 'Publicado', value: 'published' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      label: 'Destacado',
      admin: {
        description: 'Solo un artículo debería estar destacado; no se valida en código.',
        position: 'sidebar',
      },
    },
    {
      name: 'translationState',
      type: 'json',
      label: 'Estado de traducción',
      admin: {
        hidden: true,
        description: 'Hash de la última traducción automática por campo e idioma.',
      },
    },
  ],
}
