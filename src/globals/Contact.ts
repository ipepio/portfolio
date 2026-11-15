import type { GlobalConfig } from 'payload'

export const Contact: GlobalConfig = {
  slug: 'contact',
  label: 'Contacto',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      label: 'Email',
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Teléfono',
    },
    {
      name: 'socials',
      type: 'array',
      labels: {
        singular: 'Red social',
        plural: 'Redes sociales',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          label: 'Nombre',
          admin: {
            description: 'Ej. GitHub',
          },
        },
        {
          name: 'url',
          type: 'text',
          required: true,
          label: 'URL',
        },
      ],
    },
  ],
}
