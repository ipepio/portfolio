import { ArrowUpRight } from 'lucide-react'

import type { Contact } from '@/payload-types'

export type ContactSectionProps = {
  contact: Contact
  /** Section eyebrow, e.g. "04 / CONTACTO". */
  eyebrow: string
  /** Display heading, e.g. "¿Hablamos?". */
  heading: string
}

const HEADING_ID = 'contact-section-heading'

function isExternal(url: string) {
  return /^https?:\/\//i.test(url)
}

/**
 * Presentational Contact section: eyebrow, display heading, primary email link,
 * muted phone link and every social as an outline link.
 */
export function ContactSection({ contact, eyebrow, heading }: ContactSectionProps) {
  const email = contact.email?.trim() || null
  const phone = contact.phone?.trim() || null
  const socials = (contact.socials ?? []).filter((social) => social.label && social.url)

  return (
    <section
      id="contact"
      aria-labelledby={HEADING_ID}
      className="scroll-mt-24 px-6 pt-4 pb-20 sm:pb-24 lg:pb-28"
    >
      <div className="mx-auto flex w-full max-w-(--container-page) flex-col gap-10 lg:gap-12">
        <header className="flex flex-col gap-5">
          <span className="eyebrow">{eyebrow}</span>
          <h2
            id={HEADING_ID}
            className="font-heading text-[clamp(38px,4.5vw,64px)] font-bold leading-[1.03] tracking-[-0.06em] text-balance"
          >
            {heading}
          </h2>
        </header>

        {email || phone ? (
          <div className="flex flex-col gap-2">
            {email ? (
              <a
                href={`mailto:${email}`}
                className="font-heading w-fit max-w-full text-[clamp(20px,3vw,34px)] font-semibold leading-tight tracking-[-0.04em] break-all text-primary underline-offset-4 hover:underline"
              >
                {email}
              </a>
            ) : null}
            {phone ? (
              <a
                href={`tel:${phone.replace(/[^\d+]/g, '')}`}
                className="mono w-fit text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              >
                {phone}
              </a>
            ) : null}
          </div>
        ) : null}

        {socials.length > 0 ? (
          <ul role="list" className="flex flex-wrap gap-3">
            {socials.map((social, index) => {
              const external = isExternal(social.url)

              return (
                <li key={social.id ?? `${social.label}-${index}`}>
                  <a
                    href={social.url}
                    target={external ? '_blank' : undefined}
                    rel={external ? 'noopener noreferrer' : undefined}
                    className="mono inline-flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-[11px] uppercase leading-none tracking-[0.16em] text-muted-foreground transition-colors hover:border-primary/60 hover:text-foreground"
                  >
                    {social.label}
                    {external ? <ArrowUpRight aria-hidden className="size-3.5" /> : null}
                  </a>
                </li>
              )
            })}
          </ul>
        ) : null}
      </div>
    </section>
  )
}
