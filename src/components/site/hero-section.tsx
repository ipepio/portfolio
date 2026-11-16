import { RichText } from '@payloadcms/richtext-lexical/react'

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
  primaryCta: string
  secondaryCta: string
  /** Localized note shown inside the architecture panel status line. */
  statusNote: string
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

const NODE_CLASS =
  'mono absolute z-[1] rounded-[9px] border border-input bg-card px-3 py-2.5 text-[10px] font-bold leading-[1.2] whitespace-nowrap shadow-[0_8px_25px_rgba(0,0,0,0.10)]'

const NODE_SMALL_CLASS = 'mono mt-[3px] block text-[8px] font-medium leading-[1.5] text-muted'

/** Lexical editor state accepted by the official Payload `RichText` renderer. */
type RichTextData = Parameters<typeof RichText>[0]['data']

/**
 * The animated `dash` keyframe from the reference lives here instead of
 * `globals.css` so the decorative diagram stays self-contained, and it is
 * switched off when the visitor prefers reduced motion.
 */
const DASH_KEYFRAMES = `@keyframes hero-dash{to{stroke-dashoffset:-220}}
.hero-path-active{animation:hero-dash 14s linear infinite}
@media (prefers-reduced-motion:reduce){.hero-path-active{animation:none}}`

function lineKey(line: HeroLine, index: number) {
  return line.id ?? `${line.text}-${index}`
}

function metaKey(item: HeroMeta, index: number) {
  return item.id ?? `${item.text ?? 'meta'}-${index}`
}

/**
 * Hero: availability pill, the three-line display headline (plain / outlined /
 * accent), the intro paragraph, two CTAs, the `+`-prefixed meta row and the
 * decorative `architecture / system.map` panel with its dashed connectors.
 * The numbers live in the About section, not here.
 */
export function HeroSection({
  name,
  availability,
  heroLines,
  heroIntro,
  heroMeta,
  primaryCta,
  secondaryCta,
  statusNote,
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
      className="relative scroll-mt-24 overflow-hidden px-6 pt-[clamp(78px,9.5vw,144px)] pb-[82px] md:pb-[102px]"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -top-[260px] -right-[320px] size-[720px] rounded-full"
        style={{
          background:
            'radial-gradient(circle, color-mix(in oklab, var(--primary) 9%, transparent) 0%, transparent 65%)',
        }}
      />

      <div className="relative mx-auto grid w-full max-w-(--container-page) items-center gap-[56px] lg:grid-cols-[minmax(0,1.16fr)_minmax(0,0.84fr)] lg:gap-[clamp(48px,6vw,93px)]">
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
              href="#contact"
              className={`${BTN_CLASS} border border-primary bg-primary text-primary-foreground hover:-translate-y-0.5 hover:brightness-[1.04] motion-reduce:hover:translate-y-0`}
            >
              <span>{primaryCta}</span>
              <span aria-hidden>↗</span>
            </a>
            <a
              href="https://github.com/ipepio"
              target="_blank"
              rel="noopener noreferrer"
              className={`${BTN_CLASS} border border-input text-foreground hover:border-muted hover:bg-card`}
            >
              <span>{secondaryCta}</span>
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

        <div
          aria-hidden
          className="relative mx-auto w-full max-w-[560px] overflow-hidden rounded-[20px] border border-input bg-[linear-gradient(145deg,var(--card),var(--secondary))] shadow-[var(--shadow)] transition-transform duration-[400ms] motion-reduce:transition-none lg:max-w-none lg:rotate-[1.5deg] lg:hover:rotate-0"
        >
          <style>{DASH_KEYFRAMES}</style>

          <div className="flex h-[47px] items-center justify-between border-b border-border bg-secondary px-[18px]">
            <span className="flex gap-1.5">
              <span className="size-[7px] rounded-full border border-input" />
              <span className="size-[7px] rounded-full border border-input" />
              <span className="size-[7px] rounded-full border border-input" />
            </span>
            <span className="mono text-[10px] font-semibold tracking-[0.04em] text-muted-foreground">
              architecture / system.map
            </span>
            <span className="mono text-[9px] font-semibold text-primary">● DESIGN MODE</span>
          </div>

          <div className="p-[22px]">
            <div className="mb-[23px] flex items-center justify-between gap-3">
              <div className="min-w-0">
                <b className="mono block text-[13px] font-semibold leading-[1.3] text-foreground">
                  Systems, not just code.
                </b>
                <small className="mono text-[9px] font-medium leading-[1.4] text-muted">
                  REFERENCE ARCHITECTURE / 001
                </small>
              </div>
              <span className="mono grid size-7 shrink-0 place-items-center rounded-[7px] border border-input text-xs font-semibold text-primary">
                {`{ }`}
              </span>
            </div>

            <div className="grid-lines relative min-h-[240px] overflow-hidden rounded-[11px] border border-border p-[19px_14px] sm:min-h-[300px]">
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    'radial-gradient(circle at 50% 47%, color-mix(in oklab, var(--primary) 14%, transparent), transparent 55%)',
                }}
              />

              <span className="mono relative text-[9px] font-semibold leading-none tracking-[0.1em] text-muted">
                {'// AI CONTROL PLANE'}
              </span>

              <svg
                aria-hidden
                className="pointer-events-none absolute inset-0 size-full"
                viewBox="0 0 440 300"
                preserveAspectRatio="none"
              >
                <path
                  className="hero-path-active fill-none stroke-primary [stroke-dasharray:5_6] [stroke-width:1.5]"
                  d="M220 91 V125"
                />
                <path
                  className="fill-none stroke-input [stroke-dasharray:4_4] [stroke-width:1.2]"
                  d="M220 169 V208 H101 V229 M220 208 H340 V229"
                />
                <circle className="fill-primary" cx="220" cy="208" r="3" />
              </svg>

              <div className={`${NODE_CLASS} top-[48px] left-1/2 -translate-x-1/2`}>
                API / CLIENT
                <small className={NODE_SMALL_CLASS}>requests in</small>
              </div>
              <div
                className={`${NODE_CLASS} top-[125px] left-1/2 -translate-x-1/2 border-primary bg-primary text-primary-foreground`}
                style={{
                  boxShadow: '0 0 28px color-mix(in oklab, var(--primary) 28%, transparent)',
                }}
              >
                POLICY + ROUTER
                <small className="mono mt-[3px] block text-[8px] font-medium leading-[1.5] text-primary-foreground/70">
                  auth · budgets · limits
                </small>
              </div>
              <div className={`${NODE_CLASS} bottom-[36px] left-[7%] sm:left-[12%]`}>
                MODELS
                <small className={NODE_SMALL_CLASS}>local / cloud</small>
              </div>
              <div className={`${NODE_CLASS} right-[7%] bottom-[36px] sm:right-[12%]`}>
                AGENTS
                <small className={NODE_SMALL_CLASS}>tools / context</small>
              </div>
            </div>

            <div className="mono flex items-center justify-between gap-2.5 pt-4 text-[9px] leading-[1.6] text-muted">
              <span className="flex items-center gap-2">
                <span aria-hidden className="size-1.5 rounded-full bg-primary" />
                {statusNote}
              </span>
              <span>v1.0</span>
            </div>

            <div className="mono mt-[13px] flex gap-2 border-t border-border pt-[13px] text-[9px] font-medium leading-[1.5] text-muted-foreground">
              <em className="text-primary not-italic">$</em>
              <span>
                build --pragmatic --secure --scalable
                <span className="text-primary">_</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
