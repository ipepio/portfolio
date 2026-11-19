/**
 * The index's presentational blocks: breadcrumb, hero, featured note, archive grid,
 * pagination and footer.
 *
 * They are shared by `/[locale]` (page 1) and `/[locale]/page/[n]` (later pages), so both
 * routes render the same archive. Every string arrives from the dictionary and every number
 * from `@/lib/payload`: these components only lay the design out.
 */
import { CardVisual, FeatureVisual, artKindFor } from '@/components/journal-cover'
import { format, pad, type JournalCopy } from '@/lib/i18n'
import { POSTS_PAGE_SIZE, type Locale, type PostSummary } from '@/lib/payload'
import { archiveHref, postHref } from '@/lib/routes'

/** `PREVIOUS PAGE` / `NEXT PAGE` links and the current page: real links, so a keyboard
 * reaches them with Tab, and `rel` tells crawlers how the pages relate. */
function PageStep({
  direction,
  href,
  children,
}: {
  direction: 'prev' | 'next'
  href: string | null
  children: React.ReactNode
}) {
  if (href === null) {
    // Disabled end of the archive: not a link, so it cannot be followed or tabbed to.
    return (
      <span className="journal-page-step is-disabled" aria-disabled="true">
        {children}
      </span>
    )
  }

  if (direction === 'prev') {
    return (
      <a className="journal-page-step" data-journal-prev href={href} rel="prev">
        {children}
      </a>
    )
  }

  return (
    <a className="journal-page-step" data-journal-next href={href} rel="next">
      {children}
    </a>
  )
}

/**
 * `IPEPIO / JOURNAL`, plus the crumb of a note when the article page asks for it. The
 * section is a link only where it has somewhere to go — the note pages link back to the
 * archive — and the current crumb is the slug, never the title, exactly like the reference.
 */
export function JournalBreadcrumb({
  locale,
  copy,
  current,
  sectionHref,
}: {
  locale: Locale
  copy: JournalCopy
  current?: string
  sectionHref?: string
}) {
  return (
    <nav className="journal-breadcrumb" aria-label={copy.breadcrumbLabel}>
      <a href={`/${locale}`}>{copy.breadcrumbHome}</a>
      <b aria-hidden="true">/</b>
      {sectionHref === undefined ? (
        <span>{copy.breadcrumbSection}</span>
      ) : (
        <a href={sectionHref}>{copy.breadcrumbSection}</a>
      )}
      {current === undefined ? null : (
        <>
          <b aria-hidden="true">/</b>
          <span className="last">{current}</span>
        </>
      )}
    </nav>
  )
}

export function JournalHero({ copy }: { copy: JournalCopy }) {
  return (
    <header className="journal-hero">
      <div>
        <div className="journal-kicker">
          <i aria-hidden="true" /> {copy.heroKicker} / 001
        </div>
        <h1>
          {/* The space stays before the break so stripped-down text still reads as one sentence. */}
          {copy.heroTitleLead} <br />
          {copy.heroTitleMiddle} <span className="lime">{copy.heroTitleAccent}</span>
        </h1>
        <p className="journal-lead">{copy.heroLead}</p>
      </div>
      <aside className="journal-hero-side">
        <div className="journal-aside-code">
          <span>
            <b className="prompt">❯</b> <strong>{copy.asideCommand}</strong>
          </span>
          <span>
            <b className="prompt">#</b> {copy.asideOpinion}
          </span>
          <span>
            <b className="prompt">#</b> {copy.asideLoop}
          </span>
        </div>
        <div className="journal-draft">{copy.draftNotice}</div>
      </aside>
    </header>
  )
}

/** The featured note: the one Payload flags, on page 1 only. */
export function FeaturedNote({
  locale,
  copy,
  post,
  position,
  total,
}: {
  locale: Locale
  copy: JournalCopy
  post: PostSummary
  position: number
  total: number
}) {
  const minutes = typeof post.readMinutes === 'number' ? post.readMinutes : null
  const category = post.category ?? null

  return (
    <section className="journal-feature">
      <div className="journal-feature-head">
        <span className="journal-kicker">
          <i aria-hidden="true" /> {copy.featuredKicker}
        </span>
        <span>{format(copy.featureCoverPosition, { index: pad(position), total: pad(total) })}</span>
      </div>
      <a
        className="journal-feature-link"
        data-journal-featured
        href={postHref(locale, post.slug)}
        aria-label={post.title}
      >
        <div className="journal-feature-copy">
          <div className="journal-feature-supra">
            <span aria-hidden="true">✳</span>
            {category === null ? null : <span>{category}</span>}
            {minutes === null ? null : (
              <span className="journal-draft">
                / {format(copy.featuredRead, { minutes })}
              </span>
            )}
          </div>
          <h2 className="journal-feature-title">{post.title}</h2>
          {post.excerpt === null || post.excerpt === undefined ? null : (
            <p className="journal-feature-description">{post.excerpt}</p>
          )}
          <div className="journal-feature-bottom">
            <span className="journal-meta">
              {copy.featuredByline} <span aria-hidden="true">·</span> {copy.featuredNote}
            </span>
            <span className="journal-arrow" aria-hidden="true">
              ↗
            </span>
          </div>
        </div>
        <FeatureVisual
          corner={copy.featureCoverCorner}
          serial={pad(position)}
          idTemplate={copy.featureCoverId}
        />
      </a>
    </section>
  )
}

