'use client'

import { Moon, Sun } from 'lucide-react'
import { useSyncExternalStore } from 'react'

import { DEFAULT_THEME, parseTheme, themeCookie, type Theme } from '@/lib/theme'

/**
 * `data-theme` lives on `<html>`, so the store watches that attribute instead of
 * duplicating state: the toggle and the server-rendered attribute (from the theme
 * cookie) converge on the same source of truth.
 */
function subscribe(onStoreChange: () => void) {
  const observer = new MutationObserver(onStoreChange)
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  })

  return () => observer.disconnect()
}

/** React only ever renders this on the client (click handler) or from the server snapshot. */
function readTheme(): Theme {
  return parseTheme(document.documentElement.dataset.theme)
}

/**
 * Applies the theme for this document and persists it in the cookie the server layout
 * reads on the next request: no round-trip, and the preference survives reloads and
 * locale changes so the first paint is always correct.
 */
function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme

  try {
    document.cookie = themeCookie(theme)
  } catch {
    // Cookies may be blocked (private mode, strict settings). The attribute still
    // applies the theme for this session; only the persistence is lost.
  }
}

/**
 * Single icon button that flips `<html data-theme>` between `dark` and `light`.
 *
 * The server snapshot is the default theme, so the first client render matches the
 * server markup exactly (no hydration mismatch); the real theme is picked up right
 * after hydration through the `data-theme` subscription.
 */
export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, readTheme, () => DEFAULT_THEME)
  const nextTheme: Theme = theme === 'dark' ? 'light' : 'dark'
  const label = nextTheme === 'light' ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'
  const Icon = nextTheme === 'light' ? Sun : Moon

  return (
    <button
      type="button"
      onClick={() => applyTheme(nextTheme)}
      aria-label={label}
      title={label}
      className="inline-flex size-[38px] shrink-0 items-center justify-center rounded-[10px] border border-border text-muted-foreground transition-colors hover:border-input hover:bg-card hover:text-foreground"
    >
      <Icon aria-hidden className="size-[17px]" />
    </button>
  )
}
