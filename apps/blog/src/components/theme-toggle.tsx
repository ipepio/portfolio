'use client'

import { useSyncExternalStore } from 'react'

import { parseTheme, themeCookie, type Theme } from '@/lib/theme'

/**
 * `data-theme` lives on `<html>`, so the store watches that attribute instead of
 * duplicating state: the toggle and the server-rendered attribute (from the theme cookie)
 * converge on the same source of truth.
 */
function subscribe(onStoreChange: () => void) {
  const observer = new MutationObserver(onStoreChange)
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  })

  return () => observer.disconnect()
}

function readTheme(): Theme {
  return parseTheme(document.documentElement.dataset.theme)
}

/**
 * Applies the theme for this document and persists it in the cookie the server layout reads
 * on the next request: no round-trip, and the preference survives reloads and locale changes
 * so the first paint is always correct. The cookie is the one the portfolio writes too, so
 * the choice carries across both apps.
 */
function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme

  try {
    document.cookie = themeCookie(theme)
  } catch {
    // Cookies may be blocked (private mode, strict settings). The attribute still applies the
    // theme for this session; only the persistence is lost.
  }
}

/** Sun mark, shown when the button offers the light theme. */
function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="journal-control-icon">
      <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M12 2.6v2.2M12 19.2v2.2M2.6 12h2.2M19.2 12h2.2M5.4 5.4l1.6 1.6M17 17l1.6 1.6M18.6 5.4L17 7M7 17l-1.6 1.6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Crescent mark, shown when the button offers the dark theme. */
function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="journal-control-icon">
      <path
        d="M20.2 14.6A8.6 8.6 0 0 1 9.4 3.8a8.6 8.6 0 1 0 10.8 10.8Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/**
 * Single icon button that flips `<html data-theme>` between `dark` and `light`.
 *
 * `serverTheme` is the theme the server read from the cookie, so the very first paint shows
 * the right icon and the right label: the client's hydration render uses it as the server
 * snapshot and only then subscribes to the attribute.
 */
export function ThemeToggle({
  serverTheme,
  toLight,
  toDark,
}: {
  serverTheme: Theme
  toLight: string
  toDark: string
}) {
  const theme = useSyncExternalStore(subscribe, readTheme, () => serverTheme)
  const nextTheme: Theme = theme === 'dark' ? 'light' : 'dark'
  const label = nextTheme === 'light' ? toLight : toDark

  return (
    <button
      type="button"
      data-journal-theme
      onClick={() => applyTheme(nextTheme)}
      aria-label={label}
      title={label}
      className="journal-control"
    >
      {nextTheme === 'light' ? <SunIcon /> : <MoonIcon />}
    </button>
  )
}
