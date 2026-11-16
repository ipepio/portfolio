import type { Meta, StoryObj } from '@storybook/nextjs'

import { ProjectsSection } from '@/components/site/projects-section'

const meta = {
  title: 'Site/ProjectsSection',
  component: ProjectsSection,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof ProjectsSection>

export default meta

type Story = StoryObj<typeof meta>

/**
 * The six seeded projects as Payload returns them at `depth: 1`: tags populated,
 * `coverImage: null` and `year: null` for all of them, so every card exercises
 * the decorative no-image fallback.
 */
export const Default: Story = {
  args: {
    allLabel: 'Todos',
    locale: 'es',
    statusLabels: {
      live: 'En producción',
      wip: 'En desarrollo',
      archived: 'Archivado',
    },
    gridLabels: {
      filterGroup: 'Filtrar proyectos',
      countOne: 'proyecto',
      countOther: 'proyectos',
      imageAltPrefix: 'Imagen de',
      openPrefix: 'Abrir',
    },
    eyebrow: '02 / PROYECTOS SELECCIONADOS',
    heading: 'Ideas que se convierten en sistemas.',
    note: 'Una mezcla de productos propios, investigación aplicada y arquitectura profesional. Algunos están en desarrollo o son privados.',
    projects: [
      {
        id: 1,
        title: 'AI Governor',
        slug: 'ai-governor',
        shortDescription:
          'Gateway OpenAI-compatible para gobernar acceso a modelos, cuotas, presupuestos y rate limits con trazabilidad por usuario y organización.',
        coverImage: null,
        tags: [
          { id: 1, name: 'IA / Agentes' },
          { id: 2, name: 'Plataforma' },
        ],
        status: 'wip',
        year: null,
        order: 1,
      },
      {
        id: 2,
        title: 'pi-hub',
        slug: 'pi-hub',
        shortDescription:
          'Entorno de orquestación para agentes de IA, herramientas y sesiones persistentes. Una base ligera para construir flujos de trabajo propios.',
        coverImage: null,
        tags: [
          { id: 1, name: 'IA / Agentes' },
          { id: 3, name: 'Producto' },
        ],
        githubUrl: 'https://github.com/ipepio/pi-hub',
        status: 'live',
        year: null,
        order: 2,
      },
      {
        id: 3,
        title: 'Nabla',
        slug: 'nabla',
        shortDescription:
          'Un harness de IA de escritorio con enfoque local-first: experiencia nativa, runtime de agentes y una interfaz que prioriza claridad y velocidad.',
        coverImage: null,
        tags: [
          { id: 1, name: 'IA / Agentes' },
          { id: 3, name: 'Producto' },
        ],
        status: 'wip',
        year: null,
        order: 3,
      },
      {
        id: 4,
        title: 'ECHO',
        slug: 'echo',
        shortDescription:
          'Concepto de asistente personal privado, con interacción por voz, STT/TTS y herramientas conectadas a servicios propios.',
        coverImage: null,
        tags: [
          { id: 1, name: 'IA / Agentes' },
          { id: 3, name: 'Producto' },
        ],
        status: 'wip',
        year: null,
        order: 4,
      },
      {
        id: 5,
        title: 'Platform Modernization',
        slug: 'platform-modernization',
        shortDescription:
          'Evolución de plataformas hacia servicios desacoplados, dominios claros, despliegues reproducibles y operativa cloud automatizada.',
        coverImage: null,
        tags: [{ id: 2, name: 'Plataforma' }],
        status: 'live',
        year: null,
        order: 5,
      },
      {
        id: 6,
        title: 'Discord Hub',
        slug: 'discord-hub',
        shortDescription:
          'Ingesta, indexación y recuperación de conocimiento de Discord para que agentes y herramientas puedan trabajar con contexto y permisos.',
        coverImage: null,
        tags: [
          { id: 1, name: 'IA / Agentes' },
          { id: 2, name: 'Plataforma' },
        ],
        status: 'wip',
        year: null,
        order: 6,
      },
    ],
  },
}
