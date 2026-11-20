# portfolio-project-hero

Make the project detail hero editable: a split layout with the visual beside the title and lead, the meta line, an optional badge pill and an optional card label — each optional, with the current page as the fallback.

## Specs

S1. `yo quiero poder editar si quiero la cabecera así [imagen] con la imagen al lado de la descripción y título`: the detail page's hero becomes two columns on wide screens — title, lead and badge on the left; the cover or generated visual on the right — matching the reference `/Users/ipepio/Desktop/portfolio_discord_mcp.html`. It stacks to one column on small screens. A per-project `heroLayout` select chooses `split` (default, the reference) or `stacked` (today's single column), so any project can keep the old shape.

S2. `además de diferentes formatos en ese texto`: the hero lead is markdown, rendered with the same renderer the body uses, so the owner can use emphasis, links and line breaks there without touching the body. It falls back to `shortDescription` (plain) when empty, and `shortDescription` keeps feeding the archive cards.

S3. The reference's meta line (`06 / 06 · AI INFRASTRUCTURE / MCP`) is editable: a `heroEyebrow` localized text (e.g. `AI INFRASTRUCTURE / MCP`), rendered next to an index that stays derived — `NN / TT` from the project's position in the archive and the number of published projects — because hand-typed positions go stale. With no eyebrow, only the index shows.

S4. `el tag ese de ipepio projects discord` (optional): a `cardLabel` text (e.g. `ipepio / projects / discord`) rendered in the corner of the visual card, and a `showCardLabel` checkbox to omit it. Off by default so existing projects do not sprout a new label.

S5. `la cake esa de Open source MIT Selfhosted (entiendo que son los tags) con el circulito verde`: the green-dot pill under the lead is a new `badges` array of localized labels (`Open source`, `MIT`, `Autoalojado`), independent of the archive filter `tags` — they are different concepts (filters select projects; badges describe this one). Rendered as mono, uppercase, one line, separated by `·`, with the green dot from the design system. Empty array → no pill.

S6. Everything optional and non-destructive: an existing project with none of these fields set renders exactly today's page (stacked hero, plain short description, no pill, no card label) except that the split layout is the new default — and setting `stacked` restores the old shape per project.

S7. Both locales. Every new field is localized except the toggles and the layout select. The admin groups them under a `Cabecera` tab/group with Spanish descriptions that document the markdown in `heroLead` and the optional nature of each piece.

S8. The schema change travels as a migration, generated after the dev push applies it and adopted on the dev database with `scripts/adopt-migration.ts`.

## Tasks

- T1 — the model: hero group, fields, admin descriptions, generated types, migration — S1-S5, S7, S8
- T2 — the split hero on the detail page, respecting `heroLayout` and every fallback — S1, S2, S3, S4, S5
- T3 — the badge pill and the card label, styled from the design system — S4, S5
- T4 — verification: both layouts, every fallback, both locales, live preview, mermaid, and the seeded clash-hub as the acceptance case

## Log

L1 (verbatim): «pero yo quiero poder editar si quiero la cabecera así [Image#3] con la imagen al lado de la descripción y título además de diferentes formatos en ese texto. si quiero también (opcional) el tag ese de ipepio projects dicrod. después la cake esa de Open source MIT Selfhosted (entiendo que son los tags) con el circulito verde etc.»

L2: decision — `badges` is a new field, not the archive `tags`: the reference's pill reads like licence/hosting traits, while tags filter the archive, and mixing them would break the filters.
L3: decision — the `NN / TT` index stays derived while the eyebrow text is editable, because a typed position rots the moment a project is reordered.
L4: decision — `split` is the new default layout, since it is the reference the owner asked for, and `stacked` is one select away per project.
