import type { Meta, StoryObj } from '@storybook/nextjs'

import { AboutSection } from '@/components/site/about-section'
import { getDictionary } from '@/lib/i18n'
import { richText } from '@/seed/lexical'

import type { About } from '@/payload-types'

const es = getDictionary('es')

const meta = {
  title: 'Site/AboutSection',
  component: AboutSection,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof AboutSection>

export default meta

type Story = StoryObj<typeof meta>

/** The seeded copy: two-line heading built from a real `\n`, one bio paragraph. */
const BIO_ES = [
  'Me muevo entre estrategia técnica y ejecución. Puedo definir una arquitectura, construir el producto, automatizar su despliegue y analizar qué ocurre cuando llega tráfico real. Creo en soluciones claras, escalables, observables y sin complejidad gratuita.',
]

const PRINCIPLES: NonNullable<About['principles']> = [
  {
    id: 'principle-1',
    index: '01 — ARCHITECTURE',
    title: 'Pensar en sistemas',
    body: 'Arquitecturas event-driven, APIs, límites entre dominios y decisiones técnicas que sigan teniendo sentido en dos años.',
  },
  {
    id: 'principle-2',
    index: '02 — ENGINEERING',
    title: 'Construir de extremo a extremo',
    body: 'Backend, frontend, infraestructura y pipelines. Me interesa más que todo encaje que defender una tecnología concreta.',
  },
  {
    id: 'principle-3',
    index: '03 — AI / AUTOMATION',
    title: 'IA que hace trabajo real',
    body: 'Agentes, inferencia local, gateways y automatización. Menos demos espectaculares; más sistemas que aportan valor y control.',
  },
]

/**
 * Seeded shape with an uploaded portrait: the heading sits on the left, the bio on the
 * right, and the principles grid plus the expertise orbit close the section. `location`,
 * `education`, `languages` and `stats` are no longer part of the seed, so the fixtures do
 * not carry them either.
 */
export const Default: Story = {
  args: {
    copy: es.about,
    about: {
      id: 1,
      name: 'Isaac Pepió',
      role: 'CTO · Software Architect',
      availability: 'CTO · Arquitectura · IA aplicada',
      photo: {
        id: 1,
        alt: 'Isaac Pepió',
        url: '/api/media/file/isaac.png',
        filename: 'isaac.png',
        mimeType: 'image/png',
        filesize: 2118299,
        width: 1122,
        height: 1402,
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
      },
      sectionEyebrow: '01 / ENFOQUE',
      sectionHeading: 'Menos ruido.\nMás sistemas',
      sectionHeadingAccent: 'que funcionan.',
      bio: richText(BIO_ES),
      principles: PRINCIPLES,
    },
  },
}

/**
 * No photo uploaded in Payload: the section still draws its heading, bio, principles and
 * orbit. Nothing renders as an empty box, and the orbit still draws because it owns its
 * own seven areas.
 */
export const WithoutPhoto: Story = {
  args: {
    copy: es.about,
    about: {
      id: 2,
      name: 'Isaac Pepió',
      photo: null,
      sectionEyebrow: '01 / ENFOQUE',
      sectionHeading: 'Menos ruido.\nMás sistemas',
      sectionHeadingAccent: 'que funcionan.',
      bio: richText(BIO_ES),
      principles: PRINCIPLES,
    },
  },
}

/**
 * Sparse content: no Payload chrome at all, so the section falls back to the dictionary
 * eyebrow and heading (`copy`) and every other block collapses.
 */
export const Minimal: Story = {
  args: {
    copy: es.about,
    about: {
      id: 3,
      name: 'Isaac Pepió',
      photo: null,
    },
  },
}
