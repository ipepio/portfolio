'use client'

import { usePathname } from 'next/navigation'

import { BrandLogo } from '@/components/brand-logo'
import { ThemeToggle } from '@/components/theme-toggle'
import { getDictionary } from '@/lib/i18n'
import { isLocale, type Locale } from '@/lib/payload'
import { otherLocaleHref } from '@/lib/routes'
import type { Theme } from '@/lib/theme'

/**
 * Whether a pathname is the archive: the index itself or one of its later pages. An article
 * is not the archive, so it gets no `aria-current` — the nav has no link to a note.
 */
function isArchivePath(pathname: string | null): boolean {
  const segments = (pathname ?? '').split('/').filter(Boolean)

  if (!isLocale(segments[0])) {
    return false
  }

  return segments.length === 1 || (segments.length === 3 && segments[1] === 'page')
}

/**
 * The blog's sticky header: the journal identity on the left, the archive and the portfolio
 * on the right, plus the theme toggle and the language switch.
 *
 * It is a client component because the two controls that depend on the reader's position —
 * `aria-current` and the language switch target — are derived from the current pathname.
 * Everything else (identity copy, labels, and the theme the server already read from the
 * cookie) arrives as props, so the server renders the whole header and the first paint is
 * correct with no flash and no hydration mismatch.
 *
 * The blog is a separate application: nothing here is imported from the portfolio.
 */
export function SiteHeader({
  locale,
  portfolioUrl,
  theme,
}: {
  locale: Locale
  portfolioUrl: string
  theme: Theme
}) {
  const copy = getDictionary(locale)
  const pathname = usePathname()
  const archiveHref = `/${locale}`
  const other: Locale = locale === 'es' ? 'en' : 'es'

  return (
    <header className="journal-header" data-journal-header>
      <nav className="journal-nav wrap" aria-label={copy.navLabel}>
        <a
          className="journal-brand"
          data-journal-brand
          href={archiveHref}
          aria-label={copy.navBrandLabel}
        >
          <span className="journal-brand-mark" aria-hidden="true">
            <BrandLogo />
          </span>
          <span className="journal-brand-word">ipepio</span>
          <span className="journal-brand-slash" aria-hidden="true">
            /
          </span>
          <span className="journal-brand-section">{copy.navSection}</span>
        </a>

        <div className="journal-nav-links">
          <a
            className="journal-nav-link"
            data-journal-nav-index
            href={archiveHref}
            aria-current={isArchivePath(pathname) ? 'page' : undefined}
          >
            {copy.navIndex}
          </a>
          {/* Another site, opened in its own tab: the arrow and the label say so. */}
          <a
            className="journal-nav-link is-external"
            data-journal-nav-portfolio
            href={portfolioUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={copy.navPortfolioLabel}
          >
            {copy.navPortfolio}
            <span aria-hidden="true">↗</span>
          </a>
          <ThemeToggle
            serverTheme={theme}
            toLight={copy.navThemeToLight}
            toDark={copy.navThemeToDark}
          />
          {/* Only the locale segment changes, so the reader lands on the same page. */}
          <a
            className="journal-control journal-control-code mono"
            data-journal-language
            href={otherLocaleHref(pathname, other)}
            hrefLang={other}
            aria-label={copy.navLanguageLabel}
          >
            {other.toUpperCase()}
          </a>
        </div>
      </nav>
    </header>
  )
}
