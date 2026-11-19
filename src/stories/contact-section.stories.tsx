import type { Meta, StoryObj } from '@storybook/nextjs'

import { ContactSection } from '@/components/site/contact-section'
import { getDictionary } from '@/lib/i18n'
import { LocaleProvider } from '@/lib/locale-context'

const es = getDictionary('es')
const en = getDictionary('en')

const meta = {
  title: 'Site/ContactSection',
  component: ContactSection,
  parameters: { layout: 'fullscreen' },
  // The form inside the section is a client component that reads its copy from context,
  // so every story has to publish a locale and a dictionary.
  decorators: [
    (Story) => (
      <LocaleProvider locale="es" dict={es}>
        <Story />
      </LocaleProvider>
    ),
  ],
} satisfies Meta<typeof ContactSection>

export default meta

type Story = StoryObj<typeof meta>

/**
 * Seeded shape: both socials of the global render as `.social-link` cards — the GitHub
 * and LinkedIn glyphs come from their url host, the handle is derived from the url, and
 * the destination email lives server-side.
 */
export const Default: Story = {
  args: {
    copy: es.contact,
    ownerName: 'Isaac Pepió',
    contact: {
      id: 1,
      email: null,
      phone: null,
      socials: [
        { id: 'social-1', label: 'GitHub', url: 'https://github.com/ipepio' },
        { id: 'social-2', label: 'LinkedIn', url: 'https://www.linkedin.com/in/ipepio/' },
      ],
    },
  },
}

/** English dictionary: `Let's build / something real.` and the English form copy. */
export const English: Story = {
  args: {
    ...Default.args,
    copy: en.contact,
    contact: {
      id: 2,
      email: 'hola@ipepio.dev',
      phone: '+34 600 000 000',
      socials: [
        { id: 'social-1', label: 'GitHub', url: 'https://github.com/ipepio' },
        { id: 'social-2', label: 'LinkedIn', url: 'https://www.linkedin.com/in/ipepio/' },
      ],
    },
  },
  decorators: [
    (Story) => (
      <LocaleProvider locale="en" dict={en}>
        <Story />
      </LocaleProvider>
    ),
  ],
}

/** A social with no brand glyph of its own: neutral link icon, label and handle intact. */
export const UnknownSocial: Story = {
  args: {
    ...Default.args,
    contact: {
      id: 3,
      email: null,
      phone: null,
      socials: [{ id: 'social-1', label: 'Mastodon', url: 'https://mastodon.social/@ipepio' }],
    },
  },
}

/** No socials in the global: the copy column closes after the description. */
export const WithoutSocial: Story = {
  args: {
    copy: es.contact,
    ownerName: 'Isaac Pepió',
    contact: {
      id: 4,
      email: null,
      socials: [],
    },
  },
}
