import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { getPosts, isLocale, locales, type Locale } from '@/lib/payload'

/** Chrome copy for the skeleton index; every string exists in both locales (S9). */
const labels: Record<Locale, { heading: string; intro: string; empty: string }> = {
  es: {
    heading: 'Journal',
    intro: 'Notas sobre agentes, infraestructura y producto.',
    empty: 'Todavía no hay notas publicadas.',
  },
  en: {
    heading: 'Journal',
    intro: 'Field notes on agents, infrastructure and product.',
    empty: 'No published notes yet.',
  },
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await props.params

  return { title: isLocale(locale) ? `${labels[locale].heading} — IPEPIO` : 'IPEPIO — Journal' }
}

type BlogIndexProps = {
  params: Promise<{ locale: string }>
}

/**
 * Blog index skeleton: proves the pipeline by listing the published posts of one locale in
 * the order Payload returns them (newest first). Unknown locales are missing routes, not
 * Spanish pages.
 */
export default async function BlogIndexPage({ params }: BlogIndexProps) {
  const { locale } = await params

  if (!isLocale(locale)) {
    notFound()
  }

  const copy = labels[locale]
  const posts = await getPosts(locale)

  return (
    <main>
      <h1>{copy.heading}</h1>
      <p>{copy.intro}</p>
      {posts.length === 0 ? (
        <p>{copy.empty}</p>
      ) : (
        <ul>
          {posts.map((post) => (
            <li key={post.id}>
              <a href={`/${locale}/${post.slug}`}>{post.title}</a>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
