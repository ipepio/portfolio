/**
 * Philosophy band closing section 02 (skills): the lime manifesto strip from
 * `portfolio_ipepio_expertise.html` (`.manifesto`), reproduced verbatim.
 *
 * Both visible strings are English in the reference in both locales, so they stay
 * untranslated; only the accessible name of the region comes from the dictionary.
 * Layout copies the reference CSS: accent surface, 39px vertical rhythm, the quote at
 * `clamp(22px, 3.2vw, 41px)` on the left and the mono process line on the right, stacked
 * from 520px down.
 */
import type { ManifestoCopy } from '@/lib/i18n'

export type ManifestoBandProps = {
  /** Localized chrome of the band (dictionary `manifesto` slice). */
  copy: ManifestoCopy
}

export function ManifestoBand({ copy }: ManifestoBandProps) {
  return (
    <section
      aria-label={copy.label}
      className="overflow-hidden bg-primary py-[39px] text-primary-foreground"
    >
      <div className="mx-auto flex w-full max-w-(--container-page) flex-col items-start justify-between gap-5 px-6 min-[520px]:flex-row min-[520px]:items-center">
        <p className="m-0 text-[clamp(22px,3.2vw,41px)] font-bold leading-[1.15] tracking-[-0.065em]">
          Build it. Ship it. Own it.
        </p>
        <span className="font-mono text-[11px] leading-[1.6] font-[750] whitespace-nowrap">
          IDEA → CODE → PRODUCTION ↗
        </span>
      </div>
    </section>
  )
}
