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
 * The slice of a `posts` document the blog index needs. The archive, the featured block and
 * the article page read more fields; this skeleton only renders the title as a link.
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

type PostsResponse = {
  docs: PostSummary[]
  totalDocs: number
}

/** Revalidation window shared by every read: the blog must not hammer the API. */
const REVALIDATE_SECONDS = 60

/**
 * Published posts in the requested locale, newest first. Only published entries leave the
 * API: drafts stay invisible to the blog, exactly as they are in the portfolio.
 */
export async function getPosts(locale: Locale): Promise<PostSummary[]> {
  const query = new URLSearchParams({
    'where[status][equals]': 'published',
    sort: '-publishedAt',
    depth: '0',
    locale,
  })

  const response = await fetch(`${getPayloadUrl()}/api/posts?${query.toString()}`, {
    next: { revalidate: REVALIDATE_SECONDS },
  })

  if (!response.ok) {
    throw new Error(
      `Payload responded ${response.status} for /api/posts (locale: ${locale}) at ${getPayloadUrl()}`,
    )
  }

  const data = (await response.json()) as PostsResponse

  return data.docs
}
