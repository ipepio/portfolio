import { ContactForm } from '@/components/site/contact-form'
import { SocialIcon, socialIconFor, socialHandle } from '@/components/site/social-icon'
import { SectionSeparator } from '@/components/site/section-separator'

import type { Contact } from '@/payload-types'
import type { ContactCopy } from '@/lib/i18n'

export type ContactSectionProps = {
  /** Contact global; only its socials feed this section (the destination is server-side). */
  contact: Contact
  /** Localized chrome of section 05 (dictionary `contact` slice). */
  copy: ContactCopy
  /** Person the profiles belong to; completes each link's accessible name. */
  ownerName?: string
}

const HEADING_ID = 'contact-section-heading'

/**
 * Section 05 (Contacto), copied from the reference `footer.contact` of
 * `/Users/ipepio/Desktop/portfolio_ipepio_experiencia_separada.html`: the `contact-top`
 * two-column grid — eyebrow, display heading over two lines with the accent tail, the
 * description, the `ENCUÉNTRAME TAMBIÉN EN` label and the `social-grid` of `.social-link`
 * cards — next to the contact form card.
 *
 * Every measurement of the reference CSS is kept; only its variables are mapped onto the
 * app tokens: `--bg`→`background`, `--surface`/`--card`→`card`,
 * `--bg-elevated`→`background-elevated`, `--line`/`--border`→`border`,
 * `--border-strong`→`input`, `--muted`→`muted-foreground`, `--soft`→`muted`,
 * `--fg`/`--ink`→`foreground`, `--accent`→`primary`, `--accent-soft`→`primary` at 10%,
 * `--peach`→`peach`.
 *
 * The socials come from the `contact` global (label and url), so the list is editable in
 * Payload: a new row renders without touching this component.
 *
 * The form is the client component `ContactForm`, which reads its own copy from
 * `useDictionary()`; the destination address is never passed to the browser: the route
 * reads it from the `contact` global on every request.
 */
export function ContactSection({ contact, copy, ownerName }: ContactSectionProps) {
  const socials = (contact.socials ?? []).filter((social) => social.url?.trim())

  return (
    <section
      id="contact"
      aria-labelledby={HEADING_ID}
      className="relative bg-background-elevated px-6 pt-[100px] pb-11 min-[781px]:pt-[120px]"
    >
      {/* Centred on the section's top edge, so the rules land exactly on the surface change. */}
      <SectionSeparator className="pointer-events-none absolute inset-x-0 top-0 z-[1] -translate-y-1/2" />
      <div className="mx-auto grid w-full max-w-(--container-page) grid-cols-1 items-start gap-10 pb-[70px] min-[781px]:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] min-[781px]:gap-9 min-[781px]:pb-[93px] min-[1021px]:gap-[clamp(40px,7vw,110px)]">
        <div>
          <p className="eyebrow">{copy.eyebrow}</p>

          <h2
            id={HEADING_ID}
            className="mt-[22px] max-w-[650px] font-heading text-[clamp(59px,15vw,80px)] leading-[0.93] font-bold tracking-[-0.085em] min-[521px]:text-[clamp(61px,8vw,112px)]"
          >
            {copy.heading}
            <br />
            <span className="text-primary">{copy.headingAccent}</span>
          </h2>

          <div className="max-w-[620px] pt-2 min-[781px]:max-w-none">
            <p className="mt-0 mb-7 max-w-[530px] text-[15px] leading-[1.7] text-muted-foreground">
              {copy.description}
            </p>

            {socials.length > 0 ? (
              <>
                <div className="mono mt-[14px] mb-[11px] text-[10px] leading-[1.4] font-bold tracking-[0.1em] text-muted uppercase">
                  {copy.findMe}
                </div>

                <div className="grid max-w-[440px] grid-cols-2 gap-2.5">
                  {socials.map((social, index) => {
                    const handle = socialHandle(social.url ?? '')
                    const accessibleName = ownerName
                      ? `${social.label}: ${ownerName}`
                      : `${social.label}: ${handle}`

                    return (
                      <a
                        key={social.id ?? `${social.label}-${index}`}
                        href={social.url ?? ''}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={accessibleName}
                        className="group flex min-w-0 items-center gap-2.5 rounded-[11px] border border-border bg-card px-3.5 py-[15px] text-foreground transition-[background-color,border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-primary hover:bg-[color-mix(in_srgb,var(--primary)_10%,transparent)] max-[520px]:gap-[7px] max-[520px]:px-2.5 max-[520px]:py-3"
                      >
                        <SocialIcon name={socialIconFor(social.url ?? '')} />

                        <span className="flex min-w-0 flex-col gap-[3px]">
                          <strong className="text-[12px] leading-[1.2] font-bold">
                            {social.label}
                          </strong>
                          <small className="mono truncate text-[9px] leading-[1.3] font-medium text-muted max-[520px]:text-[8px]">
                            {handle}
                          </small>
                        </span>

                        <span
                          aria-hidden="true"
                          className="mono ml-auto flex-none text-[13px] leading-none font-bold text-muted transition-colors group-hover:text-primary"
                        >
                          ↗
                        </span>
                      </a>
                    )
                  })}
                </div>
              </>
            ) : null}
          </div>
        </div>

        {/* Inside `LocaleProvider`: the form reads its own copy from the dictionary. */}
        <ContactForm />
      </div>
    </section>
  )
}
