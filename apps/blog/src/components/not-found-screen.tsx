import { JournalFooter } from '@/components/journal-blocks'
import { SiteHeader } from '@/components/site-header'
import { getDictionary } from '@/lib/i18n'
import { getFeaturedPost, type Locale, type PostSummary } from '@/lib/payload'
import { postHref } from '@/lib/routes'
import { readLocale, readTheme } from '@/lib/server'
import { getPortfolioUrl } from '@/lib/site'

/**
 * The featured note is the second way out of a 404. A content API that is down must not turn
 * "this page does not exist" into a server error, so the note is optional here while the
 * archive link — the first way out — never is.
 */
async function featuredNoteOrNull(locale: Locale): Promise<PostSummary | null> {
  try {
    return await getFeaturedPost(locale)
  } catch {
    return null
  }
}

/**
 * The designed 404 body: the same shell as every other route, in the reader's language, with
 * two ways back into the journal.
 *
 * It is shared by the two files Next can use to answer a missing route — `not-found.tsx`
 * (called by `notFound()`) and `global-not-found.tsx` (a URL that matches no route) — so both
 * look identical to the reader.
 *
 * The locale and the theme are read from the request, not guessed from the client: the proxy
 * forwards the pathname and the server reads the theme cookie, so the page is already in the
 * right language and the right theme.
 */
export async function NotFoundScreen() {
  const [locale, theme] = await Promise.all([readLocale(), readTheme()])
  const copy = getDictionary(locale)
  const portfolioUrl = getPortfolioUrl()
  const featured = await featuredNoteOrNull(locale)

  return (
    <>
      <a className="skip-link" href="#journalNotFound">
        {copy.skipToContent}
      </a>
      <SiteHeader locale={locale} portfolioUrl={portfolioUrl} theme={theme} />
      <main id="journalNotFound" className="journal journal-notfound">
        <div className="wrap">
          <section className="journal-notfound-block">
            <p className="journal-kicker">
              <i aria-hidden="true" /> {copy.notFoundKicker}
            </p>
            <h1 className="journal-notfound-title">
              {copy.notFoundTitleLead}{' '}
              <span className="lime">{copy.notFoundTitleAccent}</span>
            </h1>
            <p className="journal-notfound-lead">{copy.notFoundLead}</p>
            <div className="journal-notfound-actions">
              <a className="journal-notfound-cta" data-journal-notfound-index href={`/${locale}`}>
                {copy.notFoundIndex}
              </a>
              {featured === null ? null : (
                <a
                  className="journal-notfound-link mono"
                  data-journal-notfound-featured
                  href={postHref(locale, featured.slug)}
                >
                  {copy.notFoundFeatured}
                  <span aria-hidden="true">→</span>
                </a>
              )}
            </div>
          </section>
          <JournalFooter copy={copy} portfolioUrl={portfolioUrl} />
        </div>
      </main>
    </>
  )
}

/** Document title for the 404, in the reader's language. */
export async function notFoundTitle(): Promise<string> {
  return getDictionary(await readLocale()).notFoundDocumentTitle
}
