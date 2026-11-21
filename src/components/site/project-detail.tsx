import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

import { MarkdownBlocks } from '@/components/site/markdown-body'
import { ProjectAside } from '@/components/site/project-aside'
import type { ProjectItem } from '@/components/site/projects-grid'
import {
  formatNumber,
  ProjectVisual,
  VisualHead,
  visualHeadCopy,
} from '@/components/site/project-visuals'
import type { Locale, ProjectDetailLabels, ProjectStatus } from '@/lib/i18n'
import { parseMarkdown, type MarkdownBlock } from '@/lib/markdown'

/** Payload `Project` at `depth >= 1`, narrowed to what the detail page renders. */
export type ProjectDetailItem = ProjectItem & {
  /** Raw markdown (`textarea`): headings, lists, links, fences, callouts, ```mermaid diagrams. */
  longDescription?: string | null
  /** Payload `projects.hero`: every piece of the editable hero, all of it optional. */
  hero?: ProjectHero | null
}

/**
 * The `hero` group of a project (T1: S1-S5, S7): the layout select, the eyebrow beside the
 * derived index, the markdown lead, the trait pills, and the optional label of the visual.
 */
export type ProjectHero = {
  /** `split` (the reference, two columns) or `stacked` (the page's original shape). */
  heroLayout?: HeroLayout | null
  /** Mono line beside the derived index, e.g. `AI INFRASTRUCTURE / MCP`. */
  heroEyebrow?: string | null
  /** Markdown lead of the hero; falls back to `shortDescription` when empty. */
  heroLead?: string | null
  /** Trait pills (`Open source`, `MIT`, …); unrelated to the archive filter `tags`. */
  /** Path-like label, e.g. `ipepio / projects / discord`, painted on the visual's corner. */
  cardLabel?: string | null
  /** Off by default, so a project never grows a label it did not ask for. */
  showCardLabel?: boolean | null
}

/** Payload `projects.hero.heroLayout`; anything else renders the split hero. */
export type HeroLayout = 'split' | 'stacked'

/** The project the closing row leads to, resolved by the page from the archive order. */
export type ProjectDetailNeighbour = {
  slug: string
  title: string
}

/**
 * Where this project sits in the published archive: its one-based position and the archive
 * size, both derived on the server from the `order` sort. Stored nowhere, so reordering the
 * archive (or publishing one more project) can never leave a stale `06 / 06` on the page.
 */
export type ProjectArchiveIndex = {
  position: number
  total: number
}

export type ProjectDetailProps = {
  project: ProjectDetailItem
  /** Current locale, used for the back link into the home `#projects` section. */
  locale: Locale
  labels: ProjectDetailLabels
  /** The next project in the archive (wrapping at the end), or `null` for a lone project. */
  nextProject?: ProjectDetailNeighbour | null
  /** The hero's `NN / TT`, or `null` when the project is missing from the archive read. */
  archiveIndex?: ProjectArchiveIndex | null
}

const HEADING_ID = 'project-detail-heading'
const DETAIL_IMAGE_SIZES = '(min-width: 1280px) 1216px, 100vw'
/** The diagram keeps its card proportions, centred in the detail column. */
const DETAIL_VISUAL =
  'mx-auto w-full max-w-[520px] overflow-hidden rounded-2xl border border-border bg-secondary'

/** Only the label is localized; the pill palette stays design-owned. */
const STATUS_CLASSNAMES: Record<ProjectStatus, string> = {
  live: 'border-primary/40 bg-primary/12 text-primary',
  wip: 'border-accent/40 bg-accent/12 text-accent',
  archived: 'border-border bg-secondary text-muted-foreground',
}

/** The reference's `.case-back` / `.case-next-link`. */
const CLOSING_BLOCK =
  'flex min-w-0 flex-1 flex-col justify-center gap-2 rounded-[14px] border border-border bg-card px-6 py-6 transition-[border-color,transform] hover:-translate-y-0.5 hover:border-primary'
