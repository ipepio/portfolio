import { ContactForm } from '@/components/site/contact-form'

import type { Contact } from '@/payload-types'
import type { ContactLabels } from '@/lib/i18n'

export type ContactSectionProps = {
  /** Contact global; only its socials feed this section (the destination is server-side). */
  contact: Contact
  /** Copy for section 05, including the form chrome and its states. */
  copy: ContactLabels
}

const HEADING_ID = 'contact-section-heading'

/**
 * The GitHub link of the copy column. It comes from the `contact` global's socials instead
 * of being hardcoded; without one the section simply omits the link.
 */
function githubUrl(contact: Contact): string | null {
  const socials = contact.socials ?? []
  const github = socials.find((social) => social.url && /github\.com/i.test(social.url))

  return github?.url?.trim() || null
}

/**
 * Section 05 (Contacto), copied from the reference `footer.contact` of
 * `/Users/ipepio/Desktop/portfolio_ipepio_experiencia_contacto.html`: the `contact-top`
 * two-column grid — eyebrow, display heading over two lines with the accent tail, the
 * description and the `contact-social` GitHub link — next to the contact form card.
 *
 * Every measurement of the reference CSS is kept; only its variables are mapped onto the
 * app tokens: `--bg`→`background`, `--surface`/`--card`→`card`,
 * `--bg-elevated`→`background-elevated`, `--line`/`--border`→`border`,
 * `--border-strong`→`input`, `--muted`→`muted-foreground`, `--soft`→`muted`,
 * `--fg`/`--ink`→`foreground`, `--accent`→`primary`, `--accent-soft`→`primary` at 10%,
 * `--peach`→`peach`.
 *
 * The form is the client component `ContactForm`; the destination address is never passed
 * to the browser: the route reads it from the `contact` global on every request.
 */
export function ContactSection({ contact, copy }: ContactSectionProps) {
  const github = githubUrl(contact)

  return (
    <section
      id="contact"
      aria-labelledby={HEADING_ID}
      className="px-6 pt-[100px] pb-11 min-[781px]:pt-[120px]"
    >
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

            {github ? (
              <div className="mono flex items-center gap-2.5 text-[10px] leading-[1.5] font-[650] text-muted-foreground">
                <a
                  href={github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border-b border-input py-[9px] transition-colors hover:text-primary"
                >
                  <span>{copy.github}</span>
                  <span aria-hidden="true">↗</span>
                </a>
              </div>
            ) : null}
          </div>
        </div>

        <ContactForm copy={copy.form} />
      </div>
    </section>
  )
}
