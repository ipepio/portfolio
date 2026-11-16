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
      name: 'sectionEyebrow',
      type: 'text',
      localized: true,
      label: 'Eyebrow de la sección',
      admin: {
        description: 'Ej. 01 / ENFOQUE',
      },
    },
    {
      name: 'sectionHeading',
      type: 'text',
      localized: true,
      label: 'Título de la sección',
    },
    {
      name: 'sectionHeadingAccent',
      type: 'text',
      localized: true,
      label: 'Título (parte en color)',
      admin: {
        description: 'Se pinta en lima y se añade tras el título.',
      },
    },
    {
      name: 'heroLines',
      type: 'array',
      label: 'Líneas del hero',
      maxRows: 3,
      labels: {
        singular: 'Línea',
        plural: 'Líneas',
      },
      fields: [
        {
          name: 'text',
          type: 'text',
          localized: true,
          required: true,
          label: 'Texto',
        },
        {
          name: 'style',
          type: 'select',
          label: 'Estilo',
          defaultValue: 'plain',
          options: [
            { label: 'Normal', value: 'plain' },
            { label: 'Contorno', value: 'outlined' },
            { label: 'Acento (lima)', value: 'accent' },
          ],
        },
      ],
    },
    {
      name: 'heroIntro',
      type: 'richText',
      localized: true,
      label: 'Intro del hero',
    },
    {
      name: 'heroMeta',
      type: 'array',
      label: 'Meta del hero',
      labels: {
        singular: 'Etiqueta',
        plural: 'Etiquetas',
      },
      fields: [
        {
          name: 'text',
          type: 'text',
          localized: true,
          required: true,
          label: 'Texto',
        },
      ],
    },
    {
      name: 'stats',
      type: 'array',
      label: 'Estadísticas',
      labels: {
        singular: 'Estadística',
        plural: 'Estadísticas',
      },
      fields: [
        {
          name: 'value',
          type: 'text',
          required: true,
          label: 'Valor',
          admin: {
            description: 'Ej. 8+',
          },
        },
        {
          name: 'label',
          type: 'text',
          localized: true,
          required: true,
          label: 'Etiqueta',
        },
      ],
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
