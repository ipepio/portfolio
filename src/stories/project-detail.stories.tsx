import type { Meta, StoryObj } from '@storybook/nextjs'

import { ProjectDetail, type ProjectDetailItem } from '@/components/site/project-detail'
import type { ProjectDetailLabels } from '@/lib/i18n'

const meta = {
  title: 'Site/ProjectDetail',
  component: ProjectDetail,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof ProjectDetail>

export default meta

type Story = StoryObj<typeof meta>

const labels: ProjectDetailLabels = {
  backToProjects: 'Volver a proyectos',
  viewLive: 'Ver en producción',
  repository: 'Repositorio',
  imageAltPrefix: 'Imagen de',
  statusLabels: {
    live: 'En producción',
    wip: 'En desarrollo',
    archived: 'Archivado',
  },
}

/**
 * The seeded `ai-governor` document as Payload returns it at `depth: 1`:
 * `coverImage: null` (decorative fallback panel), `liveUrl` empty, and
 * `longDescription` empty — so the lead paragraph is repeated as the body.
 */
const aiGovernor: ProjectDetailItem = {
  id: 1,
  title: 'AI Governor',
  slug: 'ai-governor',
  shortDescription:
    'Gateway OpenAI-compatible para gobernar acceso a modelos, cuotas, presupuestos y rate limits con trazabilidad por usuario y organización.',
  longDescription: null,
  coverImage: null,
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
  },
}

/**
 * Same project with a stored lexical editor state (two plain paragraphs, the
 * shape produced by the configured `richText` editor), so the official Payload
 * `RichText` renderer replaces the fallback body.
 */
export const WithRichText: Story = {
  args: {
    project: {
      ...aiGovernor,
      longDescription: {
        root: {
          type: 'root',
          format: '',
          indent: 0,
          version: 1,
          direction: 'ltr',
          children: [
            {
              type: 'paragraph',
              version: 1,
              format: '',
              indent: 0,
              direction: 'ltr',
              textFormat: 0,
              children: [
                {
                  type: 'text',
                  text: 'AI Governor acts as a single control plane in front of every model provider: one OpenAI-compatible endpoint, per-user and per-organization quotas, budgets and rate limits, and a full audit trail of who consumed what.',
                  version: 1,
                  format: 0,
                  detail: 0,
                  mode: 'normal',
                  style: '',
                },
              ],
            },
            {
              type: 'paragraph',
              version: 1,
              format: '',
              indent: 0,
              direction: 'ltr',
              textFormat: 0,
              children: [
                {
                  type: 'text',
                  text: 'It runs next to the existing stack, so teams keep their current SDKs and tooling while governance moves from convention to enforced policy.',
                  version: 1,
                  format: 0,
                  detail: 0,
                  mode: 'normal',
                  style: '',
                },
              ],
            },
          ],
        },
      },
    },
    locale: 'es',
    labels,
  },
}
