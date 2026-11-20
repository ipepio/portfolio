'use client'

import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

import { ThemeToggle } from '@/components/site/theme-toggle'
import { isLocale, otherLocale, type Locale } from '@/lib/i18n'
import { useDictionary, useLocale } from '@/lib/locale-context'

const MENU_ID = 'site-nav-menu'
/** Matches the `md` breakpoint used by the link list and the menu button. */
const DESKTOP_QUERY = '(min-width: 768px)'

/** Geometric brand mark (parallel lines), light on the dark theme and dark on the light one. */
function BrandLogo() {
  return (
    <svg
      viewBox="58 52 215 228"
      fill="none"
      aria-hidden="true"
      shapeRendering="geometricPrecision"
      className="size-8 shrink-0 md:size-[37px]"
    >
      <path
        fill="currentColor"
        d="M170 60L128 86L128 126L170 100L228.1538 136L228.1538 192L176.4615 224L176.4615 248L157.0769 236L157.0769 192L195.8461 168L195.8461 136L182.923 128L131.2307 160L131.2307 248L170 272L260.4614 216L260.4614 116L170 60Z"
      />
      <path fill="currentColor" d="M108 100L72.4615 122L72.4615 218L108 240Z" />
    </svg>
  )
}

/**
 * Same page in the counterpart locale: swap the leading locale segment and keep the
 * rest, so anchors and any future sub-route survive the switch.
 */
function localeHref(pathname: string, target: Locale): string {
  const segments = pathname.split('/').filter(Boolean)
  const rest = isLocale(segments[0]) ? segments.slice(1) : segments

  return `/${[target, ...rest].join('/')}`
}

/**
 * Sticky site header: brand mark, section anchors (starting at the hero), language
 * switcher, theme toggle, contact CTA and, below the `md` breakpoint, a disclosure menu
 * mirroring the anchors.
 *
 * Locale and copy come from `useLocale()` / `useDictionary()`; the header is rendered by
 * the `[locale]` layout inside `<LocaleProvider>`, so it needs no props.
 */
export function SiteNav() {
  const locale = useLocale()
  const labels = useDictionary().nav
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  /**
   * Section anchors mirror the page composition: Hero → About → Skills → Projects → Experience → Contact.
   *
   * On any other route the bare hash has nothing to scroll to — a project page has no
   * `#about` — so the click does nothing and the reader stays where they were. Away from the
   * home page the links therefore point at the home page plus the hash.
   */
  const home = `/${locale}`
  const onHome = pathname === home || pathname === `${home}/`
  const anchor = (hash: string) => (onHome ? hash : `${home}${hash}`)

  const navLinks = [
    { href: anchor('#hero'), label: labels.links.home },
    { href: anchor('#about'), label: labels.links.about },
    { href: anchor('#skills'), label: labels.links.skills },
    { href: anchor('#projects'), label: labels.links.projects },
    { href: anchor('#experience'), label: labels.links.experience },
    { href: anchor('#contact'), label: labels.links.contact },
  ]
  const other = otherLocale(locale)

  useEffect(() => {
    if (!open) return

    const desktop = window.matchMedia(DESKTOP_QUERY)
    const close = () => setOpen(false)
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setOpen(false)
      menuButtonRef.current?.focus()
    }

    desktop.addEventListener('change', close)
    window.addEventListener('keydown', onKeyDown)

    return () => {
      desktop.removeEventListener('change', close)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const closeMenu = () => setOpen(false)

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-nav backdrop-blur-[18px]">
      <nav
        aria-label={labels.ariaLabel}
        className="mx-auto flex h-16 w-full max-w-(--container-page) items-center px-6 md:h-[69px]"
      >
        <a
          href={anchor('#hero')}
          aria-label={labels.homeLabel}
          className="flex items-center gap-[13px] whitespace-nowrap"
        >
          <BrandLogo />
          <span className="flex flex-col">
            <span className="font-heading text-[17px] leading-none font-bold tracking-[-0.06em] md:text-[19px]">
              ipepio
            </span>
            <span className="mono mt-[3px] text-[10px] leading-none font-medium tracking-[0.05em] text-muted-foreground uppercase">
              ISAAC PEPIÓ / DEV
            </span>
          </span>
        </a>

        <ul className="ml-auto hidden items-center gap-[clamp(16px,2.4vw,36px)] md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="ml-auto flex items-center gap-2 md:ml-[clamp(16px,2.4vw,36px)]">
          <ThemeToggle />
          {/* Real client navigation: `next/link` swaps the route without loading a new
              document, and `scroll={false}` keeps the reader where they were instead of
              jumping to the top (which read as a full reload). */}
          <Link
            href={localeHref(pathname, other)}
            hrefLang={other}
            scroll={false}
            aria-label={labels.languageSwitcher.ariaLabel}
            className="mono inline-flex h-[38px] shrink-0 items-center rounded-[10px] border border-border px-2.5 text-[11px] leading-none font-bold tracking-[0.14em] text-muted-foreground transition-colors hover:border-input hover:bg-card hover:text-foreground"
          >
            {labels.languageSwitcher.code}
          </Link>
          <a
            href={anchor('#contact')}
            className="mono hidden h-[39px] items-center gap-[15px] rounded-[10px] bg-primary px-[15px] text-[11px] leading-none font-bold text-primary-foreground hover:brightness-105 motion-safe:transition-transform motion-safe:hover:-translate-y-0.5 md:inline-flex"
          >
            {labels.cta}
            <span aria-hidden>↗</span>
          </a>
          <button
            ref={menuButtonRef}
            type="button"
            aria-expanded={open}
            aria-controls={MENU_ID}
            aria-label={open ? labels.menuClose : labels.menuOpen}
            onClick={() => setOpen((value) => !value)}
            className="inline-flex size-[34px] items-center justify-center rounded-[10px] border border-border text-muted-foreground transition-colors hover:border-input hover:bg-card hover:text-foreground md:hidden"
          >
            {open ? (
              <X aria-hidden className="size-[17px]" />
            ) : (
              <Menu aria-hidden className="size-[17px]" />
            )}
          </button>
        </div>
      </nav>

      {open ? (
        <div
          id={MENU_ID}
          className="absolute inset-x-0 top-full border-b border-border bg-popover shadow-[var(--shadow)] md:hidden"
        >
          <ul className="mx-auto flex w-full max-w-(--container-page) flex-col px-6 py-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={closeMenu}
                  className="block border-b border-border/60 py-3 text-sm font-semibold text-muted-foreground transition-colors last:border-0 hover:text-foreground"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href={anchor('#contact')}
            onClick={closeMenu}
            className="mono mx-6 mb-4 inline-flex h-10 items-center gap-2 rounded-[10px] bg-primary px-4 text-[11px] leading-none font-bold text-primary-foreground"
          >
            {labels.cta}
            <span aria-hidden>↗</span>
          </a>
        </div>
      ) : null}
    </header>
  )
}
