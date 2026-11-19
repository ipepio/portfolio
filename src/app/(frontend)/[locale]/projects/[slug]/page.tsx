import { getPayload } from 'payload'

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { cache } from 'react'

import config from '@payload-config'
import { ProjectDetail } from '@/components/site/project-detail'
import { defaultLocale, getDictionary, isLocale, locales } from '@/lib/i18n'

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
    title: project.title,
    description: project.shortDescription ?? undefined,
  }
}

/** Project detail page: one Payload `projects` document, in the URL's locale. */
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

  return (
    <ProjectDetail
      project={project}
      locale={locale}
      labels={{
        ...dict.projects.detail,
        imageAltPrefix: dict.projects.gridLabels.imageAltPrefix,
        statusLabels: dict.projects.statusLabels,
      }}
    />
  )
}
