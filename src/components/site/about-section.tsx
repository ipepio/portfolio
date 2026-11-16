import { RichText } from '@payloadcms/richtext-lexical/react'
import Image from 'next/image'

import type { About } from '@/payload-types'

export type AboutSectionProps = {
  about: About
  /** Label for the education list heading. */
  educationHeading: string
  /** Label for the languages list heading. */
  languagesHeading: string
}

/** Lexical editor state accepted by the official Payload `RichText` renderer. */
type RichTextData = Parameters<typeof RichText>[0]['data']

const HEADING_ID = 'about-section-heading'
const EDUCATION_ID = 'about-education-heading'
const LANGUAGES_ID = 'about-languages-heading'

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

/**
 * Presentational About section: availability pill, display name, role, location,
 * optional photo, rich-text bio, principles grid plus education and languages.
 */
export function AboutSection({ about, educationHeading, languagesHeading }: AboutSectionProps) {
  const photo = about.photo && typeof about.photo === 'object' ? about.photo : null
  const photoUrl = photo?.url ?? null
  const principles = about.principles ?? []
  const education = about.education ?? []
  const languages = about.languages ?? []
  // SAFETY: `bio` is a stored Payload lexical editor state. The generated type only
  // describes `root`/`children` loosely (e.g. `type: string` instead of `'root'`), while
  // `RichText` expects the full `SerializedEditorState` node union. The runtime shape is
  // identical for editor states produced by the configured lexical editor.
  const bioData = (about.bio ?? null) as unknown as RichTextData | null

  return (
    <section
      id="about"
      aria-labelledby={HEADING_ID}
      className="scroll-mt-24 px-6 pt-16 pb-16 sm:pt-20 lg:pt-24"
    >
      <div className="mx-auto flex w-full max-w-(--container-page) flex-col gap-14 lg:gap-16">
        <header className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex min-w-0 flex-col gap-6">
            {about.availability ? (
              <p className="mono inline-flex w-fit items-center gap-2.5 rounded-full border border-border bg-card/70 px-3.5 py-1.5 text-[10px] uppercase leading-none tracking-[0.16em] text-muted-foreground">
                <span
                  aria-hidden
                  className="size-1.5 shrink-0 rounded-full bg-primary motion-safe:animate-pulse"
                />
                {about.availability}
              </p>
            ) : null}

            <div className="flex flex-col gap-3">
              <h1
                id={HEADING_ID}
                className="font-heading text-[clamp(48px,7vw,96px)] font-bold leading-[0.95] tracking-[-0.08em] text-balance"
              >
                {about.name}
              </h1>
              {about.role ? (
                <p className="font-heading text-[clamp(19px,2.2vw,28px)] font-semibold leading-tight tracking-[-0.03em] text-primary">
                  {about.role}
                </p>
              ) : null}
              {about.location ? (
                <p className="mono text-[11px] uppercase tracking-[0.16em] text-muted">
                  {about.location}
                </p>
              ) : null}
            </div>
          </div>

          {photo && photoUrl ? (
            <Image
              src={photoUrl}
              alt={photo.alt || about.name}
              width={photo.width ?? 480}
              height={photo.height ?? 480}
              priority
              className="size-40 shrink-0 rounded-2xl border border-border object-cover"
            />
          ) : null}
        </header>

        {bioData ? (
          <RichText
            className="flex max-w-[68ch] flex-col gap-4 text-base leading-[1.75] text-muted-foreground [&_a]:text-primary [&_a]:underline [&_blockquote]:border-l-2 [&_blockquote]:border-border [&_blockquote]:pl-4 [&_li]:my-1 [&_p]:m-0 [&_strong]:text-foreground [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5"
            data={bioData}
          />
        ) : null}

        {principles.length > 0 ? (
          <ul role="list" className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {principles.map((principle, index) => (
              <li key={principleKey(principle, index)}>
                <article className="flex h-full flex-col gap-3 rounded-xl border border-border bg-card p-6">
                  {principle.index ? (
                    <span className="mono text-[10px] uppercase leading-none tracking-[0.16em] text-accent">
                      {principle.index}
                    </span>
                  ) : null}
                  {principle.title ? (
                    <h2 className="font-heading text-[17px] font-semibold leading-snug tracking-[-0.02em]">
                      {principle.title}
                    </h2>
                  ) : null}
                  {principle.body ? (
                    <p className="text-sm leading-[1.7] text-muted-foreground">{principle.body}</p>
                  ) : null}
                </article>
              </li>
            ))}
          </ul>
        ) : null}

        {education.length > 0 || languages.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:gap-12">
            {education.length > 0 ? (
              <section aria-labelledby={EDUCATION_ID} className="flex flex-col gap-5">
                <h2 id={EDUCATION_ID} className="eyebrow">
                  {educationHeading}
                </h2>
                <ul role="list" className="flex flex-col gap-3">
                  {education.map((item, index) => (
                    <li key={educationKey(item, index)}>
                      <article className="flex h-full flex-col gap-1.5 rounded-xl border border-border bg-card p-6">
                        {item.title ? (
                          <h3 className="font-heading text-[16px] font-semibold leading-snug tracking-[-0.02em]">
                            {item.title}
                          </h3>
                        ) : null}
                        {item.institution ? (
                          <p className="text-sm text-muted-foreground">{item.institution}</p>
                        ) : null}
                        {item.note ? (
                          <p className="text-sm leading-[1.6] text-accent">{item.note}</p>
                        ) : null}
                      </article>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {languages.length > 0 ? (
              <section aria-labelledby={LANGUAGES_ID} className="flex flex-col gap-5">
                <h2 id={LANGUAGES_ID} className="eyebrow">
                  {languagesHeading}
                </h2>
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
