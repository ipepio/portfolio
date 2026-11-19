import { ContactForm } from '@/components/site/contact-form'
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

type SocialIconName = 'github' | 'linkedin'

/** The `d` of each brand glyph, verbatim from the reference `.social-link` icons. */
const SOCIAL_ICON_PATHS: Record<SocialIconName, string> = {
  github:
    'M12 .95a11.05 11.05 0 0 0-3.49 21.53c.55.1.75-.24.75-.54v-2.1c-3.06.67-3.7-1.3-3.7-1.3-.5-1.29-1.23-1.63-1.23-1.63-1-.69.08-.67.08-.67 1.11.08 1.7 1.14 1.7 1.14.98 1.68 2.58 1.19 3.21.91.1-.71.38-1.19.7-1.46-2.44-.28-5.01-1.22-5.01-5.47 0-1.21.43-2.2 1.14-2.97-.11-.28-.49-1.4.11-2.92 0 0 .93-.3 3.04 1.13A10.56 10.56 0 0 1 12 6.3c.94 0 1.88.13 2.76.37 2.11-1.43 3.04-1.13 3.04-1.13.6 1.52.22 2.64.11 2.92.71.77 1.14 1.76 1.14 2.97 0 4.26-2.57 5.19-5.02 5.46.4.34.75 1.01.75 2.03v3.02c0 .3.2.65.75.54A11.05 11.05 0 0 0 12 .95Z',
  linkedin:
    'M20.45 2H3.55C2.7 2 2 2.67 2 3.5v17C2 21.33 2.7 22 3.55 22h16.9c.85 0 1.55-.67 1.55-1.5v-17c0-.83-.7-1.5-1.55-1.5ZM7.94 18.75H4.97V9.2h2.97v9.55ZM6.45 7.9a1.72 1.72 0 1 1 0-3.44 1.72 1.72 0 0 1 0 3.44Zm12.3 10.85h-2.97V14.1c0-1.11-.02-2.53-1.54-2.53-1.55 0-1.79 1.21-1.79 2.45v4.73H9.48V9.2h2.85v1.3h.04c.4-.75 1.37-1.54 2.82-1.54 3.02 0 3.56 1.98 3.56 4.54v5.25Z',
}

/**
 * The brand glyph of a social, picked by the host of its url: `github.com` → GitHub,
 * `linkedin.com` → LinkedIn. Any other host has no glyph of its own and gets a neutral
 * link icon, so a new social never renders an empty or broken slot.
 */
function socialIconFor(url: string): SocialIconName | null {
  let host: string

  try {
    host = new URL(url.trim()).hostname.toLowerCase().replace(/^www\./, '')
  } catch {
    return null
  }

  if (host === 'github.com') return 'github'
  if (host === 'linkedin.com') return 'linkedin'

  return null
}

/**
 * The mono handle under the label, derived from the url the way the reference writes it:
 * no protocol, no `www.`, no trailing slash (`https://www.linkedin.com/in/ipepio/` →
 * `linkedin.com/in/ipepio`).
 */
function socialHandle(url: string): string {
  return url
    .trim()
    .replace(/^https?:\/\//i, '')
    .replace(/^www\./i, '')
    .replace(/\/+$/, '')
}

/** Brand glyph when known, neutral link glyph otherwise. Decorative in both cases. */
function SocialIcon({ name }: { name: SocialIconName | null }) {
  if (!name) {
    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="size-[18px] flex-none fill-none stroke-current text-primary [stroke-linecap:round] [stroke-linejoin:round] [stroke-width:1.8]"
      >
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </svg>
    )
  }

  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className="size-[18px] flex-none text-primary"
    >
      <path d={SOCIAL_ICON_PATHS[name]} />
    </svg>
  )
}

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
