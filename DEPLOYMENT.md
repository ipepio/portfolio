# Deployment

Two applications are deployed from this repository:

| App       | Path        | What it is                                                       |
| --------- | ----------- | ---------------------------------------------------------------- |
| Portfolio | `.`         | Next + Payload (admin, REST API, SQLite database, media uploads) |
| Blog      | `apps/blog` | Next only; it reads Payload over HTTP and owns no database       |

The blog has its own build and its own deploy, so it can ship independently of the
portfolio. It never imports the Payload config; it only consumes `/api`.

## Environment variables

Portfolio (repository root):

| Variable                            | Required | Notes                                                            |
| ----------------------------------- | -------- | ---------------------------------------------------------------- |
| `PAYLOAD_SECRET`                    | yes      | Payload config secret; changing it invalidates sessions          |
| `DATABASE_URI`                      | yes      | `file:./ipepio-portfolio.db` locally, an absolute path on a host |
| `BLOG_URL`                          | yes      | Public blog URL; the hero, About and footer links point at it    |
| `PREVIEW_SECRET`                    | no       | Shared with the blog; without it the `Posts` preview is omitted  |
| `SMTP_HOST` `SMTP_USER` `SMTP_PASS` | no       | Contact form delivery; without all three the route answers 503   |
| `SMTP_PORT` `SMTP_FROM`             | no       | Defaults: port `587`, from `SMTP_USER`                           |
| `TRANSLATION_BASE_URL`              | no       | OpenAI-compatible endpoint root (llama.cpp in dev)               |
| `TRANSLATION_API_KEY`               | no       | Bearer token, only for providers that need one                   |
| `TRANSLATION_MODEL`                 | no       | Model name; without `BASE_URL` + `MODEL` the hook skips silently |

Blog (`apps/blog`):

| Variable         | Required | Notes                                                         |
| ---------------- | -------- | ------------------------------------------------------------- |
| `PAYLOAD_URL`    | yes      | Portfolio origin serving `/api` (default `:3000`)             |
| `PORTFOLIO_URL`  | yes      | Public portfolio URL used for the links back                  |
| `PREVIEW_SECRET` | no       | Same value as the portfolio's; without it there is no preview |

`BLOG_URL`, `PORTFOLIO_URL` and `PAYLOAD_URL` are per-deployment origins, so each app is
pointed at the other from its own environment rather than from shared code. Never commit
these values, and never put them in a file that ships with the image.

## Draft preview of a post

An editor reads an unpublished `posts` entry in the real blog, without publishing it, and
nobody else sees it. Preview exists only when `PREVIEW_SECRET` is set to the **same value**
in both deployments: the portfolio builds the URL with it and the blog is the only side that
validates it. There is no default secret, so an environment without the variable has no
preview at all.

1. Payload's `Posts` collection exposes it in two places, both pointing at the blog's token
   route: the **Preview** action (opens the note in a new tab) and the **live preview**
   panel (the note beside the form). With no `PREVIEW_SECRET` both are omitted, because a
   URL the blog would reject is worse than no button.
2. The URL is `${BLOG_URL}/api/draft?secret=<PREVIEW_SECRET>&slug=<slug>&locale=<locale>`,
   built from `BLOG_URL` so the address is the deployment's own.
3. `apps/blog/src/app/api/draft/route.ts` compares the token in constant-sized terms — a
   missing secret, a wrong secret and a missing slug all answer the same empty `404`, so the
   route never says which part failed — and on a match enables Next's draft mode and
   redirects to `/<locale>/<slug>`.
4. Draft mode is the `__prerender_bypass` cookie Next writes (`HttpOnly`, session lifetime).
   Only then does the article lookup drop Payload's `status` filter and read without caching;
   the index, the archive and the `Siguiente nota` order keep the published filter, so a
   draft never enters the public listing. Every previewed page shows a
   `BORRADOR · VISTA PREVIA` / `DRAFT · PREVIEW` strip.
5. `?exit=1` (the strip's link) deletes the cookie and returns to the index; closing the
   browser ends it too.

The secret is a bearer token for reading drafts: treat it like `PAYLOAD_SECRET`, rotate it by
changing it in both deployments at once, and never expose it to the browser except inside
the admin, where only an authenticated editor can see the Preview URL.

## Commands

Portfolio, from the repository root:

```bash
npm ci
npm run build          # next build (payload build was removed in Payload 3.93)
npm run start          # next start, port 3000
npm run dev            # next dev, port 3000 (schema push, no migration needed)
```

Blog, from `apps/blog`:

```bash
npm ci
npm run build          # next build
npm run start -- -p 3200
npm run dev -- -p 3200
```

## Migrations are part of the deploy

`payload migrate` is the only way schema reaches a deployed database: the sqlite adapter
runs with `push: process.env.NODE_ENV !== 'production'`, so production never pushes and a
schema change that is not in `src/migrations` simply is not applied.

Deploy pipeline, in order:

```bash
npm ci
PAYLOAD_SECRET=… DATABASE_URI=… npx payload migrate   # applies pending migrations
npm run build
npm run start
```

- Migrations live in `src/migrations` (generated with `npx payload migrate:create`) and are
  committed with the code that needs them.
- `npx payload migrate:status` reports which migrations a database has and which are
  pending.
- `PAYLOAD_SECRET` and `DATABASE_URI` must be set for the migrate step: it boots Payload
  against the same database the server will use.
- Run `migrate` before `start`, never after: a migration that fails must stop the deploy
  instead of serving a half-migrated schema.
- Development keeps push, so a local database that was created by push has no migration
  history. Production databases are created by `migrate` and keep that history.
- A database created by push can still be adopted: `npx tsx scripts/adopt-migration.ts
  <migration-name>` records an existing migration as already applied (the one row Payload
  writes after running it), so `migrate` does not try to recreate tables that already exist.
  Never run it on a database that has not actually got that schema.

## Theme cookie across both hosts

The light/dark preference is stored in the `ipepio-theme` cookie by both apps. Write it
with `domain=.ipepio.dev` (for example `path=/; domain=.ipepio.dev; max-age=31536000;
SameSite=Lax`) so the preference set on `www.ipepio.dev` also applies to the blog's host
and does not flip when the reader moves between them.
