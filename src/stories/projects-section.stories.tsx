import type { Meta, StoryObj } from '@storybook/nextjs'

import { ProjectsSection } from '@/components/site/projects-section'
import { getDictionary } from '@/lib/i18n'
import { LocaleProvider } from '@/lib/locale-context'

const meta = {
  title: 'Site/ProjectsSection',
  component: ProjectsSection,
  parameters: { layout: 'fullscreen' },
  // The grid reads the locale and its chrome from context, so the story publishes both.
  decorators: [
    (Story) => (
      <LocaleProvider locale="es" dict={getDictionary('es')}>
        <Story />
      </LocaleProvider>
    ),
  ],
} satisfies Meta<typeof ProjectsSection>

export default meta

type Story = StoryObj<typeof meta>

/**
 * The six seeded projects as Payload returns them at `depth: 1`: tags and
 * `visual` populated, `coverImage: null` and `year: null` for all of them, so
 * every card exercises one of the six decorative diagrams.
 */
export const Default: Story = {
  args: {
    copy: getDictionary('es').projects,
    projects: [
      {
        id: 1,
        title: 'AI Governor',
        visual: 'code-stack',
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
        visual: 'agent-orbit',
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
        visual: 'mock-shell',
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
        visual: 'echo-ring',
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
        visual: 'svc-map',
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
        visual: 'chat-lines',
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
