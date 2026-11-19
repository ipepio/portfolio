/**
 * Theme persistence for the blog.
 *
 * The preference lives in a cookie instead of `localStorage` so the server layout can
 * render `<html data-theme="…">` with the right value on the very first paint: no inline
 * bootstrap `<script>` and no flash of the wrong theme after a reload or a locale change.
 *
 * The blog is its own application and keeps its own copy of this contract, but the cookie
 * name is the same one the portfolio writes (`ipepio-theme`), so the preference carries
 * across both apps in development instead of flipping when the reader moves between them.
 */

/** Cookie name; also the single source of truth for both the server and client halves. */
export const THEME_COOKIE_NAME = 'ipepio-theme'

/** One year, in seconds: the `max-age` written by `themeCookie`. */
export const THEME_COOKIE_MAX_AGE = 31_536_000

export type Theme = 'light' | 'dark'

/** Dark is the design default: `globals.css` only defines light under `[data-theme="light"]`. */
export const DEFAULT_THEME: Theme = 'dark'

export function isTheme(value: unknown): value is Theme {
  return value === 'light' || value === 'dark'
}

/**
 * Normalizes a raw cookie value (request header on the server, `document.cookie` on the
 * client) into a renderable theme. Anything unrecognised falls back to the default.
 */
export function parseTheme(value: string | undefined | null): Theme {
  return isTheme(value) ? value : DEFAULT_THEME
}

/** `document.cookie` assignment that persists `theme` for the whole site. */
export function themeCookie(theme: Theme): string {
  return `${THEME_COOKIE_NAME}=${theme}; path=/; max-age=${THEME_COOKIE_MAX_AGE}; SameSite=Lax`
}
