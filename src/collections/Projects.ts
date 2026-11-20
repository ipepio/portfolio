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
      name: 'card',
      type: 'group',
      label: 'Tarjeta',
      admin: {
        description:
          'El rótulo del visual en la tarjeta del archivo. El número «001» no se escribe aquí: sale del orden del archivo. Lo que dejes vacío cae en el texto del tipo de visual, así que una tarjeta nunca se queda sin cabecera.',
      },
      fields: [
        {
          name: 'category',
          type: 'text',
          localized: true,
          label: 'Categoría',
          admin: {
            description:
              'La palabra que sigue al número, por ejemplo «INFRASTRUCTURE». Vacío: se usa la del tipo de visual, que es la misma para todos los proyectos con ese diagrama.',
          },
        },
        {
          name: 'tag',
          type: 'text',
          localized: true,
          label: 'Rótulo',
          admin: {
            description:
              'El texto acentuado de la derecha, por ejemplo «POLICY ENGINE». Vacío: se usa el del tipo de visual.',
          },
        },
      ],
    },
    {
      name: 'hero',
      type: 'group',
      label: 'Cabecera',
      admin: {
        description:
          'La cabecera es la parte de arriba de la página del proyecto. Todo lo de este grupo es opcional: lo que dejes vacío cae en su respaldo y la página no se rompe.',
      },
      fields: [
        {
          name: 'heroLayout',
          type: 'select',
          defaultValue: 'split',
          label: 'Disposición de la cabecera',
          options: [
            { label: 'Dos columnas (la referencia)', value: 'split' },
            { label: 'Una columna (como antes)', value: 'stacked' },
          ],
          admin: {
            description:
              '«Dos columnas» pone el antetítulo, el título, la entradilla y las píldoras a la izquierda y la imagen o el diagrama a la derecha; en pantallas pequeñas se apila sola. «Una columna» mantiene la cabecera de siempre y no pinta el antetítulo, la entradilla ni las píldoras.',
          },
        },
        {
          name: 'heroEyebrow',
          type: 'text',
          localized: true,
          label: 'Antetítulo',
          admin: {
            description:
              'Línea mono que acompaña al índice de la cabecera, por ejemplo «AI INFRASTRUCTURE / MCP». El índice «01 / 07» no se escribe aquí: se calcula con el orden del archivo y el número de proyectos publicados. Si lo dejas vacío, la cabecera muestra solo el índice.',
          },
        },
        {
          name: 'heroLead',
          type: 'textarea',
          localized: true,
          label: 'Entradilla de la cabecera',
          admin: {
            description:
              'Markdown en crudo, igual que la descripción larga: admite énfasis, enlaces y saltos de línea (una línea en blanco separa párrafos). Si lo dejas vacío, la cabecera pinta la descripción corta en texto plano; la descripción corta sigue siendo la que se ve en las tarjetas del archivo.',
          },
        },
        {
          name: 'cardLabel',
          type: 'text',
          label: 'Etiqueta de la tarjeta',
          admin: {
            description:
              'Ruta que se pinta en la esquina de la imagen o del diagrama, por ejemplo «ipepio / projects / discord». Solo se ve con «Mostrar etiqueta de la tarjeta» marcado.',
          },
        },
        {
          name: 'showCardLabel',
          type: 'checkbox',
          defaultValue: false,
          label: 'Mostrar etiqueta de la tarjeta',
          admin: {
            description:
              'Apagado por defecto, para que los proyectos que ya existen no estrenen etiqueta. Marcado y con «Etiqueta de la tarjeta» escrita, la cabecera la pinta sobre la imagen.',
          },
        },
      ],
    },
    {
      name: 'longDescription',
      type: 'textarea',
      localized: true,
      label: 'Descripción larga',
      admin: {
        description:
          'Markdown en crudo: lo que escribes es lo que se guarda. Admite encabezados (##, ###), listas, énfasis, enlaces, citas y bloques de código con ```. Un bloque de código abierto con ```mermaid se renderiza como diagrama en la página del proyecto, y cada encabezado ## añade una entrada al índice «En esta página». ' +
          'Para cajitas de aviso, cita una línea con el marcador: «> [!NOTE] Título» deja una nota neutra, «> [!DECISION] Título» una decisión numerada (01, 02… en orden de aparición) y «> [!WARNING] Título» un aviso en tono de advertencia. Las líneas siguientes, también citadas con «>», son el cuerpo de la cajita (listas, código o diagramas incluidos); una cita normal, sin marcador, mantiene su estilo discreto.',
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
