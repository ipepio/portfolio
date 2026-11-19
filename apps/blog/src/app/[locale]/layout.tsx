import type React from 'react'

import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'

import { DraftStrip } from '@/components/draft-strip'
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
 *
 * The draft preview strip lives here for the same reason: every page of a preview says it is
 * one, and no page can forget to. Outside draft mode it renders nothing at all, so the
 * public site is byte-for-byte the page it was before the preview existed.
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
  const { isEnabled: previewing } = await draftMode()

  return (
    <>
      <a className="skip-link" href="#journal-content">
        {/* The skip link belongs to the shell: it must be the first stop, before the header. */}
        {copy.skipToContent}
      </a>
      {previewing ? <DraftStrip locale={locale} copy={copy} /> : null}
      <SiteHeader locale={locale} portfolioUrl={getPortfolioUrl()} theme={theme} />
      <div id="journal-content" tabIndex={-1}>
        {children}
      </div>
    </>
  )
}