/** Their `small`: the mono label that names where the block leads. */
const CLOSING_LABEL =
  'mono text-[10px] font-semibold uppercase leading-[1.4] tracking-[0.08em] text-muted'
/** Their `strong`: the destination's name. */
const CLOSING_TITLE = 'font-heading text-[23px] leading-[1.1] tracking-[-0.05em] text-foreground'

/** The reference's `.case-hero`: two columns wide, one column from `lg` down. */
const HERO_SPLIT =
  'grid grid-cols-1 items-center gap-8 pb-2 lg:grid-cols-[minmax(0,1.13fr)_minmax(0,.87fr)] lg:gap-[clamp(35px,5vw,92px)]'
/** Their `.case-topline`: the derived index in the accent, the eyebrow beside it. */
const HERO_META =
  'mono flex flex-wrap items-center gap-x-2.5 gap-y-2 text-[10px] font-semibold uppercase leading-none tracking-[0.13em] text-muted'
/** Their `.case-number`: the only piece of the meta line that is not writable. */
const HERO_INDEX = 'text-[11px] font-bold tracking-[0.02em] text-primary'
/** Their `.case-hero h1`, one step smaller so the split column can hold it. */
const HERO_TITLE =
  'font-heading text-[clamp(44px,5.4vw,88px)] font-bold leading-[0.96] tracking-[-0.08em] text-balance'
/** Their `.case-intro`, used only for the plain-short-description fallback. */
const HERO_LEAD = 'max-w-[650px] text-[15px] leading-[1.85] text-muted-foreground'
/** Their `.case-status`: one mono line, the labels separated by `·`, the accent dot first. */
const HERO_BADGES =
  'mono inline-flex w-fit max-w-full items-center gap-2.5 rounded-full border border-border px-3.5 py-[9px] text-[10px] font-semibold uppercase leading-[1.2] text-muted-foreground'
/** Their `.case-code`, pinned to the visual's corner instead of a strip under it. */
const HERO_CARD_LABEL =
  'mono absolute bottom-3 left-3 inline-flex max-w-[calc(100%-1.5rem)] items-center truncate rounded-[9px] border border-border bg-card/92 px-2.5 py-1.5 text-[10px] font-semibold leading-none tracking-[0.04em] text-muted-foreground backdrop-blur-sm'

/**
 * Tag names of a project, dropping unresolved ids and empty names. Mirrors the
 * grid's local helper: `projects-grid` is a client module, so its runtime values
 * cannot be imported into this server component.
 */
function tagNames(project: ProjectDetailItem): string[] {
  return (project.tags ?? [])
    .map((tag) => (typeof tag === 'string' || typeof tag === 'number' ? null : tag.name?.trim()))
    .filter((name): name is string => Boolean(name))
}

function coverImageOf(project: ProjectDetailItem) {
  return typeof project.coverImage === 'object' && project.coverImage !== null
    ? project.coverImage
    : null
}

/** Two-digit ordinal, as the reference prints it (`01`, `07`). */
function ordinal(position: number): string {
  return String(position).padStart(2, '0')
}

/**
 * The reference's `.case-code` label (`ipepio / projects / discord`), painted on the corner
 * of the visual: the first segment keeps the accent, the rest stays muted like the strip.
 */
function CardLabel({ label }: { label: string }) {
  const [head, ...rest] = label.split('/').map((part) => part.trim())

  return (
    <span data-hero-card-label className={HERO_CARD_LABEL}>
      <b className="font-semibold text-primary">{head}</b>
      {rest.length > 0 ? <span>{` / ${rest.join(' / ')}`}</span> : null}
    </span>
  )
}

/** The archive tags as chips; unchanged from the original hero, both layouts show them. */
function TagChips({ tags }: { tags: string[] }) {
  return (
    <ul role="list" className="flex flex-wrap gap-1.5">
      {tags.map((name) => (
        <li key={name}>
          <span className="mono inline-flex rounded-md border border-border bg-secondary/40 px-2 py-1 text-[10px] leading-none text-muted-foreground">
            {name}
          </span>
        </li>
      ))}
    </ul>
  )
}

