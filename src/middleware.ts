import { NextResponse, type NextRequest } from 'next/server'

import { defaultLocale, locales } from '@/lib/i18n'

/** Paths served by Payload or Next itself rather than by a localized page. */
const RESERVED_PREFIXES = ['/admin', '/api', '/media', '/favicon.ico']

/** Anything with a file extension is an asset, not a page. */
const FILE_EXTENSION = /\.[^/]+$/

function hasPrefix(pathname: string, prefix: string) {
  return pathname === prefix || pathname.startsWith(`${prefix}/`)
}

/**
 * Rule: every public page lives under a locale prefix, so a path without one is
 * redirected to the default locale instead of being served unprefixed.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (
    locales.some((locale) => hasPrefix(pathname, `/${locale}`)) ||
    RESERVED_PREFIXES.some((prefix) => hasPrefix(pathname, prefix)) ||
    FILE_EXTENSION.test(pathname)
  ) {
    return NextResponse.next()
  }

  const url = request.nextUrl.clone()
  url.pathname = pathname === '/' ? `/${defaultLocale}` : `/${defaultLocale}${pathname}`

  return NextResponse.redirect(url)
}

export const config = {
  matcher: ['/((?!_next).*)'],
}
