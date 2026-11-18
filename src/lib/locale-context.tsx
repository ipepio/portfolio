'use client'

import { createContext, useContext, type ReactNode } from 'react'

import type { Dictionary, Locale } from '@/lib/i18n'

/**
 * Locale plumbing for client components: the server layout resolves the active locale
 * and its dictionary once and hands them down through this context, so client
 * components read copy with a hook instead of receiving every string as a prop.
 */
export type LocaleContextValue = {
  /** Active locale, for building locale-aware links. */
  locale: Locale
  /** Fully resolved dictionary for that locale. */
  dict: Dictionary
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

export function LocaleProvider({
  locale,
  dict,
  children,
}: LocaleContextValue & { children: ReactNode }) {
  return <LocaleContext.Provider value={{ locale, dict }}>{children}</LocaleContext.Provider>
}

function useLocaleContext(): LocaleContextValue {
  const value = useContext(LocaleContext)

  // A missing provider is an authoring error, not a runtime state to paper over.
  if (!value) {
    throw new Error(
      'useLocale/useDictionary must be used inside <LocaleProvider> (the [locale] layout)',
    )
  }

  return value
}

/** Active locale of the current page. */
export function useLocale(): Locale {
  return useLocaleContext().locale
}

/** Copy for the active locale. */
export function useDictionary(): Dictionary {
  return useLocaleContext().dict
}
