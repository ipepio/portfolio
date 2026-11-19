/**
 * The portfolio's brand mark, copied verbatim from its navigation so both apps carry the
 * same logo. It paints with `currentColor`, which is how the header decides its tone.
 *
 * The two apps are separate builds and share no code, so this small shape is duplicated on
 * purpose: a shared package for one SVG would cost more than it saves.
 */
export function BrandLogo() {
  return (
    <svg
      viewBox="58 52 215 228"
      fill="none"
      aria-hidden="true"
      shapeRendering="geometricPrecision"
      className="journal-brand-logo"
    >
      <path
        fill="currentColor"
        d="M170 60L128 86L128 126L170 100L228.1538 136L228.1538 192L176.4615 224L176.4615 248L157.0769 236L157.0769 192L195.8461 168L195.8461 136L182.923 128L131.2307 160L131.2307 248L170 272L260.4614 216L260.4614 116L170 60Z"
      />
      <path fill="currentColor" d="M108 100L72.4615 122L72.4615 218L108 240Z" />
    </svg>
  )
}