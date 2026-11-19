import { NextResponse } from 'next/server'

import { getPayloadUrl } from '@/lib/payload'

/** Health is never cached: it reports the configuration the process is actually using. */
export const dynamic = 'force-dynamic'

/**
 * Liveness plus the Payload base URL in use, so a broken connection between the two
 * applications is diagnosable with one request.
 */
export function GET() {
  return NextResponse.json({
    status: 'ok',
    app: '@ipepio/blog',
    payloadUrl: getPayloadUrl(),
    endpoint: `${getPayloadUrl()}/api/posts`,
  })
}
