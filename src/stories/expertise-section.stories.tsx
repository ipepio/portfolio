import type { Meta, StoryObj } from '@storybook/nextjs'

import { ExpertiseSection } from '@/components/site/expertise-section'
import { capabilitySeeds, coreToolNames, extendedToolNames } from '@/seed/content'

const meta = {
  title: 'Site/ExpertiseSection',
  component: ExpertiseSection,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof ExpertiseSection>

export default meta

type Story = StoryObj<typeof meta>

/**
 * Real Spanish copy, as the dictionary and the expertise global provide it: the sticky
 * aside on the left, the five capabilities and the two tool belts on the right.
 */
export const Default: Story = {
  args: {
    eyebrow: '02 / LO QUE HAGO',
    heading: 'Del problema al',
    headingAccent: 'sistema.',
    description:
      'Diseño, construyo y opero soluciones de extremo a extremo. Mi valor está en conectar arquitectura, producto, infraestructura y personas, no en acumular frameworks.',
    note: 'Las herramientas cambian. El criterio permanece.',
    areasLabel: 'CAPACIDADES / CÓMO APORTO VALOR',
    capabilities: capabilitySeeds.map((capability, index) => ({
      id: `capability-${index + 1}`,
      title: capability.title.es,
      description: capability.description.es,
    })),
    coreTools: [...coreToolNames],
    extendedTools: [...extendedToolNames],
    coreLabel: 'HERRAMIENTAS CON LAS QUE MÁS ME IDENTIFICO',
    coreTag: 'CORE TOOLKIT',
    extendedLabel: 'TAMBIÉN PRESENTES EN MI TRABAJO Y PROYECTOS',
    extendedTag: 'EXTENDED TOOLKIT',
    toolsFoot:
      'El stack es una caja de herramientas. En cada proyecto, elijo lo que aporta simplicidad, rendimiento y autonomía al equipo.',
  },
}

/** Core toolkit only: the extended belt and its closing sentence collapse. */
export const CoreOnly: Story = {
  args: {
    eyebrow: '02 / LO QUE HAGO',
    heading: 'Del problema al',
    headingAccent: 'sistema.',
    areasLabel: 'CAPACIDADES / CÓMO APORTO VALOR',
    capabilities: capabilitySeeds.map((capability, index) => ({
      id: `capability-${index + 1}`,
      title: capability.title.es,
      description: capability.description.es,
    })),
    coreTools: [...coreToolNames],
    extendedTools: [],
    coreLabel: 'HERRAMIENTAS CON LAS QUE MÁS ME IDENTIFICO',
    coreTag: 'CORE TOOLKIT',
    extendedLabel: 'TAMBIÉN PRESENTES EN MI TRABAJO Y PROYECTOS',
    extendedTag: 'EXTENDED TOOLKIT',
  },
}
