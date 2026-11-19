import type { Meta, StoryObj } from '@storybook/nextjs'

import { ExpertiseSection } from '@/components/site/expertise-section'
import { getDictionary } from '@/lib/i18n'
import { capabilitySeeds, coreToolNames, extendedToolNames } from '@/seed/content'

const es = getDictionary('es')

const meta = {
  title: 'Site/ExpertiseSection',
  component: ExpertiseSection,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof ExpertiseSection>

export default meta

type Story = StoryObj<typeof meta>

/**
 * Real Spanish copy, as the dictionary and the expertise global provide it: the sticky
 * aside on the left, the five capabilities and the two tool belts on the right. The
 * capabilities and tools are Payload content; every label arrives in the `copy` slice.
 */
export const Default: Story = {
  args: {
    copy: es.expertise,
    capabilities: capabilitySeeds.map((capability, index) => ({
      id: `capability-${index + 1}`,
      title: capability.title.es,
      description: capability.description.es,
    })),
    coreTools: [...coreToolNames],
    extendedTools: [...extendedToolNames],
  },
}

/** Core toolkit only: the extended belt and its closing sentence collapse. */
export const CoreOnly: Story = {
  args: {
    copy: { ...es.expertise, description: '', note: '', toolsFoot: '' },
    capabilities: capabilitySeeds.map((capability, index) => ({
      id: `capability-${index + 1}`,
      title: capability.title.es,
      description: capability.description.es,
    })),
    coreTools: [...coreToolNames],
    extendedTools: [],
  },
}
