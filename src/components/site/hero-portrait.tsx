import Image from 'next/image'

import type { PortraitLabels } from '@/lib/i18n'
import type { Media } from '@/payload-types'

export type HeroPortraitProps = {
  /** `about.photo` at `depth >= 1`, or its raw id when the relation is not populated. */
  photo?: Media | number | null
  /** Payload `about.name`, used by the caption and the fallback initials. */
  name: string
  /** Payload `about.role`; when empty the dictionary role line is used. */
  role?: string | null
  /** Localized copy for the showcase. */
  copy: PortraitLabels
}

/** The card is the whole right column: ~42vw on desktop, full width once stacked. */
const CARD_SIZES = '(min-width: 780px) 42vw, 92vw'

/**
 * The reference `.hero-showcase` frame: padding around the card, a blurred lime
 * `::before` glow pushed off the top-right corner and the `::after` offset frame
 * peeking out behind the card. The pseudo-elements are real (aria-hidden) spans so
 * the whole composition stays inside the component instead of `globals.css`.
 */
const SHOWCASE_CLASS =
  'relative isolate mx-auto w-[min(100%,580px)] min-w-0 px-[10px] pt-0 pb-[20px] pl-[25px] min-[780px]:mx-0 min-[780px]:w-auto min-[780px]:pt-[18px] min-[780px]:pb-[24px] min-[780px]:pl-[30px]'

const GLOW_CLASS =
  'pointer-events-none absolute top-[9%] -right-[12%] -z-[2] aspect-square w-[85%] rounded-full blur-[20px]'

const FRAME_CLASS =
  'pointer-events-none absolute inset-[0_0_33px_48px] -z-[1] translate-x-[13px] translate-y-[12px] rounded-[25px] border border-border'

/**
 * `aspect-[0.795]` is the reference portrait ratio; the gradient is the fallback
 * backdrop (and the tint behind a photo with transparent edges), not a brand colour.
 */
const CARD_CLASS =
  'relative aspect-[0.795] w-full overflow-hidden rounded-[18px] border border-input bg-[linear-gradient(155deg,#d7e4cf_0%,#8f9b8d_47%,#2a372e_100%)] shadow-[0_30px_80px_rgba(0,0,0,0.24)] min-[780px]:min-h-[430px] min-[780px]:rounded-[22px]'

const TOPLINE_CLASS =
  'mono absolute top-[20px] left-[20px] z-[2] flex items-center gap-[9px] rounded-[7px] border border-[rgba(255,255,255,0.15)] bg-[rgba(10,14,12,0.78)] px-[10px] py-2 text-[9px] font-semibold uppercase leading-[1.25] tracking-[0.1em] text-[#edf6e8]'

const CROSSHAIR_CLASS =
  'mono absolute top-[22px] right-[21px] z-[2] text-[16px] font-medium leading-none text-[rgba(255,255,255,0.8)]'

const CAPTION_CLASS =
  'absolute bottom-[17px] left-[18px] z-[2] flex flex-col items-start gap-2 text-left text-[#f0f3ed] right-[15px] min-[780px]:right-[22px] min-[780px]:bottom-[25px] min-[780px]:left-auto min-[780px]:max-w-[234px] min-[780px]:items-end min-[780px]:text-right'

/**
 * The floating terminal card sits over the photo on desktop. Once the hero stacks
 * (≤780px) it drops below the card and goes back into the flow, as in the reference.
 * The tilt is static; the straighten-and-lift on hover only runs for `motion-safe`.
 */
const FLOAT_CLASS =
  'mono z-[5] mt-[15px] ml-[6px] w-[min(310px,84%)] -rotate-[1.5deg] rounded-[13px] border border-[rgba(182,228,147,0.4)] bg-[rgba(13,18,16,0.97)] px-[17px] pt-4 pb-[15px] text-[#f0f3ed] shadow-[0_20px_50px_rgba(0,0,0,0.35)] backdrop-blur-[14px] transition-transform duration-200 ease-out motion-safe:hover:-translate-y-[3px] motion-safe:hover:rotate-0 motion-reduce:transition-none min-[780px]:absolute min-[780px]:bottom-[59px] min-[780px]:left-0 min-[780px]:mt-0 min-[780px]:ml-0 min-[780px]:w-[min(255px,65%)] min-[780px]:-rotate-2 min-[1100px]:w-[min(272px,61%)]'

const DECORATION_CLASS =
  'mono mt-4 mr-[5px] ml-[5px] flex items-center justify-end gap-[11px] text-[9px] font-semibold uppercase leading-[1.4] tracking-[0.11em] text-muted'

