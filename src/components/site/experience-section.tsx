import type { Experience } from '@/payload-types'

export type ExperienceSectionProps = {
  /** Fallback eyebrow; the section ordinal lives in the dictionary. */
  eyebrow?: string
  /**
   * Display heading, without the accent tail. Real newlines are rendered as forced
   * line breaks (`whitespace-pre-line`), like the About heading.
   */
  heading: string
  /** Accented tail of the heading, rendered in the primary colour. */
  headingAccent?: string
  /** Intro paragraph of the left column. */
  intro?: string
  /** Label next to the `2017 →` stat. */
  statLabel?: string
  /** Badge on the role that has no `endDate` yet. */
  currentLabel: string
  /** Experience docs as Payload returns them at `depth: 1`, newest first. */
  experiences: Experience[]
}

const HEADING_ID = 'experienceTitle'

const CARD_CLASS =
  'rounded-[16px] border border-border bg-card px-[18px] pt-5 pb-[25px] transition-[border-color,transform] duration-200 hover:translate-x-[3px] hover:border-input min-[521px]:px-[26px] min-[521px]:pt-6'

/** The current card: `--accent-soft` (primary at 10%) fading out over the card surface. */
const CURRENT_CARD_CLASS = `${CARD_CLASS} border-input bg-[linear-gradient(135deg,color-mix(in_srgb,var(--primary)_10%,transparent),transparent_47%)]`

const MARKER_CLASS =
  'absolute top-5 -left-[23px] z-[1] size-3 rotate-45 rounded-[4px] border border-input bg-background min-[521px]:-left-[30px] min-[521px]:size-[13px]'

/** The current marker: lime diamond with the `--accent-soft` halo. */
const CURRENT_MARKER_CLASS = `${MARKER_CLASS} border-primary bg-primary shadow-[0_0_0_5px_color-mix(in_srgb,var(--primary)_10%,transparent)]`

const TAG_CLASS =
  'mono rounded-[6px] border border-border bg-background-elevated px-[9px] py-[7px] text-[9px] leading-[1.3] font-semibold tracking-normal text-muted'

/**
 * Year of the earliest role, used by the reference's `2017 →` stat. It is derived from
 * the seeded `startDate`s instead of hardcoded, so the stat follows the timeline.
 */
function firstRoleYear(experiences: Experience[]): string | null {
  const years = experiences
    .map((experience) => new Date(experience.startDate).getUTCFullYear())
    .filter((year) => Number.isFinite(year))

  return years.length > 0 ? String(Math.min(...years)) : null
}

/**
 * Presentational Experience section, copied verbatim from the `section.experience` of
 * `/Users/ipepio/Desktop/portfolio_ipepio_experiencia_contacto.html`: a sticky intro
 * column (eyebrow, display heading, description, the `2017 →` stat) next to the roles
 * timeline — a lime-headed rail with a diamond marker per card, the first one marked as
 * current, and mono tags closing each card.
 *
 * Every figure of the reference CSS is kept; only the variables are mapped onto the app
 * tokens: `--bg`→`--background`, `--card`→`--card`, `--border`→`--border`,
 * `--border-strong`→`--input`, `--muted`→`--muted-foreground`, `--soft`→`--muted`,
 * `--accent`→`--primary`, `--accent-soft`→`--primary` at 10%,
 * `--bg-elevated`→`--background-elevated`.
 */
