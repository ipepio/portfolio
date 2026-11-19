import type { Metadata } from 'next'

import { NotFoundScreen, notFoundTitle } from '@/components/not-found-screen'

export async function generateMetadata(): Promise<Metadata> {
  return { title: await notFoundTitle() }
}

/**
 * The 404 for the `notFound()` calls inside the pages: an unknown slug, a draft, `/page/1`,
 * `/page/0`, a page past the last one and a locale the blog does not serve.
 *
 * The body is shared with `global-not-found.tsx`, which answers URLs that match no route at
 * all; both render the same designed page, so a reader cannot tell which one they got.
 */
export default function NotFound() {
  return <NotFoundScreen />
}