/**
 * The trait pill: the project's own tags on one mono line with the system's green dot.
 * They are the same tags the archive filters by, so the pill and the filters can never
 * disagree about what this project is.
 */
function TraitPill({ tags }: { tags: string[] }) {
  return (
    <p data-hero-pill className={HERO_BADGES}>
      <span aria-hidden className="size-[7px] shrink-0 rounded-full bg-primary" />
      <span className="min-w-0">{tags.join(' · ')}</span>
    </p>
  )
}

/** The cover image, or the project's generated diagram when there is no cover. */
function HeroVisual({
  project,
  labels,
  sizes,
}: {
  project: ProjectDetailItem
  labels: ProjectDetailLabels
  sizes: string
}) {
  const cover = coverImageOf(project)
  const coverUrl = cover?.url ?? null
  // Resolved for both branches: a cover replaces the diagram, and with it the head line the
  // owner fills in Payload.
  const head = visualHeadCopy(project.visual, project.card?.category, project.card?.tag)

  if (!cover || !coverUrl) {
    return (
      <div aria-hidden className="overflow-hidden rounded-2xl border border-border bg-secondary">
        <ProjectVisual
          visual={project.visual}
          number={project.order === null || project.order === undefined ? null : project.order + 1}
          label={project.card?.category}
          tag={project.card?.tag ?? undefined}
          className="h-[335px] sm:h-[420px]"
        />
      </div>
    )
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border">
      <Image
        src={coverUrl}
        alt={cover.alt?.trim() || `${labels.imageAltPrefix} ${project.title}`}
        width={cover.width ?? 1600}
        height={cover.height ?? 900}
        sizes={sizes}
        priority
        className="h-auto w-full object-cover"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/80 via-black/20 to-transparent"
      />
      <div className="absolute inset-x-0 top-0 z-[2] p-[21px]">
        <VisualHead number={formatNumber(project.order)} label={head.label} tag={head.tag} />
      </div>
    </div>
  )
}

/**
 * The reference's `.case-next`: back to the work, and on to the next project.
 *
 * Both blocks are plain links, so the accessible name of each one is its own two lines
 * (`← Volver al trabajo` + `Todos los proyectos`; `Siguiente proyecto →` + the title), and
 * the copy comes from the dictionary in both locales.
 */
function ClosingRow({
  locale,
  labels,
  nextProject,
}: {
  locale: Locale
  labels: ProjectDetailLabels
  nextProject?: ProjectDetailNeighbour | null
}) {
  return (
    <div className="mx-auto flex w-full max-w-[1000px] flex-col gap-5 border-t border-border pt-9 sm:flex-row sm:items-stretch sm:justify-between">
      <Link href={`/${locale}#projects`} className={CLOSING_BLOCK}>
        <span className={CLOSING_LABEL}>← {labels.backToWork}</span>
        <span className={CLOSING_TITLE}>{labels.projectsArchive}</span>
      </Link>

      {nextProject ? (
        <Link
          href={`/${locale}/projects/${nextProject.slug}`}
          className={`${CLOSING_BLOCK} sm:items-end sm:text-right`}
        >
          <span className={CLOSING_LABEL}>{labels.nextProject} →</span>
          <span className={CLOSING_TITLE}>{nextProject.title}</span>
        </Link>
      ) : null}
    </div>
  )
}

/** Everything the split hero prints besides the title, already resolved from the document. */
type SplitHeroData = {
  /** `NN / TT`, derived on the server from the archive; `null` when it is unknown. */
  index: string | null
  eyebrow: string
  /** The lead, parsed; empty when the owner left `heroLead` blank. */
  leadBlocks: MarkdownBlock[]
  cardLabel: string | null
}

/**
 * The reference's `.case-hero` (T2: S1-S5): title, eyebrow, lead and pill on the left, the
 * cover or the generated diagram on the right, one column on small screens.
 */
