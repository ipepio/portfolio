import { RichText } from '@payloadcms/richtext-lexical/react'

import { ExpertiseOrbit } from '@/components/site/expertise-orbit'

import type { AboutCopy } from '@/lib/i18n'
import { BLOG_URL } from '@/lib/site-links'
import type { About } from '@/payload-types'

export type AboutSectionProps = {
  about: About
  /** Localized chrome of the section, including both fallback strings (dictionary `about`). */
  copy: AboutCopy
}

/** Lexical editor state accepted by the official Payload `RichText` renderer. */
type RichTextData = Parameters<typeof RichText>[0]['data']

const HEADING_ID = 'about-section-heading'

/**
 * The reference `.about-description`: big, tight, with `<strong>` promoted to the
 * foreground and italic runs stepped back to the muted tone.
 */
const BIO_CLASS =
  'max-w-[62ch] text-[clamp(19px,2vw,27px)] leading-[1.48] tracking-[-0.03em] text-muted-foreground [&_a]:text-primary [&_a]:underline [&_em]:text-muted [&_i]:text-muted [&_p]:m-0 [&_p+p]:mt-[0.6em] [&_strong]:font-semibold [&_strong]:text-foreground'

function principleKey(
  principle: NonNullable<About['principles']>[number],
  index: number,
): string | number {
  return principle.id ?? `${principle.title ?? 'principle'}-${index}`
}

/**
 * Presentational About section, matching the reference two-column layout: eyebrow plus the
 * display heading on the left, the big rich-text bio on the right, then the three-column
 * principles grid and the expertise orbit closing the section. It is one of the elevated
 * bands of the page (Hero, Skills and Contact keep the base surface). The section is
 * viewport-tall like the hero, but its content is top-aligned so the eyebrow never floats
 * in the middle of the screen.
 *
 * The portrait, location caption, education and languages are still fields of the About
 * global but no section renders them and the seed writes them empty — the user asked for
 * this section to stay minimal.
 */
export function AboutSection({ about, copy }: AboutSectionProps) {
  const principles = about.principles ?? []

  // The Payload fields win; the dictionary strings are the fallbacks. The heading can carry
  // real newlines, which `whitespace-pre-line` renders as forced line breaks so the
  // three-line composition is guaranteed regardless of width.
  const eyebrowText = about.sectionEyebrow?.trim() || copy.eyebrow.trim()
  const headingText = about.sectionHeading?.trim() || copy.heading.trim()
  const headingAccent = about.sectionHeadingAccent?.trim() ?? ''

  // SAFETY: `bio` is a stored Payload lexical editor state. The generated type only
  // describes `root`/`children` loosely (e.g. `type: string` instead of `'root'`), while
  // `RichText` expects the full `SerializedEditorState` node union. The runtime shape is
  // identical for editor states produced by the configured lexical editor.
  const bioData = (about.bio ?? null) as unknown as RichTextData | null

  return (
    <section
      id="about"
      aria-labelledby={headingText ? HEADING_ID : undefined}
      className="flex min-h-[100svh] flex-col justify-start border-y border-border bg-background-elevated px-6 pt-[clamp(40px,5vw,72px)] pb-16 min-[780px]:pb-[88px]"
    >
      <div className="mx-auto flex w-full max-w-(--container-page) flex-col gap-10 min-[780px]:gap-[44px]">
        {/* Reference layout: display heading on the left, description on the right. */}
        <div className="grid grid-cols-1 gap-[30px] md:grid-cols-[minmax(0,0.43fr)_minmax(0,0.57fr)] md:items-start md:gap-[9%]">
          <div className="flex min-w-0 flex-col">
            {eyebrowText ? <p className="eyebrow">{eyebrowText}</p> : null}

            {headingText ? (
              <h2
                id={HEADING_ID}
                className="mt-5 whitespace-pre-line font-heading text-[clamp(37px,4.7vw,61px)] font-semibold leading-[1.06] tracking-[-0.067em] text-balance"
              >
                {headingText}
                {headingAccent ? (
                  <>
                    {'\n'}
                    <span className="text-primary">{headingAccent}</span>
                  </>
                ) : null}
              </h2>
            ) : null}
          </div>

          <div className="min-w-0">
            {bioData ? <RichText className={BIO_CLASS} data={bioData} /> : null}

            {/* Leads to the blog application, which lives on its own address. */}
            <a
              href={BLOG_URL}
              className="mono mt-6 inline-flex w-fit max-w-full items-center justify-between gap-3 border-b border-primary pb-3 text-[11px] leading-[1.6] font-semibold tracking-[0.01em] text-primary transition-colors hover:border-foreground hover:text-foreground"
            >
              <span>{copy.blogLink}</span>
              <span aria-hidden className="text-[18px] leading-none">
                ↗
              </span>
            </a>
          </div>
        </div>

        {/* Principles: top rule, mono accent index, 21px title, 13px muted body. */}
        {principles.length > 0 ? (
          <ul
            role="list"
            className="grid grid-cols-1 gap-[16px] min-[780px]:grid-cols-3 min-[780px]:gap-[22px]"
          >
            {principles.map((principle, index) => (
              <li
                key={principleKey(principle, index)}
                className="border-t border-input pt-[23px] pr-[5px] pb-[10px]"
              >
                {principle.index ? (
                  <span className="mono text-[11px] font-bold leading-none text-primary">
                    {principle.index}
                  </span>
                ) : null}
                {principle.title ? (
                  <h3 className="mt-[24px] mb-[10px] font-heading text-[21px] font-semibold leading-[1.25] tracking-[-0.045em]">
                    {principle.title}
                  </h3>
                ) : null}
                {principle.body ? (
                  <p className="max-w-[350px] text-[13px] leading-[1.8] text-muted">
                    {principle.body}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        ) : null}

        {/* Expertise orbit: seven equidistant areas of expertise, last block of the section. */}
        <ExpertiseOrbit />
      </div>
    </section>
  )
}
