import type { CollectionConfig } from 'payload'

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
  ],
}
