import type { Meta, StoryObj } from '@storybook/nextjs'

import { HeroSection } from '@/components/site/hero-section'
import { getDictionary } from '@/lib/i18n'
import { richText } from '@/seed/lexical'

const es = getDictionary('es')

const meta = {
  title: 'Site/HeroSection',
  component: HeroSection,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof HeroSection>

export default meta

type Story = StoryObj<typeof meta>

/**
 * Seeded shape: three headline lines, intro, four meta tags and the portrait. The section
 * chrome (both CTAs) arrives as the dictionary `hero` slice; the rest is Payload content.
 */
export const Default: Story = {
  args: {
    name: 'Isaac Pepió',
    availability: 'CTO · Arquitectura · IA aplicada',
    heroLines: [
      { text: 'HAGO', style: 'plain' },
      { text: 'SIMPLE', style: 'outlined' },
      { text: 'LO COMPLEJO.', style: 'accent' },
    ],
    heroIntro: richText([
      [
        { text: 'Soy ' },
        { text: 'Isaac Pepió', bold: true },
        {
          text: '. Diseño y construyo producto, plataformas cloud y sistemas de IA. Desde la primera línea de código hasta su operación en producción.',
        },
      ],
    ]),
    heroMeta: [
      { text: 'CTO' },
      { text: 'Software Architect' },
      { text: 'Cloud / AI / DevOps' },
      { text: 'Desde España' },
    ],
    copy: es.hero,
    role: 'CTO · Software Architect',
    portrait: es.portrait,
  },
}

/** Bare shape: one plain line and no meta tags, for a content-less About global. */
export const Minimal: Story = {
  args: {
    name: 'Isaac Pepió',
    heroLines: [{ text: 'HAGO SISTEMAS.', style: 'plain' }],
    copy: es.hero,
    portrait: es.portrait,
  },
}
