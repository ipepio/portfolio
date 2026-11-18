import { skillIcon } from '@/lib/skill-icons'

export type SkillGroupItem = { name: string; key?: boolean | null }

export type SkillGroup = {
  id?: string | number
  number?: string | null
  label?: string | null
  title: string
  icon?: string | null
  items?: SkillGroupItem[] | null
}

export type SkillsSectionProps = {
  eyebrow?: string
  heading: string
  /** Trailing part of the heading, rendered in the lima accent (`text-primary`). */
  headingAccent?: string
  subheading?: string
  groups: SkillGroup[]
}

const HEADING_ID = 'skills-section-heading'

const CHIP_CLASS =
  'mono inline-flex max-w-full items-baseline rounded-md border border-border bg-secondary/40 px-2.5 py-1 text-[11px] leading-[1.5] break-words text-muted-foreground'

const KEY_CHIP_CLASS =
  'mono inline-flex max-w-full items-baseline rounded-md border border-primary/50 bg-primary/10 px-2.5 py-1 text-[11px] leading-[1.5] break-words text-primary'

function groupKey(group: SkillGroup, index: number) {
  return group.id ?? group.number ?? `${group.title}-${index}`
}

function groupMeta(group: SkillGroup) {
  return [group.number, group.label]
    .map((part) => part?.trim())
    .filter((part): part is string => Boolean(part))
    .join(' / ')
}

/**
 * Presentational Skills section: eyebrow, display heading with a lima accent,
 * muted subheading and a responsive grid of "skills by area" cards whose chips
 * sit at the bottom so sibling cards line up.
 */
export function SkillsSection({
  eyebrow,
  heading,
  headingAccent,
  subheading,
  groups,
}: SkillsSectionProps) {
  const accent = headingAccent?.trim() ?? ''

  return (
    <section
      id="skills"
      aria-labelledby={HEADING_ID}
      className="px-6 py-20 sm:py-24 lg:py-28"
    >
      <div className="mx-auto flex w-full max-w-(--container-page) flex-col gap-10 lg:gap-14">
        {/* Header: eyebrow + display heading on the left, muted subheading on the right. */}
        <header className="grid grid-cols-1 gap-6 min-[780px]:grid-cols-[.43fr_.57fr] min-[780px]:items-end min-[780px]:gap-[9%]">
          <div className="flex min-w-0 flex-col">
            {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
            <h2
              id={HEADING_ID}
              className="mt-[15px] font-heading text-[clamp(37px,4.7vw,61px)] font-semibold leading-[1.08] tracking-[-0.065em] text-balance"
            >
              {heading}
              {accent ? (
                <>
                  {' '}
                  <span className="text-primary">{accent}</span>
                </>
              ) : null}
            </h2>
          </div>

          {subheading ? (
            <p className="max-w-[60ch] text-[15px] leading-[1.75] text-muted-foreground min-[780px]:pb-1">
              {subheading}
            </p>
          ) : null}
        </header>

        <ul
          role="list"
          className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3"
        >
          {groups.map((group, index) => {
            const Icon = skillIcon(group.icon)
            const meta = groupMeta(group)
            const items = group.items ?? []

            return (
              <li key={groupKey(group, index)} className="flex">
                <article className="flex h-full w-full flex-col gap-5 rounded-2xl border border-border bg-card p-6 transition duration-200 hover:border-input motion-safe:hover:-translate-y-0.5 motion-reduce:transition-none">
                  <div className="flex items-start gap-3">
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                      <Icon className="size-5" aria-hidden />
                    </span>
                    <div className="flex min-w-0 flex-col gap-1.5">
                      {meta ? (
                        <span className="mono text-[10px] font-semibold uppercase leading-none tracking-[0.16em] text-muted">
                          {meta}
                        </span>
                      ) : null}
                      <h3 className="font-heading text-[18px] font-semibold leading-snug tracking-tight break-words">
                        {group.title}
                      </h3>
                    </div>
                  </div>

                  {items.length > 0 ? (
                    <ul role="list" className="mt-auto flex flex-wrap gap-2">
                      {items.map((item, itemIndex) => (
                        <li key={`${item.name}-${itemIndex}`} className="min-w-0 max-w-full">
                          <span className={item.key ? KEY_CHIP_CLASS : CHIP_CLASS}>
                            {item.name}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </article>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
