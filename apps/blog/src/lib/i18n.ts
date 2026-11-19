/**
 * The blog's own dictionary.
 *
 * The blog is a separate application, so it cannot borrow the portfolio's copy: every
 * user-visible string of the index lives here, in both locales (S9). The Spanish/English
 * wording is transcribed from the design reference's inline copies
 * (`/Users/ipepio/Desktop/portfolio_y_blog_ipepio/blog.html`).
 *
 * Strings that contain a variable are templates: `{placeholder}` is filled by `format`.
 * Decorative cover art and code samples are deliberately not translated (S7): they are
 * identical in both locales, as in the reference.
 */
import type { Locale } from './payload'

export type JournalCopy = {
  /** Document title per locale, used by the pages' metadata. */
  documentTitle: string
  skipToContent: string
  breadcrumbLabel: string
  breadcrumbHome: string
  breadcrumbSection: string
  heroKicker: string
  heroTitleLead: string
  heroTitleMiddle: string
  heroTitleAccent: string
  heroLead: string
  asideCommand: string
  asideOpinion: string
  asideLoop: string
  draftNotice: string
  featuredKicker: string
  featuredRead: string
  featuredByline: string
  featuredNote: string
  archiveKicker: string
  archiveTitleLead: string
  archiveTitleAccent: string
  /** Plain archive heading, for metadata that cannot hold markup. */
  archiveTitle: string
  archivePageTitle: string
  notesCount: string
  cardCategory: string
  cardMeta: string
  readMinutes: string
  emptyArchive: string
  paginationLabel: string
  previousPage: string
  nextPage: string
  pageStatus: string
  footerRights: string
  footerPortfolio: string
  coverLabel: string
  cardSerial: string
  featureCoverCorner: string
  featureCoverId: string
  featureCoverPosition: string
}

const es: JournalCopy = {
  documentTitle: 'Journal — IPEPIO / Field notes',
  skipToContent: 'Saltar al contenido',
  breadcrumbLabel: 'Ruta de navegación',
  breadcrumbHome: 'IPEPIO',
  breadcrumbSection: 'JOURNAL',
  heroKicker: 'EL CUADERNO DE INGENIERÍA',
  heroTitleLead: 'Cosas que',
  heroTitleMiddle: 'me',
  heroTitleAccent: 'rondan.',
  heroLead:
    'Arquitectura, IA, desarrollo, infraestructura y experimentos propios. Lo que construyo, lo que rompo y lo que aprendo por el camino. Sin promesas de gurú.',
  asideCommand: 'cat ~/notes/about.md',
  asideOpinion: 'Opiniones técnicas, no dogmas',
  asideLoop: 'Build → break → learn → repeat',
  draftNotice: 'CONCEPTO VISUAL · LOS ARTÍCULOS SON EJEMPLOS',
  featuredKicker: 'EN PRIMER PLANO',
  featuredRead: 'LECTURA · {minutes} MIN',
  featuredByline: 'POR ISAAC PEPIÓ',
  featuredNote: 'ARTÍCULO DE EJEMPLO',
  archiveKicker: 'ARCHIVO / TEMAS',
  archiveTitleLead: 'En el',
  archiveTitleAccent: 'radar.',
  archiveTitle: 'En el radar.',
  archivePageTitle: 'En el radar. — Página {page}',
  notesCount: '{count} NOTAS',
  cardCategory: '{category} / {minutes} MIN',
  cardMeta: 'BORRADOR DE EJEMPLO',
  readMinutes: '{minutes} MIN',
  emptyArchive: 'Todavía no hay notas publicadas.',
  paginationLabel: 'Paginación del archivo',
  previousPage: '← Anterior',
  nextPage: 'Siguiente →',
  pageStatus: 'PÁGINA {page} / {total}',
  footerRights: '© IPEPIO / FIELD NOTES — PREVISUALIZACIÓN EDITORIAL',
  footerPortfolio: '← Portfolio',
  coverLabel: 'ENGINEERING / NOTES',
  cardSerial: 'N° {serial}',
  featureCoverCorner: 'IPEPIO / ENGINEERING NOTES',
  featureCoverId: 'NOTE / {serial}',
  featureCoverPosition: '{index} / {total}',
}

const en: JournalCopy = {
  documentTitle: 'Journal — IPEPIO / Field notes',
  skipToContent: 'Skip to content',
  breadcrumbLabel: 'Breadcrumb',
  breadcrumbHome: 'IPEPIO',
  breadcrumbSection: 'JOURNAL',
  heroKicker: 'NOTES FROM THE ENGINE ROOM',
  heroTitleLead: 'Things on',
  heroTitleMiddle: 'my',
  heroTitleAccent: 'mind.',
  heroLead:
    'Architecture, AI, software, infrastructure and side experiments. What I build, what breaks, and what I learn along the way. No guru promises.',
  asideCommand: 'cat ~/notes/about.md',
  asideOpinion: 'Engineering opinions, not dogma',
  asideLoop: 'Build → break → learn → repeat',
  draftNotice: 'VISUAL CONCEPT · ARTICLES ARE SAMPLES',
  featuredKicker: 'FEATURED NOTE',
  featuredRead: '{minutes} MIN READ',
  featuredByline: 'BY ISAAC PEPIÓ',
  featuredNote: 'SAMPLE ARTICLE',
  archiveKicker: 'ARCHIVE / TOPICS',
  archiveTitleLead: 'On my',
  archiveTitleAccent: 'radar.',
  archiveTitle: 'On my radar.',
  archivePageTitle: 'On my radar. — Page {page}',
  notesCount: '{count} NOTES',
  cardCategory: '{category} / {minutes} MIN',
  cardMeta: 'SAMPLE DRAFT',
  readMinutes: '{minutes} MIN',
  emptyArchive: 'No published notes yet.',
  paginationLabel: 'Archive pagination',
  previousPage: '← Previous',
  nextPage: 'Next →',
  pageStatus: 'PAGE {page} / {total}',
  footerRights: '© IPEPIO / FIELD NOTES — EDITORIAL PREVIEW',
  footerPortfolio: '← Portfolio',
  coverLabel: 'ENGINEERING / NOTES',
  cardSerial: 'N° {serial}',
  featureCoverCorner: 'IPEPIO / ENGINEERING NOTES',
  featureCoverId: 'NOTE / {serial}',
  featureCoverPosition: '{index} / {total}',
}

const dictionaries: Record<Locale, JournalCopy> = { es, en }

/** The copy for one locale; keys are shared by both dictionaries, so nothing can be missing. */
export function getDictionary(locale: Locale): JournalCopy {
  return dictionaries[locale]
}

/** Fill `{placeholder}` slots in a template. Unknown placeholders are left untouched. */
export function format(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  )
}

/** Zero-padded index used by the counter, the serials and the page status, as in the reference. */
export function pad(value: number, length = 2): string {
  return String(value).padStart(length, '0')
}
