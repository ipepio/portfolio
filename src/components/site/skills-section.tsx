import type { LucideIcon } from 'lucide-react'
import { Building2, Cloud, Code2, Database, ShieldCheck, Sparkles, Workflow } from 'lucide-react'

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
  subheading?: string
  groups: SkillGroup[]
}

/** Payload `icon` select values mapped onto lucide glyphs. */
const groupIcons: Record<string, LucideIcon> = {
  code: Code2,
  cloud: Cloud,
  ai: Sparkles,
  shield: ShieldCheck,
  database: Database,
  enterprise: Building2,
  engineering: Workflow,
}

const HEADING_ID = 'skills-section-heading'

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
 * Presentational Skills section: eyebrow, display heading, optional subheading
 * and a responsive grid of "skills by area" cards filled with chips.
 */
export function SkillsSection({ eyebrow, heading, subheading, groups }: SkillsSectionProps) {
  return (
    <section aria-labelledby={HEADING_ID} className="px-6 py-20 sm:py-24 lg:py-28">
      <div className="mx-auto flex w-full max-w-(--container-page) flex-col gap-10 lg:gap-14">
        <header className="flex flex-col gap-5">
          {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
          <h2
            id={HEADING_ID}
            className="font-heading text-[clamp(38px,4.5vw,64px)] font-bold leading-[1.03] tracking-[-0.06em] text-balance"
          >
            {heading}
          </h2>
          {subheading ? (
            <p className="max-w-[60ch] text-base leading-[1.7] text-muted-foreground">
              {subheading}
            </p>
          ) : null}
        </header>

        <ul role="list" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map((group, index) => {
            const Icon = groupIcons[group.icon ?? ''] ?? groupIcons.code
            const meta = groupMeta(group)
            const items = group.items ?? []

            return (
              <li key={groupKey(group, index)}>
                <article className="flex h-full flex-col gap-4 rounded-xl border border-border bg-card p-6">
                  <div className="flex items-start gap-3">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent/12 text-accent">
                      <Icon className="size-4" aria-hidden />
                    </span>
                    <div className="flex min-w-0 flex-col gap-1">
                      {meta ? (
                        <span className="mono text-[10px] uppercase leading-none tracking-[0.16em] text-muted">
                          {meta}
                        </span>
                      ) : null}
                      <h3 className="font-heading text-[17px] font-semibold leading-snug tracking-[-0.02em]">
                        {group.title}
                      </h3>
                    </div>
                  </div>

                  {items.length > 0 ? (
                    <ul role="list" className="flex flex-wrap gap-2">
                      {items.map((item, itemIndex) => (
                        <li key={`${item.name}-${itemIndex}`}>
                          <span
                            className={
                              item.key
                                ? 'inline-flex rounded-md border border-primary/60 bg-primary/10 px-2.5 py-1 font-mono text-[11px] text-foreground'
                                : 'inline-flex rounded-md border border-border bg-secondary/40 px-2.5 py-1 font-mono text-[11px] text-muted-foreground'
                            }
                          >
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
