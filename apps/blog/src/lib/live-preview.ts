/**
 * The article's live preview (T13: S13): the two readings of the editor's document the page
 * needs on the client.
 *
 * Payload's admin keeps the iframe up to date by post-messaging the editor's whole form state
 * into it — `useLivePreview`, from `@payloadcms/live-preview-react`, is the receiving half:
 *
 *   - it listens for `{ type: 'payload-live-preview', collectionSlug, data, locale }` events
 *     whose `origin` is the Payload server, and
 *   - it answers by asking for that draft to be *merged* — a `POST` to
 *     `{serverURL}/api/posts/{id}` with `X-Payload-HTTP-Method-Override: GET`, so Payload runs
 *     its own read pipeline over the editor's values and answers a document shaped exactly
 *     like a stored read (populated uploads included). Nothing is written.
 *
 * The merge request is routed through this application (`app/api/live-preview/[...endpoint]`)
 * instead of straight to Payload: the API lives on another origin, whose CORS configuration is
 * the portfolio's business, not the blog's. `coverOf` below is the other reading — the one
 * piece of the live document the page has to interpret instead of render.
 */
import type { PostCover } from '@/lib/payload'

/** Where the blog merges a live document. Mirrored by the route handler it names. */
export const LIVE_PREVIEW_ROUTE = '/api/live-preview'

/** The cover the article paints: an absolute URL, and the alternative text it came with. */
export type ArticleCover = {
  alt: string
  url: string
}

/** Narrow the `cover` field of a document to the upload it is populated into. */
function uploadOf(cover: unknown): PostCover | null {
  return typeof cover === 'object' && cover !== null ? (cover as PostCover) : null
}

/**
 * The cover to paint for a note, or `null` when it has none.
 *
 * The upload's `url` is Payload's own path (`/api/media/file/isaac-1.png`), so a relative one
 * is resolved against the Payload server the page was configured with; a deployment that
 * serves absolute media URLs passes them through untouched. An unpopulated `cover` — the id
 * of an upload rather than the upload — has no URL to paint, so the note keeps its artwork.
 */
export function coverOf(cover: unknown, payloadUrl: string): ArticleCover | null {
  const upload = uploadOf(cover)

  if (upload === null || typeof upload.url !== 'string' || upload.url.length === 0) {
    return null
  }

  const url = /^[a-z]+:\/\//i.test(upload.url)
    ? upload.url
    : `${payloadUrl.replace(/\/+$/, '')}${upload.url.startsWith('/') ? '' : '/'}${upload.url}`

  return { alt: typeof upload.alt === 'string' ? upload.alt : '', url }
}
