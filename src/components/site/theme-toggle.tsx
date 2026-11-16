'use client'

import { Moon, Sun } from 'lucide-react'
import { useSyncExternalStore } from 'react'

/** localStorage key shared with the inline bootstrap script in the root layout. */
export const THEME_STORAGE_KEY = 'ipepio-theme'

export type Theme = 'light' | 'dark'

/** Dark is the design default: `globals.css` only defines light under `[data-theme="light"]`. */
const DEFAULT_THEME: Theme = 'dark'

function readTheme(): Theme {
  return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'
}

/**
 * `data-theme` lives on `<html>`, so the store watches that attribute instead of
 * duplicating state: the toggle, the bootstrap script and any external writer all
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

/** React only ever renders this on the client (click handler) or from the server snapshot. */
function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme

  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme)
  } catch {
    // Storage may be unavailable (private mode, blocked cookies). The attribute still
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
