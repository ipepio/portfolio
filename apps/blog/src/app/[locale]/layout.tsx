import type React from 'react'

import { notFound } from 'next/navigation'

import { SiteHeader } from '@/components/site-header'
import { getDictionary } from '@/lib/i18n'
import { isLocale } from '@/lib/payload'
import { readTheme } from '@/lib/server'
import { getPortfolioUrl } from '@/lib/site'

/**
 * The shell every blog route shares: skip link, then the header, then the page.
 *
 * The header lives here rather than in each page so the routes cannot drift, and a locale the
 * blog does not serve is rejected before anything renders — `/fr` is a missing route, not a
 * Spanish page. The 404 keeps its own copy of the header (`app/not-found.tsx`) because a
 * `not-found` boundary above this segment replaces it.
 */
export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!isLocale(locale)) {
    notFound()
  }

  const theme = await readTheme()
  const copy = getDictionary(locale)

  return (
    <>
      <a className="skip-link" href="#journal-content">
        {/* The skip link belongs to the shell: it must be the first stop, before the header. */}
        {copy.skipToContent}
      </a>
      <SiteHeader locale={locale} portfolioUrl={getPortfolioUrl()} theme={theme} />
      <div id="journal-content" tabIndex={-1}>
        {children}
      </div>
    </>
  )
}
