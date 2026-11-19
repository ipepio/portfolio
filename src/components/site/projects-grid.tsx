'use client'

import { ArrowUpRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

import type { Locale, ProjectStatus, ProjectsGridLabels } from '@/lib/i18n'
import { ProjectVisual, type ProjectVisualName } from '@/components/site/project-visuals'
import { useDictionary, useLocale } from '@/lib/locale-context'

/** Tag as returned by Payload at `depth >= 1` (or as a raw id at `depth 0`). */
export type ProjectTag = { id?: string | number; name?: string | null }

/** Media relation as returned by Payload at `depth >= 1`. */
export type ProjectCoverImage = {
  url?: string | null
  alt?: string | null
  width?: number | null
  height?: number | null
}

/** Narrow structural view of a Payload `Project`, enough to render a card. */
export type ProjectItem = {
  id?: string | number
  title: string
  slug?: string | null
  shortDescription?: string | null
  coverImage?: ProjectCoverImage | number | string | null
  /** Diagram shown when there is no cover image (Payload `projects.visual`). */
  visual?: ProjectVisualName | null
  tags?: (ProjectTag | number)[] | null
  liveUrl?: string | null
  githubUrl?: string | null
  status?: ProjectStatus | null
  year?: number | null
  order?: number | null
}

export type ProjectsGridProps = {
  /** The projects themselves; every label comes from the dictionary via context. */
  projects: ProjectItem[]
}

const ALL_FILTER = '__all__'

const CARD_SIZES = '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw'

/** Card chrome ported from the reference `.project-card` / `.project-body`. */
const CARD_HEAD = 'relative block h-[202px] overflow-hidden border-b border-border bg-secondary'
const BODY = 'flex flex-1 flex-col px-[24px] pt-[25px] pb-[23px]'
const CATEGORY = 'mono text-[9px] font-[650] uppercase leading-[1.5] tracking-[0.1em] text-muted'
const TITLE =
  'font-heading mt-[9px] mb-[11px] text-[25px] font-semibold leading-[1.15] tracking-[-0.055em]'
const DESCRIPTION = 'mb-[26px] flex-1 text-[13px] leading-[1.75] text-muted-foreground line-clamp-3'
const BOTTOM = 'flex items-center justify-between gap-[15px] border-t border-border pt-[18px]'
const CHIP =
  'mono inline-flex rounded-[5px] border border-border px-[6px] py-[5px] text-[9px] font-semibold leading-[1.2] text-muted-foreground'

type FilterOption = { key: string; label: string }

function tagNames(project: ProjectItem): string[] {
  return (project.tags ?? [])
    .map((tag) => (typeof tag === 'string' || typeof tag === 'number' ? null : tag.name?.trim()))
    .filter((name): name is string => Boolean(name))
}

/** Unique tag names in first-seen order, preceded by the "all" catch-all. */
function buildFilters(projects: ProjectItem[], allLabel: string): FilterOption[] {
  const seen = new Set<string>()
  const filters: FilterOption[] = [{ key: ALL_FILTER, label: allLabel }]

  for (const project of projects) {
    for (const name of tagNames(project)) {
      if (seen.has(name)) {
        continue
      }
      seen.add(name)
      filters.push({ key: name, label: name })
    }
  }

  return filters
}

function projectKey(project: ProjectItem, index: number) {
  return project.id ?? project.slug ?? `${project.title}-${index}`
}

function coverImageOf(project: ProjectItem): ProjectCoverImage | null {
  return typeof project.coverImage === 'object' && project.coverImage !== null
    ? project.coverImage
    : null
}

function projectLink(project: ProjectItem): string | null {
  const live = project.liveUrl?.trim()
  if (live) {
    return live
  }

  const github = project.githubUrl?.trim()
  return github || null
}

/** Internal route of the project's detail page, or `null` when it has no slug. */
function projectHref(project: ProjectItem, locale: Locale): string | null {
  const slug = project.slug?.trim()
  return slug ? `/${locale}/projects/${slug}` : null
}

function ProjectCard({
  project,
  position,
  statusLabels,
  labels,
}: {
  project: ProjectItem
  position: number
  statusLabels: Record<ProjectStatus, string>
  labels: ProjectsGridLabels
}) {
  // The layout publishes the locale and the dictionary, so the cards read both instead of
  // receiving them as props.
  const locale = useLocale()
  const indexLabel = position + 1
  const tags = tagNames(project)
  const cover = coverImageOf(project)
  const coverUrl = cover?.url ?? null
  const link = projectLink(project)
  const href = projectHref(project, locale)
  const status = project.status ?? 'live'
  const statusLabel = statusLabels[status]
  // Reference category line: the localized status label.
  const category = statusLabel

  const media =
    cover && coverUrl ? (
      <Image
        src={coverUrl}
        alt={cover.alt?.trim() || `${labels.imageAltPrefix} ${project.title}`}
        fill
        sizes={CARD_SIZES}
        className="object-cover transition duration-500 motion-safe:group-hover:scale-[1.03]"
      />
    ) : (
      <ProjectVisual visual={project.visual} number={indexLabel} />
    )

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition hover:border-input motion-safe:hover:-translate-y-[5px]">
      {href ? (
        // Decorative duplicate of the title link: skipped by keyboard and AT.
        <Link href={href} aria-hidden tabIndex={-1} className={CARD_HEAD}>
          {media}
        </Link>
      ) : (
        <div className={CARD_HEAD}>{media}</div>
      )}

      <div className={BODY}>
        <p className={CATEGORY}>{category}</p>

        <h3 className={TITLE}>
          {href ? (
            <Link href={href} className="transition-colors hover:text-primary">
              {project.title}
            </Link>
          ) : (
            project.title
          )}
        </h3>

        {project.shortDescription ? (
          <p className={DESCRIPTION}>{project.shortDescription}</p>
        ) : (
          <div className="flex-1" />
        )}

        {tags.length > 0 || link ? (
          <div className={BOTTOM}>
            {tags.length > 0 ? (
              <ul role="list" className="flex flex-wrap gap-[6px]">
                {tags.map((name) => (
                  <li key={name}>
                    <span className={CHIP}>{name}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <span />
            )}

            {link ? (
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${labels.openPrefix} ${project.title}`}
                className="grid size-[30px] shrink-0 place-items-center rounded-lg border border-input text-[18px] text-foreground transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground"
              >
                <ArrowUpRight aria-hidden className="size-4" />
              </a>
            ) : null}
          </div>
        ) : null}
      </div>
    </article>
  )
}

/**
 * Interactive Projects grid: derives its filters from the projects' tags,
 * keeps every card mounted and toggles the `hidden` attribute on the ones that
 * do not match, so layout and the live counter stay trivial.
 *
 * It is a client component rendered inside `LocaleProvider`, so the whole grid chrome
 * (catch-all label, status pills, counter and per-card accessible names) is read from
 * `useDictionary()` instead of being drilled down from the server page.
 */
export function ProjectsGrid({ projects }: ProjectsGridProps) {
  const { allLabel, statusLabels, gridLabels: labels } = useDictionary().projects
  const filters = buildFilters(projects, allLabel)
  const [active, setActive] = useState(ALL_FILTER)

  const isVisible = (project: ProjectItem) =>
    active === ALL_FILTER || tagNames(project).includes(active)
  const visibleCount = projects.filter(isVisible).length

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div role="group" aria-label={labels.filterGroup} className="flex flex-wrap gap-2">
          {filters.map((filter) => {
            const pressed = filter.key === active

            return (
              <button
                key={filter.key}
                type="button"
                aria-pressed={pressed}
                onClick={() => setActive(filter.key)}
                className={
                  pressed
                    ? 'mono inline-flex rounded-md border border-primary/60 bg-primary/10 px-3 py-2 text-[11px] uppercase leading-none tracking-[0.14em] text-foreground transition-colors'
                    : 'mono inline-flex rounded-md border border-border bg-card px-3 py-2 text-[11px] uppercase leading-none tracking-[0.14em] text-muted-foreground transition-colors hover:border-primary/60 hover:text-foreground'
                }
              >
                {filter.label}
              </button>
            )
          })}
        </div>

        <p
          aria-live="polite"
          className="mono text-[11px] uppercase leading-none tracking-[0.16em] text-muted"
        >
          {`${String(visibleCount).padStart(2, '0')} ${visibleCount === 1 ? labels.countOne : labels.countOther}`}
        </p>
      </div>

      <ul role="list" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, index) => (
          <li key={projectKey(project, index)} hidden={!isVisible(project)}>
            <ProjectCard
              project={project}
              position={index}
              statusLabels={statusLabels}
              labels={labels}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}
