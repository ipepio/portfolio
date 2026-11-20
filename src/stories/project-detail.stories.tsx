import type { Meta, StoryObj } from '@storybook/nextjs'

import { ProjectDetail, type ProjectDetailItem } from '@/components/site/project-detail'
import { getDictionary, type ProjectDetailLabels } from '@/lib/i18n'

const meta = {
  title: 'Site/ProjectDetail',
  component: ProjectDetail,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof ProjectDetail>

export default meta

type Story = StoryObj<typeof meta>

/**
 * Derived from the real dictionary instead of typed out here: the detail labels grew with the
 * case-page work once already, and a hand-kept copy silently falls behind the type.
 */
const dict = getDictionary('es')

const labels: ProjectDetailLabels = {
  ...dict.projects.detail,
  imageAltPrefix: dict.projects.gridLabels.imageAltPrefix,
  statusLabels: dict.projects.statusLabels,
}

/**
 * The seeded `ai-governor` document as Payload returns it at `depth: 1`:
 * `coverImage: null` (so the `code-stack` diagram renders), `liveUrl` empty,
 * and `longDescription` empty — so the lead paragraph is repeated as the body.
 */
const aiGovernor: ProjectDetailItem = {
  id: 1,
  title: 'AI Governor',
  slug: 'ai-governor',
  shortDescription:
    'Gateway OpenAI-compatible para gobernar acceso a modelos, cuotas, presupuestos y rate limits con trazabilidad por usuario y organización.',
  longDescription: null,
  coverImage: null,
  visual: 'code-stack',
  tags: [
    { id: 1, name: 'IA / Agentes' },
    { id: 2, name: 'Plataforma' },
  ],
  liveUrl: null,
  githubUrl: 'https://github.com/ipepio/ai-governor',
  status: 'wip',
  year: 2026,
  order: 1,
}

export const Default: Story = {
  args: {
    project: aiGovernor,
    locale: 'es',
    labels,
    archiveIndex: { position: 1, total: 7 },
  },
}

/**
 * Same project with a stored markdown body (two paragraphs, the shape the `textarea`
 * field now holds), so the markdown renderer replaces the fallback body.
 */
export const WithMarkdown: Story = {
  args: {
    project: {
      ...aiGovernor,
      longDescription: [
        'AI Governor acts as a single control plane in front of every model provider: one **OpenAI-compatible endpoint**, per-user and per-organization quotas, budgets and rate limits, and a full audit trail of who consumed what.',
        '',
        'It runs next to the existing stack, so teams keep their current SDKs and tooling while governance moves from convention to enforced policy.',
      ].join('\n'),
    },
    locale: 'es',
    labels,
    archiveIndex: { position: 1, total: 7 },
  },
}

/**
 * The split hero with every optional piece filled (T2/T3: S2-S5): an eyebrow beside the
 * derived index, a markdown lead with emphasis and a link, the badge pill and the card
 * label on the visual's corner.
 */
export const SplitHeroWithContent: Story = {
  args: {
    project: {
      ...aiGovernor,
      hero: {
        heroLayout: 'split',
        heroEyebrow: 'AI INFRASTRUCTURE / MCP',
        heroLead:
          'Un **plano de control** único delante de cada proveedor de modelos, con cuotas y presupuesto por usuario.\n\nEl detalle técnico vive en [el repositorio](https://github.com/ipepio/ai-governor).',
        cardLabel: 'ipepio / projects / ai-governor',
        showCardLabel: true,
      },
    },
    locale: 'es',
    labels,
    archiveIndex: { position: 2, total: 7 },
  },
}

/** `heroLayout: 'stacked'`: the page's original one-column hero, untouched by the hero fields. */
export const StackedHero: Story = {
  args: {
    project: {
      ...aiGovernor,
      hero: {
        heroLayout: 'stacked',
        heroEyebrow: 'AI INFRASTRUCTURE / MCP',
        heroLead: 'Una entradilla que la cabecera apilada no pinta.',
        cardLabel: 'ipepio / projects / ai-governor',
        showCardLabel: true,
      },
    },
    locale: 'es',
    labels,
    archiveIndex: { position: 2, total: 7 },
  },
}
