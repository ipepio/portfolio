'use client'

import { useState, type FormEvent } from 'react'

import { useDictionary } from '@/lib/locale-context'

/** The four states the form can be in. */
type ContactFormState =
  | { status: 'idle' }
  | { status: 'sending' }
  | { status: 'sent' }
  | { status: 'error'; reason: 'invalid' | 'notConfigured' | 'failed' }

/** Where the form posts; the route reads the destination from the `contact` global. */
const ENDPOINT = '/api/contact'

const FIELD_CLASS =
  'w-full rounded-[9px] border border-border bg-background-elevated px-[13px] py-3 text-[13px] leading-[1.5] font-medium text-foreground outline-hidden transition-[border-color,box-shadow] duration-200 placeholder:text-muted focus:border-primary focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--primary)_10%,transparent)]'

const LABEL_CLASS =
  'mono text-[10px] leading-[1.5] font-bold tracking-[0.05em] text-muted-foreground uppercase'

const FIELD_WRAPPER_CLASS = 'mb-[15px] flex min-w-0 flex-col gap-2'

const STATUS_CLASS =
  'mono mt-[13px] mb-0 rounded-[9px] border px-3 py-[11px] text-[11px] leading-[1.6] font-semibold'

/**
 * Error responses of `POST /api/contact`, mapped onto the localized message the form
 * announces. The route owns validation; the client only translates its codes.
 */
function reasonForCode(code: string | undefined): 'invalid' | 'notConfigured' | 'failed' {
  if (code === 'email_not_configured' || code === 'recipient_not_configured') {
    return 'notConfigured'
  }

  if (code === 'invalid_input' || code === 'invalid_payload') {
    return 'invalid'
  }

  return 'failed'
}

/**
 * The contact form of section 05, copied from the reference `footer.contact` form: card
 * header with the three-diamond indicator, name/email row, message textarea, the visually
 * hidden `website` honeypot and the submit action.
 *
 * It is a client component inside `LocaleProvider`: it owns a request state
 * (`idle` → `sending` → `sent` or `error`) and reads its copy from
 * `useDictionary().contact.form`, so it takes no props at all. The submit button is
 * disabled while sending and every outcome is announced in the `aria-live` status
 * region. Native `required`/`type`/`minlength` give immediate feedback; the route remains
 * the authority and its rejection codes pick the message.
 *
 * Reference variables mapped onto app tokens: `--card`→`card`, `--border`→`border`,
 * `--border-strong`→`input`, `--bg-elevated`→`background-elevated`, `--ink`→`foreground`,
 * `--muted`→`muted-foreground`, `--soft`→`muted`, `--accent`→`primary`,
 * `--accent-soft`→`primary` at 10%, `--peach`→`peach`.
 */
