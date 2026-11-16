import type { Meta, StoryObj } from '@storybook/nextjs'

import { ExperienceSection } from '@/components/site/experience-section'

const meta = {
  title: 'Site/ExperienceSection',
  component: ExperienceSection,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof ExperienceSection>

export default meta

type Story = StoryObj<typeof meta>

/**
 * Sample positions (story-only mock data, never seeded) covering the three
 * shapes the timeline has to handle: a current role (`endDate: null` renders
 * "Actualidad"), a finished role with a stack and logo-less fallback, and a role
 * without description or location.
 */
export const Default: Story = {
  args: {
    eyebrow: '03 / TRAYECTORIA',
    heading: 'Dónde he trabajado.',
    presentLabel: 'Actualidad',
    locale: 'es',
    experiences: [
      {
        id: 1,
        company: 'Acme Corp',
        role: 'Lead Backend Engineer',
        startDate: '2023-03-01T00:00:00.000Z',
        endDate: null,
        description:
          'Diseño y evolución de la plataforma de servicios: arquitectura modular, contratos de API y despliegues reproducibles sobre Kubernetes.',
        location: 'Valencia, España',
        logo: null,
        stack: [
          { id: 'acme-1', name: 'Node.js' },
          { id: 'acme-2', name: 'NestJS' },
          { id: 'acme-3', name: 'PostgreSQL' },
          { id: 'acme-4', name: 'Kubernetes' },
        ],
        updatedAt: '2023-03-01T00:00:00.000Z',
        createdAt: '2023-03-01T00:00:00.000Z',
      },
      {
        id: 2,
        company: 'Globex',
        role: 'Backend Developer',
        startDate: '2021-01-01T00:00:00.000Z',
        endDate: '2023-02-01T00:00:00.000Z',
        description:
          'Integración de servicios internos, automatización de procesos de negocio y migración progresiva hacia una arquitectura orientada a eventos.',
        location: 'Madrid, España',
        logo: null,
        stack: [
          { id: 'globex-1', name: 'TypeScript' },
          { id: 'globex-2', name: 'Express' },
          { id: 'globex-3', name: 'AWS' },
        ],
        updatedAt: '2021-01-01T00:00:00.000Z',
        createdAt: '2021-01-01T00:00:00.000Z',
      },
      {
        id: 3,
        company: 'Initech',
        role: 'Analista funcional',
        startDate: '2018-09-01T00:00:00.000Z',
        endDate: '2020-12-01T00:00:00.000Z',
        description: null,
        location: null,
        logo: null,
        stack: null,
        updatedAt: '2018-09-01T00:00:00.000Z',
        createdAt: '2018-09-01T00:00:00.000Z',
      },
    ],
  },
}

/**
 * Empty collection, which is the current state of the database: the section
 * returns `null`, so the story canvas renders nothing at all. Proving it means
 * `canvasElement.innerHTML === ''` (or `querySelector('section') === null`);
 * no heading survives to sit over an empty timeline.
 */
export const Empty: Story = {
  args: {
    eyebrow: '03 / TRAYECTORIA',
    heading: 'Dónde he trabajado.',
    presentLabel: 'Actualidad',
    locale: 'es',
    experiences: [],
  },
}
