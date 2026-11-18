/**
 * Real portfolio content. Every string below is transcribed from
 * /Users/ipepio/Desktop/portfolio_ipepio.html (translations.es / translations.en)
 * or from the copy supplied with the seed request — nothing is invented.
 * Fields without a source stay empty.
 */

import type { RichTextRun } from './lexical'

export type Localized = { es: string; en: string }

export type CapabilityScene =
  | 'backend'
  | 'cloud'
  | 'ai'
  | 'quality'
  | 'data'
  | 'enterprise'
  | 'engineering'

export type CapabilitySeed = {
  title: Localized
  description: Localized
  /** Diagram the About orbit draws for this node. */
  scene: CapabilityScene
}

/** "Lo que hago": the five capabilities, verbatim from the expertise reference. */
export const capabilitySeeds: CapabilitySeed[] = [
  {
    title: { es: 'Arquitectura de software', en: 'Software architecture' },
    description: {
      es: 'Diseño de sistemas, separación de dominios, APIs, arquitecturas event-driven y modernización incremental sin perder el control de producción.',
      en: 'System design, domain boundaries, APIs, event-driven architecture and incremental modernization without compromising production.',
    },
    scene: 'backend',
  },
  {
    title: { es: 'Ingeniería de producto', en: 'Product engineering' },
    description: {
      es: 'Construcción fullstack, diseño de plataformas, integraciones y desarrollo de producto desde la idea hasta una solución mantenible.',
      en: 'Full-stack development, platform design, integrations, and shipping ideas as maintainable products.',
    },
    scene: 'engineering',
  },
  {
    title: { es: 'Cloud, DevOps y operaciones', en: 'Cloud, DevOps & operations' },
    description: {
      es: 'Infraestructura como código, contenedores, CI/CD, automatización de despliegues y operación de servicios en AWS y Linux.',
      en: 'Infrastructure as code, containers, CI/CD, deployment automation and operating services on AWS and Linux.',
    },
    scene: 'cloud',
  },
  {
    title: { es: 'IA aplicada a ingeniería', en: 'Applied AI engineering' },
    description: {
      es: 'Agentes, RAG, inferencia local, gateways LLM y herramientas que automatizan trabajo real sin perder observabilidad ni control.',
      en: 'Agents, RAG, local inference, LLM gateways and tooling that automates real work while retaining observability and control.',
    },
    scene: 'ai',
  },
  {
    title: { es: 'Liderazgo técnico y calidad', en: 'Technical leadership & quality' },
    description: {
      es: 'Dirección de equipos, criterios de arquitectura, code review, QA, seguridad y mejora del ciclo de entrega.',
      en: 'Leading teams, architectural standards, code review, QA, security, and improving how software gets delivered.',
    },
    scene: 'quality',
  },
]

/** Core toolkit, in the reference order: the ones highlighted over the rest. */
export const coreToolNames = [
  'Node.js',
  'TypeScript',
  'React',
  'PostgreSQL',
  'AWS',
  'Docker',
  'Kubernetes',
] as const

/** Extended toolkit, in the reference order: also present across work and projects. */
export const extendedToolNames = [
  'Vue',
  'Kotlin',
  'Go',
  'Terraform / OpenTofu',
  'Linux',
  'GitHub Actions',
  'llama.cpp',
  'LiteLLM',
] as const

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
