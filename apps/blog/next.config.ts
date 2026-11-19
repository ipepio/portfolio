import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

/**
 * The blog is its own Next application: it never imports the Payload config, so it needs
 * no plugin here. It only reads the Payload API over HTTP (see `src/lib/payload.ts`).
 *
 * `turbopack.root` is pinned to this package. The repository root also has a lockfile, so
 * without it Turbopack infers the monorepo root as the workspace and compiles the portfolio
 * app's `src/middleware.ts` and routes into the blog build.
 */
const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(dirname),
  },
}

export default nextConfig
