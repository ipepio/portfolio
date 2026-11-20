import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

import { MarkdownBlocks } from '@/components/site/markdown-body'
import { ProjectAside } from '@/components/site/project-aside'
import type { ProjectItem } from '@/components/site/projects-grid'
import { ProjectVisual } from '@/components/site/project-visuals'
import type { Locale, ProjectDetailLabels, ProjectStatus } from '@/lib/i18n'
import { parseMarkdown } from '@/lib/markdown'

/** Payload `Project` at `depth >= 1`, narrowed to what the detail page renders. */
export type ProjectDetailItem = ProjectItem & {
  /** Raw markdown (`textarea`): headings, lists, links, fences, callouts, ```mermaid diagrams. */
  longDescription?: string | null
}

/** The project the closing row leads to, resolved by the page from the archive order. */
export type ProjectDetailNeighbour = {
  slug: string
  title: string
}

export type ProjectDetailProps = {
  project: ProjectDetailItem
  /** Current locale, used for the back link into the home `#projects` section. */
  locale: Locale
  labels: ProjectDetailLabels
  /** The next project in the archive (wrapping at the end), or `null` for a lone project. */
  nextProject?: ProjectDetailNeighbour | null
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

/**
 * Presentational project detail: back link, year/status eyebrow, display title,
 * lead paragraph, tag chips, cover media, the reading row (markdown body and the
 * section index aside) and the closing row that leads back to the work and to the
 * next project.
 */
export function ProjectDetail({ project, locale, labels, nextProject = null }: ProjectDetailProps) {
  const cover = coverImageOf(project)
  const coverUrl = cover?.url ?? null
  const tags = tagNames(project)
  const status = project.status ?? 'live'
  const liveUrl = project.liveUrl?.trim()
  const githubUrl = project.githubUrl?.trim()
  const body = project.longDescription?.trim() ?? ''

  // One parse feeds the body and the index: the aside lists exactly the `##` headings the
  // renderer stamped, in document order, so an index link can never point at nothing.
  const { blocks, headings } = parseMarkdown(body)
  const indexHeadings = headings.filter((heading) => heading.depth === 2)

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

          {tags.length > 0 ? (
            <ul role="list" className="flex flex-wrap gap-1.5">
              {tags.map((name) => (
                <li key={name}>
                  <span className="mono inline-flex rounded-md border border-border bg-secondary/40 px-2 py-1 text-[10px] leading-none text-muted-foreground">
                    {name}
                  </span>
                </li>
              ))}
            </ul>
          ) : null}
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
            <ProjectVisual visual={project.visual} number={project.order} />
          </div>
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
