import Image from 'next/image'

import type { Experience } from '@/payload-types'
import type { Locale } from '@/lib/i18n'

export type ExperienceSectionProps = {
  eyebrow?: string
  heading: string
  note?: string
  /** Label shown in place of a missing `endDate` (e.g. "Actualidad"). */
  presentLabel: string
  /** Locale of the URL segment, used to format the month/year date ranges. */
  locale: Locale
  /** Experience docs as Payload returns them at `depth: 1`, newest first. */
  experiences: Experience[]
}

const HEADING_ID = 'experience-section-heading'

/** Month + year formatting is stable per locale, so build one formatter per locale. */
const monthFormatters = new Map<Locale, Intl.DateTimeFormat>()

function monthFormatter(locale: Locale): Intl.DateTimeFormat {
  const cached = monthFormatters.get(locale)

  if (cached) {
    return cached
  }

  // UTC keeps a stored first-of-month date on the month it was authored in.
  const formatter = new Intl.DateTimeFormat(locale, {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  })
  monthFormatters.set(locale, formatter)

  return formatter
}

function formatMonth(value: string, locale: Locale): string | null {
  const date = new Date(value)

  return Number.isNaN(date.getTime()) ? null : monthFormatter(locale).format(date)
}

function logoOf(experience: Experience) {
  return experience.logo && typeof experience.logo === 'object' ? experience.logo : null
}

/**
 * Presentational Experience section: a professional timeline rendered as an
 * ordered list. Each entry has a left rail with a dot marker, the date range as
 * mono meta, the role, company/location, description and stack chips.
 */
export function ExperienceSection({
  eyebrow,
  heading,
  note,
  presentLabel,
  locale,
  experiences,
}: ExperienceSectionProps) {
  // The collection starts empty and may be emptied again: no content, no section.
  // Returning null keeps the home page from rendering a heading over nothing.
  if (experiences.length === 0) {
    return null
  }

  return (
    <section
      id="experience"
      aria-labelledby={HEADING_ID}
      className="px-6 py-20 sm:py-24 lg:py-28"
    >
      <div className="mx-auto flex w-full max-w-(--container-page) flex-col gap-10 lg:gap-14">
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

        <ol role="list" className="flex flex-col">
          {experiences.map((experience, index) => {
            const logo = logoOf(experience)
            const logoUrl = logo?.url ?? null
            const stack = experience.stack ?? []
            const startLabel = formatMonth(experience.startDate, locale)
            const endLabel = experience.endDate ? formatMonth(experience.endDate, locale) : null
            const initial = experience.company.trim().charAt(0).toUpperCase()

            return (
              <li
                key={experience.id ?? `${experience.company}-${index}`}
                className="relative flex flex-col gap-4 border-l border-border pb-10 pl-8 last:pb-0 sm:pl-10"
              >
                <span
                  aria-hidden
                  className="absolute left-0 top-2.5 size-2 -translate-x-1/2 rounded-full bg-primary"
                />

                <div className="mono flex flex-wrap items-center gap-2 text-[10px] uppercase leading-none tracking-[0.16em] text-muted">
                  {startLabel ? <time dateTime={experience.startDate}>{startLabel}</time> : null}
                  <span aria-hidden>—</span>
                  {experience.endDate && endLabel ? (
                    <time dateTime={experience.endDate ?? undefined}>{endLabel}</time>
                  ) : (
                    <span>{presentLabel}</span>
                  )}
                </div>

                <div className="flex items-start gap-4">
                  {logo && logoUrl ? (
                    <Image
                      src={logoUrl}
                      alt={logo.alt || `${experience.company} logo`}
                      width={logo.width ?? 40}
                      height={logo.height ?? 40}
                      className="size-10 shrink-0 rounded-lg border border-border object-contain"
                    />
                  ) : (
                    <span
                      aria-hidden
                      className="mono flex size-10 shrink-0 items-center justify-center rounded-lg border border-border bg-secondary/40 text-[13px] leading-none text-muted-foreground"
                    >
                      {initial}
                    </span>
                  )}

                  <div className="flex min-w-0 flex-col gap-1.5">
                    <h3 className="font-heading text-[17px] font-semibold leading-snug tracking-[-0.02em]">
                      {experience.role}
                    </h3>
                    <p className="mono text-[10px] uppercase leading-none tracking-[0.16em] text-muted-foreground">
                      {experience.company}
                      {experience.location ? (
                        <>
                          <span aria-hidden> · </span>
                          <span className="text-muted">{experience.location}</span>
                        </>
                      ) : null}
                    </p>
                  </div>
                </div>

                {experience.description ? (
                  <p className="max-w-[62ch] text-sm leading-[1.7] text-muted-foreground">
                    {experience.description}
                  </p>
                ) : null}

                {stack.length > 0 ? (
                  <ul role="list" className="flex flex-wrap gap-2">
                    {stack.map((item, itemIndex) => (
                      <li key={item.id ?? `${item.name}-${itemIndex}`}>
                        <span className="mono inline-flex rounded-md border border-border bg-secondary/40 px-2.5 py-1 text-[11px] leading-none text-muted-foreground">
                          {item.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
