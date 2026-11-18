/**
 * Transition between section 04 (experience) and section 05 (contact), copied from the
 * `.section-separator` of `/Users/ipepio/Desktop/portfolio_ipepio_experiencia_separada.html`
 * (markup at line 725, CSS at lines 305-308): two gradient rules fading away from a small
 * rotated square in the accent colour, with a halo ring of the page background.
 *
 * Reference measurements are kept; only the variables are mapped onto the app tokens:
 * `--max`→`--container-page`, `--border-strong`→`--input`, `--accent`→`--primary`,
 * `--accent-soft`→`--primary` at 10%, `--bg`→`--background-elevated` (the separator
 * straddles the top edge of section 05, which is the elevated surface).
 *
 * It is decorative, so it is hidden from assistive technology.
 */
const SEPARATOR_CLASS =
  'mx-auto flex h-11 w-[min(calc(100%-92px),var(--container-page))] items-center justify-center gap-[21px] max-[780px]:w-[min(calc(100%-40px),var(--container-page))]'

/** The rules either side: `to right` before the mark, mirrored after it. */
const RULE_CLASS =
  "before:h-px before:flex-1 before:bg-[linear-gradient(to_right,transparent,var(--input))] before:content-[''] after:h-px after:flex-1 after:bg-[linear-gradient(to_left,transparent,var(--input))] after:content-['']"

const MARK_CLASS =
  'size-3 flex-none rotate-45 border border-primary bg-[color-mix(in_srgb,var(--primary)_10%,transparent)] [box-shadow:0_0_0_5px_var(--background-elevated)]'

export function SectionSeparator({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`${SEPARATOR_CLASS} ${RULE_CLASS} ${className ?? ''}`}>
      <span className={MARK_CLASS} />
    </div>
  )
}
