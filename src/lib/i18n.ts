/** Locales the public site is served in; Payload localizes the same two codes. */
export const locales = ['es', 'en'] as const

export type Locale = (typeof locales)[number]

/** Spanish is the primary language of the portfolio and Payload's default locale. */
export const defaultLocale: Locale = 'es'

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (locales as readonly string[]).includes(value)
}

/** The counterpart locale, used by the nav language switcher. */
export function otherLocale(locale: Locale): Locale {
  return locale === 'es' ? 'en' : 'es'
}

/** Payload `Project.status` select values; only the label is localized. */
export type ProjectStatus = 'live' | 'wip' | 'archived'

/** Copy for the Projects grid chrome, which lives in a client component. */
export type ProjectsGridLabels = {
  filterGroup: string
  countOne: string
  countOther: string
  imageAltPrefix: string
  openPrefix: string
}

/**
 * Copy for a single project detail page (server-rendered, outside the grid).
 *
 * The strings that are not in `ProjectDetailCopy` (`imageAltPrefix`, `statusLabels`) are
 * borrowed from the projects section, so a status pill reads the same on both surfaces.
 */
export type ProjectDetailLabels = {
  backToProjects: string
  viewLive: string
  repository: string
  /** Prefix used to describe a cover image that has no alt text of its own. */
  imageAltPrefix: string
  /** Localized status pill labels; the same map the projects grid uses. */
  statusLabels: Record<ProjectStatus, string>
  /** Accessible name of the detail aside (the reference's `case-aside`). */
  asideLabel: string
  /** Head over the section index; the reference prints it uppercase. */
  onThisPage: string
  /** Accessible name of the section index list itself. */
  sectionIndexLabel: string
  /** Side label over the project's status (the reference's `case-side-label`). */
  caseStudy: string
  /** Side label over the project's links. */
  links: string
  /** Shown instead of the link buttons when a project has no public link. */
  noLinks: string
  /** Small label of the closing row's back block, after the `←` glyph. */
  backToWork: string
  /** Title of the closing row's back block: the work archive it leads to. */
  projectsArchive: string
  /** Small label of the closing row's next block, before the `→` glyph. */
  nextProject: string
}

/** The subset of `ProjectDetailLabels` that lives verbatim in the dictionary. */
export type ProjectDetailCopy = Pick<
  ProjectDetailLabels,
  | 'backToProjects'
  | 'viewLive'
  | 'repository'
  | 'asideLabel'
  | 'onThisPage'
  | 'sectionIndexLabel'
  | 'caseStudy'
  | 'links'
  | 'noLinks'
  | 'backToWork'
  | 'projectsArchive'
  | 'nextProject'
>

/**
 * Copy for the contact form (a client component): its chrome and its four states —
 * idle, sending, sent and error.
 */
export type ContactFormLabels = {
  /** Card heading over the fields. */
  title: string
  /** Mono line under the title. */
  subtitle: string
  nameLabel: string
  emailLabel: string
  messageLabel: string
  namePlaceholder: string
  emailPlaceholder: string
  messagePlaceholder: string
  /** Submit button, idle. */
  send: string
  /** Submit button while the request is in flight. */
  sending: string
  /** Announced after a 200. */
  sent: string
  /** Announced when the request fails for any other reason. */
  error: string
  /** Announced when the server rejects the payload (400). */
  invalid: string
  /** Announced when the server has no SMTP transport or no destination (503). */
  notConfigured: string
}

/** Copy for the contact section (05): the reference `footer.contact`. */
export type ContactLabels = {
  eyebrow: string
  /** First line of the display heading, above the accent. */
  heading: string
  /** Accented second line of the display heading. */
  headingAccent: string
  description: string
  /** Mono label over the social links; each link's own label comes from the global. */
  findMe: string
  form: ContactFormLabels
}

/** Copy for the CV callout that closes the experience intro column (`cv.*`). */
export type CvLabels = {
  /** Strong line: the CV title. */
  title: string
  /** Mono line under the title. */
  subtitle: string
  /** Link text; the reference appends a `↓` glyph after it. */
  download: string
}

