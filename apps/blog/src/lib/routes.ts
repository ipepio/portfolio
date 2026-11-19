/**
 * Blog URLs, built in one place so the routes and the links cannot drift apart.
 */
import { isLocale, type Locale } from './payload'

/**
 * Request header the proxy writes with the requested pathname.
 *
 * Server components cannot read the URL (only `params`, and a `not-found` boundary gets no
 * props at all), so the proxy forwards the pathname and the 404 can answer in the reader's
 * language. It is also what keeps `<html lang>` in step with the locale segment.
 */
export const PATHNAME_HEADER = 'x-ipepio-pathname'

/**
 * The archive is canonical at `/[locale]`: page 1 has no own URL (it is a 404), and every
 * later page lives at `/[locale]/page/[n]`.
 */
export function archiveHref(locale: Locale, page: number): string {
  return page <= 1 ? `/${locale}` : `/${locale}/page/${page}`
}

/**
 * The article lives at `/[locale]/[slug]`. Next resolves the static `page` segment before a
 * slug, so `/[locale]/page/[n]` stays the archive's later pages.
 */
export function postHref(locale: Locale, slug: string): string {
  return `/${locale}/${slug}`
}

/** The path segments of a pathname, without the query string, empty segments or trailing slash. */
function segmentsOf(pathname: string | null | undefined): string[] {
  return (pathname ?? '').split('?')[0].split('/').filter(Boolean)
}

/**
 * The locale a pathname announces. Spanish is the default, so a URL that carries no locale
 * segment — or one the blog does not serve — reads as Spanish.
 */
export function localeFromPathname(pathname: string | null | undefined): Locale {
  const [first] = segmentsOf(pathname)

  return isLocale(first) ? first : 'es'
}

/**
 * The same page in the other locale: only the leading locale segment changes, so the index,
 * `/[locale]/page/[n]` and an article link all keep their rest. A path that carries no locale
 * at all is a missing route, and the switch lands on the other locale's index instead of
 * inventing one.
 */
export function otherLocaleHref(pathname: string | null | undefined, target: Locale): string {
  const segments = segmentsOf(pathname)

  return isLocale(segments[0]) ? `/${[target, ...segments.slice(1)].join('/')}` : `/${target}`
}