function SplitHero({
  project,
  labels,
  hero,
}: {
  project: ProjectDetailItem
  labels: ProjectDetailLabels
  hero: SplitHeroData
}) {
  const tags = tagNames(project)

  return (
    <section data-hero-layout="split" className={HERO_SPLIT}>
      <div data-hero-copy className="min-w-0">
        {/* The meta line carries the derived index and the owner's eyebrow, nothing else
            (T2: S3): with no eyebrow it is the index alone. The year stays a fact of the
            stacked hero, and the aside carries the status. */}
        {hero.index !== null || hero.eyebrow.length > 0 ? (
          <p className={HERO_META}>
            {hero.index !== null ? (
              <span data-hero-index className={HERO_INDEX}>
                {hero.index}
              </span>
            ) : null}
            {hero.index !== null && hero.eyebrow.length > 0 ? (
              <span aria-hidden className="text-border">
                ·
              </span>
            ) : null}
            {hero.eyebrow.length > 0 ? (
              <span data-hero-eyebrow className="min-w-0">
                {hero.eyebrow}
              </span>
            ) : null}
          </p>
        ) : null}

        <h1 id={HEADING_ID} className={`${HERO_TITLE} mt-7`}>
          {project.title}
          {/* The reference's accent dot, the split hero's only decoration. */}
          <span aria-hidden className="text-primary">
            .
          </span>
        </h1>

        {hero.leadBlocks.length > 0 ? (
          <div data-hero-lead className="mt-6 max-w-[650px]">
            <MarkdownBlocks blocks={hero.leadBlocks} />
          </div>
        ) : project.shortDescription ? (
          <p data-hero-lead className={`${HERO_LEAD} mt-6`}>
            {project.shortDescription}
          </p>
        ) : null}

        {tags.length > 0 ? (
          <div className="mt-6">
            <TraitPill tags={tags} />
          </div>
        ) : null}
      </div>

      <div data-hero-visual className="relative min-w-0">
        <HeroVisual project={project} labels={labels} sizes="(min-width: 1024px) 40vw, 100vw" />
        {hero.cardLabel !== null ? <CardLabel label={hero.cardLabel} /> : null}
      </div>
    </section>
  )
}

/**
 * The page's original hero, restored verbatim by `heroLayout: 'stacked'` (S1, S6): one
 * column, the year and the status pill first, the plain short description under the title
 * and the visual full width. The editable hero pieces are deliberately not rendered here.
 */
