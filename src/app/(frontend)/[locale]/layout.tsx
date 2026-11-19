import React from 'react'
import '../globals.css'

import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

import { SiteNav } from '@/components/site/site-nav'
import { getDictionary, isLocale, type Locale } from '@/lib/i18n'
import { LocaleProvider } from '@/lib/locale-context'
import { parseTheme, THEME_COOKIE_NAME } from '@/lib/theme'

const metadataByLocale: Record<Locale, Metadata> = {
  es: {
    title: 'Isaac Pepió',
    description:
      'Portfolio de Isaac Pepió: producto, plataformas cloud y sistemas de IA. De la primera línea de código a producción.',
  },
  en: {
    title: 'Isaac Pepió',
    description:
      'Isaac Pepió’s portfolio: product, cloud platforms and AI systems. From the first line of code to production.',
  },
}

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await props.params
  return isLocale(locale) ? metadataByLocale[locale] : metadataByLocale.es
}

export default async function RootLayout(props: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { children, params } = props
  const { locale } = await params

  // Unknown locales must not fall back to Spanish: they are genuinely missing routes.
  if (!isLocale(locale)) {
    notFound()
  }

  // Read the persisted theme on the server so the first paint already carries it.
  // This replaces the old inline bootstrap script, which React never executed on the
  // client and which caused a hydration mismatch.
  const theme = parseTheme((await cookies()).get(THEME_COOKIE_NAME)?.value)
  const dict = getDictionary(locale)

  return (
    // `data-scroll-behavior="smooth"` declares the global smooth scrolling from
    // `globals.css`, so Next disables it during route transitions instead of fighting it.
    <html lang={locale} data-theme={theme} data-scroll-behavior="smooth">
      <body>
        <LocaleProvider locale={locale} dict={dict}>
          <SiteNav />
          <main>{children}</main>
        </LocaleProvider>
      </body>
    </html>
  )
}
