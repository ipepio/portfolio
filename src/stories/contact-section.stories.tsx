import type { Meta, StoryObj } from '@storybook/nextjs'

import { ContactSection } from '@/components/site/contact-section'
import { getDictionary } from '@/lib/i18n'

const es = getDictionary('es')
const en = getDictionary('en')

const meta = {
  title: 'Site/ContactSection',
  component: ContactSection,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof ContactSection>

export default meta

type Story = StoryObj<typeof meta>

/** Seeded shape: the GitHub social exists, the destination email lives server-side. */
export const Default: Story = {
  args: {
    copy: es.contact,
    contact: {
      id: 1,
      email: null,
      phone: null,
      socials: [{ id: 'social-1', label: 'GitHub', url: 'https://github.com/ipepio' }],
    },
  },
}

/** English dictionary: `Let's build / something real.` and the English form copy. */
export const English: Story = {
  args: {
    copy: en.contact,
    contact: {
      id: 2,
      email: 'hola@ipepio.dev',
      phone: '+34 600 000 000',
      socials: [{ id: 'social-1', label: 'GitHub', url: 'https://github.com/ipepio' }],
    },
  },
}

/** No GitHub social in the global: the copy column closes after the description. */
export const WithoutSocial: Story = {
  args: {
    copy: es.contact,
    contact: {
      id: 3,
      email: null,
      socials: [],
    },
  },
}
