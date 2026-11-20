import { ArrowUpRight } from 'lucide-react'

import type { ProjectDetailLabels, ProjectStatus } from '@/lib/i18n'
import type { MarkdownHeading } from '@/lib/markdown'

export type ProjectAsideProps = {
  /** The body's numbered headings, in document order (already filtered to depth 2). */
  headings: MarkdownHeading[]
  status: ProjectStatus
  liveUrl?: string | null
  githubUrl?: string | null
  labels: ProjectDetailLabels
}

/** Same two-digit ordinal the reference prints: `01`, `02`, … */
function ordinal(position: number): string {
  return String(position).padStart(2, '0')
}

/** The reference's `.case-side-label`: a mono, uppercase label over an aside block. */
const SIDE_LABEL =
  'mono text-[9px] font-semibold uppercase leading-none tracking-[0.1em] text-muted'

/** The reference's `.case-aside-nav a`. */
const NAV_LINK =
  'block rounded-md px-1.5 py-2 mono text-[11px] font-semibold leading-none text-muted-foreground transition-colors hover:text-primary'

/** The reference's `.case-links a`, primary and `.secondary`. */
const PRIMARY_LINK =
  'mono flex min-h-[43px] items-center justify-between gap-3 rounded-[9px] bg-primary px-3.5 py-2.5 text-[11px] font-bold uppercase leading-none tracking-[0.1em] text-primary-foreground transition-[filter] hover:brightness-110'
const SECONDARY_LINK =
  'mono flex min-h-[43px] items-center justify-between gap-3 rounded-[9px] border border-border px-3.5 py-2.5 text-[11px] font-bold uppercase leading-none tracking-[0.1em] text-foreground transition-colors hover:border-primary/60'

/**
 * The project page's aside (T1: S1, S4): the reference's `.case-aside`.
 *
 * It is derived from the body at render time — `headings` is what the markdown parse found —
 * so the index cannot drift from the text, and it is rendered for every project: the index
 * list is simply omitted when the body has no `##` heading, while the case-study label and
 * the links block always show. It is sticky on wide screens and becomes a normal block above
 * the closing row on narrow ones.
 */
export function ProjectAside({ headings, status, liveUrl, githubUrl, labels }: ProjectAsideProps) {
  const hasLive = Boolean(liveUrl)
  const hasRepository = Boolean(githubUrl)

  return (
    <aside
      aria-label={labels.asideLabel}
      className="flex w-full shrink-0 flex-col rounded-[15px] border border-border bg-card p-5 lg:sticky lg:top-[123px] lg:w-[240px] lg:p-6"
    >
      <h2 className="mono text-[10px] font-bold uppercase leading-none tracking-[0.14em] text-muted">
        {labels.onThisPage}
      </h2>

      {headings.length > 0 ? (
        <nav aria-label={labels.sectionIndexLabel} className="mt-4">
          <ul role="list" className="grid gap-1">
            {headings.map((heading, index) => (
              <li key={heading.id}>
                <a href={`#${heading.id}`} className={NAV_LINK}>
                  <span aria-hidden className="text-muted">
                    {ordinal(index + 1)} ·{' '}
                  </span>
                  {heading.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}

      <div aria-hidden className="my-5 h-px bg-border" />

      <p className={SIDE_LABEL}>{labels.caseStudy}</p>
      <p className="mt-2 flex items-center gap-2 text-[11px] leading-[1.7] text-foreground">
        <span aria-hidden className="size-[7px] shrink-0 rounded-full bg-primary" />
        {labels.statusLabels[status]}
      </p>

      <div aria-hidden className="my-5 h-px bg-border" />

      <p className={SIDE_LABEL}>{labels.links}</p>

      {hasLive || hasRepository ? (
        <div className="mt-2.5 grid gap-2">
          {hasLive ? (
            <a
              href={liveUrl as string}
              target="_blank"
              rel="noopener noreferrer"
              className={PRIMARY_LINK}
            >
              {labels.viewLive}
              <ArrowUpRight aria-hidden className="size-3.5 shrink-0" />
            </a>
          ) : null}

          {hasRepository ? (
            <a
              href={githubUrl as string}
              target="_blank"
              rel="noopener noreferrer"
              className={SECONDARY_LINK}
            >
              {labels.repository}
              <ArrowUpRight aria-hidden className="size-3.5 shrink-0" />
            </a>
          ) : null}
        </div>
      ) : (
        <p className="mt-2.5 rounded-[9px] border border-border bg-background-elevated px-3 py-3 text-[11px] leading-[1.7] text-muted">
          {labels.noLinks}
        </p>
      )}
    </aside>
  )
}
