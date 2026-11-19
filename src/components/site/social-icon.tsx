export type SocialIconName = 'github' | 'linkedin'

/** The `d` of each brand glyph, verbatim from the reference `.social-link` icons. */
export const SOCIAL_ICON_PATHS: Record<SocialIconName, string> = {
  github:
    'M12 .95a11.05 11.05 0 0 0-3.49 21.53c.55.1.75-.24.75-.54v-2.1c-3.06.67-3.7-1.3-3.7-1.3-.5-1.29-1.23-1.63-1.23-1.63-1-.69.08-.67.08-.67 1.11.08 1.7 1.14 1.7 1.14.98 1.68 2.58 1.19 3.21.91.1-.71.38-1.19.7-1.46-2.44-.28-5.01-1.22-5.01-5.47 0-1.21.43-2.2 1.14-2.97-.11-.28-.49-1.4.11-2.92 0 0 .93-.3 3.04 1.13A10.56 10.56 0 0 1 12 6.3c.94 0 1.88.13 2.76.37 2.11-1.43 3.04-1.13 3.04-1.13.6 1.52.22 2.64.11 2.92.71.77 1.14 1.76 1.14 2.97 0 4.26-2.57 5.19-5.02 5.46.4.34.75 1.01.75 2.03v3.02c0 .3.2.65.75.54A11.05 11.05 0 0 0 12 .95Z',
  linkedin:
    'M20.45 2H3.55C2.7 2 2 2.67 2 3.5v17C2 21.33 2.7 22 3.55 22h16.9c.85 0 1.55-.67 1.55-1.5v-17c0-.83-.7-1.5-1.55-1.5ZM7.94 18.75H4.97V9.2h2.97v9.55ZM6.45 7.9a1.72 1.72 0 1 1 0-3.44 1.72 1.72 0 0 1 0 3.44Zm12.3 10.85h-2.97V14.1c0-1.11-.02-2.53-1.54-2.53-1.55 0-1.79 1.21-1.79 2.45v4.73H9.48V9.2h2.85v1.3h.04c.4-.75 1.37-1.54 2.82-1.54 3.02 0 3.56 1.98 3.56 4.54v5.25Z',
}

/**
 * The brand glyph of a social, picked by the host of its url: `github.com` → GitHub,
 * `linkedin.com` → LinkedIn. Any other host has no glyph of its own and gets a neutral
 * link icon, so a new social never renders an empty or broken slot.
 */
export function socialIconFor(url: string): SocialIconName | null {
  let host: string

  try {
    host = new URL(url.trim()).hostname.toLowerCase().replace(/^www\./, '')
  } catch {
    return null
  }

  if (host === 'github.com') return 'github'
  if (host === 'linkedin.com') return 'linkedin'

  return null
}

/**
 * The mono handle under the label, derived from the url the way the reference writes it:
 * no protocol, no `www.`, no trailing slash (`https://www.linkedin.com/in/ipepio/` →
 * `linkedin.com/in/ipepio`).
 */
export function socialHandle(url: string): string {
  return url
    .trim()
    .replace(/^https?:\/\//i, '')
    .replace(/^www\./i, '')
    .replace(/\/+$/, '')
}

/** Brand glyph when known, neutral link glyph otherwise. Decorative in both cases. */
export function SocialIcon({ name, size = 18 }: { name: SocialIconName | null; size?: number }) {
  if (!name) {
    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        style={{ width: size, height: size }}
        className="flex-none fill-none stroke-current text-primary [stroke-linecap:round] [stroke-linejoin:round] [stroke-width:1.8]"
      >
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </svg>
    )
  }

  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      style={{ width: size, height: size }}
      className="flex-none text-primary"
    >
      <path d={SOCIAL_ICON_PATHS[name]} />
    </svg>
  )
}