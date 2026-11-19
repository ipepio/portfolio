import { draftMode } from 'next/headers'
import { NextResponse } from 'next/server'

import { isLocale } from '@/lib/payload'
import { postHref } from '@/lib/routes'

/**
 * The draft preview entry point (T12: S12).
 *
 * Payload's admin sends the editor here, with the token it built from `PREVIEW_SECRET`:
 *
 *     /api/draft?secret=<PREVIEW_SECRET>&slug=<slug>&locale=<locale>
 *
 * A matching token turns Next's draft mode on — which is what lets the article page read a
 * note that is still a `draft` — and the editor lands on the note. `?exit=1` takes them back
 * out. The secret lives only in the two deployments' environments: with no `PREVIEW_SECRET`
 * configured the blog has no preview at all and answers 404, so there is no default key.
 */

/** The one answer every rejected token gets: no body, nothing that says what went wrong. */
const rejected = () => new NextResponse(null, { status: 404 })

/** The configured token, or `null` when preview is not configured on this deployment. */
function previewSecret(): string | null {
  const secret = process.env.PREVIEW_SECRET?.trim()

  return secret !== undefined && secret.length > 0 ? secret : null
}

/** The locale the token route lands on; an absent or unknown one reads as Spanish. */
function localeOf(value: string | null): 'es' | 'en' {
  return isLocale(value) ? value : 'es'
}

/** A slug is a path segment: leading and trailing slashes would build a different URL. */
function slugOf(value: string | null): string | null {
  const slug = (value ?? '').trim().replace(/^\/+|\/+$/g, '')

  return slug.length > 0 ? slug : null
}

export async function GET(request: Request): Promise<Response> {
  const secret = previewSecret()

  // No secret configured and no matching secret share one answer: nothing tells the caller
  // which half of the token was wrong, not even the body.
  if (secret === null) return rejected()

  const { searchParams } = new URL(request.url)

  if (searchParams.get('secret') !== secret) return rejected()

  const locale = localeOf(searchParams.get('locale'))
  const draft = await draftMode()

  // The way out: drop the cookie and send the editor back to the public index.
  if (searchParams.get('exit') === '1') {
    draft.disable()

    return NextResponse.redirect(new URL(`/${locale}`, request.url), 307)
  }

  const slug = slugOf(searchParams.get('slug'))

  // The token was right but it leads nowhere: same answer as a wrong token, and no cookie
  // is written for a note that cannot be opened.
  if (slug === null) return rejected()

  draft.enable()

  // The destination is built from the validated parts, never taken from the query string
  // as a URL, so the route cannot be turned into an open redirect.
  return NextResponse.redirect(new URL(postHref(locale, slug), request.url), 307)
}
