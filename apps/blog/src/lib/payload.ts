/**
 * Payload API client for the blog application.
 *
 * The blog is a separate Next application: it never imports the Payload config or the
 * database, it only reads the REST API the portfolio app already serves over HTTP.
 */

/** Locales the blog renders, mirroring Payload's two localization codes. */
export const locales = ['es', 'en'] as const

export type Locale = (typeof locales)[number]

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (locales as readonly string[]).includes(value)
}

/**
 * How many notes the `En el radar` archive shows per page.
 *
 * Four is the reference's split: the six seeded notes read 4 on page 1 and 1 on page 2
 * once the featured note moves to its own block, which proves pagination with real data.
 * The counter always reports every published note, never this page size.
 */
export const POSTS_PAGE_SIZE = 4

/**
 * Base URL of the Payload API. `PAYLOAD_URL` points it at the deployed portfolio; the
 * default is the local dev server so the blog runs with no configuration at all.
 */
export function getPayloadUrl(): string {
  const configured = process.env.PAYLOAD_URL?.trim()

  return (configured && configured.length > 0 ? configured : 'http://localhost:3000').replace(
    /\/+$/,
    '',
  )
}

/**
 * The fields of a `posts` document the index renders. The article page reads `body` and
 * the cover as well; both are left out here so the archive request stays small.
 */
export type PostSummary = {
  id: number | string
  slug: string
  title: string
  subtitle?: string | null
  excerpt?: string | null
  category?: string | null
  readMinutes?: number | null
  publishedAt: string
  featured?: boolean | null
}

/** One page of notes, with the totals the pagination controls and the counter need. */
export type PostsPage = {
  docs: PostSummary[]
  totalDocs: number
  totalPages: number
  page: number
}

/** Revalidation window shared by every read: the blog must not hammer the API. */
const REVALIDATE_SECONDS = 60

async function requestPosts(query: URLSearchParams): Promise<PostsPage> {
  const response = await fetch(`${getPayloadUrl()}/api/posts?${query.toString()}`, {
    next: { revalidate: REVALIDATE_SECONDS },
  })

  if (!response.ok) {
    throw new Error(
      `Payload responded ${response.status} for /api/posts (locale: ${query.get('locale')}) at ${getPayloadUrl()}`,
    )
  }

  const data = (await response.json()) as PostsPage

  return data
}

/** Published posts in the requested locale, newest first, without pagination. */
export async function getPosts(locale: Locale): Promise<PostSummary[]> {
  const data = await requestPosts(
    new URLSearchParams({
      'where[status][equals]': 'published',
      sort: '-publishedAt',
      depth: '0',
      locale,
    }),
  )

  return data.docs
}

/**
 * The archive: published notes except the featured one, which the index renders in its own
 * block above the grid, newest first and sliced by Payload into pages of `pageSize`.
 *
 * Only published entries leave the API: drafts stay invisible to the blog, exactly as they
 * are in the portfolio. A page beyond the end comes back empty with the real `totalPages`,
 * so the caller can tell "past the end" (404) from "nothing published yet".
 */
export async function getPostsPage({
  locale,
  page,
  pageSize = POSTS_PAGE_SIZE,
}: {
  locale: Locale
  page: number
  pageSize?: number
}): Promise<PostsPage> {
  return requestPosts(
    new URLSearchParams({
      'where[status][equals]': 'published',
      'where[featured][not_equals]': 'true',
      sort: '-publishedAt',
      depth: '0',
      locale,
      limit: String(pageSize),
      page: String(page),
    }),
  )
}

/**
 * The note with `featured: true`. When nothing is flagged, the newest published note stands
 * in for it, so the index always has a subject for its featured block.
 */
export async function getFeaturedPost(locale: Locale): Promise<PostSummary | null> {
  const flagged = await requestPosts(
    new URLSearchParams({
      'where[status][equals]': 'published',
      'where[featured][equals]': 'true',
      sort: '-publishedAt',
      depth: '0',
      locale,
      limit: '1',
    }),
  )

  if (flagged.docs.length > 0) {
    return flagged.docs[0]
  }

  const newest = await requestPosts(
    new URLSearchParams({
      'where[status][equals]': 'published',
      sort: '-publishedAt',
      depth: '0',
      locale,
      limit: '1',
    }),
  )

  return newest.docs[0] ?? null
}

/**
 * How many notes are published in this locale. The archive counter reports this number and
 * not the page size, so it stays stable across pages; one document is enough to learn it
 * from Payload's `totalDocs`, which is why the request asks for the cheapest possible page.
 */
export async function getPublishedNotesTotal(locale: Locale): Promise<number> {
  const data = await requestPosts(
    new URLSearchParams({
      'where[status][equals]': 'published',
      depth: '0',
      locale,
      limit: '1',
    }),
  )

  return data.totalDocs
}