export function ContactForm() {
  const copy = useDictionary().contact.form
  const [state, setState] = useState<ContactFormState>({ status: 'idle' })

  const isSending = state.status === 'sending'

  const message =
    state.status === 'sent'
      ? copy.sent
      : state.status === 'error'
        ? state.reason === 'invalid'
          ? copy.invalid
          : state.reason === 'notConfigured'
            ? copy.notConfigured
            : copy.error
        : ''

  const kind = state.status === 'sent' ? 'success' : 'error'

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (isSending) {
      return
    }

    const form = event.currentTarget
    const data = new FormData(form)

    const body = {
      name: String(data.get('name') ?? '').trim(),
      email: String(data.get('email') ?? '').trim(),
      message: String(data.get('message') ?? '').trim(),
      website: String(data.get('website') ?? '').trim(),
    }

    setState({ status: 'sending' })

    try {
      const response = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        const error = (await response.json().catch(() => null)) as { error?: string } | null

        setState({ status: 'error', reason: reasonForCode(error?.error) })

        return
      }

      form.reset()
      setState({ status: 'sent' })
    } catch {
      setState({ status: 'error', reason: 'failed' })
    }
  }

  return (
    <form
      aria-labelledby="contact-form-title"
      className="relative overflow-hidden rounded-[18px] border border-input bg-card p-[19px_16px] min-[521px]:p-[21px] min-[1021px]:p-[26px] before:absolute before:top-0 before:right-0 before:h-px before:w-[170px] before:bg-primary before:content-['']"
      onSubmit={handleSubmit}
    >
      <div className="mb-[25px] flex items-start justify-between gap-4">
        <div>
          <h3
            id="contact-form-title"
            className="mt-0 mb-[5px] text-[20px] font-[650] tracking-[-0.045em]"
          >
            {copy.title}
          </h3>
          <p className="mono m-0 text-[10px] leading-[1.6] font-medium text-muted">
            {copy.subtitle}
          </p>
        </div>

        <div aria-hidden="true" className="flex gap-1.5 pt-[7px]">
          <span className="block size-[7px] rotate-45 rounded-[2px] border border-primary bg-primary" />
          <span className="block size-[7px] rotate-45 rounded-[2px] border border-input" />
          <span className="block size-[7px] rotate-45 rounded-[2px] border border-input" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-0 min-[1021px]:grid-cols-2 min-[1021px]:gap-[14px]">
        <div className={FIELD_WRAPPER_CLASS}>
          <label htmlFor="contactName" className={LABEL_CLASS}>
            {copy.nameLabel}
          </label>
          <input
            id="contactName"
            name="name"
            type="text"
            required
            maxLength={120}
            autoComplete="name"
            placeholder={copy.namePlaceholder}
            className={FIELD_CLASS}
          />
        </div>

        <div className={FIELD_WRAPPER_CLASS}>
          <label htmlFor="contactEmail" className={LABEL_CLASS}>
            {copy.emailLabel}
          </label>
          <input
            id="contactEmail"
            name="email"
            type="email"
            required
            maxLength={254}
            autoComplete="email"
            inputMode="email"
            placeholder={copy.emailPlaceholder}
            className={FIELD_CLASS}
          />
        </div>
      </div>

      <div className={FIELD_WRAPPER_CLASS}>
        <label htmlFor="contactMessage" className={LABEL_CLASS}>
          {copy.messageLabel}
        </label>
        <textarea
          id="contactMessage"
          name="message"
          required
          minLength={15}
          maxLength={4000}
          placeholder={copy.messagePlaceholder}
          className={`${FIELD_CLASS} min-h-[130px] max-h-[360px] resize-y`}
        />
      </div>

      {/* Honeypot: invisible to people, irresistible to bots. Never focusable. */}
      <div aria-hidden="true" className="pointer-events-none absolute -left-[9999px] opacity-0">
        <label htmlFor="contactWebsite">Website</label>
        <input id="contactWebsite" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-[14px] pt-[7px] max-[520px]:items-stretch">
        <button
          type="submit"
          disabled={isSending}
          className="inline-flex min-h-[46px] w-full cursor-pointer items-center justify-center gap-5 rounded-[11px] border border-primary bg-primary px-[19px] text-[12px] font-[750] text-primary-foreground transition-[filter,transform] duration-200 hover:-translate-y-0.5 hover:brightness-105 disabled:cursor-wait disabled:opacity-65 disabled:hover:translate-y-0 min-[521px]:w-auto"
        >
          <span>{isSending ? copy.sending : copy.send}</span>
          <span aria-hidden="true">↗</span>
        </button>
      </div>

      <p
        role="status"
        aria-live="polite"
        aria-atomic="true"
        data-kind={message ? kind : undefined}
        className={
          message
            ? `${STATUS_CLASS} ${
                kind === 'success'
                  ? 'border-primary bg-[color-mix(in_srgb,var(--primary)_10%,transparent)] text-foreground'
                  : 'border-peach text-foreground'
              }`
            : 'sr-only'
        }
      >
        {message}
      </p>
    </form>
  )
}
