'use client'

import { ArrowUpRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

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

/** The archive card's visual head line (Payload `projects.card`). */
type ProjectCardCopy = {
  category?: string | null
  tag?: string | null
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
  /** Editable head line of the visual: the word after the number and the accent tag. */
  card?: ProjectCardCopy | null
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

/** The archive never shows more than this many cards on one page, however tall the screen. */
const MAX_PAGE_SIZE = 6

/** Room the sticky header, the section heading and the pagination take out of the viewport. */
const VIEWPORT_CHROME = 200

/** Mirrors the grid's `gap-4`, so the reserved height matches the real one. */
const GRID_GAP = 16

/**
 * A row that overflows the viewport by a hair still counts as fitting. Card heights move a
 * few pixels with font loading and image decoding, and without this margin a 1440p screen
 * would flip between one and two rows for four pixels.
 */
const ROW_TOLERANCE = 1.05

/**
 * Case- and accent-insensitive form of a string, so `ia` finds `IA/Agentes` and `diseno`
 * finds `Diseño`. Diacritics are stripped rather than folded per locale on purpose: the
 * archive is short and a Spanish keyboard is not always an option mid-word.
 */
function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

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
      <ProjectVisual
        visual={project.visual}
        number={indexLabel}
        label={project.card?.category}
        tag={project.card?.tag ?? undefined}
      />
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
 * Interactive Projects grid: derives its filters from the projects' tags, narrows the list
 * with those filters and a free-text search, and paginates what is left.
 *
 * It is a client component rendered inside `LocaleProvider`, so the whole grid chrome
 * (catch-all label, status pills, counter and per-card accessible names) is read from
 * `useDictionary()` instead of being drilled down from the server page.
 */

/** What the viewport can hold right now, measured from a rendered card. */
type PageFit = { pageSize: number; columns: number; rows: number; cardHeight: number }

/**
 * The fit assumed before anything is measured. Three cards is the desktop default, so the
 * first frame of the common case is already correct and hydration changes nothing visible;
 * smaller screens collapse to one or two on the first measurement.
 */
const INITIAL_FIT: PageFit = { pageSize: 3, columns: 3, rows: 1, cardHeight: 0 }

/**
 * How many cards actually fit on one screen: the grid's column count times the whole card
 * rows that fit in the viewport, never above six and never below one. A phone that fits a
 * single card paginates by one; a desktop that fits six paginates by six.
 *
 * Measured rather than hardcoded per breakpoint, because the answer depends on the viewport
 * height as much as on its width, and the owner's screen is not the visitor's.
 */
function usePageFit(
  gridRef: React.RefObject<HTMLUListElement | null>,
  cardRef: React.RefObject<HTMLLIElement | null>,
): PageFit {
  const [fit, setFit] = useState(INITIAL_FIT)
  // Measurements taken while images and fonts are still landing see a shorter card than the
  // settled one, which would report a page size that immediately shrinks. Only a measurement
  // after the layout settles is allowed to move the page size away from the initial guess.
  const armedRef = useRef(false)

  useEffect(() => {
    const measure = () => {
      const grid = gridRef.current
      if (!grid) {
        return
      }

      const columns = Math.max(
        1,
        getComputedStyle(grid).gridTemplateColumns.split(' ').filter(Boolean).length,
      )
      const cardHeight = Math.round(cardRef.current?.getBoundingClientRect().height ?? 0)

      // One screen's worth of rows: the viewport minus the chrome around the grid. Without a
      // measured card (before content settles) a single row is the safe assumption.
      const rows =
        cardHeight > 0
          ? Math.max(
              1,
              Math.floor(
                ((window.innerHeight - VIEWPORT_CHROME) * ROW_TOLERANCE + GRID_GAP) /
                  (cardHeight + GRID_GAP),
              ),
            )
          : 1

      setFit((prev) => {
        const next: PageFit = {
          pageSize: armedRef.current
            ? Math.max(1, Math.min(MAX_PAGE_SIZE, columns * rows))
            : prev.pageSize,
          columns,
          rows,
          cardHeight,
        }

        const unchanged =
          prev.pageSize === next.pageSize &&
          prev.columns === next.columns &&
          prev.rows === next.rows &&
          prev.cardHeight === next.cardHeight

        return unchanged ? prev : next
      })
    }

    // Arm once the page has actually loaded — images decoded, fonts in — and measure then:
    // arming earlier read a shorter card than the settled one and flipped the page size
    // twice on a tall screen. From that point on every resize is authoritative.
    const arm = () => {
      armedRef.current = true
      measure()
    }
    const settle = () => {
      requestAnimationFrame(() => requestAnimationFrame(arm))
    }

    measure()

    if (document.readyState === 'complete') {
      void (document.fonts?.ready ?? Promise.resolve()).then(settle)
    } else {
      window.addEventListener('load', settle, { once: true })
    }

    // The card drives the measurement: its height changes with the column width, and nothing
    // here resizes it, so observing it cannot feed back into this effect. The window's own
    // resize covers the height half of the question.
    const observer = new ResizeObserver(measure)
    if (cardRef.current) {
      observer.observe(cardRef.current)
    }
    window.addEventListener('resize', measure)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [gridRef, cardRef])

  return fit
}

export function ProjectsGrid({ projects }: ProjectsGridProps) {
  const { allLabel, statusLabels, gridLabels: labels } = useDictionary().projects
  const filters = buildFilters(projects, allLabel)
  const [active, setActive] = useState(ALL_FILTER)
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const gridRef = useRef<HTMLUListElement | null>(null)
  const cardRef = useRef<HTMLLIElement | null>(null)
  const fit = usePageFit(gridRef, cardRef)
  const pageSize = fit.pageSize

  const needle = normalizeText(query.trim())

  // Tag filter and free text compose: the tag narrows the archive, the text narrows what
  // is left. Both reset the page, because page 3 of the previous result means nothing here.
  const matches = (project: ProjectItem) => {
    if (active !== ALL_FILTER && !tagNames(project).includes(active)) return false
    if (needle === '') return true

    const haystack = [project.title, project.shortDescription ?? '', ...tagNames(project)].join(' ')

    return normalizeText(haystack).includes(needle)
  }

  const filtered = projects.filter(matches)
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, pageCount)
  const pageItems = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  // A half-filled page keeps the height a full one had, so paging never makes the archive
  // jump and the pagination stays under the same row of cards. Measured from a full page
  // rather than derived from a card: a lone card is a few pixels shorter than the tallest
  // in a stretched row, and deriving it would leave a visible 8px hop on the last page.
  const [fullHeight, setFullHeight] = useState<{ height: number; pageSize: number }>({
    height: 0,
    pageSize: 0,
  })
  const isFullPage = pageItems.length >= pageSize

  useEffect(() => {
    const grid = gridRef.current
    if (!grid || !isFullPage) {
      return
    }

    // The tallest full page wins rather than the latest one: two pages of six can differ by a
    // few pixels when their descriptions wrap differently, and switching between them would
    // still nudge the pagination. The height is tied to the page size it was measured with,
    // so a value from the initial guess can never be reserved for the real one.
    const height = Math.ceil(grid.getBoundingClientRect().height)
    setFullHeight((prev) => {
      if (prev.pageSize !== pageSize) {
        return { height, pageSize }
      }

      return height > prev.height ? { height, pageSize } : prev
    })
  }, [gridRef, isFullPage, pageSize, fit.cardHeight])

  useEffect(() => {
    const reset = () => setFullHeight({ height: 0, pageSize: 0 })
    window.addEventListener('resize', reset)

    return () => window.removeEventListener('resize', reset)
  }, [])

  const reservedHeight =
    fullHeight.pageSize === pageSize && fullHeight.height > 0 ? fullHeight.height : undefined

  const selectFilter = (key: string) => {
    setActive(key)
    setPage(1)
  }

  const changeQuery = (value: string) => {
    setQuery(value)
    setPage(1)
  }

  const clearSearch = () => {
    changeQuery('')
    setActive(ALL_FILTER)
  }

  return (
    <div className="flex flex-col gap-6">
      <label className="flex w-full max-w-md flex-col gap-2">
        <span className="mono text-[10px] uppercase leading-none tracking-[0.18em] text-muted">
          {labels.searchLabel}
        </span>
        <input
          type="search"
          value={query}
          onChange={(event) => changeQuery(event.target.value)}
          placeholder={labels.searchPlaceholder}
          className="mono w-full rounded-md border border-border bg-card px-3 py-2.5 text-[12px] leading-none text-foreground transition-colors placeholder:text-muted focus-visible:border-primary/60 focus-visible:outline-none"
        />
      </label>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div role="group" aria-label={labels.filterGroup} className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <FilterButton
              key={filter.key}
              filter={filter}
              pressed={filter.key === active}
              onSelect={selectFilter}
            />
          ))}
        </div>

        <p
          aria-live="polite"
          className="mono text-[11px] uppercase leading-none tracking-[0.16em] text-muted"
        >
          {`${String(filtered.length).padStart(2, '0')} ${filtered.length === 1 ? labels.countOne : labels.countOther}`}
        </p>
      </div>

      {pageItems.length > 0 ? (
        // The reserved height lives on a wrapper, never on the grid itself: a min-height on
        // the grid stretches its rows, which inflates the very card height the page size is
        // measured from, and the section then grows a couple of pixels per frame.
        <div
          style={reservedHeight === undefined ? undefined : { minHeight: `${reservedHeight}px` }}
        >
          <ul
            ref={gridRef}
            role="list"
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {pageItems.map((project, index) => (
              <li
                key={projectKey(project, (currentPage - 1) * pageSize + index)}
                ref={index === 0 ? cardRef : null}
              >
                <ProjectCard
                  project={project}
                  position={(currentPage - 1) * pageSize + index}
                  statusLabels={statusLabels}
                  labels={labels}
                />
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="flex flex-col items-start gap-4 rounded-lg border border-dashed border-border bg-card/40 px-5 py-8">
          <p className="max-w-md text-sm text-muted-foreground">{labels.noResults}</p>
          <button
            type="button"
            onClick={clearSearch}
            className="mono inline-flex rounded-md border border-border bg-card px-3 py-2 text-[11px] uppercase leading-none tracking-[0.14em] text-muted-foreground transition-colors hover:border-primary/60 hover:text-foreground"
          >
            {labels.clearSearch}
          </button>
        </div>
      )}

      <Pagination page={currentPage} pageCount={pageCount} labels={labels} onGo={setPage} />
    </div>
  )
}

/** One tag filter; pressed state is the primary tint. */
function FilterButton({
  filter,
  pressed,
  onSelect,
}: {
  filter: FilterOption
  pressed: boolean
  onSelect: (key: string) => void
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={() => onSelect(filter.key)}
      className={
        pressed
          ? 'mono inline-flex rounded-md border border-primary/60 bg-primary/10 px-3 py-2 text-[11px] uppercase leading-none tracking-[0.14em] text-foreground transition-colors'
          : 'mono inline-flex rounded-md border border-border bg-card px-3 py-2 text-[11px] uppercase leading-none tracking-[0.14em] text-muted-foreground transition-colors hover:border-primary/60 hover:text-foreground'
      }
    >
      {filter.label}
    </button>
  )
}

const PAGER_BUTTON =
  'mono inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-[11px] uppercase leading-none tracking-[0.14em] text-muted-foreground transition-colors hover:border-primary/60 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-border disabled:hover:text-muted-foreground'

/** Previous / position / next, and nothing at all when everything fits on one page. */
function Pagination({
  page,
  pageCount,
  labels,
  onGo,
}: {
  page: number
  pageCount: number
  labels: ProjectsGridLabels
  onGo: (page: number) => void
}) {
  if (pageCount <= 1) {
    return null
  }

  return (
    <nav
      aria-label={labels.paginationLabel}
      className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-4"
    >
      <button
        type="button"
        onClick={() => onGo(page - 1)}
        disabled={page === 1}
        className={PAGER_BUTTON}
      >
        <span aria-hidden>←</span>
        {labels.previousPage}
      </button>

      <p
        aria-live="polite"
        className="mono text-[11px] uppercase leading-none tracking-[0.16em] text-muted"
      >
        {labels.pageOf.replace('{page}', String(page)).replace('{total}', String(pageCount))}
      </p>

      <button
        type="button"
        onClick={() => onGo(page + 1)}
        disabled={page === pageCount}
        className={PAGER_BUTTON}
      >
        {labels.nextPage}
        <span aria-hidden>→</span>
      </button>
    </nav>
  )
}
