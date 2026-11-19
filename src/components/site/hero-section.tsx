import { RichText } from '@payloadcms/richtext-lexical/react'

import { HeroPortrait } from '@/components/site/hero-portrait'

import type { HeroCopy, PortraitLabels } from '@/lib/i18n'
import type { Media } from '@/payload-types'

export type HeroLineStyle = 'plain' | 'outlined' | 'accent'

export type HeroLine = {
  text: string
  style?: HeroLineStyle | null
  id?: string | null
}

export type HeroMeta = {
  text?: string | null
  id?: string | null
}

export type HeroSectionProps = {
  /** Full name, exposed to assistive tech next to the headline lines. */
  name: string
  availability?: string | null
  /** The headline, one array row per line (maxRows 3 in the About global). */
  heroLines?: HeroLine[] | null
  /** Stored lexical editor state for the intro; the name is a bold run. */
  heroIntro?: RichTextData | null
  /** Short tags rendered as the reference's `+`-prefixed meta row. */
  heroMeta?: HeroMeta[] | null
  /** Localized chrome of the section (dictionary `hero` slice). */
  copy: HeroCopy
  /** `about.photo` for the portrait card, or its raw id when the relation is unpopulated. */
  photo?: Media | number | null
  /** `about.role`, shown under the name in the portrait caption. */
  role?: string | null
  /** Localized copy for the portrait showcase (dictionary `portrait` group). */
  portrait: PortraitLabels
}

/** Per-style classes for one headline line, mirroring the reference `.hero h1`. */
const LINE_CLASSES: Record<HeroLineStyle, string> = {
  plain: 'text-foreground',
  outlined: 'text-transparent [-webkit-text-stroke:1px_var(--muted-foreground)]',
  accent: 'text-primary',
}

const HERO_LINE_CLASS =
  'font-heading block text-[clamp(55px,13.6vw,74px)] font-bold leading-[0.92] tracking-[-0.087em] sm:text-[clamp(58px,7.3vw,112px)]'

/** Shared `.btn` shape from the reference: 48px tall, 11px radius, 20px label gap. */
const BTN_CLASS =
  'inline-flex min-h-[48px] items-center justify-center gap-5 rounded-[11px] px-5 text-xs font-bold transition duration-200 motion-reduce:transition-none'

/** Lexical editor state accepted by the official Payload `RichText` renderer. */
type RichTextData = Parameters<typeof RichText>[0]['data']

function lineKey(line: HeroLine, index: number) {
  return line.id ?? `${line.text}-${index}`
}

function metaKey(item: HeroMeta, index: number) {
  return item.id ?? `${item.text ?? 'meta'}-${index}`
}

/**
 * Hero: availability pill, the three-line display headline (plain / outlined /
 * accent), the intro paragraph, two CTAs, the `+`-prefixed meta row and the
 * editorial portrait showcase on the right. The numbers live in the About
 * section, not here.
 */
export function HeroSection({
  name,
  availability,
  heroLines,
  heroIntro,
  heroMeta,
  copy,
  photo,
  role,
  portrait,
}: HeroSectionProps) {
  const lines = (heroLines ?? []).filter((line) => line.text?.trim())
  const meta = (heroMeta ?? []).filter((item) => item.text?.trim())
  // SAFETY: `heroIntro` is a stored Payload lexical editor state. The generated type only
  // describes `root`/`children` loosely (e.g. `type: string` instead of `'root'`), while
  // `RichText` expects the full `SerializedEditorState` node union. The runtime shape is
  // identical for editor states produced by the configured lexical editor.
  const introData = (heroIntro ?? null) as unknown as RichTextData | null

  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden px-6 pt-[clamp(78px,9.5vw,144px)] pb-[82px] md:pb-[102px]"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -top-[260px] -right-[320px] size-[720px] rounded-full"
        style={{
          background:
            'radial-gradient(circle, color-mix(in oklab, var(--primary) 9%, transparent) 0%, transparent 65%)',
        }}
      />

      <div className="relative mx-auto grid w-full max-w-(--container-page) items-center gap-[42px] min-[780px]:grid-cols-[minmax(0,1.16fr)_minmax(0,0.84fr)] min-[780px]:gap-[clamp(36px,4.8vw,72px)]">
        <div className="relative z-[1] min-w-0">
          {availability ? (
            <p className="mono mb-9 inline-flex items-center gap-[11px] rounded-full border border-border px-[13px] py-2 text-[11px] leading-none text-muted-foreground">
              <span
                aria-hidden
                className="size-[7px] shrink-0 animate-pulse rounded-full bg-primary motion-reduce:animate-none"
                style={{
                  boxShadow: '0 0 0 4px color-mix(in oklab, var(--primary) 18%, transparent)',
                }}
              />
              {availability}
            </p>
          ) : null}

          <h1 id="hero-heading" className="max-w-[750px] text-balance">
            {lines.length > 0 ? (
              lines.map((line, index) => (
                <span
                  key={lineKey(line, index)}
                  className={`${HERO_LINE_CLASS} ${LINE_CLASSES[line.style ?? 'plain']}`}
                >
                  {line.text}
                </span>
              ))
            ) : (
              <span className={`${HERO_LINE_CLASS} text-foreground`}>{name}</span>
            )}
            <span className="sr-only"> — {name}</span>
          </h1>

          {introData ? (
            <RichText
              className="mt-[30px] mb-[30px] max-w-[560px] text-[clamp(16px,1.7vw,20px)] leading-[1.7] tracking-[-0.015em] text-muted-foreground [&_p]:m-0 [&_strong]:font-semibold [&_strong]:text-foreground"
              data={introData}
            />
          ) : null}

          <div className="flex flex-wrap gap-2.5">
            <a
              href="#about"
              className={`${BTN_CLASS} border border-primary bg-primary text-primary-foreground hover:-translate-y-0.5 hover:brightness-[1.04] motion-reduce:hover:translate-y-0`}
            >
              <span>{copy.primaryCta}</span>
              <span aria-hidden>↗</span>
            </a>
            <a
              href="#contact"
              className={`${BTN_CLASS} border border-input text-foreground hover:border-muted hover:bg-card`}
            >
              <span>{copy.secondaryCta}</span>
              <span aria-hidden>↗</span>
            </a>
          </div>

          {meta.length > 0 ? (
            <ul
              role="list"
              className="mono mt-[43px] flex flex-wrap gap-x-6 gap-y-1 text-[10px] font-medium uppercase leading-[1.5] tracking-[0.06em] text-muted"
            >
              {meta.map((item, index) => (
                <li key={metaKey(item, index)}>
                  <span aria-hidden className="text-primary">
                    {'+ '}
                  </span>
                  {item.text}
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <HeroPortrait photo={photo} name={name} role={role} copy={portrait} />
      </div>
    </section>
  )
}
