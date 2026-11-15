import type { CollectionConfig } from 'payload'

export const Projects: CollectionConfig = {
  slug: 'projects',
  labels: {
    singular: 'Proyecto',
    plural: 'Proyectos',
  },
  admin: {
    useAsTitle: 'title',
  },
  defaultSort: '-year',
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
    },
    {
      name: 'shortDescription',
      type: 'textarea',
      localized: true,
      label: 'Descripción corta',
    },
    {
      name: 'longDescription',
      type: 'richText',
      localized: true,
      label: 'Descripción larga',
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Imagen de cabecera',
    },
    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
      label: 'Tags',
    },
    {
      name: 'liveUrl',
      type: 'text',
      label: 'URL en producción',
    },
    {
      name: 'githubUrl',
      type: 'text',
      label: 'Repositorio GitHub',
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'live',
      label: 'Estado',
      options: [
        { label: 'En producción', value: 'live' },
        { label: 'En desarrollo', value: 'wip' },
        { label: 'Archivado', value: 'archived' },
      ],
    },
    {
      name: 'year',
      type: 'number',
      label: 'Año',
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      label: 'Destacado',
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      label: 'Orden',
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
