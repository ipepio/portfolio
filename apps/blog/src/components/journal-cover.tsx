/**
 * Decorative cover art for the archive cards and the featured block.
 *
 * The reference paints one abstract graphic per note. Payload's `cover` is a real upload
 * (empty for the seeded notes), so the index keeps the reference's editorial graphics:
 * each note gets a stable art variant derived from its slug, which makes the same note look
 * the same in both locales. The letters inside the art are part of the drawing, not copy:
 * like code samples they stay identical in Spanish and English.
 */
import { format } from '@/lib/i18n'

const artKinds = ['agents', 'cloud', 'homelab', 'models', 'nabla'] as const

export type ArtKind = (typeof artKinds)[number]

/** Deterministic, locale-independent art per note: the same slug always paints the same. */
export function artKindFor(slug: string): ArtKind {
  let total = 0

  for (const character of slug) {
    total += character.codePointAt(0) ?? 0
  }

  return artKinds[total % artKinds.length]
}

function Art({ kind }: { kind: ArtKind }) {
  switch (kind) {
    case 'cloud':
      return (
        <div className="journal-art cloud">
          <span>LEGACY</span>
          <i />
          <span>API</span>
          <i />
          <span>EVENTS</span>
        </div>
      )
    case 'homelab':
      return (
        <div className="journal-art homelab">
          <span />
          <span />
          <span />
        </div>
      )
    case 'models':
      return <div className="journal-art models">16G</div>
    case 'nabla':
      return <div className="journal-art nabla" />
    case 'agents':
    default:
      return (
        <div className="journal-art agents">
          <span>R</span>
          <span>T</span>
          <span>↗</span>
          <span>?</span>
          <span>AI</span>
          <span>✓</span>
        </div>
      )
  }
}

/** The small graphic at the top of an archive card. */
export function CardVisual({
  kind,
  label,
  serial,
}: {
  kind: ArtKind
  label: string
  serial: string
}) {
  return (
    <div className="journal-card-visual" aria-hidden="true">
      <span className="art-label">{label}</span>
      <Art kind={kind} />
      <span className="art-serial">{serial}</span>
    </div>
  )
}

/**
 * The full-bleed graphic beside the featured note: the reference's console window with its
 * corner and serial labels.
 */
export function FeatureVisual({
  corner,
  serial,
  idTemplate,
}: {
  corner: string
  serial: string
  idTemplate: string
}) {
  return (
    <div className="journal-graphic" aria-hidden="true">
      <span className="graphic-corner">{corner}</span>
      <div className="graphic-signal" />
      <div className="graphic-console">
        <div className="graphic-console-head">
          <i />
          <i />
          <i />
        </div>
        <div className="graphic-console-lines">
          <span className="line muted">// production is not a demo</span>
          <span className="line">
            <span className="good">$</span> agent.run(task)
          </span>
          <span className="line">→ authorize(tool, scope)</span>
          <span className="line">→ execute · trace · verify</span>
          <span className="line good">✓ reviewed and observable</span>
        </div>
      </div>
      <span className="graphic-id">{format(idTemplate, { serial })}</span>
    </div>
  )
}
