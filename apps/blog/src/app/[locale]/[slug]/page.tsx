import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { JournalBreadcrumb, JournalFooter } from '@/components/journal-blocks'
import { artKindFor } from '@/components/journal-cover'
import {
  ReadingBody,
  ReadingCover,
  ReadingEnd,
  ReadingHero,
  ReadingSideNote,
  ReadingToc,
} from '@/components/reading-blocks'
import { format, getDictionary, pad } from '@/lib/i18n'
import { getPostBySlug, getPosts, isLocale } from '@/lib/payload'
import { readingSections } from '@/lib/reading'
import { getPortfolioUrl } from '@/lib/site'

type ArticlePageProps = {
  params: Promise<{ locale: string; slug: string }>
}

/**
 * The article's metadata: its title and excerpt, both read from Payload in the requested
 * locale. A slug the blog would not show falls back to the journal title, because the page
 * itself answers 404.
 */
export async function generateMetadata(props: ArticlePageProps): Promise<Metadata> {
  const { locale, slug } = await props.params

  if (!isLocale(locale)) {
    return { title: 'IPEPIO — Journal' }
  }

  const post = await getPostBySlug(locale, slug)

  if (post === null) {
    return { title: 'IPEPIO — Journal' }
  }

  return {
    title: format(getDictionary(locale).articleDocumentTitle, { title: post.title }),
    description: post.excerpt ?? undefined,
  }
}

/**
 * The article page: breadcrumb, hero, cover, the reading layout with its section index and
 * body, and the note that follows.
 *
 * `/[locale]/[slug]` sits beside the `page/[page]` archive route of T3. Next resolves the
 * static `page` segment first, so `/[locale]/page/2` stays the archive and only other slugs
 * reach this page, where a slug that is not a published note — unknown, still a draft, or
 * belonging to the other locale — is a 404.
 *
 * The next note is the next older published note in the archive order (`-publishedAt`, the
 * order `En el radar` uses), read from the same list this note is in. The reference cycled
 * back to the newest note at the end of the archive; that is a link to the top of the list,
 * not a next note, so the oldest note renders no block at all.
 */
export default async function ArticlePage({ params }: ArticlePageProps) {
  const { locale, slug } = await params

  if (!isLocale(locale)) {
    notFound()
  }

  const [post, timeline] = await Promise.all([getPostBySlug(locale, slug), getPosts(locale)])

  if (post === null) {
    notFound()
  }

  const copy = getDictionary(locale)
  const position = timeline.findIndex((entry) => entry.slug === post.slug)
  const next = position === -1 ? null : (timeline[position + 1] ?? null)
  const sections = readingSections(post.body)
  const serial = pad(position === -1 ? 1 : position + 1)

  return (
    <main id="blogArticle" className="journal">
      <div className="wrap">
        <JournalBreadcrumb
          locale={locale}
          copy={copy}
          current={post.slug}
          sectionHref={`/${locale}`}
        />
        <ReadingHero copy={copy} post={post} />
        <ReadingCover copy={copy} kind={artKindFor(post.slug)} serial={serial} />
        <div className={sections.length === 0 ? 'reading-layout is-plain' : 'reading-layout'}>
          {sections.length === 0 ? null : <ReadingToc copy={copy} sections={sections} />}
          <ReadingBody body={post.body} sections={sections} />
          <ReadingSideNote copy={copy} />
        </div>
        {next === null ? null : <ReadingEnd locale={locale} copy={copy} post={next} />}
        <JournalFooter copy={copy} portfolioUrl={getPortfolioUrl()} />
      </div>
    </main>
  )
}
