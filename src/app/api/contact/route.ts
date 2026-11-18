import config from '@payload-config'
import { getPayload } from 'payload'

/**
 * POST /api/contact — the delivery endpoint of section 05.
 *
 * The destination is never hardcoded: it is the `email` of the `contact` global, read with
 * the Local API. Delivery goes through `payload.sendEmail` and therefore through the
 * nodemailer adapter registered in `payload.config.ts`, which only exists when the SMTP
 * environment variables do. Without a transport (or without a destination) the route
 * answers 503 instead of pretending the message was sent.
 *
 * Validation lives here, not in the client: a 400 always carries a machine-readable
 * `error` code that the form maps onto a localized message.
 */

/** Required fields of the form, in the order they are reported. */
type Field = 'name' | 'email' | 'message'

const NAME_MAX = 120
const EMAIL_MAX = 254
const MESSAGE_MIN = 15
const MESSAGE_MAX = 4000

/** Deliberately loose: `a@b.co`, no whitespace, a dotted domain with a real TLD. */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

type InvalidFields = Partial<Record<Field, 'required' | 'invalid' | 'too_long' | 'too_short'>>

type ContactPayload = {
  name: string
  email: string
  message: string
  website: string
}

function json(status: number, body: unknown) {
  return Response.json(body, { status })
}

function readString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

/**
 * Parses the JSON body into the four accepted fields. Anything that is not a JSON object
 * is rejected; unknown keys are ignored.
 */
function parseBody(raw: unknown): ContactPayload | null {
  if (typeof raw !== 'object' || raw === null) {
    return null
  }

  const body = raw as Record<string, unknown>

  return {
    name: readString(body.name),
    email: readString(body.email),
    message: readString(body.message),
    website: readString(body.website),
  }
}

function validate({ name, email, message }: ContactPayload): InvalidFields {
  const errors: InvalidFields = {}

  if (!name) {
    errors.name = 'required'
  } else if (name.length > NAME_MAX) {
    errors.name = 'too_long'
  }

  if (!email) {
    errors.email = 'required'
  } else if (email.length > EMAIL_MAX || !EMAIL_PATTERN.test(email)) {
    errors.email = 'invalid'
  }

  if (!message) {
    errors.message = 'required'
  } else if (message.length < MESSAGE_MIN) {
    errors.message = 'too_short'
  } else if (message.length > MESSAGE_MAX) {
    errors.message = 'too_long'
  }

  return errors
}

export async function POST(request: Request) {
  let raw: unknown

  try {
    raw = await request.json()
  } catch {
    return json(400, { error: 'invalid_payload' })
  }

  const payloadBody = parseBody(raw)

  if (!payloadBody) {
    return json(400, { error: 'invalid_payload' })
  }

  // Honeypot: a human never sees this field. Answer 200 and drop the message so a bot
  // cannot tell whether it got through; nothing is read, logged or sent.
  if (payloadBody.website) {
    return json(200, { ok: true })
  }

  const invalidFields = validate(payloadBody)

  if (Object.keys(invalidFields).length > 0) {
    return json(400, { error: 'invalid_input', fields: invalidFields })
  }

  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  // No SMTP variables at boot means no adapter was registered; Payload would otherwise
  // fall back to its console adapter and swallow the message silently.
  if (!payloadConfig.email) {
    console.error(
      '[contact] Email is not configured: set SMTP_HOST, SMTP_PORT, SMTP_USER and SMTP_PASS (optional SMTP_FROM). The message was NOT sent.',
    )

    return json(503, {
      error: 'email_not_configured',
      message:
        'Email delivery is not configured on the server. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS and optionally SMTP_FROM.',
    })
  }

  const contact = await payload.findGlobal({ slug: 'contact', depth: 0 })
  const recipient = contact.email?.trim()

  if (!recipient) {
    console.error(
      '[contact] The `contact` global has no email address, so there is nowhere to deliver the message. The message was NOT sent.',
    )

    return json(503, {
      error: 'recipient_not_configured',
      message: 'The contact global has no email address configured.',
    })
  }

  const { name, email, message } = payloadBody

  const text = [`Nombre: ${name}`, `Email: ${email}`, '', message].join('\n')

  try {
    await payload.sendEmail({
      to: recipient,
      replyTo: email,
      subject: `Nuevo mensaje de ${name}`,
      text,
    })
  } catch (error) {
    console.error('[contact] The email could not be delivered:', error)

    return json(502, { error: 'send_failed' })
  }

  return json(200, { ok: true })
}
