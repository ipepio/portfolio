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
  /** Document title of the article page; `{title}` is the note's own title. */
  articleDocumentTitle: string
  /** Byline: the author and the handle the reference prints beside it. */
  authorName: string
  authorHandle: string
  /** Monogram in the byline avatar. */
  authorInitials: string
  articleReadMinutes: string
  articleDraft: string
  articleCoverLabel: string
  tocLabel: string
  tocTitle: string
  sideNoteTitle: string
  sideNoteBody: string
  nextNoteKicker: string
  nextNoteAction: string
  /** Accessible name of the header's own nav landmark. */
  navLabel: string
  /** Accessible name of the identity link: the monogram plus what it leads to. */
  navBrandLabel: string
  /** The word after the identity's slash — the journal as this locale names it. */
  navSection: string
  navIndex: string
  navPortfolio: string
  /** Accessible name of the portfolio link: another site, opened in a new tab. */
  navPortfolioLabel: string
  navThemeToLight: string
  navThemeToDark: string
  /** Accessible name of the language switch: the page it leads to, not the current one. */
  navLanguageLabel: string
  notFoundDocumentTitle: string
  notFoundKicker: string
  /** The 404 headline, split like the hero's: a plain lead and an accented end. */
  notFoundTitleLead: string
  notFoundTitleAccent: string
  notFoundLead: string
  notFoundIndex: string
  notFoundFeatured: string
  /** Draft preview strip (T12): shown only while Next's draft mode is on. */
  previewStrip: string
  /** Label of the strip's link out of draft mode. */
  previewExit: string
}

const es: JournalCopy = {
  documentTitle: 'Isaac Pepió - Blog',
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
  articleDocumentTitle: '{title} — Isaac Pepió - Blog',
  authorName: 'Isaac Pepió',
  authorHandle: 'ipepio',
  authorInitials: 'IP',
  articleReadMinutes: '{minutes} MIN DE LECTURA',
  articleDraft: 'BORRADOR DE DISEÑO',
  articleCoverLabel: 'ENGINEERING / FIELD NOTES / {serial}',
  tocLabel: 'EN ESTA NOTA',
  tocTitle: 'Contenido',
  sideNoteTitle: '// DISCLAIMER',
  sideNoteBody:
    'Este artículo es una muestra de diseño. El contenido final se publicaría con sus ejemplos, código y referencias reales.',
  nextNoteKicker: 'SIGUIENTE NOTA',
  nextNoteAction: 'Leer siguiente',
  navLabel: 'Navegación principal',
  navBrandLabel: 'IPEPIO / BLOG — portada del blog',
  navSection: 'BLOG',
  navIndex: 'ARCHIVO',
  navPortfolio: 'PORTFOLIO',
  navPortfolioLabel: 'IPEPIO / PORTFOLIO — se abre en otra pestaña',
  navThemeToLight: 'Cambiar a tema claro',
  navThemeToDark: 'Cambiar a tema oscuro',
  navLanguageLabel: 'Ver esta página en inglés',
  notFoundDocumentTitle: 'Página no encontrada — Isaac Pepió - Blog',
  notFoundKicker: 'ERROR 404 / RUTA PERDIDA',
  notFoundTitleLead: 'Esta nota',
  notFoundTitleAccent: 'no existe.',
  notFoundLead:
    'La nota o la página que buscas no está aquí. Puede que la URL tenga una errata, que la nota solo esté publicada en el otro idioma o que todavía sea un borrador.',
  notFoundIndex: '← Volver al blog',
  notFoundFeatured: 'Leer la nota destacada',
  previewStrip: 'BORRADOR · VISTA PREVIA',
  previewExit: 'Salir de la vista previa',
}

const en: JournalCopy = {
  documentTitle: 'Isaac Pepió - Blog',
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
  articleDocumentTitle: '{title} — Isaac Pepió - Blog',
  authorName: 'Isaac Pepió',
  authorHandle: 'ipepio',
  authorInitials: 'IP',
  articleReadMinutes: '{minutes} MIN READ',
  articleDraft: 'DESIGN DRAFT',
  articleCoverLabel: 'ENGINEERING / FIELD NOTES / {serial}',
  tocLabel: 'IN THIS NOTE',
  tocTitle: 'Table of contents',
  sideNoteTitle: '// DISCLAIMER',
  sideNoteBody:
    'This is a layout sample. Actual posts would include real-world examples, code, and sources.',
  nextNoteKicker: 'NEXT NOTE',
  nextNoteAction: 'Read next',
  navLabel: 'Main navigation',
  navBrandLabel: 'IPEPIO / JOURNAL — blog index',
  navSection: 'JOURNAL',
  navIndex: 'ARCHIVE',
  navPortfolio: 'PORTFOLIO',
  navPortfolioLabel: 'IPEPIO / PORTFOLIO — opens in a new tab',
  navThemeToLight: 'Switch to light theme',
  navThemeToDark: 'Switch to dark theme',
  navLanguageLabel: 'View this page in Spanish',
  notFoundDocumentTitle: 'Page not found — Isaac Pepió - Blog',
  notFoundKicker: 'ERROR 404 / LOST ROUTE',
  notFoundTitleLead: 'This note',
  notFoundTitleAccent: 'does not exist.',
  notFoundLead:
    'The note or page you are looking for is not here. The URL may have a typo, the note may only be published in the other language, or it may still be a draft.',
  notFoundIndex: '← Back to the journal',
  notFoundFeatured: 'Read the featured note',
  previewStrip: 'DRAFT · PREVIEW',
  previewExit: 'Exit preview',
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
