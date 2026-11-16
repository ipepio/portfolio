'use client'

import { Menu, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { ThemeToggle } from '@/components/site/theme-toggle'

/** Section anchors mirror the page composition: About → Skills → Projects → Contact. */
const NAV_LINKS = [
  { href: '#about', label: 'Sobre mí' },
  { href: '#skills', label: 'Skills' },
  { href: '#projects', label: 'Proyectos' },
  { href: '#contact', label: 'Contacto' },
] as const

const MENU_ID = 'site-nav-menu'
/** Matches the `md` breakpoint used by the link list and the menu button. */
const DESKTOP_QUERY = '(min-width: 768px)'

/** Hexagon monogram, stroke colors taken from the brand tokens. */
function Monogram() {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
      className="size-8 shrink-0 md:size-[37px]"
    >
      <path
        d="M32 3.8 56.4 17.9v28.2L32 60.2 7.6 46.1V17.9L32 3.8Z"
        stroke="currentColor"
        strokeWidth="2.6"
      />
      <path
        d="M23 22v24M23 15.8v1.3M32 46V22h8.3c5.6 0 8.7 3.1 8.7 7.6 0 4.5-3.1 7.5-8.7 7.5H32"
        stroke="var(--primary)"
        strokeWidth="3.7"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
    </svg>
  )
}

/**
 * Sticky site header: monogram brand, section anchors, theme toggle, contact CTA and,
 * below the `md` breakpoint, a disclosure menu that mirrors the same anchors.
 */
export function SiteNav() {
  const [open, setOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)

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
        aria-label="Principal"
        className="mx-auto flex h-16 w-full max-w-(--container-page) items-center px-6 md:h-[69px]"
      >
        <a
          href="#about"
          aria-label="ipepio — inicio"
          className="flex items-center gap-[13px] whitespace-nowrap"
        >
          <Monogram />
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
          {NAV_LINKS.map((link) => (
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
          <a
            href="#contact"
            className="mono hidden h-[39px] items-center gap-[15px] rounded-[10px] bg-primary px-[15px] text-[11px] leading-none font-bold text-primary-foreground hover:brightness-105 motion-safe:transition-transform motion-safe:hover:-translate-y-0.5 md:inline-flex"
          >
            Hablemos
            <span aria-hidden>↗</span>
          </a>
          <button
            ref={menuButtonRef}
            type="button"
            aria-expanded={open}
            aria-controls={MENU_ID}
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
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
            {NAV_LINKS.map((link) => (
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
            href="#contact"
            onClick={closeMenu}
            className="mono mx-6 mb-4 inline-flex h-10 items-center gap-2 rounded-[10px] bg-primary px-4 text-[11px] leading-none font-bold text-primary-foreground"
          >
            Hablemos
            <span aria-hidden>↗</span>
          </a>
        </div>
      ) : null}
    </header>
  )
}
