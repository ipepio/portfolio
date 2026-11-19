import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Tags } from './collections/Tags'
import { Experience } from './collections/Experience'
import { Projects } from './collections/Projects'
import { Posts } from './collections/Posts'
import { About } from './globals/About'
import { Contact } from './globals/Contact'
import { Expertise } from './globals/Expertise'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

/**
 * SMTP delivery is configured only from the environment. Without `SMTP_HOST`,
 * `SMTP_USER` and `SMTP_PASS` no adapter is registered at all, so the app boots (and the
 * site renders) exactly as before and the contact endpoint answers 503 instead of
 * pretending the message was sent.
 */
const smtpHost = process.env.SMTP_HOST?.trim()
const smtpUser = process.env.SMTP_USER?.trim()
const smtpPass = process.env.SMTP_PASS
const smtpPort = Number(process.env.SMTP_PORT?.trim() || '587')

const smtpFrom = process.env.SMTP_FROM?.trim() || smtpUser

const smtpConfigured = Boolean(smtpHost && smtpUser && smtpPass)

const email = smtpConfigured
  ? nodemailerAdapter({
      defaultFromAddress: smtpFrom as string,
      defaultFromName: 'Isaac Pepió',
      // No transport.verify() at boot: a slow or unreachable mailbox must not delay or
      // fail the server start. Delivery errors surface per request, in the contact route.
      skipVerify: true,
      transportOptions: {
        host: smtpHost,
        port: Number.isFinite(smtpPort) ? smtpPort : 587,
        secure: smtpPort === 465,
        auth: { user: smtpUser as string, pass: smtpPass as string },
      },
    })
  : undefined

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Tags, Experience, Projects, Posts],
  globals: [About, Contact, Expertise],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URI || 'file:./ipepio-portfolio.db',
    },
    /**
     * Development keeps Payload's schema push, so iterating on fields needs no migration.
     * Production never pushes: a deploy applies the versioned migrations in `src/migrations`
     * (`payload migrate`, see DEPLOYMENT.md), so the deployed schema only ever changes
     * through a migration that is reviewed with the code.
     */
    push: process.env.NODE_ENV !== 'production',
  }),
  localization: {
    locales: [
      { code: 'es', label: 'Español' },
      { code: 'en', label: 'English' },
    ],
    fallback: true,
    defaultLocale: 'es',
  },
  // Registered only when the SMTP variables exist; absent otherwise, which is what the
  // contact route checks before it accepts a message.
  ...(email ? { email } : {}),
})
