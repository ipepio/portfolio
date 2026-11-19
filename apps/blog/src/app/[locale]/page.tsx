import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import {
  FeaturedNote,
  JournalArchive,
  JournalBreadcrumb,
  JournalFooter,
  JournalHero,
} from '@/components/journal-blocks'
import { getDictionary } from '@/lib/i18n'
import {
  getFeaturedPost,
  getPostsPage,
  getPublishedNotesTotal,
  isLocale,
  locales,
  POSTS_PAGE_SIZE,
} from '@/lib/payload'
import { getPortfolioUrl } from '@/lib/site'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await props.params

  return { title: isLocale(locale) ? getDictionary(locale).documentTitle : 'Isaac Pepió - Blog' }
}

type BlogIndexProps = {
  params: Promise<{ locale: string }>
}

/**
 * The blog index: its own hero, the featured note and the first page of the `En el radar`
 * archive. Page 1 is canonical here — `/[locale]/page/1` is a 404 — and every older note is
 * reachable through `/[locale]/page/[n]`, so nothing gets dropped.
 *
 * Unknown locales are missing routes, not Spanish pages.
 */
export default async function BlogIndexPage({ params }: BlogIndexProps) {
  const { locale } = await params

  if (!isLocale(locale)) {
    notFound()
  }

  const copy = getDictionary(locale)
  const [featured, archive, publishedCount] = await Promise.all([
    getFeaturedPost(locale),
    getPostsPage({ locale, page: 1, pageSize: POSTS_PAGE_SIZE }),
    getPublishedNotesTotal(locale),
  ])
  const portfolioUrl = getPortfolioUrl()

  return (
    <main id="blogIndex" className="journal">
      <div className="wrap">
        <JournalBreadcrumb locale={locale} copy={copy} />
        <JournalHero copy={copy} />
        {featured === null ? null : (
          <FeaturedNote
            locale={locale}
            copy={copy}
            post={featured}
            position={1}
            total={publishedCount}
          />
        )}
      </div>
      <JournalArchive
        locale={locale}
        copy={copy}
        docs={archive.docs}
        page={archive.page}
        totalPages={archive.totalPages}
        publishedCount={publishedCount}
      />
      <div className="wrap">
        <JournalFooter copy={copy} portfolioUrl={portfolioUrl} />
      </div>
    </main>
  )
}
