import React from 'react'
import './globals.css'

import { SiteNav } from '@/components/site/site-nav'

export const metadata = {
  description: 'A blank template using Payload in a Next.js app.',
  title: 'Payload Blank Template',
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

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    // The bootstrap script rewrites `data-theme` before hydration, so the attribute
    // intentionally differs from the server markup once a stored theme exists.
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>{themeBootstrap}</head>
      <body>
        <SiteNav />
        <main>{children}</main>
      </body>
    </html>
  )
}
