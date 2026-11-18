import type { GlobalConfig } from 'payload'

/**
 * The "what I do" block: the capabilities list and the two tool belts under it.
 *
 * It is a global rather than a collection because the portfolio renders exactly one
 * of these, the same way it renders one About and one Contact. The capabilities also
 * feed the orbit in the About section, so this is the single source of truth for both.
 */
export const Expertise: GlobalConfig = {
  slug: 'expertise',
  label: 'Lo que hago',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'capabilities',
      type: 'array',
      required: true,
      labels: {
        singular: 'Capacidad',
        plural: 'Capacidades',
      },
      admin: {
        description:
          'Una entrada por capacidad. El orden de esta lista es el orden en pantalla y el de los nodos de la órbita de "Sobre mí".',
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
          name: 'description',
          type: 'textarea',
          localized: true,
          required: true,
          label: 'Descripción',
        },
        {
          name: 'scene',
          type: 'select',
          defaultValue: 'backend',
          required: true,
          label: 'Escena de la órbita',
          admin: {
            description: 'Diagrama que dibuja este nodo cuando se abre en la órbita de "Sobre mí".',
          },
          options: [
            { label: 'Backend / servicios', value: 'backend' },
            { label: 'Cloud', value: 'cloud' },
            { label: 'IA', value: 'ai' },
            { label: 'Calidad', value: 'quality' },
            { label: 'Datos', value: 'data' },
            { label: 'Enterprise', value: 'enterprise' },
            { label: 'Ingeniería', value: 'engineering' },
          ],
        },
      ],
    },
    {
      name: 'coreTools',
      type: 'array',
      labels: {
        singular: 'Herramienta core',
        plural: 'Herramientas core',
      },
      admin: {
        description: 'Las herramientas con las que más te identificas; se destacan sobre el resto.',
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
    {
      name: 'extendedTools',
      type: 'array',
      labels: {
        singular: 'Herramienta extendida',
        plural: 'Herramientas extendidas',
      },
      admin: {
        description: 'Las que también están presentes en tu trabajo y proyectos.',
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
