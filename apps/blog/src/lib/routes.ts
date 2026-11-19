/**
 * Blog URLs, built in one place so the routes and the links cannot drift apart.
 */
import type { Locale } from './payload'

/**
 * The archive is canonical at `/[locale]`: page 1 has no own URL (it is a 404), and every
 * later page lives at `/[locale]/page/[n]`.
 */
export function archiveHref(locale: Locale, page: number): string {
  return page <= 1 ? `/${locale}` : `/${locale}/page/${page}`
}

/** The article lives at `/[locale]/[slug]`; its page arrives with T4, the links already do. */
export function postHref(locale: Locale, slug: string): string {
  return `/${locale}/${slug}`
}
