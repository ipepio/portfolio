import { NextResponse } from 'next/server'

import { getPayloadUrl } from '@/lib/payload'

/**
 * The merge the article's live preview asks for (T13: S13).
 *
 * `useLivePreview` normally sends this request straight to Payload: a `POST` to
 * `/api/posts/:id` that carries the editor's whole document in the body and the header
 * `X-Payload-HTTP-Method-Override: GET`, which Payload answers with the document as if it had
 * been read — nothing is saved. The browser cannot make that request itself: the API is on the
 * blog's sibling origin (`PAYLOAD_URL`) and does not answer the blog's origin with CORS, so
 * the article routes it through this handler instead. The request is a read on both hops; the
 * only difference is that this one is server-to-server.
 *
 * The path is restricted to a note of the `posts` collection: the blog previews notes, and a
 * narrow endpoint cannot be turned into a general proxy for the portfolio's API.
 */

/** A note's endpoint, exactly as `@payloadcms/live-preview` builds it: `posts/<id>`. */
const NOTE_PATH = /^posts\/[A-Za-z0-9_-]+$/

export async function POST(
  request: Request,
  { params }: { params: Promise<{ endpoint: string[] }> },
): Promise<Response> {
  const { endpoint } = await params
  const path = endpoint.join('/')

  if (!NOTE_PATH.test(path)) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 })
  }

  const body = await request.text()
  const response = await fetch(`${getPayloadUrl()}/api/${path}`, {
    body,
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      // The editor's document is the answer, read through Payload's own pipeline: the same
      // request Payload's admin makes from the panel, with nothing written on the way.
      'X-Payload-HTTP-Method-Override': 'GET',
    },
    method: 'POST',
  })

  return new NextResponse(await response.text(), {
    headers: {
      'Content-Type': response.headers.get('content-type') ?? 'application/json',
    },
    status: response.status,
  })
}
