import { RichText } from '@payloadcms/richtext-lexical/react'
import Image from 'next/image'

import type { About } from '@/payload-types'

export type AboutSectionProps = {
  about: About
  /** Fallback eyebrow for when the Payload `sectionEyebrow` field is empty. */
  eyebrow?: string
  /**
   * Fallback display heading for when the Payload `sectionHeading` field is empty.
   * The hero owns the page `h1`, so the section renders a single `h2`.
   */
  heading?: string
  /** Label for the education card heading. */
  educationHeading: string
  /** Label for the languages card heading. */
  languagesHeading: string
  /** Word for the current period in the photo caption, e.g. "Actualidad". */
  presentLabel?: string
}

/** Lexical editor state accepted by the official Payload `RichText` renderer. */
type RichTextData = Parameters<typeof RichText>[0]['data']

const HEADING_ID = 'about-section-heading'
const EDUCATION_ID = 'about-education-heading'
const LANGUAGES_ID = 'about-languages-heading'

/**
 * The reference `.about-description`: big, tight, with `<strong>` promoted to the
 * foreground and italic runs stepped back to the muted tone.
 */
const BIO_CLASS =
  'max-w-[680px] text-[clamp(19px,2vw,27px)] leading-[1.48] tracking-[-0.03em] text-muted-foreground [&_a]:text-primary [&_a]:underline [&_em]:text-muted [&_i]:text-muted [&_p]:m-0 [&_p+p]:mt-[0.6em] [&_strong]:font-semibold [&_strong]:text-foreground'

function principleKey(
  principle: NonNullable<About['principles']>[number],
  index: number,
): string | number {
  return principle.id ?? `${principle.title ?? 'principle'}-${index}`
}

function educationKey(item: NonNullable<About['education']>[number], index: number) {
  return item.id ?? `${item.title ?? 'education'}-${index}`
}

function languageKey(language: NonNullable<About['languages']>[number], index: number) {
  return language.id ?? `${language.name ?? 'language'}-${index}`
}

/** The years-of-experience figure, rendered compactly next to the portrait. */
function AboutStat({ stat }: { stat: NonNullable<About['stats']>[number] }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="font-heading text-[clamp(44px,6vw,58px)] font-semibold leading-[0.85] tracking-[-0.06em] text-foreground">
        {stat.value}
      </span>
      <span className="mono text-[10px] font-semibold uppercase leading-[1.5] tracking-[0.14em] text-muted-foreground">
        {stat.label}
      </span>
    </div>
  )
}

/**
 * Presentational About section, rebuilt on the reference's `.about` layout:
 * a `.43fr / .57fr` header grid (eyebrow + display heading / big rich-text bio),
 * a portrait row carrying the mono location caption and the single stat, the
 * three-column principles grid, and two rounded cards for education and languages.
 * The name, role and availability pill live in the hero.
 */
