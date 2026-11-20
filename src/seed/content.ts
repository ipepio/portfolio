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

/**
 * Project tags, one `Localized` record per tag so the chips follow the locale. The `es`
 * value is also the canonical key `projectSeeds[].tags` uses to resolve tag ids.
 */
export const tagSeeds = [
  { es: 'IA / Agentes', en: 'AI / Agents' },
  { es: 'Plataforma', en: 'Platform' },
  { es: 'Producto', en: 'Product' },
] as const satisfies readonly Localized[]

export type TagName = (typeof tagSeeds)[number]['es']

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
  /** Raw markdown (see `projects.longDescription`), rendered by the detail page. */
  longDescription?: Localized
  visual: ProjectVisualName
  tags: TagName[]
  status: 'live' | 'wip'
  githubUrl?: string
  order: number
}

/**
 * The long description of ai-governor, written as raw markdown.
 *
 * It is a list of lines joined at the end: the document carries fenced code blocks, and a
 * template literal cannot hold the backtick fences without escaping every one of them.
 */
const aiGovernorLongDescriptionEs = [
  '**AI Governor** es un gateway compatible con la API de OpenAI que se coloca delante de los proveedores de modelos para **gobernar** quién consume qué, cuánto y a qué coste. La aplicación nunca habla con cada proveedor: habla con el gateway, y el gateway decide. El enfoque sigue las [buenas prácticas de producción de OpenAI](https://platform.openai.com/docs/guides/production-best-practices) y el código vive en el [repositorio de pi-hub](https://github.com/ipepio/pi-hub).',
  '',
  '## Qué gobierna',
  '',
  '- Acceso por usuario y por organización, con claves propias y revocables.',
  '- Cuotas y presupuestos por periodo, medidos en tokens y en dinero.',
  '- Rate limits por clave, por modelo y por organización.',
  '- Trazabilidad de cada petición: quién la pidió, qué modelo, cuántos tokens y cuánto costó.',
  '',
  '## Cómo se integra',
  '',
  'Un cliente que ya habla la API de OpenAI solo cambia la base URL del SDK:',
  '',
  '```bash',
  'export OPENAI_BASE_URL="https://gateway.example/v1"',
  'export OPENAI_API_KEY="sk-org-..."',
  'curl "$OPENAI_BASE_URL/chat/completions" \\',
  '  -H "Authorization: Bearer $OPENAI_API_KEY" \\',
  '  -d \'{"model": "gpt-4o-mini", "messages": [{"role": "user", "content": "hola"}]}\'',
  '```',
  '',
  'Cada petición recorre el mismo camino: autenticación, comprobación de cuota, presupuesto disponible, selección de proveedor y registro del consumo.',
  '',
  '```mermaid',
  'flowchart LR',
  '  Client[Cliente OpenAI] --> Auth[Autenticación]',
  '  Auth --> Policy{Cuota y presupuesto}',
  '  Policy -- dentro --> Provider[Proveedor de modelos]',
  '  Policy -- fuera --> Deny[429]',
  '  Provider --> Ledger[Registro de consumo]',
  '```',
].join('\n')

/** The same document in English: the seed writes both locales at once. */
const aiGovernorLongDescriptionEn = [
  '**AI Governor** is an OpenAI-compatible gateway that sits in front of model providers to **govern** who consumes what, how much and at what cost. Applications never talk to each provider: they talk to the gateway, and the gateway decides. The approach follows [OpenAI production best practices](https://platform.openai.com/docs/guides/production-best-practices) and the code lives in the [pi-hub repository](https://github.com/ipepio/pi-hub).',
  '',
  '## What it governs',
  '',
  '- Access per user and per organization, with revocable keys of their own.',
  '- Quotas and budgets per period, measured in tokens and in money.',
  '- Rate limits per key, per model and per organization.',
  '- A record of every request: who asked, which model, how many tokens and what it cost.',
  '',
  '## How it plugs in',
  '',
  'A client that already speaks the OpenAI API only changes the SDK base URL:',
  '',
  '```bash',
  'export OPENAI_BASE_URL="https://gateway.example/v1"',
  'export OPENAI_API_KEY="sk-org-..."',
  'curl "$OPENAI_BASE_URL/chat/completions" \\',
  '  -H "Authorization: Bearer $OPENAI_API_KEY" \\',
  '  -d \'{"model": "gpt-4o-mini", "messages": [{"role": "user", "content": "hello"}]}\'',
  '```',
  '',
  'Every request walks the same path: authentication, quota check, budget left, provider selection and usage accounting.',
  '',
  '```mermaid',
  'flowchart LR',
  '  Client[OpenAI client] --> Auth[Authentication]',
  '  Auth --> Policy{Quota and budget}',
  '  Policy -- within --> Provider[Model provider]',
  '  Policy -- over --> Deny[429]',
  '  Provider --> Ledger[Usage ledger]',
  '```',
].join('\n')

