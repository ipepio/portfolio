import type { Meta, StoryObj } from '@storybook/nextjs'

import { ExperienceSection } from '@/components/site/experience-section'
import { getDictionary, type Locale } from '@/lib/i18n'
import { experienceSeeds } from '@/seed/content'

const meta = {
  title: 'Site/ExperienceSection',
  component: ExperienceSection,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof ExperienceSection>

export default meta

type Story = StoryObj<typeof meta>

/** The seeded timeline in one locale, as Payload returns it at `depth: 1`. */
function experiencesFor(locale: Locale) {
  return experienceSeeds.map((seed, index) => ({
    id: index + 1,
    company: seed.company,
    role: seed.role[locale],
    period: seed.period[locale],
    description: seed.description[locale],
    startDate: seed.startDate,
    endDate: seed.endDate,
    location: null,
    logo: null,
    stack: seed.tags.map((name) => ({ id: `${seed.company}-${name}`, name })),
    updatedAt: '2025-09-01T00:00:00.000Z',
    createdAt: '2025-09-01T00:00:00.000Z',
  }))
}

/**
 * The seeded career timeline as Payload returns it (Spanish): the sticky intro column
 * with the `2017 →` stat and the CV callout on the left and the five roles on the right,
 * the first one marked as current. Chrome and CV copy come from the `copy` slice; role,
 * period, description and tags come from `experienceSeeds`.
 */
export const Default: Story = {
  args: {
    copy: getDictionary('es').experience,
    experiences: experiencesFor('es'),
  },
}

/** The English dictionary: same layout, translated copy. */
export const English: Story = {
  args: {
    copy: getDictionary('en').experience,
    experiences: experiencesFor('en'),
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