export function AboutSection({
  about,
  eyebrow,
  heading,
  educationHeading,
  languagesHeading,
  presentLabel,
}: AboutSectionProps) {
  const photo = about.photo && typeof about.photo === 'object' ? about.photo : null
  const principles = about.principles ?? []
  const education = about.education ?? []
  const languages = about.languages ?? []
  // Only the years-of-experience figure is kept; it renders next to the photo.
  const stat = (about.stats ?? []).find((item) => item.value?.trim() && item.label?.trim()) ?? null

  // Section copy is editable in Payload; the dictionary only acts as a fallback.
  const eyebrowText = about.sectionEyebrow?.trim() || eyebrow?.trim() || ''
  const headingText = about.sectionHeading?.trim() || heading?.trim() || ''
  const headingAccent = about.sectionHeadingAccent?.trim() ?? ''
  const photoUrl = photo?.url ?? null
  const caption = [about.location?.trim(), presentLabel?.trim()]
    .filter((part): part is string => Boolean(part))
    .join(' · ')

  // SAFETY: `bio` is a stored Payload lexical editor state. The generated type only
  // describes `root`/`children` loosely (e.g. `type: string` instead of `'root'`), while
  // `RichText` expects the full `SerializedEditorState` node union. The runtime shape is
  // identical for editor states produced by the configured lexical editor.
  const bioData = (about.bio ?? null) as unknown as RichTextData | null

  return (
    <section
      id="about"
      aria-labelledby={headingText ? HEADING_ID : undefined}
      className="scroll-mt-24 px-6 pt-16 pb-16 sm:pt-20 min-[780px]:pt-[126px] min-[780px]:pb-[120px]"
    >
      <div className="mx-auto flex w-full max-w-(--container-page) flex-col gap-12 min-[780px]:gap-[52px]">
        {/* Header: eyebrow + display heading on the left, the bio as big description. */}
        <div className="grid grid-cols-1 gap-[30px] min-[780px]:grid-cols-[.43fr_.57fr] min-[780px]:gap-[9%]">
          <div className="flex min-w-0 flex-col">
            {eyebrowText ? <p className="eyebrow">{eyebrowText}</p> : null}
            {headingText ? (
              <h2
                id={HEADING_ID}
                className="mt-[15px] max-w-[580px] font-heading text-[clamp(37px,4.7vw,61px)] font-semibold leading-[1.08] tracking-[-0.065em] text-balance min-[780px]:max-w-[310px]"
              >
                {headingText}
                {headingAccent ? (
                  <>
                    {' '}
                    <span className="text-primary">{headingAccent}</span>
                  </>
                ) : null}
              </h2>
            ) : null}
          </div>

          {bioData ? <RichText className={BIO_CLASS} data={bioData} /> : null}
        </div>

        {/* Portrait + mono caption, with the single stat beside them. */}
        {photoUrl || caption || stat ? (
          <div className="flex flex-col gap-8 min-[520px]:flex-row min-[520px]:items-end min-[520px]:justify-between min-[520px]:gap-12">
            {photoUrl || caption ? (
              <figure className="flex min-w-0 flex-col gap-3">
                {photoUrl ? (
                  <Image
                    src={photoUrl}
                    alt={photo?.alt || about.name}
                    width={photo?.width ?? 480}
                    height={photo?.height ?? 480}
                    className="aspect-square w-[clamp(160px,42vw,230px)] rounded-2xl border border-border object-cover"
                  />
                ) : null}
                {caption ? (
                  <figcaption className="mono text-[10px] font-semibold uppercase leading-[1.5] tracking-[0.14em] text-muted-foreground">
                    {caption}
                  </figcaption>
                ) : null}
              </figure>
            ) : null}

            {stat ? <AboutStat stat={stat} /> : null}
          </div>
        ) : null}

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

        {/* Education and languages as two rounded cards. */}
        {education.length > 0 || languages.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 min-[780px]:grid-cols-2">
            {education.length > 0 ? (
              <section
                aria-labelledby={EDUCATION_ID}
                className="flex flex-col gap-6 rounded-2xl border border-border bg-card p-6"
              >
                <h3 id={EDUCATION_ID} className="eyebrow">
                  {educationHeading}
                </h3>
                <ul role="list" className="flex flex-col gap-5">
                  {education.map((item, index) => (
                    <li key={educationKey(item, index)} className="flex flex-col gap-1.5">
                      {item.title ? (
                        <h4 className="font-heading text-[17px] font-semibold leading-snug tracking-[-0.02em]">
                          {item.title}
                        </h4>
                      ) : null}
                      {item.institution ? (
                        <p className="text-sm text-muted-foreground">{item.institution}</p>
                      ) : null}
                      {item.note ? (
                        <p className="text-sm leading-[1.6] text-peach">{item.note}</p>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {languages.length > 0 ? (
              <section
                aria-labelledby={LANGUAGES_ID}
                className="flex flex-col gap-6 rounded-2xl border border-border bg-card p-6"
              >
                <h3 id={LANGUAGES_ID} className="eyebrow">
                  {languagesHeading}
                </h3>
                <ul role="list" className="flex flex-wrap gap-2">
                  {languages.map((language, index) => {
                    const label = [language.name, language.level]
                      .map((part) => part?.trim())
                      .filter((part): part is string => Boolean(part))
                      .join(' · ')

                    if (!label) {
                      return null
                    }

                    return (
                      <li key={languageKey(language, index)}>
                        <span className="mono inline-flex rounded-full border border-border bg-secondary/40 px-3 py-1.5 text-[11px] leading-none text-muted-foreground">
                          {label}
                        </span>
                      </li>
                    )
                  })}
                </ul>
              </section>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  )
}
