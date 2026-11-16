import { RichText } from '@payloadcms/richtext-lexical/react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'

import type { ProjectItem } from '@/components/site/projects-grid'
import type { Locale, ProjectDetailLabels, ProjectStatus } from '@/lib/i18n'

/** Payload `Project` at `depth >= 1`, narrowed to what the detail page renders. */
export type ProjectDetailItem = ProjectItem & {
  longDescription?: unknown
}

export type ProjectDetailProps = {
  project: ProjectDetailItem
  /** Current locale, used for the back link into the home `#projects` section. */
  locale: Locale
  labels: ProjectDetailLabels
}

/** Lexical editor state accepted by the official Payload `RichText` renderer. */
type RichTextData = Parameters<typeof RichText>[0]['data']

const HEADING_ID = 'project-detail-heading'
const DETAIL_IMAGE_SIZES = '(min-width: 1280px) 1216px, 100vw'

/** Only the label is localized; the pill palette stays design-owned. */
const STATUS_CLASSNAMES: Record<ProjectStatus, string> = {
  live: 'border-primary/40 bg-primary/12 text-primary',
  wip: 'border-accent/40 bg-accent/12 text-accent',
  archived: 'border-border bg-secondary text-muted-foreground',
}

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
 * Presentational project detail: back link, year/status eyebrow, display title,
 * lead paragraph, tag chips, cover media, rich-text body and external links.
 */
export function ProjectDetail({ project, locale, labels }: ProjectDetailProps) {
  const cover = coverImageOf(project)
  const coverUrl = cover?.url ?? null
  const tags = tagNames(project)
  const status = project.status ?? 'live'
  const liveUrl = project.liveUrl?.trim()
  const githubUrl = project.githubUrl?.trim()
  const hasLinks = Boolean(liveUrl || githubUrl)
  // SAFETY: `longDescription` is a stored Payload lexical editor state; the
  // generated type only describes its nodes loosely, while `RichText` requires the
  // full `SerializedEditorState` union. The runtime shape is identical.
  const bodyData = (project.longDescription ?? null) as RichTextData | null

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
          <div
            aria-hidden
            className="relative flex aspect-[16/9] items-center justify-center overflow-hidden rounded-2xl border border-border bg-secondary"
          >
            <div className="grid-lines absolute inset-0" />
            <span className="mono relative max-w-[80%] text-center text-[clamp(28px,5vw,64px)] font-bold uppercase leading-none tracking-[-0.04em] text-primary/15">
              {tags[0] ?? project.title}
            </span>
          </div>
        )}

        {bodyData ? (
          <RichText
            className="flex max-w-[68ch] flex-col gap-4 text-base leading-[1.75] text-muted-foreground [&_a]:text-primary [&_a]:underline [&_blockquote]:border-l-2 [&_blockquote]:border-border [&_blockquote]:pl-4 [&_h2]:font-heading [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-foreground [&_h3]:font-heading [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-foreground [&_li]:my-1 [&_p]:m-0 [&_strong]:text-foreground [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5"
            data={bodyData}
          />
        ) : project.shortDescription ? (
          <p className="max-w-[68ch] text-base leading-[1.75] text-muted-foreground">
            {project.shortDescription}
          </p>
        ) : null}

        {hasLinks ? (
          <div className="flex flex-wrap gap-3">
            {liveUrl ? (
              <a
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mono inline-flex items-center gap-2 rounded-md border border-primary/60 bg-primary/10 px-4 py-2.5 text-[11px] uppercase leading-none tracking-[0.14em] text-foreground transition-colors hover:border-primary"
              >
                {labels.viewLive}
                <ArrowUpRight aria-hidden className="size-3.5" />
              </a>
            ) : null}

            {githubUrl ? (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mono inline-flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2.5 text-[11px] uppercase leading-none tracking-[0.14em] text-muted-foreground transition-colors hover:border-primary/60 hover:text-foreground"
              >
                {labels.repository}
                <ArrowUpRight aria-hidden className="size-3.5" />
              </a>
            ) : null}
          </div>
        ) : null}
      </div>
    </article>
  )
}