export function ExperienceSection({
  eyebrow,
  heading,
  headingAccent,
  intro,
  statLabel,
  currentLabel,
  experiences,
}: ExperienceSectionProps) {
  // The collection may be empty again: no roles, no section. Returning null keeps the
  // home page from rendering a heading over an empty timeline.
  if (experiences.length === 0) {
    return null
  }

  const firstYear = firstRoleYear(experiences)

  return (
    <section
      id="experience"
      aria-labelledby={HEADING_ID}
      className="border-b border-border px-6 pt-[86px] pb-[95px] min-[781px]:pt-[120px] min-[781px]:pb-[130px]"
    >
      <div className="mx-auto grid w-full max-w-(--container-page) grid-cols-1 items-start gap-8 min-[781px]:grid-cols-[minmax(255px,0.72fr)_minmax(0,1.28fr)] min-[781px]:gap-[50px] min-[1021px]:grid-cols-[minmax(255px,0.77fr)_minmax(0,1.23fr)] min-[1021px]:gap-[clamp(55px,8vw,125px)]">
        <div className="min-[781px]:sticky min-[781px]:top-[123px]">
          {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}

          <h2
            id={HEADING_ID}
            className="mt-6 mb-[25px] max-w-[520px] font-heading text-[clamp(48px,12vw,65px)] leading-[0.99] font-[660] tracking-[-0.075em] whitespace-pre-line min-[521px]:text-[clamp(45px,5.6vw,80px)] min-[781px]:max-w-none"
          >
            {heading} {headingAccent ? <span className="text-primary">{headingAccent}</span> : null}
          </h2>

          {intro ? (
            <p className="mt-0 mb-[31px] max-w-[620px] text-base leading-[1.8] text-muted-foreground min-[781px]:max-w-[400px]">
              {intro}
            </p>
          ) : null}

          <div className="mono flex max-w-[350px] items-center gap-[14px] border-t border-border pt-[22px] text-[10px] leading-[1.7] font-semibold tracking-[0.09em] text-muted uppercase min-[781px]:max-w-none">
            {firstYear ? (
              <strong className="font-heading text-[38px] leading-none font-[650] tracking-[-0.07em] text-primary">
                {firstYear}
                <span className="text-muted">→</span>
              </strong>
            ) : null}
            {statLabel ? <span>{statLabel}</span> : null}
          </div>
        </div>

        <div className="relative grid pl-[23px] min-[521px]:pl-[31px]">
          {/* The rail: primary at the top, then a line that fades out before the last card. */}
          <span
            aria-hidden="true"
            className="absolute top-[25px] bottom-[42px] left-[6px] w-px bg-[linear-gradient(var(--primary),var(--border)_31%,var(--border)_94%,transparent)] min-[521px]:left-[7px]"
          />

          {experiences.map((experience, index) => {
            // The reference marks the role without an end date as the current one. Like
            // the collection's own ordering, the newest card is also the first one.
            const isCurrent = !experience.endDate

            return (
              <article
                key={experience.id ?? `${experience.company}-${index}`}
                className="relative pb-5 last:pb-0 min-[521px]:pb-[38px]"
              >
                <span
                  aria-hidden="true"
                  className={isCurrent ? CURRENT_MARKER_CLASS : MARKER_CLASS}
                />

                <div className={isCurrent ? CURRENT_CARD_CLASS : CARD_CLASS}>
                  <div className="mb-[18px] flex flex-wrap items-center justify-between gap-1.5 min-[521px]:flex-nowrap min-[521px]:gap-[15px]">
                    {experience.period ? (
                      <time
                        dateTime={experience.startDate}
                        className="mono text-[10px] leading-[1.4] font-[650] tracking-[0.06em] text-muted uppercase"
                      >
                        {experience.period}
                      </time>
                    ) : null}

                    {isCurrent ? (
                      <span className="mono inline-flex items-center gap-[7px] text-[9px] leading-[1.4] font-bold tracking-[0.08em] text-primary uppercase before:size-[6px] before:rounded-full before:bg-primary before:shadow-[0_0_0_4px_color-mix(in_srgb,var(--primary)_10%,transparent)] before:content-['']">
                        {currentLabel}
                      </span>
                    ) : null}
                  </div>

                  <h3 className="mt-0 mb-1.5 font-heading text-[21px] leading-[1.2] font-[680] tracking-[-0.04em] min-[521px]:text-[clamp(19px,2.2vw,26px)]">
                    {experience.role}
                  </h3>

                  <div className="mono mb-[17px] text-[12px] leading-[1.4] font-bold tracking-[0.035em] text-primary">
                    {experience.company}
                  </div>

                  {experience.description ? (
                    <p className="mt-0 mb-[19px] max-w-[600px] text-[13px] leading-[1.83] text-muted-foreground">
                      {experience.description}
                    </p>
                  ) : null}

                  {experience.stack && experience.stack.length > 0 ? (
                    <div className="flex flex-wrap gap-[7px]">
                      {experience.stack.map((tag, tagIndex) => (
                        <span key={tag.id ?? `${tag.name}-${tagIndex}`} className={TAG_CLASS}>
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
