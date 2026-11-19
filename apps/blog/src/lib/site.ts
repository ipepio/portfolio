/**
 * Outbound links the blog owns: the journal lives in its own deploy, so every link out of
 * it is built here and can be pointed at another host from the environment.
 */

/**
 * The portfolio the blog belongs to. `PORTFOLIO_URL` points it at the deployed site; the
 * default is the local dev server, so both apps work together with no configuration.
 *
 * It is deliberately separate from `PAYLOAD_URL` (`@/lib/payload`): the content API and the
 * public site are different deployments in production even when they share a host in dev.
 */
export function getPortfolioUrl(): string {
  const configured = process.env.PORTFOLIO_URL?.trim()

  return (configured && configured.length > 0 ? configured : 'http://localhost:3000').replace(
    /\/+$/,
    '',
  )
}
