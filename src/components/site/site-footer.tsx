import { SocialIcon, socialIconFor } from '@/components/site/social-icon'

import type { FooterCopy } from '@/lib/i18n'
import { BLOG_URL } from '@/lib/site-links'
import type { Contact } from '@/payload-types'

/** The CV is served by this app; `download` makes the browser save it instead of opening it. */
const CV_HREF = '/CV_Isaac_Pepio.pdf'
const CV_FILE = 'CV_Isaac_Pepio.pdf'

const LINK_BASE =
  'mono whitespace-nowrap text-[10px] leading-[1.7] font-[650] transition-colors hover:text-primary'
/** Secondary links: the soft tone, like `.footer-actions a` in the reference. */
const LINK_CLASS = `${LINK_BASE} text-muted`
/**
 * Profile links: the ink tone with the brand glyph, like `.social-footer`. They must not
 * reuse the muted class — Tailwind's order decides between two colour utilities, and the
 * muted one wins, which painted the glyphs grey instead of the row's ink.
 */
const SOCIAL_CLASS = `${LINK_BASE} inline-flex items-center gap-[7px] text-foreground`

export type SiteFooterProps = {
  /** Owner name from the About global; printed uppercase above the brand. */
  name?: string | null
  /** Contact global; its socials become the profile links. */
  contact: Contact
  copy: FooterCopy
}

/**
 * Footer strip from the reference `.footer-bottom`: the copyright line on the left and the
 * profile, CV, journal and back-to-top links on the right, separated by a rule.
 *
 * The year is read on the server, so it never flashes a wrong value on hydration.
 */
export function SiteFooter({ name, contact, copy }: SiteFooterProps) {
  const year = new Date().getFullYear()
  const owner = (name ?? '').trim().toUpperCase()
  const socials = (contact.socials ?? []).filter((social) => social.url?.trim())

  return (
    <footer className="bg-background-elevated px-6 pb-[26px]">
      <div className="mx-auto flex w-full max-w-(--container-page) flex-col items-start gap-3 border-t border-border pt-[29px] md:flex-row md:items-center md:justify-between md:gap-5">
        <p className="mono text-[10px] leading-[1.7] font-[550] text-muted">
          {`© ${year} `}
          {owner ? `${owner} / ` : ''}
          {'IPEPIO. '}
          {copy.made}
        </p>

        <div className="flex flex-wrap items-center gap-x-[18px] gap-y-3 md:justify-end">
          {socials.map((social) => (
            <a
              key={social.url}
              href={social.url ?? '#'}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${social.label ?? 'Social'}: ${owner || 'ipepio'}`}
              className={SOCIAL_CLASS}
            >
              <SocialIcon name={socialIconFor(social.url ?? '')} size={14} tone="inherit" />
              <span className="uppercase">{social.label}</span>
              <span aria-hidden>↗</span>
            </a>
          ))}

          <a href={CV_HREF} download={CV_FILE} className={LINK_CLASS}>
            {copy.cv} <span aria-hidden>↓</span>
          </a>

          <a href={BLOG_URL} className={LINK_CLASS}>
            {copy.blog} <span aria-hidden>↗</span>
          </a>

          <a href="#hero" className={LINK_CLASS}>
            {copy.backToTop} <span aria-hidden>↑</span>
          </a>
        </div>
      </div>
    </footer>
  )
}
