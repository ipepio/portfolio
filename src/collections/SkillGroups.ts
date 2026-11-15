import type { CollectionConfig } from 'payload'

export const SkillGroups: CollectionConfig = {
  slug: 'skill-groups',
  labels: {
    singular: 'Grupo de skills',
    plural: 'Skills',
  },
  admin: {
    useAsTitle: 'title',
  },
  defaultSort: 'order',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'number',
      type: 'text',
      label: 'Número',
      admin: {
        description: 'Ej. 01',
      },
    },
    {
      name: 'label',
      type: 'text',
      label: 'Etiqueta corta',
      admin: {
        description: 'Ej. BACKEND',
      },
    },
    {
      name: 'title',
      type: 'text',
      localized: true,
      required: true,
      label: 'Título',
    },
    {
      name: 'icon',
      type: 'select',
      defaultValue: 'code',
      label: 'Icono',
      options: [
        { label: 'Código', value: 'code' },
        { label: 'Cloud', value: 'cloud' },
        { label: 'IA', value: 'ai' },
        { label: 'Seguridad', value: 'shield' },
        { label: 'Bases de datos', value: 'database' },
        { label: 'Enterprise', value: 'enterprise' },
        { label: 'Ingeniería', value: 'engineering' },
      ],
    },
    {
      name: 'items',
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
        {
          name: 'key',
          type: 'checkbox',
          label: 'Destacada',
          defaultValue: false,
        },
      ],
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
