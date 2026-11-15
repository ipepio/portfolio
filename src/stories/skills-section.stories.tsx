import type { Meta, StoryObj } from '@storybook/nextjs'

import { SkillsSection } from '@/components/site/skills-section'

const meta = {
  title: 'Site/SkillsSection',
  component: SkillsSection,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof SkillsSection>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    eyebrow: 'LO QUE HAGO',
    heading: 'Habilidades técnicas por área.',
    subheading:
      'Un perfil transversal que abarca desde el código hasta la infraestructura, pasando por la IA, la calidad y la seguridad.',
    groups: [
      {
        id: 'backend',
        number: '01',
        label: 'BACKEND',
        title: 'Backend & Architecture',
        icon: 'code',
        items: [
          { name: 'Node.js', key: true },
          { name: 'NestJS' },
          { name: 'Express' },
          { name: 'REST APIs' },
          { name: 'Event-Driven Architecture' },
          { name: 'Microservices' },
          { name: 'Modular Monolith' },
          { name: 'Clean Architecture' },
        ],
      },
      {
        id: 'cloud',
        number: '02',
        label: 'CLOUD',
        title: 'Cloud & DevOps',
        icon: 'cloud',
        items: [
          { name: 'AWS', key: true },
          { name: 'Amazon EKS' },
          { name: 'Kubernetes' },
          { name: 'Docker' },
          { name: 'CI/CD' },
          { name: 'Deployment Automation' },
        ],
      },
      {
        id: 'ai',
        number: '03',
        label: 'AI',
        title: 'Artificial Intelligence',
        icon: 'ai',
        items: [
          { name: 'LLMs', key: true },
          { name: 'RAG' },
          { name: 'AI Agents' },
          { name: 'AI-assisted Development' },
          { name: 'Automated Code Review' },
          { name: 'Intelligent Automation' },
        ],
      },
      {
        id: 'quality',
        number: '04',
        label: 'QUALITY',
        title: 'Quality & Security',
        icon: 'shield',
        items: [
          { name: 'E2E Testing' },
          { name: 'QA Processes' },
          { name: 'Code Review' },
          { name: 'Secure SDLC' },
          { name: 'Cybersecurity' },
        ],
      },
      {
        id: 'data',
        number: '05',
        label: 'DATA',
        title: 'Databases',
        icon: 'database',
        items: [{ name: 'PostgreSQL', key: true }, { name: 'SQL Server' }],
      },
      {
        id: 'enterprise',
        number: '06',
        label: 'ENTERPRISE',
        title: 'Enterprise & SAP',
        icon: 'enterprise',
        items: [
          { name: 'SAP WM' },
          { name: 'EWM' },
          { name: 'MM' },
          { name: 'SD' },
          { name: 'PP' },
          { name: 'CO' },
          { name: 'ABAP' },
        ],
      },
      {
        id: 'engineering',
        number: '07',
        label: 'ENGINEERING',
        title: 'Engineering',
        icon: 'engineering',
        items: [
          { name: 'Git' },
          { name: 'GitHub' },
          { name: 'Software Architecture' },
          { name: 'Systems Integration' },
          { name: 'Agile' },
          { name: 'Scrum' },
        ],
      },
    ],
  },
}

export const Minimal: Story = {
  args: {
    heading: 'Habilidades técnicas.',
    groups: [
      {
        number: '01',
        title: 'Databases',
        icon: 'database',
        items: [{ name: 'PostgreSQL', key: true }, { name: 'SQL Server' }],
      },
    ],
  },
}
