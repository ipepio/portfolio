import { NextResponse, type NextRequest } from 'next/server'

/**
 * Forwards the requested pathname to the render, which is the only way a `not-found`
 * boundary can learn the locale: it receives no props and the App Router exposes no
 * request URL to server components.
 *
 * `PATHNAME_HEADER` is spelled out here instead of imported from `@/lib/routes` on purpose:
 * the proxy runs on its own layer, before (and outside) the app's rendering.
 */
const PATHNAME_HEADER = 'x-ipepio-pathname'

/** Locale a reader lands on when the URL does not name one. */
const DEFAULT_LOCALE = 'es'

const LOCALES = new Set(['es', 'en'])

/** Paths owned by the app itself, which never carry a locale. */
const UNLOCALIZED = new Set(['api', 'icon.svg'])

/**
 * A two-letter first segment that is not a supported locale (`/fr`) is a locale the blog
 * does not speak, not a missing one: it must reach the 404 rather than being redirected
 * into the default locale with a nonsense slug.
 */
function looksLikeUnsupportedLocale(segment: string | undefined): boolean {
  return segment !== undefined && /^[a-z]{2}$/.test(segment) && !LOCALES.has(segment)
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const [, first] = pathname.split('/')

  // No locale in the URL at all: pick the default one and keep the rest of the path.
  if (first !== undefined && first !== '' && !UNLOCALIZED.has(first) && !looksLikeUnsupportedLocale(first) && !LOCALES.has(first)) {
    const url = request.nextUrl.clone()
    url.pathname = `/${DEFAULT_LOCALE}${pathname}`
    return NextResponse.redirect(url)
  }

  // The root has no path to keep, so it becomes the default locale's index.
  if (pathname === '/' || pathname === '') {
    const url = request.nextUrl.clone()
    url.pathname = `/${DEFAULT_LOCALE}`
    return NextResponse.redirect(url)
  }

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set(PATHNAME_HEADER, pathname)

  return NextResponse.next({ request: { headers: requestHeaders } })
}

export const config = {
  // Everything the router may render; static assets cannot answer 404 with a locale.
  matcher: '/((?!_next/static|_next/image|favicon.ico).*)',
}