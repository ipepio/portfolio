import type { Meta, StoryObj } from '@storybook/nextjs'

import { ExperienceSection } from '@/components/site/experience-section'
import { experienceSeeds } from '@/seed/content'

const meta = {
  title: 'Site/ExperienceSection',
  component: ExperienceSection,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof ExperienceSection>

export default meta

type Story = StoryObj<typeof meta>

/**
 * The seeded career timeline as Payload returns it (Spanish): the sticky intro column
 * with the `2017 →` stat on the left and the five roles on the right, the first one
 * marked as current. Tags, role, period and description all come from `experienceSeeds`.
 */
export const Default: Story = {
  args: {
    eyebrow: '04 / TRAYECTORIA',
    heading: 'Del código\nal',
    headingAccent: 'liderazgo.',
    intro:
      'He pasado de construir aplicaciones a liderar equipos y definir la arquitectura de plataformas completas, sin alejarme de la ingeniería.',
    statLabel: 'Ingeniería de software, arquitectura y dirección técnica',
    currentLabel: 'ACTUAL',
    experiences: experienceSeeds.map((seed, index) => ({
      id: index + 1,
      company: seed.company,
      role: seed.role.es,
      period: seed.period.es,
      description: seed.description.es,
      startDate: seed.startDate,
      endDate: seed.endDate,
      location: null,
      logo: null,
      stack: seed.tags.map((name) => ({ id: `${seed.company}-${name}`, name })),
      updatedAt: '2025-09-01T00:00:00.000Z',
      createdAt: '2025-09-01T00:00:00.000Z',
    })),
  },
}

/** The English dictionary: same layout, translated copy. */
export const English: Story = {
  args: {
    ...Default.args,
    eyebrow: '04 / TRACK RECORD',
    heading: 'From code\nto',
    headingAccent: 'leadership.',
    intro:
      'I have gone from building applications to leading teams and designing entire platforms, while staying close to engineering.',
    statLabel: 'Software engineering, architecture and technical leadership',
    currentLabel: 'CURRENT',
    experiences: experienceSeeds.map((seed, index) => ({
      id: index + 1,
      company: seed.company,
      role: seed.role.en,
      period: seed.period.en,
      description: seed.description.en,
      startDate: seed.startDate,
      endDate: seed.endDate,
      location: null,
      logo: null,
      stack: seed.tags.map((name) => ({ id: `${seed.company}-${name}`, name })),
      updatedAt: '2025-09-01T00:00:00.000Z',
      createdAt: '2025-09-01T00:00:00.000Z',
    })),
  },
}

/**
 * Empty collection: the section returns `null`, so the story canvas renders nothing at
 * all. Proving it means `canvasElement.querySelector('section') === null`; no heading
 * survives to sit over an empty timeline, which keeps the page ordinals intact.
 */
export const Empty: Story = {
  args: {
    ...Default.args,
    experiences: [],
  },
}
