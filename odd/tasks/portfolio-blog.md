# portfolio-blog

Add the blog from `/Users/ipepio/Desktop/portfolio_y_blog_ipepio` as a second application, feed it from a new Payload collection, and translate entries automatically with an LLM.

## Specs

S1. `será un blog, /Users/ipepio/Desktop/portfolio_y_blog_ipepio ahí tienes el blog` — the blog is copied from that folder's `blog.html`: breadcrumb `IPEPIO / JOURNAL`, its own hero (`Cosas que me rondan.` / `Things on my mind.` plus the lead paragraph and the code aside), a featured post (`journal-feature`), the archive `En el radar.` with its note counter, the article page (title, subtitle, byline, cover, sidebar index of sections, body with code block, blockquote and editorial note, and `Siguiente nota`), and the footer.

S2. `se accederá mediante un botón en el hero (mira como queda en el html de portfolio)`. The reference `index.html` has three entries, all needed: the hero button (`hero.blog`: `Blog / Mis movidas` / `Blog / Field notes`), the About link (`about.blog`: `Leo, pruebo, rompo y escribo sobre ello en el blog.`), and the footer link (`footer.blog`: `BLOG / JOURNAL ↗`).

S3. `Tendrá paginación de lo que está "en el radar" ya que lo más antiguo se puede quedar` — the archive is paginated and older entries stay reachable through later pages; nothing is dropped.

S4. `necesitamos adaptar payload para añadir las nuevas entradas` — a `posts` collection with: `title`, `slug`, `subtitle`, `excerpt`, `body` (rich text), `cover`, `category`, `readMinutes`, `publishedAt`, `status` (draft/published), `featured`. Localized: `title`, `subtitle`, `excerpt`, `body`, `category`. Not localized: slug, cover, readMinutes, publishedAt, status, featured.

S5. `quiero añadir un plugin de traducción automática vía IA en payload` — a hook on `posts` that translates the source locale into the other one. Decision: it runs **automatically on save**, but never overwrites text a human edited: it only fills a target field that is empty or still matches the last text it produced (tracked by a hash).

S6. The translation transport is configured from the environment (`TRANSLATION_BASE_URL`, `TRANSLATION_API_KEY`, `TRANSLATION_MODEL`): the homelab llama.cpp in development and a hosted provider in the deploy. With no configuration the hook must skip silently, never block the save, and never half-write.

S7. Rich text is Lexical: the hook translates node by node (prose and headings), never by serialising the whole document to a string, so formatting, links and code blocks survive. Code blocks are copied verbatim, not translated.

S8. The blog is a second Next application that consumes Payload over HTTP. It shares the visual system and the es/en locale contract but has its own build and deploy.

S9. Every new user-visible string exists in both locales.

S10. `falta el header para cambiar idioma, ir al portfolio, cambiar el tema`: the blog gets its own sticky header with the journal identity, a link to the journal index, a link back to the portfolio, a light/dark theme toggle that survives a reload without a flash, and a language switch that lands on the equivalent page in the other locale (index, archive page and article all included). The theme cookie is shared with the portfolio (`ipepio-theme`) so the preference does not flip when moving between the two apps.

S11. `si no tenemos ruta, da un 404, tenemos que solventarlo`: an unknown route must land on a designed page, not on the framework default. It keeps the header and footer, states that the note does not exist in the reader's language, and offers the way back: the journal index and the featured note. It must not expose a bare browser 404.

S12. `como hago para previsualizar los post?` — a draft must be readable before publishing, in the real blog, without making it public. The admin gets a Preview action and a live preview panel; the blog enters Next draft mode through a token route, renders drafts only inside that mode, shows a strip that says so, and offers the way out. The token comes from `PREVIEW_SECRET`; with no secret configured, preview does not exist at all (the route answers 404 and the admin shows no preview action) — there is no default secret.

## Tasks

- T1 — `posts` collection, generated types and six sample entries transcribed from the reference — S4, S9
- T2 — second application skeleton (`apps/blog`) with its own build, reading Payload over HTTP — S8
- T3 — blog index: hero, featured post and the paginated `En el radar` archive — S1, S3
- T4 — article page with sidebar index and `Siguiente nota` — S1
- T5 — the three entries in the portfolio (hero, About, footer) — S2
- T6 — automatic translation hook with the edit-safety and no-block guarantees — S5, S6, S7
- T7 — versioned Payload migrations and deploy readiness, with a database backup first — prerequisite for shipping
- T8 — blog header: identity, journal index, portfolio link, theme toggle and language switch — S10
- T9 — designed 404 that keeps the shell and offers a way back — S11
- T12 — draft preview: admin action, live preview panel, draft-mode token route and preview strip — S12
- T13 — verification per task: both locales, pagination edges, and a translated post end to end

## Log

L1 (verbatim): «Vale, limpia un poco payload, y ahora vamos a meter una nueva aplicación, vale? será un blog, /Users/ipepio/Desktop/portfolio_y_blog_ipepio ahí tienes el blog, se accederá mediante un botón en el hero (mira como queda en el html de portfolio) el blog me gusta como ha quedado. Tendrá paginación de lo que está "en el radar" ya que lo más antiguo se puede quedar. necesitamos adaptar payload para añadir las nuevas entradas. además, quiero añadir un plugin de traducción automática vía IA en payload. ¿Que necesitamos=»

L2: decision — the blog lives in its own Next application with its own deploy, sharing Payload over HTTP.
L3: decision — translation runs automatically on save and never overwrites human edits.
L4: decision — translation provider is chosen by environment: homelab llama.cpp in dev, hosted provider in the deploy.
L5: decision — Payload cleanup approved and done (`36a8f5e`): About dead fields, `Folders`, MCP plugin.
L6: deviation, for the record — the existing portfolio app stays at the repository root instead of moving to `apps/portfolio`. Reason: the app loads its secrets from a `.env` at its own root, this session cannot create or move environment files, and relocating the app would break the running project with a failure I could not repair. The blog is added as `apps/blog` with its own build and deploy, which satisfies the two-deploy outcome without a migration that risks the working app. Moving the portfolio later is a mechanical change.
L7: note — the project has no versioned migrations (dev push only, and the last push crashed and was reconciled by hand). Migrations are a prerequisite before the first deploy of the blog schema, tracked as T7.
L8 (verbatim): «vale, si no tenemos ruta, da un 404, tenemos que solventarlo eso. También falta el header para cambiar idioma, ir al portoflio, cambiar el tema»
L9 (verbatim): «y cuando edito un post? también se traduce? como hago para previsualizar los post?» followed by «si, montalo»: editing translates too (already implemented, `afterChange`); draft preview is built as T12.