/** Copy rendered by the sticky site header (a client component). */
export type NavLabels = {
  ariaLabel: string
  homeLabel: string
  links: {
    /** Anchor to the top of the page, first item in the link list. */
    home: string
    about: string
    skills: string
    projects: string
    experience: string
    contact: string
  }
  cta: string
  menuOpen: string
  menuClose: string
  languageSwitcher: {
    ariaLabel: string
    code: string
  }
}

/** Copy rendered by the hero portrait showcase (photo card, caption and terminal card). */
export type PortraitLabels = {
  /** Prefix of the figure's accessible name; the Payload `name` is appended. */
  figureLabel: string
  /** Chip over the photo, mono uppercase. */
  topline: string
  /** Second half of the lime caption index, after the fixed `01 — `. */
  index: string
  /** Mono role line under the name; the Payload `role` wins when it is set. */
  roleLine: string
  /** Path in the floating terminal card header. */
  floatPath: string
  /** State label next to the lime LED in the terminal header. */
  floatStatus: string
  /** Shell prompt symbol of the fake build command. */
  floatPrompt: string
  /** Command name, after the prompt. */
  floatCommand: string
  /** Command flags, rendered in the lime accent one per line. */
  floatFlags: string[]
  /** Human sentence in the terminal footer. */
  floatNote: string
  /** Exit status in the terminal footer. */
  floatExit: string
  /** Words either side of the lime rule under the showcase. */
  decoration: string
  /** Mono index closing the decoration row. */
  decorationIndex: string
}

/** Copy for the hero section's own chrome; its headline, intro and meta come from Payload. */
export type HeroCopy = {
  primaryCta: string
  secondaryCta: string
  /** Entry to the blog application, which lives on its own address. */
  blogCta: string
}

/** Copy for the About section (01), including the fallbacks for its Payload fields. */
export type AboutCopy = {
  eyebrow: string
  heading: string
  /** Accessible name for the skill orbit graph. */
  orbitLabel: string
  /** Line under the bio that leads to the blog. */
  blogLink: string
}

/** Copy for the skills band (02): the aside and the two tool belts. */
export type ExpertiseCopy = {
  eyebrow: string
  heading: string
  /** Trailing part of the heading, rendered in the primary accent. */
  headingAccent: string
  description: string
  /** Mono footnote pinned under the description. */
  note: string
  /** Label over the capability list. */
  areasLabel: string
  /** Label over the core tool chips. */
  coreLabel: string
  /** Small mono tag next to `coreLabel`. */
  coreTag: string
  /** Label over the extended tool chips. */
  extendedLabel: string
  /** Small mono tag next to `extendedLabel`. */
  extendedTag: string
  /** Closing sentence under the extended chips. */
  toolsFoot: string
}

/** Copy for the experience section (04), CV callout included. */
export type ExperienceCopy = {
  eyebrow: string
  /** Display heading, without the accent tail. Real newlines become forced breaks. */
  heading: string
  /** Accented tail of the heading, rendered in the primary colour. */
  headingAccent: string
  /** Intro paragraph of the left column. */
  intro: string
  /** Label next to the `2017 →` stat. */
  stat: string
  /** Badge on the role that has no end date yet. */
  current: string
  /** CV callout under the experience stats (`cv.*`). */
  cv: CvLabels
}

/** Copy for the philosophy band that closes the skills section. */
export type ManifestoCopy = {
  /** Accessible name for the band; its two visible strings are untranslated. */
  label: string
}

/** Copy for the projects section (03): its header and the chrome of the client grid. */
export type ProjectsCopy = {
  eyebrow: string
  heading: string
  note: string
  allLabel: string
  statusLabels: Record<ProjectStatus, string>
  gridLabels: ProjectsGridLabels
  /** Copy for the `/projects/[slug]` detail page, which sits outside this section. */
  detail: ProjectDetailCopy
}

/** Copy for the contact section (05): the band, the socials label and the form. */
export type ContactCopy = ContactLabels

