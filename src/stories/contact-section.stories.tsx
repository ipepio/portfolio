import type { Meta, StoryObj } from '@storybook/nextjs'

import { ContactSection } from '@/components/site/contact-section'

const meta = {
  title: 'Site/ContactSection',
  component: ContactSection,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof ContactSection>

export default meta

type Story = StoryObj<typeof meta>

/** Seeded shape: no email/phone yet, only the GitHub social. */
export const Default: Story = {
  args: {
    eyebrow: '04 / CONTACTO',
    heading: '¿Hablamos?',
    contact: {
      id: 1,
      email: null,
      phone: null,
      socials: [{ id: 'social-1', label: 'GitHub', url: 'https://github.com/ipepio' }],
    },
  },
}

/** Full contact block: email link, phone link and several socials. */
export const WithEmailAndPhone: Story = {
  args: {
    eyebrow: '04 / CONTACTO',
    heading: '¿Hablamos?',
    contact: {
      id: 2,
      email: 'hola@ipepio.dev',
      phone: '+34 600 000 000',
      socials: [
        { id: 'social-1', label: 'GitHub', url: 'https://github.com/ipepio' },
        { id: 'social-2', label: 'LinkedIn', url: 'https://www.linkedin.com/in/ipepio' },
      ],
    },
  },
}

/** Heading override keeps the section reusable outside the home page. */
export const CustomHeading: Story = {
  args: {
    eyebrow: '04 / CONTACTO',
    heading: '¿Construimos algo juntos?',
    contact: {
      id: 3,
      email: 'hola@ipepio.dev',
      socials: [],
    },
  },
}