/** One archive card. `serial` keeps the reference's running `N° 01` across pages; the
 * heading level follows the surrounding archive so the page keeps a single `h1` chain. */
export function PostCard({
  locale,
  copy,
  post,
  serial,
  headingLevel = 'h3',
}: {
  locale: Locale
  copy: JournalCopy
  post: PostSummary
  serial: string
  headingLevel?: 'h2' | 'h3'
}) {
  const Title = headingLevel
  const minutes = typeof post.readMinutes === 'number' ? post.readMinutes : null
  const category = post.category ?? null
  const categoryLine =
    category === null
      ? minutes === null
        ? null
        : format(copy.readMinutes, { minutes })
      : minutes === null
        ? category
        : format(copy.cardCategory, { category, minutes })

  return (
    <a className="journal-card" data-journal-card href={postHref(locale, post.slug)}>
      <CardVisual
        kind={artKindFor(post.slug)}
        label={copy.coverLabel}
        serial={format(copy.cardSerial, { serial })}
      />
      <div className="journal-card-body">
        {categoryLine === null ? null : (
          <span className="journal-card-category">{categoryLine}</span>
        )}
        <Title className="journal-card-title">{post.title}</Title>
        {post.excerpt === null || post.excerpt === undefined ? null : (
          <p className="journal-card-excerpt">{post.excerpt}</p>
        )}
        <div className="journal-card-foot">
          <span className="journal-meta">
            {copy.cardMeta}
            {minutes === null ? null : ` · ${format(copy.readMinutes, { minutes })}`}
          </span>
          <span className="journal-arrow" aria-hidden="true">
            ↗
          </span>
        </div>
      </div>
    </a>
  )
}

/**
 * The `En el radar` archive of one page: heading, counter, grid and the previous/next
 * controls. `publishedCount` is every published note in the locale, so the counter reads the
 * same on every page and never the page size.
 */
export function JournalArchive({
  locale,
  copy,
  docs,
  page,
  totalPages,
  publishedCount,
  titleAs = 'h2',
}: {
  locale: Locale
  copy: JournalCopy
  docs: PostSummary[]
  page: number
  totalPages: number
  publishedCount: number
  /** Later archive pages have no hero, so their archive heading is the page's `h1`. */
  titleAs?: 'h1' | 'h2'
}) {
  const firstSerial = (page - 1) * POSTS_PAGE_SIZE + 1
  const Title = titleAs
  const cardHeading = titleAs === 'h1' ? 'h2' : 'h3'

  return (
    <section className="journal-archive">
      <div className="wrap">
        <div className="journal-archive-head">
          <div>
            <div className="journal-kicker">
              <i aria-hidden="true" /> {copy.archiveKicker}
            </div>
            <Title className="journal-archive-title">
              {copy.archiveTitleLead} <span className="accent">{copy.archiveTitleAccent}</span>
            </Title>
          </div>
          <span data-journal-count>{format(copy.notesCount, { count: pad(publishedCount) })}</span>
        </div>
        {docs.length === 0 ? (
          <p className="journal-empty">{copy.emptyArchive}</p>
        ) : (
          <div className="journal-grid">
            {docs.map((post, index) => (
              <PostCard
                key={post.id}
                locale={locale}
                copy={copy}
                post={post}
                serial={pad(firstSerial + index)}
                headingLevel={cardHeading}
              />
            ))}
          </div>
        )}
        <nav
          className="journal-pagination"
          aria-label={copy.paginationLabel}
          data-journal-pagination
        >
          <PageStep direction="prev" href={page > 1 ? archiveHref(locale, page - 1) : null}>
            {copy.previousPage}
          </PageStep>
          <span className="journal-page-status" data-journal-page-status>
            {format(copy.pageStatus, { page: pad(page), total: pad(totalPages) })}
          </span>
          <PageStep direction="next" href={page < totalPages ? archiveHref(locale, page + 1) : null}>
            {copy.nextPage}
          </PageStep>
        </nav>
      </div>
    </section>
  )
}

export function JournalFooter({ copy, portfolioUrl }: { copy: JournalCopy; portfolioUrl: string }) {
  return (
    <footer className="journal-footer">
      <span>{copy.footerRights}</span>
      <div className="journal-footer-links">
        <a href={portfolioUrl}>{copy.footerPortfolio}</a>
        <a href="https://github.com/ipepio" target="_blank" rel="noopener noreferrer">
          GitHub ↗
        </a>
        <a href="https://www.linkedin.com/in/ipepio/" target="_blank" rel="noopener noreferrer">
          LinkedIn ↗
        </a>
      </div>
    </footer>
  )
}
