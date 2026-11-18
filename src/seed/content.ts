/**
 * Real portfolio content. Every string below is transcribed from
 * /Users/ipepio/Desktop/portfolio_ipepio.html (translations.es / translations.en)
 * or from the copy supplied with the seed request — nothing is invented.
 * Fields without a source stay empty.
 */

import type { RichTextRun } from './lexical'

export type Localized = { es: string; en: string }

export type SkillGroupIcon =
  | 'code'
  | 'cloud'
  | 'ai'
  | 'shield'
  | 'database'
  | 'enterprise'
  | 'engineering'

export type SkillGroupSeed = {
  number: string
  label: string
  title: Localized
  icon: SkillGroupIcon
  items: { name: string; key?: true }[]
  order: number
}

export const skillGroupSeeds: SkillGroupSeed[] = [
  {
    number: '01',
    label: 'BACKEND',
    title: { es: 'Backend & Architecture', en: 'Backend & Architecture' },
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
    order: 1,
  },
  {
    number: '02',
    label: 'CLOUD',
    title: { es: 'Cloud & DevOps', en: 'Cloud & DevOps' },
    icon: 'cloud',
    items: [
      { name: 'AWS', key: true },
      { name: 'Amazon EKS' },
      { name: 'Kubernetes' },
      { name: 'Docker' },
      { name: 'CI/CD' },
      { name: 'Deployment Automation' },
    ],
    order: 2,
  },
  {
    number: '03',
    label: 'AI',
    title: { es: 'Artificial Intelligence', en: 'Artificial Intelligence' },
    icon: 'ai',
    items: [
      { name: 'LLMs', key: true },
      { name: 'RAG' },
      { name: 'AI Agents' },
      { name: 'AI-assisted Development' },
      { name: 'Automated Code Review' },
      { name: 'Intelligent Automation' },
    ],
    order: 3,
  },
  {
    number: '04',
    label: 'QUALITY',
    title: { es: 'Quality & Security', en: 'Quality & Security' },
    icon: 'shield',
    items: [
      { name: 'E2E Testing' },
      { name: 'QA Processes' },
      { name: 'Code Review' },
      { name: 'Secure SDLC' },
      { name: 'Cybersecurity' },
    ],
    order: 4,
  },
  {
    number: '05',
    label: 'DATA',
    title: { es: 'Databases', en: 'Databases' },
    icon: 'database',
    items: [{ name: 'PostgreSQL', key: true }, { name: 'SQL Server' }],
    order: 5,
  },
  {
    number: '06',
    label: 'ENTERPRISE',
    title: { es: 'Enterprise & SAP', en: 'Enterprise & SAP' },
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
    order: 6,
  },
  {
    number: '07',
    label: 'ENGINEERING',
    title: { es: 'Engineering', en: 'Engineering' },
    icon: 'engineering',
    items: [
      { name: 'Git' },
      { name: 'GitHub' },
      { name: 'Software Architecture' },
      { name: 'Systems Integration' },
      { name: 'Agile' },
      { name: 'Scrum' },
    ],
    order: 7,
  },
]

export const tagNames = ['IA / Agentes', 'Plataforma', 'Producto'] as const

export type TagName = (typeof tagNames)[number]

/** Diagram shown when a project has no cover image (Payload `projects.visual`). */
type ProjectVisualName =
  | 'code-stack'
  | 'agent-orbit'
  | 'mock-shell'
  | 'echo-ring'
  | 'svc-map'
  | 'chat-lines'

export type ProjectSeed = {
  title: Localized
  slug: string
  shortDescription: Localized
  visual: ProjectVisualName
  tags: TagName[]
  status: 'live' | 'wip'
  githubUrl?: string
  order: number
}

