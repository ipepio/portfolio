import type { CollectionConfig } from 'payload'

export const Experience: CollectionConfig = {
  slug: 'experience',
  labels: {
    singular: 'Experiencia',
    plural: 'Experiencia',
  },
  admin: {
    useAsTitle: 'company',
  },
  defaultSort: '-startDate',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'company',
      type: 'text',
      required: true,
      label: 'Empresa',
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      label: 'Logo',
    },
    {
      name: 'role',
      type: 'text',
      localized: true,
      required: true,
      label: 'Puesto',
    },
    {
      name: 'startDate',
      type: 'date',
      required: true,
      label: 'Inicio',
      admin: {
        date: {
          pickerAppearance: 'monthOnly',
          displayFormat: 'MM/yyyy',
        },
      },
    },
    {
      name: 'endDate',
      type: 'date',
      label: 'Fin',
      admin: {
        description: 'Vacío si el puesto es actual.',
        date: {
          pickerAppearance: 'monthOnly',
          displayFormat: 'MM/yyyy',
        },
      },
    },
    {
      name: 'period',
      type: 'text',
      localized: true,
      label: 'Periodo',
      admin: {
        description:
          'Etiqueta del periodo tal como se muestra en la web (p. ej. "SEP 2025 — ACTUALIDAD"). Las fechas de arriba solo ordenan la colección.',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
      label: 'Descripción',
    },
    {
      name: 'location',
      type: 'text',
      localized: true,
      label: 'Localización',
    },
    {
      name: 'stack',
      type: 'array',
      labels: {
        singular: 'Tecnología',
        plural: 'Tecnologías',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          label: 'Nombre',
        },
      ],
    },
  ],
}
