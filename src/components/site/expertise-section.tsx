/** One capability row: what I do, as the expertise reference describes it. */
export type Capability = {
  id?: string | number
  title: string
  description?: string | null
}

export type ExpertiseSectionProps = {
  /** Fallback eyebrow; the section ordinal lives in the dictionary. */
  eyebrow?: string
  /** Display heading, without the accent tail. */
  heading: string
  /** Accented tail of the heading, rendered in the primary colour. */
  headingAccent?: string
  description?: string
  /** Mono footnote pinned under the description. */
  note?: string
  /** Label over the capability list, e.g. "CAPACIDADES / CÓMO APORTO VALOR". */
  areasLabel: string
  capabilities: Capability[]
  /** Core toolkit names, highlighted over the extended ones. */
  coreTools: string[]
  /** Extended toolkit names. */
  extendedTools: string[]
  /** Label over the core chips, e.g. "HERRAMIENTAS CON LAS QUE MÁS ME IDENTIFICO". */
  coreLabel: string
  /** Small mono tag next to `coreLabel`, e.g. "CORE TOOLKIT". */
  coreTag: string
  /** Label over the extended chips. */
  extendedLabel: string
  /** Small mono tag next to `extendedLabel`, e.g. "EXTENDED TOOLKIT". */
  extendedTag: string
  /** Closing sentence under the extended chips. */
  toolsFoot?: string
}

const HEADING_ID = 'skills-section-heading'

const CHIP_CLASS =
  'mono inline-flex min-h-[33px] items-center rounded-[7px] border border-border bg-card px-2.5 py-[7px] text-[11px] leading-[1.3] text-muted-foreground'
const CHIP_STRONG_CLASS = `${CHIP_CLASS} border-foreground/25 text-foreground`
const CHIP_LEAD_CLASS = `${CHIP_CLASS} border-primary bg-primary/10 text-primary`

/**
 * Presentational "what I do" section, matching the expertise reference: a sticky aside
 * on the left and, on the right, the ordered capability list closing in the two tool
 * belts. Every capability and every tool name comes from Payload; only the labels and
 * this layout live here.
 */
export function ExpertiseSection({
  eyebrow,
  heading,
  headingAccent,
  description,
  note,
  areasLabel,
  capabilities,
  coreTools,
  extendedTools,
  coreLabel,
  coreTag,
  extendedLabel,
  extendedTag,
  toolsFoot,
}: ExpertiseSectionProps) {
  // An empty list would render the frame with nothing inside it, which reads as a bug.
  if (capabilities.length === 0) return null

  const total = capabilities.length
  const counter = `01 — ${String(total).padStart(2, '0')}`

  return (
    <section id="skills" aria-labelledby={HEADING_ID} className="px-6 py-20 sm:py-24 lg:py-28">
      <div className="mx-auto grid w-full max-w-(--container-page) items-start gap-10 lg:grid-cols-[0.73fr_1.27fr] lg:gap-[7.5%]">
        <div className="lg:sticky lg:top-[105px]">
          {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}

          <h2
            id={HEADING_ID}
            className="mt-4 mb-6 font-heading text-[clamp(44px,5.5vw,76px)] font-bold leading-[0.99] tracking-[-0.075em] text-balance"
          >
            {heading}
            {headingAccent ? (
              <>
                <br />
                <span className="text-primary">{headingAccent}</span>
              </>
            ) : null}
          </h2>

          {description ? (
            <p className="max-w-[345px] text-sm leading-[1.85] text-muted-foreground">
              {description}
            </p>
          ) : null}

          {note ? (
            <p className="mono mt-7 inline-flex gap-[9px] text-[11px] font-semibold leading-[1.6] text-muted">
              <span aria-hidden="true" className="text-primary">
                →
              </span>
              <span>{note}</span>
            </p>
          ) : null}
        </div>

        <div className="min-w-0 border-t border-border">
          <div className="mono flex items-center justify-between gap-3 py-[17px] pb-3 text-[10px] font-bold uppercase leading-[1.5] tracking-[0.1em] text-muted">
            <span>{areasLabel}</span>
            <span aria-hidden="true">{counter}</span>
          </div>

          <ol role="list">
            {capabilities.map((capability, index) => (
              <li
                key={capability.id ?? index}
                className="group grid grid-cols-[34px_minmax(0,1fr)_16px] items-start gap-x-[9px] border-b border-border py-[22px] transition-[padding,background] duration-200 sm:grid-cols-[45px_minmax(0,1fr)_21px] sm:gap-x-[17px] sm:pt-6 sm:pb-[25px] sm:hover:bg-[linear-gradient(90deg,var(--primary-soft),transparent_72%)] sm:hover:pl-2"
              >
                <span
                  aria-hidden="true"
                  className="mono mt-[5px] text-[11px] font-bold leading-[1.3] text-primary"
                >
                  {String(index + 1).padStart(2, '0')} /
                </span>

                <div>
                  <h3 className="mb-[9px] text-[19px] font-bold leading-tight tracking-[-0.038em] text-foreground sm:text-[20px]">
                    {capability.title}
                  </h3>
                  {capability.description ? (
                    <p className="max-w-[545px] text-xs leading-[1.75] text-muted-foreground">
                      {capability.description}
                    </p>
                  ) : null}
                </div>

                <span
                  aria-hidden="true"
                  className="text-[17px] text-muted transition-[transform,color] duration-200 group-hover:translate-x-[4px] group-hover:-translate-y-[3px] group-hover:text-primary"
                >
                  ↗
                </span>
              </li>
            ))}
          </ol>

          <div className="pt-7 pb-2">
            <div className="mono mb-[13px] flex flex-wrap items-center justify-between gap-3 text-[10px] font-bold uppercase leading-[1.5] tracking-[0.09em] text-muted">
              <span>{coreLabel}</span>
              <small className="text-[9px] font-medium tracking-normal">{coreTag}</small>
            </div>

            <div className="flex flex-wrap gap-2">
              {coreTools.map((tool, index) => (
                <span key={tool} className={index === 0 ? CHIP_LEAD_CLASS : CHIP_STRONG_CLASS}>
                  {tool}
                </span>
              ))}
            </div>

            <div className="pt-[22px]">
              <div className="mono mb-[13px] flex flex-wrap items-center justify-between gap-3 text-[10px] font-bold uppercase leading-[1.5] tracking-[0.09em] text-muted">
                <span>{extendedLabel}</span>
                <small className="text-[9px] font-medium tracking-normal">{extendedTag}</small>
              </div>

              <div className="flex flex-wrap gap-2">
                {extendedTools.map((tool) => (
                  <span key={tool} className={CHIP_CLASS}>
                    {tool}
                  </span>
                ))}
              </div>

              {toolsFoot ? (
                <p className="mt-[17px] text-[11px] leading-[1.8] text-muted">{toolsFoot}</p>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