export const projectSeeds: ProjectSeed[] = [
  {
    title: { es: 'AI Governor', en: 'AI Governor' },
    slug: 'ai-governor',
    shortDescription: {
      es: 'Gateway OpenAI-compatible para gobernar acceso a modelos, cuotas, presupuestos y rate limits con trazabilidad por usuario y organización.',
      en: 'An OpenAI-compatible gateway to govern model access, quotas, budgets, and rate limits, with per-user and organization-level tracking.',
    },
    visual: 'code-stack',
    tags: ['IA / Agentes', 'Plataforma'],
    status: 'wip',
    order: 1,
  },
  {
    title: { es: 'pi-hub', en: 'pi-hub' },
    slug: 'pi-hub',
    shortDescription: {
      es: 'Entorno de orquestación para agentes de IA, herramientas y sesiones persistentes. Una base ligera para construir flujos de trabajo propios.',
      en: 'An orchestration environment for AI agents, tools, and persistent sessions. A lightweight foundation for custom workflows.',
    },
    visual: 'agent-orbit',
    tags: ['IA / Agentes', 'Producto'],
    status: 'live',
    githubUrl: 'https://github.com/ipepio/pi-hub',
    order: 2,
  },
  {
    title: { es: 'Nabla', en: 'Nabla' },
    slug: 'nabla',
    shortDescription: {
      es: 'Un harness de IA de escritorio con enfoque local-first: experiencia nativa, runtime de agentes y una interfaz que prioriza claridad y velocidad.',
      en: 'A local-first desktop AI harness: native experience, agent runtime, and an interface built around clarity and speed.',
    },
    visual: 'mock-shell',
    tags: ['IA / Agentes', 'Producto'],
    status: 'wip',
    order: 3,
  },
  {
    title: { es: 'ECHO', en: 'ECHO' },
    slug: 'echo',
    shortDescription: {
      es: 'Concepto de asistente personal privado, con interacción por voz, STT/TTS y herramientas conectadas a servicios propios.',
      en: 'A private personal-assistant concept combining voice interaction, STT/TTS, and tools connected to self-hosted services.',
    },
    visual: 'echo-ring',
    tags: ['IA / Agentes', 'Producto'],
    status: 'wip',
    order: 4,
  },
  {
    title: { es: 'Platform Modernization', en: 'Platform Modernization' },
    slug: 'platform-modernization',
    shortDescription: {
      es: 'Evolución de plataformas hacia servicios desacoplados, dominios claros, despliegues reproducibles y operativa cloud automatizada.',
      en: 'Moving platforms toward decoupled services, clear domain boundaries, reproducible deployments, and automated cloud operations.',
    },
    visual: 'svc-map',
    tags: ['Plataforma'],
    status: 'live',
    order: 5,
  },
  {
    title: { es: 'Discord Hub', en: 'Discord Hub' },
    slug: 'discord-hub',
    shortDescription: {
      es: 'Ingesta, indexación y recuperación de conocimiento de Discord para que agentes y herramientas puedan trabajar con contexto y permisos.',
      en: 'Ingestion, indexing, and retrieval of Discord knowledge so agents and tools can work with relevant context and permissions.',
    },
    visual: 'chat-lines',
    tags: ['IA / Agentes', 'Plataforma'],
    status: 'wip',
    order: 6,
  },
]

export type HeroLineStyle = 'plain' | 'outlined' | 'accent'

/** Hero intro runs per locale; the bolded run renders as `<strong>` (see ./lexical). */
export type LocalizedRuns = { es: RichTextRun[]; en: RichTextRun[] }

export type AboutSeed = {
  name: string
  role: Localized
  availability: Localized
  location: Localized
  sectionEyebrow: Localized
  sectionHeading: Localized
  sectionHeadingAccent: Localized
  bio: { es: string[]; en: string[] }
  heroLines: { text: Localized; style: HeroLineStyle }[]
  heroIntro: LocalizedRuns
  heroMeta: Localized[]
  stats: { value: string; label: Localized }[]
  principles: { index: string; title: Localized; body: Localized }[]
  education: { title: Localized; institution: string; note: Localized }[]
  languages: { name: string; level: string }[]
}

