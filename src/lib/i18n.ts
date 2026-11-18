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

/** Copy for a single project detail page (server-rendered, outside the grid). */
export type ProjectDetailLabels = {
  backToProjects: string
  viewLive: string
  repository: string
  /** Prefix used to describe a cover image that has no alt text of its own. */
  imageAltPrefix: string
  /** Localized status pill labels; the same map the projects grid uses. */
  statusLabels: Record<ProjectStatus, string>
}

/** The subset of `ProjectDetailLabels` that lives verbatim in the dictionary. */
export type ProjectDetailCopy = Pick<
  ProjectDetailLabels,
  'backToProjects' | 'viewLive' | 'repository'
>

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

export type Dictionary = {
  nav: NavLabels
  hero: {
    primaryCta: string
    secondaryCta: string
  }
  /** Copy for the hero's right column (portrait showcase). */
  portrait: PortraitLabels
  about: {
    eyebrow: string
    heading: string
    /** Accessible name for the skill orbit graph. */
    orbitLabel: string
    educationHeading: string
    languagesHeading: string
  }
  skills: {
    eyebrow: string
    heading: string
    /** Trailing part of the heading, rendered in the lima accent. */
    headingAccent: string
    subheading: string
  }
  experience: {
    eyebrow: string
    heading: string
    note?: string
    /** Label shown in place of a missing `endDate` (current role). */
    present: string
  }
  projects: {
    eyebrow: string
    heading: string
    note: string
    allLabel: string
    statusLabels: Record<ProjectStatus, string>
    gridLabels: ProjectsGridLabels
    /** Copy for the `/projects/[slug]` detail page. */
    detail: ProjectDetailCopy
  }
  contact: {
    eyebrow: string
    heading: string
  }
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
      educationHeading: 'Formación',
      languagesHeading: 'Idiomas',
    },
    skills: {
      eyebrow: 'LO QUE HAGO',
      heading: 'Habilidades técnicas',
      headingAccent: 'por área.',
      subheading:
        'Un perfil transversal que abarca desde el código hasta la infraestructura, pasando por la IA, la calidad y la seguridad.',
    },
    experience: {
      eyebrow: '03 / TRAYECTORIA',
      heading: 'Dónde he trabajado.',
      present: 'Actualidad',
    },
    projects: {
      eyebrow: '02 / PROYECTOS SELECCIONADOS',
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
      },
    },
    contact: {
      eyebrow: '04 / CONTACTO',
      heading: '¿Hablamos?',
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
      educationHeading: 'Education',
      languagesHeading: 'Languages',
    },
    skills: {
      eyebrow: 'WHAT I DO',
      heading: 'Technical skills',
      headingAccent: 'by area.',
      subheading:
        'A cross-cutting profile that spans from code to infrastructure, through AI, quality, and security.',
    },
    experience: {
      eyebrow: '03 / TRACK RECORD',
      heading: "Where I've worked.",
      present: 'Present',
    },
    projects: {
      eyebrow: '02 / SELECTED WORK',
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
      },
    },
    contact: {
      eyebrow: '04 / CONTACT',
      heading: 'Shall we talk?',
    },
  },
}

/** Copy for one locale. The argument is already validated by the route. */
export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale]
}
