import { ProjectsGrid, type ProjectItem, type ProjectTag } from '@/components/site/projects-grid'
import type { ProjectsCopy } from '@/lib/i18n'

export type { ProjectItem, ProjectTag }

export type ProjectsSectionProps = {
  /** Localized chrome of the section and of the client grid (dictionary `projects`). */
  copy: ProjectsCopy
  projects: ProjectItem[]
}

const HEADING_ID = 'projects-section-heading'

/**
 * Presentational Projects section: eyebrow, display heading, note and the
 * filterable project grid (the only interactive part lives in `ProjectsGrid`).
 */
export function ProjectsSection({ copy, projects }: ProjectsSectionProps) {
  return (
    <section
      id="projects"
      aria-labelledby={HEADING_ID}
      className="border-y border-border bg-background-elevated px-6 py-20 sm:py-24 lg:py-28"
    >
      <div className="mx-auto flex w-full max-w-(--container-page) flex-col gap-10 lg:gap-12">
        <header className="flex flex-col gap-5">
          {copy.eyebrow ? <span className="eyebrow">{copy.eyebrow}</span> : null}
          <h2
            id={HEADING_ID}
            className="font-heading text-[clamp(38px,4.5vw,64px)] font-bold leading-[1.03] tracking-[-0.06em] text-balance"
          >
            {copy.heading}
          </h2>
          {copy.note ? (
            <p className="max-w-[55ch] text-base leading-[1.7] text-muted-foreground">
              {copy.note}
            </p>
          ) : null}
        </header>

        {/* The grid is a client component inside `LocaleProvider`: it reads its own copy. */}
        <ProjectsGrid projects={projects} />
      </div>
    </section>
  )
}