export const aboutSeed: AboutSeed = {
  name: 'Isaac Pepió',
  role: { es: 'CTO · Software Architect', en: 'CTO · Software Architect' },
  availability: {
    es: 'CTO · Arquitectura · IA aplicada',
    en: 'CTO · Architecture · Applied AI',
  },
  location: { es: 'Vinaròs, España', en: 'Vinaròs, Spain' },
  sectionEyebrow: { es: 'ENFOQUE', en: 'APPROACH' },
  // The real newline in `sectionHeading` is rendered as a forced line break (`whitespace-pre-line`).
  sectionHeading: { es: 'Menos ruido\nMás sistemas', en: 'Less noise\nMore systems' },
  sectionHeadingAccent: { es: 'que funcionan.', en: 'that work.' },
  bio: {
    es: [
      'Me muevo entre estrategia técnica y ejecución. Puedo definir una arquitectura, construir el producto, automatizar su despliegue y analizar qué ocurre cuando llega tráfico real. Creo en soluciones claras, escalables, observables y sin complejidad gratuita.',
    ],
    en: [
      'I work between technical strategy and execution. I can shape an architecture, build the product, automate its deployment and analyse what happens when real traffic arrives. I believe in clear, scalable, observable solutions without gratuitous complexity.',
    ],
  },
  heroLines: [
    { text: { es: 'HAGO', en: 'MAKE' }, style: 'plain' },
    { text: { es: 'SIMPLE', en: 'COMPLEX' }, style: 'outlined' },
    { text: { es: 'LO COMPLEJO.', en: 'FEEL SIMPLE.' }, style: 'accent' },
  ],
  heroIntro: {
    es: [
      { text: 'Soy ' },
      { text: 'Isaac Pepió', bold: true },
      {
        text: '. Diseño y construyo producto, plataformas cloud y sistemas de IA. Desde la primera línea de código hasta su operación en producción.',
      },
    ],
    en: [
      { text: "I'm " },
      { text: 'Isaac Pepió', bold: true },
      {
        text: '. I design and build products, cloud platforms and AI systems. From the first line of code to running them in production.',
      },
    ],
  },
  heroMeta: [
    { es: 'CTO', en: 'CTO' },
    { es: 'Software Architect', en: 'Software Architect' },
    { es: 'Cloud / AI / DevOps', en: 'Cloud / AI / DevOps' },
    { es: 'Desde España', en: 'Based in Spain' },
  ],
  // Kept in the data model but no longer rendered: the About section dropped the stat block.
  stats: [{ value: '8+', label: { es: 'AÑOS EN SOFTWARE', en: 'YEARS IN SOFTWARE' } }],
  principles: [
    {
      index: '01 — ARCHITECTURE',
      title: { es: 'Pensar en sistemas', en: 'Think in systems' },
      body: {
        es: 'Arquitecturas event-driven, APIs, límites entre dominios y decisiones técnicas que sigan teniendo sentido en dos años.',
        en: 'Event-driven architectures, APIs, domain boundaries, and technical decisions that will still make sense two years from now.',
      },
    },
    {
      index: '02 — ENGINEERING',
      title: { es: 'Construir de extremo a extremo', en: 'Build end to end' },
      body: {
        es: 'Backend, frontend, infraestructura y pipelines. Me interesa más que todo encaje que defender una tecnología concreta.',
        en: 'Backend, frontend, infrastructure, and pipelines. Making the whole thing work matters more than defending a particular technology.',
      },
    },
    {
      index: '03 — AI / AUTOMATION',
      title: { es: 'IA que hace trabajo real', en: 'AI that does real work' },
      body: {
        es: 'Agentes, inferencia local, gateways y automatización. Menos demos espectaculares; más sistemas que aportan valor y control.',
        en: 'Agents, local inference, gateways, and automation. Fewer flashy demos, more systems that deliver value and control.',
      },
    },
  ],
  education: [
    {
      title: {
        es: 'Grado en Ingeniería de Telecomunicaciones',
        en: "Bachelor's Degree in Telecommunications Engineering",
      },
      institution: 'Universitat Oberta de Catalunya',
      note: {
        es: 'Matrícula de Honor en el TFG (aplicaciones multimedia de nueva generación)',
        en: 'Matrícula de Honor (Honours) for the final degree project (next-generation multimedia applications)',
      },
    },
  ],
  languages: [
    { name: 'Español', level: 'Nativo' },
    { name: 'Catalán/Valenciano', level: 'Nativo' },
    { name: 'Inglés', level: 'C1' },
  ],
}

export const contactSeed = {
  socials: [{ label: 'GitHub', url: 'https://github.com/ipepio' }],
}
