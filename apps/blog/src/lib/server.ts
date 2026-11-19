/**
 * Request-scoped readers shared by the server layouts and the 404 page.
 *
 * They live beside the client-safe modules they wrap (`theme.ts`, `routes.ts`) because
 * `next/headers` is server-only: importing it from a `'use client'` module would break the
 * client bundle.
 */
import { cookies, headers } from 'next/headers'

import type { Locale } from './payload'
import { localeFromPathname, PATHNAME_HEADER } from './routes'
import { parseTheme, THEME_COOKIE_NAME, type Theme } from './theme'

/**
 * The theme the reader picked last time, read on the server so `<html data-theme>` is
 * already correct on the first paint. Anything unrecognised falls back to dark.
 */
export async function readTheme(): Promise<Theme> {
  return parseTheme((await cookies()).get(THEME_COOKIE_NAME)?.value)
}

/**
 * The locale the requested URL announces (see `PATHNAME_HEADER`). Spanish when the request
 * carries no pathname, which is what a 404 for an unmatched route falls back to.
 */
export async function readLocale(): Promise<Locale> {
  return localeFromPathname((await headers()).get(PATHNAME_HEADER))
}
