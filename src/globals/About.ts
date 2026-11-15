import type { GlobalConfig } from 'payload'

export const About: GlobalConfig = {
  slug: 'about',
  label: 'Sobre mí',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Nombre',
    },
    {
      name: 'role',
      type: 'text',
      localized: true,
      label: 'Rol',
    },
    {
      name: 'availability',
      type: 'text',
      localized: true,
      label: 'Disponibilidad',
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      label: 'Foto',
    },
    {
      name: 'location',
      type: 'text',
      localized: true,
      label: 'Localización',
    },
    {
      name: 'bio',
      type: 'richText',
      localized: true,
      label: 'Biografía',
    },
    {
      name: 'principles',
      type: 'array',
      labels: {
        singular: 'Principio',
        plural: 'Principios',
      },
      fields: [
        {
          name: 'index',
          type: 'text',
          label: 'Índice',
          admin: {
            description: 'Ej. 01 — ARCHITECTURE',
          },
        },
        {
          name: 'title',
          type: 'text',
          localized: true,
          label: 'Título',
        },
        {
          name: 'body',
          type: 'textarea',
          localized: true,
          label: 'Descripción',
        },
      ],
    },
    {
      name: 'education',
      type: 'array',
      labels: {
        singular: 'Formación',
        plural: 'Formación',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          localized: true,
          label: 'Título',
        },
        {
          name: 'institution',
          type: 'text',
          label: 'Institución',
        },
        {
          name: 'note',
          type: 'text',
          localized: true,
          label: 'Nota',
        },
      ],
    },
    {
      name: 'languages',
      type: 'array',
      labels: {
        singular: 'Idioma',
        plural: 'Idiomas',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          label: 'Idioma',
        },
        {
          name: 'level',
          type: 'text',
          label: 'Nivel',
        },
      ],
    },
  ],
}