/** Copy for the footer strip, mirroring the reference `.footer-bottom`. */
export type FooterCopy = {
  /** Closing sentence of the copyright line. */
  made: string
  /** CV download label, before the arrow. */
  cv: string
  /** Link to the blog application. */
  blog: string
  /** Scroll-back-to-top label. */
  backToTop: string
}

export type Dictionary = {
  nav: NavLabels
  hero: HeroCopy
  /** Copy for the hero's right column (portrait showcase). */
  portrait: PortraitLabels
  about: AboutCopy
  expertise: ExpertiseCopy
  experience: ExperienceCopy
  manifesto: ManifestoCopy
  projects: ProjectsCopy
  contact: ContactCopy
  footer: FooterCopy
}

const dictionaries: Record<Locale, Dictionary> = {
  es: {
    nav: {
      ariaLabel: 'Principal',
      homeLabel: 'ipepio — inicio',
      links: {
        home: 'Inicio',
        about: 'Sobre mí',
        skills: 'Skills',
        projects: 'Proyectos',
        experience: 'Experiencia',
        contact: 'Contacto',
      },
      cta: 'Hablemos',
      menuOpen: 'Abrir menú',
      menuClose: 'Cerrar menú',
      languageSwitcher: { ariaLabel: 'Cambiar a inglés', code: 'EN' },
    },
    hero: {
      primaryCta: '¿Quién soy?',
      secondaryCta: 'Escríbeme',
      blogCta: 'Blog / Mis movidas',
    },
    portrait: {
      figureLabel: 'Retrato de',
      topline: 'THE HUMAN BEHIND THE SYSTEMS',
      index: 'PERSON / ENGINEER',
      roleLine: 'CTO · SOFTWARE ARCHITECT · BUILDER',
      floatPath: '~/ipepio/about.sh',
      floatStatus: 'RUNNING',
      floatPrompt: '$',
      floatCommand: 'build',
      floatFlags: ['--pragmatic', '--secure --scalable'],
      floatNote: 'De la idea a producción.',
      floatExit: 'exit 0 ✓',
      decoration: 'DESIGN · CODE · OPERATE',
      decorationIndex: '001/∞',
    },
    about: {
      eyebrow: '01 / SOBRE MÍ',
      heading: 'Cómo trabajo.',
      orbitLabel: 'Áreas de especialidad',
      blogLink: 'Leo, pruebo, rompo y escribo sobre ello en el blog.',
    },
    expertise: {
      eyebrow: '02 / LO QUE HAGO',
      heading: 'Del problema al',
      headingAccent: 'sistema.',
      description:
        'Diseño, construyo y opero soluciones de extremo a extremo. Mi valor está en conectar arquitectura, producto, infraestructura y personas, no en acumular frameworks.',
      note: 'Las herramientas cambian. El criterio permanece.',
      areasLabel: 'CAPACIDADES / CÓMO APORTO VALOR',
      coreLabel: 'HERRAMIENTAS CON LAS QUE MÁS ME IDENTIFICO',
      coreTag: 'CORE TOOLKIT',
      extendedLabel: 'TAMBIÉN PRESENTES EN MI TRABAJO Y PROYECTOS',
      extendedTag: 'EXTENDED TOOLKIT',
      toolsFoot:
        'El stack es una caja de herramientas. En cada proyecto, elijo lo que aporta simplicidad, rendimiento y autonomía al equipo.',
    },
    experience: {
      eyebrow: '04 / TRAYECTORIA',
      heading: 'Del código\nal',
      headingAccent: 'liderazgo.',
      intro:
        'He pasado de construir aplicaciones a liderar equipos y definir la arquitectura de plataformas completas, sin alejarme de la ingeniería.',
      stat: 'Ingeniería de software, arquitectura y dirección técnica',
      current: 'ACTUAL',
      cv: {
        title: 'Trayectoria en PDF',
        subtitle: 'Experiencia · formación · competencias',
        download: 'Descargar CV',
      },
    },
    manifesto: {
      label: 'Filosofía',
    },
    projects: {
      eyebrow: '03 / PROYECTOS SELECCIONADOS',
      heading: 'Ideas que se convierten en sistemas.',
      note: 'Una mezcla de productos propios, investigación aplicada y arquitectura profesional. Algunos están en desarrollo o son privados.',
      allLabel: 'Todos',
      statusLabels: {
        live: 'En producción',
        wip: 'En desarrollo',
        archived: 'Archivado',
      },
      gridLabels: {
        filterGroup: 'Filtrar proyectos',
        countOne: 'proyecto',
        countOther: 'proyectos',
        imageAltPrefix: 'Imagen de',
        openPrefix: 'Abrir',
      },
      detail: {
        backToProjects: 'Volver a proyectos',
        viewLive: 'Ver en producción',
        repository: 'Repositorio',
        asideLabel: 'Navegación del proyecto',
        onThisPage: 'En esta página',
        sectionIndexLabel: 'Apartados del proyecto',
        caseStudy: 'Caso de estudio',
        links: 'Enlaces',
        noLinks:
          'Proyecto privado o sin despliegue público verificable. No muestro enlaces ficticios.',
        backToWork: 'Volver al trabajo',
        projectsArchive: 'Todos los proyectos',
        nextProject: 'Siguiente proyecto',
      },
    },
    footer: {
      made: 'Diseñado y construido con intención.',
      cv: 'CV / PDF',
      blog: 'BLOG / JOURNAL',
      backToTop: 'VOLVER ARRIBA',
    },
    contact: {
      eyebrow: '05 / CONTACTO',
      heading: '¿Hacemos',
      headingAccent: 'algo serio?',
      description:
        'Si tienes un producto complejo, un reto de arquitectura o una idea con IA que llevar a producción, cuéntamelo. Me interesa entender el problema antes de hablar de herramientas.',
      findMe: 'ENCUÉNTRAME TAMBIÉN EN',
      form: {
        title: 'Cuéntame tu idea.',
        subtitle: 'UN MENSAJE / SIN REUNIONES INNECESARIAS',
        nameLabel: 'Tu nombre *',
        emailLabel: 'Tu email *',
        messageLabel: 'El mensaje *',
        namePlaceholder: '¿Cómo te llamas?',
        emailPlaceholder: 'tu@empresa.com',
        messagePlaceholder: '¿Qué estás construyendo? ¿Cuál es el reto?',
        send: 'Enviar mensaje',
        sending: 'Enviando…',
        sent: 'Mensaje enviado correctamente. Gracias por contactar.',
        error: 'No se pudo enviar el mensaje. Inténtalo de nuevo.',
        invalid:
          'Completa los campos requeridos y revisa el email. El mensaje debe tener al menos 15 caracteres.',
        notConfigured: 'El envío aún no está configurado. No se ha enviado ningún mensaje.',
      },
    },
  },
  en: {
    nav: {
      ariaLabel: 'Main',
      homeLabel: 'ipepio — home',
      links: {
        home: 'Home',
        about: 'About',
        skills: 'Skills',
        projects: 'Projects',
        experience: 'Experience',
        contact: 'Contact',
      },
      cta: "Let's talk",
      menuOpen: 'Open menu',
      menuClose: 'Close menu',
      languageSwitcher: { ariaLabel: 'Switch to Spanish', code: 'ES' },
    },
    hero: {
      primaryCta: 'Who am I?',
      secondaryCta: 'Get in touch',
      blogCta: 'Blog / Field notes',
    },
    portrait: {
      figureLabel: 'Portrait of',
      topline: 'THE HUMAN BEHIND THE SYSTEMS',
      index: 'PERSON / ENGINEER',
      roleLine: 'CTO · SOFTWARE ARCHITECT · BUILDER',
      floatPath: '~/ipepio/about.sh',
      floatStatus: 'RUNNING',
      floatPrompt: '$',
      floatCommand: 'build',
      floatFlags: ['--pragmatic', '--secure --scalable'],
      floatNote: 'From idea to production.',
      floatExit: 'exit 0 ✓',
      decoration: 'DESIGN · CODE · OPERATE',
      decorationIndex: '001/∞',
    },
    about: {
      eyebrow: '01 / ABOUT',
      heading: 'How I work.',
      orbitLabel: 'Areas of expertise',
      blogLink: 'I read, experiment, break things, and write about it on the blog.',
    },
    expertise: {
      eyebrow: '02 / WHAT I DO',
      heading: 'From problem to',
      headingAccent: 'system.',
      description:
        'I design, build and run end-to-end solutions. My edge is connecting architecture, product, infrastructure and people—not collecting frameworks.',
      note: 'Tools change. Engineering judgment endures.',
      areasLabel: 'CAPABILITIES / HOW I CREATE VALUE',
      coreLabel: 'MY GO-TO TOOLS',
      coreTag: 'CORE TOOLKIT',
      extendedLabel: 'ALSO PART OF MY WORK & PROJECTS',
      extendedTag: 'EXTENDED TOOLKIT',
      toolsFoot:
        'The stack is a toolbox. For each project I choose what helps the team stay fast, maintainable and independent.',
    },
    experience: {
      eyebrow: '04 / TRACK RECORD',
      heading: 'From code\nto',
      headingAccent: 'leadership.',
      intro:
        'I have gone from building applications to leading teams and designing entire platforms, while staying close to engineering.',
      stat: 'Software engineering, architecture and technical leadership',
      current: 'CURRENT',
      cv: {
        title: 'Career in PDF',
        subtitle: 'Experience · education · skills',
        download: 'Download CV',
      },
    },
    manifesto: {
      label: 'Philosophy',
    },
    projects: {
      eyebrow: '03 / SELECTED WORK',
      heading: 'Ideas turned into systems.',
      note: 'A mix of own products, applied research, and professional architecture. Some are in progress or private.',
      allLabel: 'All',
      statusLabels: {
        live: 'Live',
        wip: 'In progress',
        archived: 'Archived',
      },
      gridLabels: {
        filterGroup: 'Filter projects',
        countOne: 'project',
        countOther: 'projects',
        imageAltPrefix: 'Image of',
        openPrefix: 'Open',
      },
      detail: {
        backToProjects: 'Back to projects',
        viewLive: 'View live',
        repository: 'Repository',
        asideLabel: 'Project navigation',
        onThisPage: 'On this page',
        sectionIndexLabel: 'Project sections',
        caseStudy: 'Case study',
        links: 'Links',
        noLinks: 'Private project or no verified public deployment. No placeholder links.',
        backToWork: 'Back to work',
        projectsArchive: 'All projects',
        nextProject: 'Next project',
      },
    },
    footer: {
      made: 'Designed and built with intent.',
      cv: 'CV / PDF',
      blog: 'BLOG / JOURNAL',
      backToTop: 'BACK TO TOP',
    },
    contact: {
      eyebrow: '05 / CONTACT',
      heading: "Let's build",
      headingAccent: 'something real.',
      description:
        "Have a complex product, an architecture challenge or an AI idea to ship? Tell me what you're building. I'd rather understand the problem before talking tools.",
      findMe: 'FIND ME ALSO ON',
      form: {
        title: 'Tell me about it.',
        subtitle: 'ONE MESSAGE / NO UNNECESSARY MEETINGS',
        nameLabel: 'Your name *',
        emailLabel: 'Your email *',
        messageLabel: 'Your message *',
        namePlaceholder: 'What should I call you?',
        emailPlaceholder: 'you@company.com',
        messagePlaceholder: 'What are you building? What is the challenge?',
        send: 'Send message',
        sending: 'Sending…',
        sent: 'Message sent successfully. Thanks for reaching out.',
        error: 'Could not send the message. Please try again.',
        invalid:
          'Fill in the required fields, check the email, and write at least 15 characters in the message.',
        notConfigured: 'Sending is not configured yet. Nothing has been sent.',
      },
    },
  },
}

/** Copy for one locale. The argument is already validated by the route. */
export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale]
}
