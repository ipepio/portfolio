import { getPayload } from 'payload'

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { cache } from 'react'

import config from '@payload-config'
import { LiveProjectDetail } from '@/components/site/project-detail-live'
import { defaultLocale, getDictionary, isLocale, locales, type Locale } from '@/lib/i18n'

type ProjectPageProps = {
  params: Promise<{ locale: string; slug: string }>
}

/**
 * Looks up one project by slug in the requested locale (or `null`).
 *
 * Wrapped in React's `cache()` so `generateMetadata` and the page render, which both need
 * the document, pay for a single query per request instead of two.
 */
const findProject = cache(async (locale: (typeof locales)[number], slug: string) => {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const { docs } = await payload.find({
    collection: 'projects',
    where: { slug: { equals: slug } },
    locale,
    depth: 1,
    limit: 1,
  })

  return docs[0] ?? null
})

/**
 * The whole archive in `order` order, with only what the closing row needs.
 *
 * The detail page's "next project" follows that order and wraps at both ends, so it needs
 * the neighbourhood, not a `greater_than` query: one small read of every slug and title is
 * cheaper than two queries and gets the wrap right. `defaultSort` is `-year`, so the order
 * is requested explicitly.
 */
const listArchive = cache(async (locale: Locale) => {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const { docs } = await payload.find({
    collection: 'projects',
    locale,
    depth: 0,
    limit: 1000,
    pagination: false,
    sort: ['order', 'id'],
    select: { slug: true, title: true },
  })

  return docs
})

/** The project after this one in the archive order, wrapping around at the end. */
function nextInArchive(
  archive: Awaited<ReturnType<typeof listArchive>>,
  slug: string,
): { slug: string; title: string } | null {
  if (archive.length < 2) return null

  const position = archive.findIndex((doc) => doc.slug === slug)
  if (position === -1) return null

  const neighbour = archive[(position + 1) % archive.length]
  if (!neighbour?.slug || neighbour.slug === slug) return null

  return { slug: neighbour.slug, title: neighbour.title ?? neighbour.slug }
}

/**
 * Where this project sits in the published archive, for the hero's `NN / TT`.
 *
 * Derived, never stored: it is the one-based position in the same `order` list the grid
 * shows, plus the size of that list, so reordering or publishing a project moves the index
 * of every page at once and no page can print a position that stopped being true.
 */
function indexInArchive(
  archive: Awaited<ReturnType<typeof listArchive>>,
  slug: string,
): { position: number; total: number } | null {
  const position = archive.findIndex((doc) => doc.slug === slug)
  if (position === -1 || archive.length === 0) return null

  return { position: position + 1, total: archive.length }
}

/**
 * Prerenders every project detail page for both locales. The child segment must
 * return the parent's `locale` param too, so the cross product is built here.
 */
export async function generateStaticParams() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const { docs } = await payload.find({
    collection: 'projects',
    locale: defaultLocale,
    depth: 0,
    limit: 1000,
    pagination: false,
  })

  return locales.flatMap((locale) => docs.map((doc) => ({ locale, slug: doc.slug })))
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { locale, slug } = await params
  if (!isLocale(locale)) {
    return {}
  }

  const project = await findProject(locale, slug)
  if (!project) {
    return {}
  }

  return {
    // The blog's articles read "<title> — Isaac Pepió - Blog"; the portfolio's detail pages
    // mirror that shape so a tab always names the site it belongs to.
    title: `${project.title} — Isaac Pepió`,
    description: project.shortDescription ?? undefined,
  }
}

/**
 * Project detail page: one Payload `projects` document, in the URL's locale.
 *
 * The server render stays the source of truth for a plain load — the document is read here,
 * once, and its metadata is generated from the same read. The page hands that document to
 * the live half (`LiveProjectDetail`, T3: S3), which keeps rendering it verbatim until the
 * admin's live-preview messages replace it while the owner edits in the panel.
 */
export default async function ProjectPage({ params }: ProjectPageProps) {
  const { locale, slug } = await params

  if (!isLocale(locale)) {
    notFound()
  }

  const project = await findProject(locale, slug)

  if (!project) {
    notFound()
  }

  const dict = getDictionary(locale)
  const archive = await listArchive(locale)

  return (
    <LiveProjectDetail
      project={project}
      locale={locale}
      nextProject={nextInArchive(archive, slug)}
      archiveIndex={indexInArchive(archive, slug)}
      labels={{
        ...dict.projects.detail,
        imageAltPrefix: dict.projects.gridLabels.imageAltPrefix,
        statusLabels: dict.projects.statusLabels,
      }}
    />
  )
}
