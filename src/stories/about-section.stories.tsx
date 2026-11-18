import type { Meta, StoryObj } from '@storybook/nextjs'

import { AboutSection } from '@/components/site/about-section'
import { richText } from '@/seed/lexical'

import type { About } from '@/payload-types'

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

const EDUCATION: NonNullable<About['education']> = [
  {
    id: 'education-1',
    title: 'Grado en Ingeniería de Telecomunicaciones',
    institution: 'Universitat Oberta de Catalunya',
    note: 'Matrícula de Honor en el TFG (aplicaciones multimedia de nueva generación)',
  },
]

const LANGUAGES: NonNullable<About['languages']> = [
  { id: 'language-1', name: 'Español', level: 'Nativo' },
  { id: 'language-2', name: 'Catalán/Valenciano', level: 'Nativo' },
  { id: 'language-3', name: 'Inglés', level: 'C1' },
]

/**
 * Seeded shape with an uploaded portrait: the photo (rounded, from Payload) sits on the
 * left above its mono caption, the two-line heading sits on the right, the bio runs
 * underneath, and the principles grid plus the expertise orbit close the section.
 * There is no stat block any more.
 */
export const Default: Story = {
  args: {
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
      location: 'Vinaròs, España',
      sectionEyebrow: '01 / ENFOQUE',
      sectionHeading: 'Menos ruido.\nMás sistemas',
      sectionHeadingAccent: 'que funcionan.',
      bio: richText(BIO_ES),
      principles: PRINCIPLES,
      education: EDUCATION,
      languages: LANGUAGES,
    },
  },
}

/**
 * No photo uploaded in Payload: the left column collapses, the heading spans the grid
 * and the mono caption moves underneath it. Nothing renders as an empty box, and the
 * orbit still draws because it owns its own seven areas.
 */
export const WithoutPhoto: Story = {
  args: {
    about: {
      id: 2,
      name: 'Isaac Pepió',
      photo: null,
      location: 'Vinaròs, España',
      sectionEyebrow: '01 / ENFOQUE',
      sectionHeading: 'Menos ruido.\nMás sistemas',
      sectionHeadingAccent: 'que funcionan.',
      bio: richText(BIO_ES),
      principles: PRINCIPLES,
      education: EDUCATION,
      languages: LANGUAGES,
    },
  },
}

/** Sparse content: only the required name, so every optional block collapses. */
export const Minimal: Story = {
  args: {
    about: {
      id: 3,
      name: 'Isaac Pepió',
      photo: null,
    },
  },
}
