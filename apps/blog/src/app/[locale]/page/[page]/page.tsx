import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { JournalArchive, JournalBreadcrumb, JournalFooter } from '@/components/journal-blocks'
import { format, getDictionary } from '@/lib/i18n'
import {
  getPostsPage,
  getPublishedNotesTotal,
  isLocale,
  POSTS_PAGE_SIZE,
} from '@/lib/payload'
import { getPortfolioUrl } from '@/lib/site'

/** A page segment is only valid as a plain, positive, decimal number. */
function parsePageNumber(value: string): number | null {
  if (!/^[0-9]+$/.test(value)) {
    return null
  }

  const parsed = Number(value)

  return Number.isSafeInteger(parsed) ? parsed : null
}

export async function generateMetadata(props: {
  params: Promise<{ locale: string; page: string }>
}): Promise<Metadata> {
  const { locale, page } = await props.params
  const pageNumber = parsePageNumber(page)

  if (!isLocale(locale) || pageNumber === null) {
    return { title: 'IPEPIO — Journal' }
  }

  return { title: format(getDictionary(locale).archivePageTitle, { page: pageNumber }) }
}

type BlogArchiveProps = {
  params: Promise<{ locale: string; page: string }>
}

/**
 * The archive from page 2 onwards: the same `En el radar` view as the index without the
 * hero and the featured note, because both belong to the front page.
 *
 * `/[locale]` stays the only URL for page 1, so `/page/1` is a 404 instead of a duplicate.
 * Past the last page is also a 404: the archive has no empty tail, and older notes stay
 * reachable through their own page.
 */
export default async function BlogArchivePage({ params }: BlogArchiveProps) {
  const { locale, page } = await params

  if (!isLocale(locale)) {
    notFound()
  }

  const pageNumber = parsePageNumber(page)

  // Page 1 is canonical at `/[locale]`, and page 0 or a non-number is no page at all.
  if (pageNumber === null || pageNumber < 2) {
    notFound()
  }

  const copy = getDictionary(locale)
  const [archive, publishedCount] = await Promise.all([
    getPostsPage({ locale, page: pageNumber, pageSize: POSTS_PAGE_SIZE }),
    getPublishedNotesTotal(locale),
  ])

  if (pageNumber > archive.totalPages) {
    notFound()
  }

  const portfolioUrl = getPortfolioUrl()

  return (
    <main id="blogIndex" className="journal">
      <div className="wrap">
        <JournalBreadcrumb locale={locale} copy={copy} />
      </div>
      <JournalArchive
        locale={locale}
        copy={copy}
        docs={archive.docs}
        page={archive.page}
        totalPages={archive.totalPages}
        publishedCount={publishedCount}
        titleAs="h1"
      />
      <div className="wrap">
        <JournalFooter copy={copy} portfolioUrl={portfolioUrl} />
      </div>
    </main>
  )
}
