import type { JournalCopy } from '@/lib/i18n'
import type { Locale } from '@/lib/payload'

/**
 * The preview strip (T12: S12): the one visible sign that the reader is looking at draft
 * content — which may still change, and may not be published at all — plus the way out.
 *
 * It renders only inside Next's draft mode (the locale layout reads `draftMode().isEnabled`
 * and omits it otherwise), so it can never be mistaken for part of the published page.
 *
 * The exit is a plain anchor and not a `<Link>`: a prefetch would reach the route before the
 * editor clicks and drop the draft cookie on its own.
 */
export function DraftStrip({ locale, copy }: { locale: Locale; copy: JournalCopy }) {
  return (
    <aside className="draft-strip" data-draft-strip role="status">
      <div className="wrap draft-strip-inner">
        <span className="draft-strip-label mono">{copy.previewStrip}</span>
        <a
          className="draft-strip-exit mono"
          data-draft-exit
          href={`/api/draft?exit=1&locale=${locale}`}
        >
          {copy.previewExit}
        </a>
      </div>
    </aside>
  )
}