function StackedHero({
  project,
  labels,
  status,
}: {
  project: ProjectDetailItem
  labels: ProjectDetailLabels
  status: ProjectStatus
}) {
  const cover = coverImageOf(project)
  const coverUrl = cover?.url ?? null
  const tags = tagNames(project)

  return (
    <section data-hero-layout="stacked" className="flex flex-col gap-10 lg:gap-12">
      <header className="flex flex-col gap-5">
        <p className="mono flex flex-wrap items-center gap-3 text-[11px] uppercase leading-none tracking-[0.16em] text-muted">
          {project.year ? <span>{project.year}</span> : null}
          <span
            className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] tracking-[0.14em] ${STATUS_CLASSNAMES[status]}`}
          >
            {labels.statusLabels[status]}
          </span>
        </p>

        <h1
          id={HEADING_ID}
          className="font-heading text-[clamp(40px,6vw,80px)] font-bold leading-[0.98] tracking-[-0.07em] text-balance"
        >
          {project.title}
        </h1>

        {project.shortDescription ? (
          <p className="max-w-[62ch] text-[clamp(17px,2vw,20px)] leading-[1.65] text-muted-foreground">
            {project.shortDescription}
          </p>
        ) : null}

        {tags.length > 0 ? <TagChips tags={tags} /> : null}
      </header>

      {cover && coverUrl ? (
        <Image
          src={coverUrl}
          alt={cover.alt?.trim() || `${labels.imageAltPrefix} ${project.title}`}
          width={cover.width ?? 1600}
          height={cover.height ?? 900}
          sizes={DETAIL_IMAGE_SIZES}
          priority
          className="h-auto w-full rounded-2xl border border-border object-cover"
        />
      ) : (
        <div aria-hidden className={DETAIL_VISUAL}>
          <ProjectVisual
            visual={project.visual}
            number={project.order === null || project.order === undefined ? null : project.order + 1}
            label={project.card?.category}
            tag={project.card?.tag ?? undefined}
          />
        </div>
      )}
    </section>
  )
}

/**
 * Presentational project detail: back link, the hero (two columns by default, or the
 * project's original stacked shape), the reading row (markdown body and the section index
 * aside) and the closing row that leads back to the work and to the next project.
 *
 * Every piece of the split hero is optional and falls back to the page as it was: no
 * eyebrow leaves the derived index alone, no lead shows the plain short description, no
 * badges hide the pill, and no `cardLabel` (or `showCardLabel` off) leaves the visual bare.
 */
export function ProjectDetail({
  project,
  locale,
  labels,
  nextProject = null,
  archiveIndex = null,
}: ProjectDetailProps) {
  const status = project.status ?? 'live'
  const liveUrl = project.liveUrl?.trim()
  const githubUrl = project.githubUrl?.trim()
  const body = project.longDescription?.trim() ?? ''
  const heroSource = project.hero ?? {}
  const leadSource = heroSource.heroLead?.trim() ?? ''

  // One parse feeds the body and the index: the aside lists exactly the `##` headings the
  // renderer stamped, in document order, so an index link can never point at nothing.
  const { blocks, headings } = parseMarkdown(body)
  const indexHeadings = headings.filter((heading) => heading.depth === 2)

  // The lead is markdown through the same parse and the same renderer as the body, so the
  // owner's emphasis, links and paragraph breaks survive here too — and so the live panel
  // re-parses it while they type instead of holding a second, plainer implementation.
  const leadBlocks = leadSource.length > 0 ? parseMarkdown(leadSource).blocks : []

  const hero: SplitHeroData = {
    index:
      archiveIndex !== null && archiveIndex.position > 0 && archiveIndex.total > 0
        ? `${ordinal(archiveIndex.position)} / ${ordinal(archiveIndex.total)}`
        : null,
    eyebrow: heroSource.heroEyebrow?.trim() ?? '',
    leadBlocks,
    cardLabel:
      heroSource.showCardLabel && heroSource.cardLabel?.trim() ? heroSource.cardLabel.trim() : null,
  }

  return (
    <article className="px-6 py-16 sm:py-20 lg:py-24">
      <div className="mx-auto flex w-full max-w-(--container-page) flex-col gap-10 lg:gap-12">
        <Link
          href={`/${locale}#projects`}
          className="mono inline-flex w-fit items-center gap-2 text-[11px] uppercase leading-none tracking-[0.16em] text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft aria-hidden className="size-3.5" />
          {labels.backToProjects}
        </Link>

        {project.hero?.heroLayout === 'stacked' ? (
          <StackedHero project={project} labels={labels} status={status} />
        ) : (
          <SplitHero project={project} labels={labels} hero={hero} />
        )}

        {/* Reading layout: the body keeps a comfortable measure on the left and the section
            index sits in its own column. The row itself is capped and centred, so on a wide
            screen the text and its index stay together instead of drifting to opposite edges. */}
        <div className="mx-auto flex w-full max-w-[1000px] flex-col gap-10 lg:grid lg:grid-cols-[minmax(0,1fr)_240px] lg:items-start lg:gap-12">
          <div className="min-w-0">
            {blocks.length > 0 ? (
              <MarkdownBlocks blocks={blocks} />
            ) : project.shortDescription ? (
              <p className="max-w-[68ch] text-base leading-[1.75] text-muted-foreground">
                {project.shortDescription}
              </p>
            ) : null}
          </div>

          <ProjectAside
            headings={indexHeadings}
            status={status}
            liveUrl={liveUrl}
            githubUrl={githubUrl}
            labels={labels}
          />
        </div>

        <ClosingRow locale={locale} labels={labels} nextProject={nextProject} />
      </div>
    </article>
  )
}
