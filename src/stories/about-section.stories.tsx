import type { Meta, StoryObj } from '@storybook/nextjs'

import { AboutSection } from '@/components/site/about-section'

const meta = {
  title: 'Site/AboutSection',
  component: AboutSection,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof AboutSection>

export default meta

type Story = StoryObj<typeof meta>

/**
 * Photo-less seeded shape: section eyebrow and display heading (editable in Payload),
 * the big bio description, three principles, one education item and three languages.
 * Payload returns `photo: null` when no image is uploaded, so only the mono caption
 * and the years-of-experience stat render in the portrait row.
 */
export const Default: Story = {
  args: {
    educationHeading: 'Formación',
    languagesHeading: 'Idiomas',
    presentLabel: 'Actualidad',
    about: {
      id: 1,
      name: 'Isaac Pepió',
      role: 'CTO · Software Architect',
      availability: 'CTO · Arquitectura · IA aplicada',
      photo: null,
      location: 'Vinaròs, España',
      sectionEyebrow: '01 / ENFOQUE',
      sectionHeading: 'Menos ruido. Más sistemas',
      sectionHeadingAccent: 'que funcionan.',
      stats: [{ id: 'stat-1', value: '8+', label: 'AÑOS EN SOFTWARE' }],
      bio: {
        root: {
          type: 'root',
          format: '',
          indent: 0,
          version: 1,
          direction: 'ltr',
          children: [
            {
              type: 'paragraph',
              version: 1,
              format: '',
              indent: 0,
              direction: 'ltr',
              textFormat: 0,
              children: [
                {
                  type: 'text',
                  text: 'Ingeniero de telecomunicaciones con 8+ años de experiencia. He trabajado en consultoría, industria y empresas de producto donde el software es el centro.',
                  version: 1,
                  format: 0,
                  detail: 0,
                  mode: 'normal',
                  style: '',
                },
              ],
            },
            {
              type: 'paragraph',
              version: 1,
              format: '',
              indent: 0,
              direction: 'ltr',
              textFormat: 0,
              children: [
                {
                  type: 'text',
                  text: 'Me gusta entender sistemas complejos y convertir requisitos ambiguos en soluciones prácticas y fiables.',
                  version: 1,
                  format: 0,
                  detail: 0,
                  mode: 'normal',
                  style: '',
                },
              ],
            },
          ],
        },
      },
      principles: [
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
      ],
      education: [
        {
          id: 'education-1',
          title: 'Grado en Ingeniería de Telecomunicaciones',
          institution: 'Universitat Oberta de Catalunya',
          note: 'Matrícula de Honor en el TFG (aplicaciones multimedia de nueva generación)',
        },
      ],
      languages: [
        { id: 'language-1', name: 'Español', level: 'Nativo' },
        { id: 'language-2', name: 'Catalán/Valenciano', level: 'Nativo' },
        { id: 'language-3', name: 'Inglés', level: 'C1' },
      ],
    },
  },
}

/** Sparse content: only the required name, so every optional block collapses. */
export const Minimal: Story = {
  args: {
    educationHeading: 'Formación',
    languagesHeading: 'Idiomas',
    presentLabel: 'Actualidad',
    about: {
      id: 2,
      name: 'Isaac Pepió',
      photo: null,
    },
  },
}