export const projectSeeds: ProjectSeed[] = [
  {
    title: { es: 'AI Governor', en: 'AI Governor' },
    slug: 'ai-governor',
    shortDescription: {
      es: 'Gateway OpenAI-compatible para gobernar acceso a modelos, cuotas, presupuestos y rate limits con trazabilidad por usuario y organización.',
      en: 'An OpenAI-compatible gateway to govern model access, quotas, budgets, and rate limits, with per-user and organization-level tracking.',
    },
    longDescription: { es: aiGovernorLongDescriptionEs, en: aiGovernorLongDescriptionEn },
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

/**
 * Blog entries, transcribed from /Users/ipepio/Desktop/portfolio_y_blog_ipepio/blog.html
 * (`journalArticles` plus its per-slug `topicExamples`). The reference prints a serial
 * (`N° 01`…`N° 06`) and a cover illustration per note; neither is a stored field, so the
 * serial is the position in this array and the illustration stays in the design system.
 */

/**
 * One section of an article body: the heading the article page indexes and the opening
 * line printed under it. Every section comes from the reference's own section list.
 */
export type PostSection = { heading: string; paragraph: string }

export type PostSeed = {
  slug: string
  title: Localized
  subtitle: Localized
  excerpt: Localized
  /** Category label as the archive prints it, per locale. */
  category: Localized
  readMinutes: number
  /** Fixed instant, so the archive order never drifts with the seed's run date. */
  publishedAt: string
  status: 'published'
  /** The reference features the first note and nothing else. */
  featured: boolean
  body: { es: PostSection[]; en: PostSection[] }
}

/**
 * The six notes, in the reference order (01 to 06). Headings are the reference's own
 * section titles (`headings` in `renderJournalArticle`) for the three sections kept here;
 * the opening line of each section is its first paragraph in the reference.
 */
export const postSeeds: PostSeed[] = [
  {
    slug: 'agentes-no-son-chatbots',
    title: {
      es: 'Los agentes no son chatbots con herramientas.',
      en: 'Agents are not chatbots with tools.',
    },
    subtitle: {
      es: 'Diseñar agentes útiles implica bastante más que conectar un LLM a una terminal.',
      en: 'Designing useful agents takes far more than connecting an LLM to a terminal.',
    },
    excerpt: {
      es: 'Un sistema agente empieza donde termina la demo: permisos, contexto, ejecución, observabilidad y errores que también hay que gestionar.',
      en: 'An agent system starts where the demo ends: permissions, context, execution, observability, and failures you still need to own.',
    },
    category: { es: 'IA / Agentes', en: 'AI / Agents' },
    readMinutes: 8,
    publishedAt: '2026-10-28T09:00:00.000Z',
    status: 'published',
    featured: true,
    body: {
      es: [
        {
          heading: 'El problema real',
          paragraph:
            'Una demo de agente puede impresionar en cinco minutos. Pero cuando lo dejas trabajando con repositorios, herramientas y permisos reales, aparecen problemas que no caben en un prompt.',
        },
        {
          heading: 'El enfoque',
          paragraph:
            'Me gusta separar el runtime de ejecución de la interfaz. El runtime se ocupa de sesiones, llamadas a herramientas, límites y estado; la UI muestra intención, progreso, evidencias y decisiones pendientes.',
        },
        {
          heading: 'Decisiones que importan',
          paragraph:
            'El sistema debe distinguir entre observar y modificar. Leer un fichero no tiene el mismo riesgo que lanzar un comando o escribir en producción. La autorización y los límites tienen que estar fuera del texto generado por el modelo.',
        },
      ],
      en: [
        {
          heading: 'The real problem',
          paragraph:
            'An agent demo can impress in five minutes. But when you put it to work with real repositories, tools and permissions, problems appear that no prompt can solve.',
        },
        {
          heading: 'The approach',
          paragraph:
            'I prefer to separate the execution runtime from the interface. The runtime owns sessions, tools, limits, and state; the UI displays intent, progress, evidence, and decisions awaiting approval.',
        },
        {
          heading: 'Decisions that matter',
          paragraph:
            'The system must distinguish observation from modification. Reading a file is not the same risk as running a command or changing production. Authorization and limits must live outside model-generated text.',
        },
      ],
    },
  },
  {
    slug: 'cache-contexto-subagentes',
    title: {
      es: 'Contexto, caché y subagentes: el coste invisible.',
      en: 'Context, caching, and subagents: the hidden cost.',
    },
    subtitle: {
      es: 'La orquestación no es gratis: se paga en tokens, latencia y coordinación.',
      en: 'Orchestration is not free: it costs tokens, latency, and coordination.',
    },
    excerpt: {
      es: 'Cuándo merece la pena delegar, qué contexto hay que compartir y por qué más agentes no siempre significa más productividad.',
      en: 'When delegation pays off, what context to share, and why more agents do not always mean more productivity.',
    },
    category: { es: 'IA / Agentes', en: 'AI / Agents' },
    readMinutes: 6,
    publishedAt: '2026-09-16T09:00:00.000Z',
    status: 'published',
    featured: false,
    body: {
      es: [
        {
          heading: 'El problema real',
          paragraph:
            'Cuantos más agentes invocas, más fácil parece repartir el trabajo. Pero cada delegación trae contexto duplicado, latencia y decisiones que coordinar.',
        },
        {
          heading: 'El enfoque',
          paragraph:
            'Prefiero que el coordinador entregue un contrato pequeño: objetivo, archivos relevantes, restricciones y formato del resultado. El contexto recuperable debería estar en una fuente compartida, no replicado en una docena de prompts.',
        },
        {
          heading: 'Decisiones que importan',
          paragraph:
            'La caché de prefijos ayuda si la estructura de los prompts es estable. Cambiar sistemáticamente el orden de instrucciones o herramientas puede anular parte del beneficio.',
        },
      ],
      en: [
        {
          heading: 'The real problem',
          paragraph:
            'The more agents you spawn, the easier delegation seems. But every handoff adds repeated context, latency, and coordination overhead.',
        },
        {
          heading: 'The approach',
          paragraph:
            'I prefer a small delegation contract: objective, relevant files, constraints, and output format. Recoverable context should live in a shared source instead of copied into a dozen prompts.',
        },
        {
          heading: 'Decisions that matter',
          paragraph:
            'Prefix caching helps when prompts stay structurally stable. Reordering instructions or tools can undermine part of that advantage.',
        },
      ],
    },
  },
  {
    slug: 'monolito-migracion',
    title: {
      es: 'De monolito a plataforma, sin hacer una reescritura suicida.',
      en: 'From monolith to platform without a reckless rewrite.',
    },
    subtitle: {
      es: 'La arquitectura de verdad se demuestra cuando convives con producción.',
      en: 'Architecture proves itself when it has to coexist with production.',
    },
    excerpt: {
      es: 'Contratos, modularidad, eventos y migración incremental. Lo importante no es cuántos microservicios tienes, sino cuánto riesgo introduces.',
      en: 'Contracts, modularity, events, and incremental migration. What matters is not service count, but how much risk you introduce.',
    },
    category: { es: 'Arquitectura', en: 'Architecture' },
    readMinutes: 10,
    publishedAt: '2026-08-05T09:00:00.000Z',
    status: 'published',
    featured: false,
    body: {
      es: [
        {
          heading: 'El problema real',
          paragraph:
            'Una migración arquitectónica no empieza cuando dibujas la nueva plataforma. Empieza cuando tienes que cambiar un sistema que ya sirve tráfico sin romperlo.',
        },
        {
          heading: 'El enfoque',
          paragraph:
            'Primero buscaría fronteras de dominio y contratos estables. Después decidiría qué módulos pueden independizarse sin generar una red de servicios excesivamente acoplados.',
        },
        {
          heading: 'Decisiones que importan',
          paragraph:
            'Modularidad antes que distribución. No todo módulo necesita ser un microservicio.',
        },
      ],
      en: [
        {
          heading: 'The real problem',
          paragraph:
            'An architectural migration does not start with a new platform diagram. It starts when you need to change a system serving real traffic without breaking it.',
        },
        {
          heading: 'The approach',
          paragraph:
            'I would first look for stable domain boundaries and contracts. Then decide which modules justify independence without creating an overly coupled service network.',
        },
        {
          heading: 'Decisions that matter',
          paragraph:
            'Modularity before distribution. Not every module deserves its own microservice.',
        },
      ],
    },
  },
  {
    slug: 'homelab-que-no-moleste',
    title: {
      es: 'Mi homelab no debería necesitar otro SRE.',
      en: 'My homelab should not need another SRE.',
    },
    subtitle: {
      es: 'Operar tus propios servicios sin crear una segunda jornada de trabajo.',
      en: 'Run your own services without creating a second full-time job.',
    },
    excerpt: {
      es: 'Proxmox, Docker, reverse proxies y servicios propios. Una infraestructura doméstica útil, sin mantener un Kubernetes por hobby.',
      en: 'Proxmox, Docker, reverse proxies, and self-hosted services. Useful home infrastructure without maintaining Kubernetes for fun.',
    },
    category: { es: 'Infra / Homelab', en: 'Infra / Homelab' },
    readMinutes: 7,
    publishedAt: '2026-06-24T09:00:00.000Z',
    status: 'published',
    featured: false,
    body: {
      es: [
        {
          heading: 'El problema real',
          paragraph:
            'Un homelab es fantástico hasta que una actualización rompe la red de casa y pasas la noche haciendo de soporte de tu propia infraestructura.',
        },
        {
          heading: 'El enfoque',
          paragraph:
            'Separaría cargas estables y laboratorios efímeros. Proxmox, contenedores y un proxy sencillo permiten montar servicios sin inventar una plataforma de orquestación gigante.',
        },
        {
          heading: 'Decisiones que importan',
          paragraph:
            'Haría copias verificadas de los datos y trataría la configuración de red como infraestructura crítica.',
        },
      ],
      en: [
        {
          heading: 'The real problem',
          paragraph:
            'A homelab is great until an update breaks your home network and you spend the evening supporting your own infrastructure.',
        },
        {
          heading: 'The approach',
          paragraph:
            'I would separate stable workloads from disposable experiments. Proxmox, containers, and a simple reverse proxy go a long way without inventing a huge orchestration platform.',
        },
        {
          heading: 'Decisions that matter',
          paragraph:
            'I would keep tested backups and treat network configuration as critical infrastructure.',
        },
      ],
    },
  },
  {
    slug: 'llm-local-cuando-compensa',
    title: {
      es: 'LLMs locales: cuándo compensa de verdad.',
      en: 'Local LLMs: when are they actually worth it?',
    },
    subtitle: {
      es: 'Elegir un modelo para un sistema real es bastante distinto a ganar un benchmark.',
      en: 'Choosing a model for production is nothing like winning a benchmark.',
    },
    excerpt: {
      es: 'VRAM, cuantización, latencia, privacidad y modelos MoE frente a densos. Decisiones de infraestructura, no una guerra de benchmarks.',
      en: 'VRAM, quantization, latency, privacy, and MoE versus dense models. Infrastructure choices, not a benchmark war.',
    },
    category: { es: 'IA / Agentes', en: 'AI / Agents' },
    readMinutes: 9,
    publishedAt: '2026-05-12T09:00:00.000Z',
    status: 'published',
    featured: false,
    body: {
      es: [
        {
          heading: 'El problema real',
          paragraph:
            'Tener un modelo en local mola, pero el hardware no desaparece de la ecuación. La VRAM y la latencia acaban decidiendo más que cualquier ranking.',
        },
        {
          heading: 'El enfoque',
          paragraph:
            'Empezaría midiendo tokens por segundo, tiempo al primer token, memoria de KV cache y calidad en tareas propias.',
        },
        {
          heading: 'Decisiones que importan',
          paragraph:
            'Denso frente a MoE, cuantización y tamaño de contexto son decisiones relacionadas.',
        },
      ],
      en: [
        {
          heading: 'The real problem',
          paragraph:
            'Running a local model is great, but hardware never disappears from the equation. VRAM and latency end up mattering more than benchmark rankings.',
        },
        {
          heading: 'The approach',
          paragraph:
            'I would measure tokens per second, time to first token, KV cache usage, and quality on real tasks.',
        },
        {
          heading: 'Decisions that matter',
          paragraph: 'Dense versus MoE, quantization, and context size are interdependent choices.',
        },
      ],
    },
  },
  {
    slug: 'nabla-harness-escritorio',
    title: {
      es: 'Nabla: la interfaz que quiero para trabajar con agentes.',
      en: 'Nabla: the interface I want for working with agents.',
    },
    subtitle: {
      es: 'Menos pestañas. Mejor contexto. Un espacio pensado para construir.',
      en: 'Fewer tabs. Better context. A workspace built for making things.',
    },
    excerpt: {
      es: 'Por qué estoy explorando un harness desktop con sesiones, herramientas, navegador, documentos y revisión de cambios en el mismo lugar.',
      en: 'Why I am exploring a desktop harness with sessions, tools, browser, documents, and diffs in one place.',
    },
    category: { es: 'Producto', en: 'Product' },
    readMinutes: 5,
    publishedAt: '2026-04-02T09:00:00.000Z',
    status: 'published',
    featured: false,
    body: {
      es: [
        {
          heading: 'El problema real',
          paragraph:
            'Quiero un entorno donde el agente pueda trabajar con código, documentos, navegador y terminal sin obligarme a vivir dentro de una conversación interminable.',
        },
        {
          heading: 'El enfoque',
          paragraph:
            'La idea de Nabla es mantener una superficie central para la conversación y la ejecución, un lateral para proyectos y sesiones, y un dock de trabajo para documentos, browser, diffs y terminal.',
        },
        {
          heading: 'Decisiones que importan',
          paragraph:
            'No quiero que la UI replique la lógica del agente. El bridge debe transportar eventos tipados, permisos y progreso, dejando al runtime la responsabilidad de ejecutar herramientas.',
        },
      ],
      en: [
        {
          heading: 'The real problem',
          paragraph:
            'I want a workspace where agents can operate with code, documents, browser and terminal without forcing me into one endless chat thread.',
        },
        {
          heading: 'The approach',
          paragraph:
            'The idea behind Nabla is a central surface for conversation and execution, a sidebar for projects and sessions, and a work dock for documents, browser, diffs, and terminal.',
        },
        {
          heading: 'Decisions that matter',
          paragraph:
            'The UI should not reimplement agent logic. The bridge moves typed events, permissions, and progress while the runtime owns tool execution.',
        },
      ],
    },
  },
]

export type HeroLineStyle = 'plain' | 'outlined' | 'accent'

/** Hero intro runs per locale; the bolded run renders as `<strong>` (see ./lexical). */
export type LocalizedRuns = { es: RichTextRun[]; en: RichTextRun[] }

export type AboutSeed = {
  name: string
  role: Localized
  availability: Localized
  sectionEyebrow: Localized
  sectionHeading: Localized
  sectionHeadingAccent: Localized
  bio: { es: string[]; en: string[] }
  heroLines: { text: Localized; style: HeroLineStyle }[]
  heroIntro: LocalizedRuns
  heroMeta: Localized[]
  principles: { index: string; title: Localized; body: Localized }[]
}

export const aboutSeed: AboutSeed = {
  name: 'Isaac Pepió',
  role: { es: 'CTO · Software Architect', en: 'CTO · Software Architect' },
  availability: {
    es: 'CTO · Arquitectura · IA aplicada',
    en: 'CTO · Architecture · Applied AI',
  },
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
}

export type ExperienceSeed = {
  company: string
  role: Localized
  /**
   * Period label exactly as the reference prints it. It is stored per locale because the
   * reference writes it by hand (e.g. "ABR — SEP 2025", without the start year) and the
   * dates below cannot reproduce that copy.
   */
  period: Localized
  description: Localized
  /** Mono tags under the description, in the reference order. */
  tags: string[]
  /** First of the month, so the UTC formatter never shifts it. */
  startDate: string
  /** Empty for the current role, which renders the `CURRENT` badge. */
  endDate: string | null
}

/** Career timeline, newest first, verbatim from the experience reference. */
export const experienceSeeds: ExperienceSeed[] = [
  {
    company: 'EASYGOBAND WORLD',
    role: { es: 'CTO / Tech Lead', en: 'CTO / Tech Lead' },
    period: { es: 'SEP 2025 — ACTUALIDAD', en: 'SEP 2025 — PRESENT' },
    description: {
      es: 'Dirección técnica de desarrollo, DevOps, QA, integraciones y ciberseguridad. Modernización de la plataforma, evolución arquitectónica hacia V2, automatización y adopción de IA en los procesos de ingeniería.',
      en: 'Technical leadership across development, DevOps, QA, integrations and cybersecurity. Platform modernization, V2 architecture, automation and the adoption of AI in engineering workflows.',
    },
    tags: ['TECH STRATEGY', 'PLATFORM', 'AWS / EKS', 'AI ENGINEERING'],
    startDate: '2025-09-01T00:00:00.000Z',
    endDate: null,
  },
  {
    company: 'TINEVERSE',
    role: { es: 'Tech Lead / Lead Software Engineer', en: 'Tech Lead / Lead Software Engineer' },
    period: { es: 'ABR — SEP 2025', en: 'APR — SEP 2025' },
    description: {
      es: 'Liderazgo técnico y desarrollo de software, con foco en la ejecución de producto, las decisiones de arquitectura y la coordinación de la entrega.',
      en: 'Technical leadership and software engineering with a focus on product delivery, architecture decisions and coordinating execution.',
    },
    tags: ['ENGINEERING', 'PRODUCT', 'TECH LEAD'],
    startDate: '2025-04-01T00:00:00.000Z',
    endDate: '2025-09-01T00:00:00.000Z',
  },
  {
    company: 'ORATREX TECH',
    role: { es: 'CTO / Tech Lead', en: 'CTO / Tech Lead' },
    period: { es: 'AGO 2023 — MAR 2025', en: 'AUG 2023 — MAR 2025' },
    description: {
      es: 'Responsabilidad sobre arquitectura y liderazgo de ingeniería. Desarrollo de soluciones, evolución de infraestructura y mejora del proceso de entrega.',
      en: 'Responsibility for architecture and engineering leadership. Building solutions, evolving infrastructure and improving software delivery.',
    },
    tags: ['ARCHITECTURE', 'DEVOPS', 'TEAM LEADERSHIP'],
    startDate: '2023-08-01T00:00:00.000Z',
    endDate: '2025-03-01T00:00:00.000Z',
  },
  {
    company: 'SEIDOR',
    role: {
      es: 'Consultor Senior SAP WM/EWM',
      en: 'Senior SAP WM/EWM Consultant',
    },
    period: { es: 'ABR 2022 — AGO 2023', en: 'APR 2022 — AUG 2023' },
    description: {
      es: 'Consultoría técnica y funcional en sistemas empresariales de logística y almacenes, integrando necesidades operativas con soluciones de software.',
      en: 'Technical and functional consulting in enterprise warehouse and logistics systems, bridging operational needs and software solutions.',
    },
    tags: ['SAP WM/EWM', 'ENTERPRISE', 'INTEGRATIONS'],
    startDate: '2022-04-01T00:00:00.000Z',
    endDate: '2023-08-01T00:00:00.000Z',
  },
  {
    company: 'GRUPO GIL COMES',
    role: {
      es: 'Senior Software Developer / SAP Developer',
      en: 'Senior Software Developer / SAP Developer',
    },
    period: { es: 'DIC 2017 — ABR 2022', en: 'DEC 2017 — APR 2022' },
    description: {
      es: 'Desarrollo de software e integraciones para procesos de negocio. Una etapa clave construyendo criterio de ingeniería desde la implementación y el mantenimiento de sistemas reales.',
      en: 'Software development and integrations for business workflows. A foundational period building engineering judgment through the implementation and maintenance of real systems.',
    },
    tags: ['SOFTWARE DEVELOPMENT', 'SAP', 'INTEGRATIONS'],
    startDate: '2017-12-01T00:00:00.000Z',
    endDate: '2022-04-01T00:00:00.000Z',
  },
]

export const contactSeed = {
  /** Inbox the section 05 form delivers to; the route reads it from the contact global. */
  email: 'isaac@ipepio.dev',
  /**
   * The profiles rendered by section 05, in the reference order. A row's icon and handle
   * are derived from its url, so a new social needs no component change.
   */
  socials: [
    { label: 'GitHub', url: 'https://github.com/ipepio' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/ipepio/' },
  ],
}
