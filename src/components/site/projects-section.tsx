import { ProjectsGrid, type ProjectItem, type ProjectTag } from '@/components/site/projects-grid'
import type { Locale, ProjectStatus, ProjectsGridLabels } from '@/lib/i18n'

export type { ProjectItem, ProjectTag }

export type ProjectsSectionProps = {
  eyebrow?: string
  heading: string
  note?: string
  projects: ProjectItem[]
  /** Current locale, passed through to the cards' detail links. */
  locale: Locale
  /** Catch-all filter label. */
  allLabel: string
  /** Localized status pill labels. */
  statusLabels: Record<ProjectStatus, string>
  /** Remaining grid chrome copy. */
  gridLabels: ProjectsGridLabels
}

const HEADING_ID = 'projects-section-heading'

/**
 * Presentational Projects section: eyebrow, display heading, note and the
 * filterable project grid (the only interactive part lives in `ProjectsGrid`).
 */
export function ProjectsSection({
  eyebrow,
  heading,
  note,
  projects,
  locale,
  allLabel,
  statusLabels,
  gridLabels,
}: ProjectsSectionProps) {
  return (
    <section
      id="projects"
      aria-labelledby={HEADING_ID}
      className="scroll-mt-24 px-6 py-20 sm:py-24 lg:py-28"
    >
      <div className="mx-auto flex w-full max-w-(--container-page) flex-col gap-10 lg:gap-12">
        <header className="flex flex-col gap-5">
          {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
          <h2
            id={HEADING_ID}
            className="font-heading text-[clamp(38px,4.5vw,64px)] font-bold leading-[1.03] tracking-[-0.06em] text-balance"
          >
            {heading}
          </h2>
          {note ? (
            <p className="max-w-[55ch] text-base leading-[1.7] text-muted-foreground">{note}</p>
          ) : null}
        </header>

        <ProjectsGrid
          projects={projects}
          locale={locale}
          allLabel={allLabel}
          statusLabels={statusLabels}
          labels={gridLabels}
        />
      </div>
    </section>
  )
}
