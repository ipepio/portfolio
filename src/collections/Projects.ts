import type { CollectionConfig } from 'payload'

/**
 * The public detail page of a project, in the locale the admin is editing.
 *
 * Unlike the blog's articles this is the real, public URL: projects have no draft state and
 * their reads are public, so there is no token route and no draft mode. Payload lives in
 * this same application, so the page is addressed relatively and the admin's own origin
 * resolves it.
 *
 * A project without a slug yet (a new, unsaved entry) has nothing to open or iframe, so it
 * returns `null` and Payload renders neither the Preview action nor the live panel.
 */
function previewUrl({ slug, locale }: { slug: unknown; locale: unknown }): string | null {
  if (typeof slug !== 'string' || slug.trim().length === 0) return null

  const language = typeof locale === 'string' && locale.length > 0 ? locale : 'es'

  return `/${language}/projects/${slug.trim()}`
}

export const Projects: CollectionConfig = {
  slug: 'projects',
  labels: {
    singular: 'Proyecto',
    plural: 'Proyectos',
  },
  admin: {
    useAsTitle: 'title',
    // The Preview action opens the public page in a new tab; the live preview panel iframes
    // the same URL and re-renders it from every message the admin posts while the editor
    // types (see `components/site/project-detail-live.tsx`).
    preview: (doc, { locale }) => previewUrl({ slug: doc.slug, locale }),
    livePreview: {
      url: ({ data, locale }) => previewUrl({ slug: data?.slug, locale }),
    },
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
      type: 'textarea',
      localized: true,
      label: 'Descripción larga',
      admin: {
        description:
          'Markdown en crudo: lo que escribes es lo que se guarda. Admite encabezados (##, ###), listas, énfasis, enlaces, citas y bloques de código con ```. Un bloque de código abierto con ```mermaid se renderiza como diagrama en la página del proyecto.',
      },
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Imagen de cabecera',
    },
    {
      name: 'visual',
      type: 'select',
      required: true,
      defaultValue: 'code-stack',
      label: 'Diagrama (sin imagen de cabecera)',
      options: [
        { label: 'Code stack', value: 'code-stack' },
        { label: 'Agent orbit', value: 'agent-orbit' },
        { label: 'Mock shell', value: 'mock-shell' },
        { label: 'Echo ring', value: 'echo-ring' },
        { label: 'Service map', value: 'svc-map' },
        { label: 'Chat lines', value: 'chat-lines' },
      ],
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
