import React from 'react'
import '../globals.css'

import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

import { SiteNav } from '@/components/site/site-nav'
import { getDictionary, isLocale, type Locale } from '@/lib/i18n'

const metadataByLocale: Record<Locale, Metadata> = {
  es: {
    title: 'Isaac Pepió — CTO, arquitecto de software y builder',
    description:
      'Portfolio de Isaac Pepió: producto, plataformas cloud y sistemas de IA. De la primera línea de código a producción.',
  },
  en: {
    title: 'Isaac Pepió — CTO, software architect and builder',
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

/**
 * Applies the persisted theme before the first paint so a light-theme visitor never
 * sees a dark flash. Mirrors `THEME_STORAGE_KEY` / `Theme` in `site/theme-toggle.tsx`.
 */
const THEME_BOOTSTRAP_SCRIPT =
  "try{var t=localStorage.getItem('ipepio-theme');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t}catch(e){}"

/**
 * Head script that runs before hydration. `THEME_BOOTSTRAP_SCRIPT` is a hardcoded
 * authored literal with no user input, and React escapes text children of `<script>`,
 * so raw HTML is the only way to inline it.
 */
// pi-lens-ignore: dangerously-set-inner-html -- hardcoded literal, no user input, must run before first paint
const themeBootstrap = <script dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP_SCRIPT }} />

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

  return (
    // The bootstrap script rewrites `data-theme` before hydration, so the attribute
    // intentionally differs from the server markup once a stored theme exists.
    <html lang={locale} data-theme="dark" suppressHydrationWarning>
      <head>{themeBootstrap}</head>
      <body>
        <SiteNav locale={locale} labels={getDictionary(locale).nav} />
        <main>{children}</main>
      </body>
    </html>
  )
}
