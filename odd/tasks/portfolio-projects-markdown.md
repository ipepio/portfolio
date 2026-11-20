# portfolio-projects-markdown

Turn the project's long description into a raw markdown field and bring the blog's live preview to the project detail page.

Branch: `main` (remote `origin` configured).

## Specs

S1. `haz que el campo "Descripción larga" sea un input crudo de markdown`: `projects.longDescription` becomes a `textarea` (still localized) holding raw markdown the owner writes. No editor chrome: what is typed is what is stored. The field description in the admin explains the supported syntax, including fenced code blocks and ```mermaid diagrams.

S2. `por si meto diagramas o cualquier cosa`: the detail page renders that markdown. Headings, paragraphs, lists, emphasis, links and fenced code blocks render styled to match the site's reading design. A fenced ` ```mermaid ` block renders as a diagram, not as code, through a client component that loads the mermaid library lazily so only pages that actually carry a diagram pay for it. Mermaid is a client dependency of the portfolio app only.

S3. `en proyectos haz lo mismo del live preview que hiciste en el blog`: the Projects collection gets `admin.preview` and `admin.livePreview` pointing at its own detail page `/{locale}/projects/{slug}`. The detail page consumes Payload's live-preview messages and re-renders as the editor types, starting from the server render so a plain load is unchanged. Projects have no draft state and their read access is public, so there is no token route and no draft mode here: the preview URL is the public URL, and the message bridge talks to `/api` directly because Payload lives in this same app (no proxy route, unlike the blog).

S4. The seeded projects stay as they are, except one (ai-governor) gains a `longDescription` in both locales written in markdown: two or three headings, a list, a paragraph with emphasis and a link, one fenced code block and one ` ```mermaid ` diagram (e.g. a simple flowchart of the gateway). This exists so the rendering is verifiable end to end.

S5. The schema change (richText → textarea on a localized column) travels as a versioned migration, generated after the dev push applies it and adopted on the dev database with `scripts/adopt-migration.ts`, so production gets it from `migrate` as usual.

## Tasks

- T1 — the field type change, the seed markdown and the migration — S1, S4, S5
- T2 — markdown rendering on the detail page with lazy mermaid — S2
- T3 — live preview: admin actions and the live-aware detail page — S3
- T4 — verification: rendering, mermaid, live messages, both locales, existing suites

## Log

L1 (verbatim): «haz que el campo "Descripción larga" sea un input crudo de markdown y en proyectos haz lo mismo del live preview que hiciste en el blog. vale? por que digo que sea markdown? por si meto diagramos o cualquier cosa»
