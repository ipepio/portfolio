/**
 * Playwright configuration for the article's live-preview test (T13: S13).
 *
 * It is separate from the `node --test tests/` suite because it needs a browser, and
 * separate from the repository's root `playwright.config.ts` because that one belongs to the
 * portfolio: this one drives the blog on 3200 and starts no server of its own — both
 * applications are expected to be running already.
 *
 *     npm run test:live-preview
 */
import fs from 'node:fs'
import { homedir } from 'node:os'
import path from 'node:path'

import { defineConfig, devices } from '@playwright/test'

/**
 * The Chromium this machine already has, or `undefined` to let Playwright resolve its own.
 *
 * Playwright launches exactly the browser build its version pins, and a machine whose cache
 * was filled by another version of Playwright has that build under a different revision
 * folder. Nothing here may download a browser, so the newest cached build is used instead;
 * when the pinned one is installed (CI runs `playwright install`), this finds it too.
 */
function cachedChromium() {
  const configured = process.env.PLAYWRIGHT_BROWSERS_PATH?.trim()
  const cache =
    configured && configured !== '0'
      ? configured
      : path.join(
          process.platform === 'darwin'
            ? path.join(homedir(), 'Library', 'Caches')
            : path.join(homedir(), '.cache'),
          'ms-playwright',
        )

  let revisions = []

  try {
    revisions = fs
      .readdirSync(cache)
      .filter((entry) => entry.startsWith('chromium_headless_shell-'))
      .map((entry) => ({ entry, revision: Number(entry.split('-').pop()) }))
      .filter(({ revision }) => Number.isFinite(revision))
      .sort((left, right) => right.revision - left.revision)
  } catch {
    return undefined
  }

  for (const { entry } of revisions) {
    const root = path.join(cache, entry)
    const found = fs
      .readdirSync(root, { recursive: true })
      .map((candidate) => path.join(root, String(candidate)))
      .find((candidate) => /(^|\/)(chrome-)?headless[-_]shell(.exe)?$/.test(candidate))

    if (found !== undefined && fs.existsSync(found)) {
      return found
    }
  }

  return undefined
}

const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE ?? cachedChromium()

export default defineConfig({
  testDir: '.',
  testMatch: 'live-preview.spec.mjs',
  forbidOnly: !!process.env.CI,
  reporter: 'list',
  // Screenshots and traces are a failed run's evidence, never part of the change: they are
  // written outside the worktree.
  outputDir: path.join(
    process.env.TMPDIR?.trim() || '/tmp',
    'blog-live-preview-results',
  ),
  use: {
    trace: 'off',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: executablePath === undefined ? {} : { executablePath },
      },
    },
  ],
})