/** First letters of the first two words, e.g. "Isaac Pepió" → "IP". */
function initialsOf(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join('')
}

/**
 * Hero right column: the editorial portrait showcase from the reference — photo card
 * with its lime chip, crosshair and caption, the floating `about.sh` terminal and the
 * `DESIGN · CODE · OPERATE` rule. The photo comes from the About global, so the section
 * renders the `IP` initials on the gradient when the media doc is missing or empty.
 */
export function HeroPortrait({ photo, name, role, copy }: HeroPortraitProps) {
  // Payload hands back the raw id when the relation could not be populated.
  const photoDoc = typeof photo === 'object' && photo !== null ? photo : null
  const photoUrl = photoDoc?.url?.trim() || null
  const roleLine = role?.trim() || copy.roleLine
  const flags = copy.floatFlags.filter(Boolean).join(' ')

  return (
    <div className={SHOWCASE_CLASS}>
      <span
        aria-hidden
        className={GLOW_CLASS}
        style={{
          background:
            'radial-gradient(circle, color-mix(in oklab, var(--primary) 16%, transparent), transparent 68%)',
        }}
      />
      <span aria-hidden className={FRAME_CLASS} />

      <figure className={CARD_CLASS} aria-label={`${copy.figureLabel} ${name}`}>
        {photoUrl ? (
          <Image
            src={photoUrl}
            alt={photoDoc?.alt?.trim() || name}
            fill
            sizes={CARD_SIZES}
            loading="eager"
            fetchPriority="high"
            className="object-cover object-center [filter:saturate(0.82)_contrast(1.045)_brightness(0.97)]"
          />
        ) : (
          <span
            aria-hidden
            className="absolute inset-0 grid place-items-center text-[clamp(100px,14vw,200px)] font-extrabold tracking-[-0.15em] text-[rgba(18,32,21,0.22)] select-none"
          >
            {initialsOf(name)}
          </span>
        )}

        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(9,13,11,0.16)_0%,transparent_22%,transparent_55%,rgba(6,11,8,0.93)_100%)]"
        />

        <span className={TOPLINE_CLASS}>
          <i
            aria-hidden
            className="size-[6px] rounded-full bg-primary"
            style={{ boxShadow: '0 0 9px rgba(209, 255, 101, 0.5)' }}
          />
          {copy.topline}
        </span>

        <span aria-hidden className={CROSSHAIR_CLASS}>
          ⌗
        </span>

        <span
          aria-hidden
          className="absolute top-0 right-[18%] z-[3] h-1 w-11 rounded-b-[3px] bg-primary"
        />

        <figcaption className={CAPTION_CLASS}>
          <span className="mono text-[10px] font-semibold leading-[1.3] tracking-[0.18em] text-primary">
            01 — {copy.index}
          </span>
          <strong className="text-[27px] font-bold leading-none tracking-[-0.065em] min-[780px]:text-[clamp(27px,2.65vw,36px)]">
            {name}
            <span className="text-primary">.</span>
          </strong>
          <small className="mono text-[8px] font-medium uppercase leading-[1.5] tracking-[0.08em] text-[#b4c5b4]">
            {roleLine}
          </small>
        </figcaption>
      </figure>

      <div aria-hidden className={FLOAT_CLASS}>
        <div className="mono flex items-center justify-between gap-[10px] border-b border-[rgba(255,255,255,0.13)] pb-[10px] text-[9px] font-semibold leading-[1.4] tracking-[0.08em] text-[#e9ffe0]">
          <span>{copy.floatPath}</span>
          <span className="inline-flex items-center gap-[6px] text-[#bade91]">
            <span className="size-[6px] rounded-full bg-primary" />
            {copy.floatStatus}
          </span>
        </div>

        <p className="mono mt-3 mb-[11px] text-[11px] font-semibold leading-[1.4] tracking-[-0.04em] min-[520px]:text-[13px]">
          <span className="text-[#a2b2a6]">{copy.floatPrompt}</span> {copy.floatCommand}
          <br />
          <b className="font-bold text-primary">
            {'\u00A0\u00A0'}
            {flags}
          </b>
          <span className="text-primary">_</span>
        </p>

        <div className="mono flex items-center justify-between gap-2 text-[9px] font-medium leading-[1.4] text-[#9cad9e]">
          <span>{copy.floatNote}</span>
          <code className="text-[#cce6c4]">{copy.floatExit}</code>
        </div>
      </div>

      <div aria-hidden className={DECORATION_CLASS}>
        <span>{copy.decoration}</span>
        <span className="block h-px w-7 bg-primary" />
        <span>{copy.decorationIndex}</span>
      </div>
    </div>
  )
}
