'use client'

import { ArrowUpRight } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

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
  tags?: (ProjectTag | number)[] | null
  liveUrl?: string | null
  githubUrl?: string | null
  status?: 'live' | 'wip' | 'archived' | null
  year?: number | null
  order?: number | null
}

export type ProjectsGridProps = {
  projects: ProjectItem[]
}

const ALL_FILTER = '__all__'

const STATUS_META: Record<
  NonNullable<ProjectItem['status']>,
  { label: string; className: string }
> = {
  live: {
    label: 'En producción',
    className: 'border-primary/40 bg-primary/12 text-primary',
  },
  wip: {
    label: 'En desarrollo',
    className: 'border-accent/40 bg-accent/12 text-accent',
  },
  archived: {
    label: 'Archivado',
    className: 'border-border bg-secondary text-muted-foreground',
  },
}

const CARD_SIZES = '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw'

type FilterOption = { key: string; label: string }

function tagNames(project: ProjectItem): string[] {
  return (project.tags ?? [])
    .map((tag) => (typeof tag === 'string' || typeof tag === 'number' ? null : tag.name?.trim()))
    .filter((name): name is string => Boolean(name))
}

/** Unique tag names in first-seen order, plus the "Todos" catch-all. */
function buildFilters(projects: ProjectItem[]): FilterOption[] {
  const seen = new Set<string>()
  const filters: FilterOption[] = [{ key: ALL_FILTER, label: 'Todos' }]

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

function ProjectCard({ project, position }: { project: ProjectItem; position: number }) {
  const indexLabel = String(position + 1).padStart(2, '0')
  const tags = tagNames(project)
  const cover = coverImageOf(project)
  const coverUrl = cover?.url ?? null
  const link = projectLink(project)
  const status = STATUS_META[project.status ?? 'live']

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition hover:border-primary/40 motion-safe:hover:-translate-y-1">
      <div className="relative h-[200px] overflow-hidden bg-secondary">
        {cover && coverUrl ? (
          <Image
            src={coverUrl}
            alt={cover.alt?.trim() || `Imagen de ${project.title}`}
            fill
            sizes={CARD_SIZES}
            className="object-cover transition duration-500 motion-safe:group-hover:scale-[1.03]"
          />
        ) : (
          <div aria-hidden className="relative flex h-full items-center justify-center">
            <div className="grid-lines absolute inset-0" />
            <span className="mono relative select-none text-[76px] font-bold leading-none tracking-[-0.06em] text-primary/15">
              {indexLabel}
            </span>
            {tags[0] ? (
              <span className="mono absolute top-4 right-5 max-w-[60%] truncate text-[10px] uppercase leading-none tracking-[0.16em] text-muted-foreground">
                {tags[0]}
              </span>
            ) : null}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <span
          className={`mono inline-flex w-fit rounded-full border px-2.5 py-1 text-[10px] uppercase leading-none tracking-[0.14em] ${status.className}`}
        >
          {status.label}
        </span>

        <h3 className="font-heading text-[22px] font-semibold leading-snug tracking-[-0.03em]">
          {project.title}
        </h3>

        {project.shortDescription ? (
          <p className="text-sm leading-[1.7] text-muted-foreground">{project.shortDescription}</p>
        ) : null}

        <div className="mt-auto flex items-end justify-between gap-3 pt-2">
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
          ) : (
            <span />
          )}

          {link ? (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Abrir ${project.title}`}
              className="inline-flex size-8 shrink-0 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-primary/60 hover:text-primary"
            >
              <ArrowUpRight aria-hidden className="size-3.5" />
            </a>
          ) : null}
        </div>
      </div>
    </article>
  )
}

/**
 * Interactive Projects grid: derives its filters from the projects' tags,
 * keeps every card mounted and toggles the `hidden` attribute on the ones that
 * do not match, so layout and the live counter stay trivial.
 */
export function ProjectsGrid({ projects }: ProjectsGridProps) {
  const filters = buildFilters(projects)
  const [active, setActive] = useState(ALL_FILTER)

  const isVisible = (project: ProjectItem) =>
    active === ALL_FILTER || tagNames(project).includes(active)
  const visibleCount = projects.filter(isVisible).length

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div role="group" aria-label="Filtrar proyectos" className="flex flex-wrap gap-2">
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
          {String(visibleCount).padStart(2, '0')} {visibleCount === 1 ? 'proyecto' : 'proyectos'}
        </p>
      </div>

      <ul role="list" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, index) => (
          <li key={projectKey(project, index)} hidden={!isVisible(project)}>
            <ProjectCard project={project} position={index} />
          </li>
        ))}
      </ul>
    </div>
  )
}
