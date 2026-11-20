# portfolio-case-pages

Give every project the case-page anatomy of `/Users/ipepio/Desktop/portfolio_discord_mcp.html`: a table of contents derived from the markdown, callout boxes the owner writes in markdown, a closing block that leads back to the work and to the next project, and tags that can be created from the admin.

## Specs

S1. `poder tener los apartados de "En esta página"`: the project detail page gains a section index beside the body, headed `EN ESTA PÁGINA` / `ON THIS PAGE`, listing the body's own `##` headings numbered `01 ·`, as the reference's `case-aside-nav` does. It is derived from the markdown at render time, never hand-collected, so it cannot drift from the text; it is a sticky column on wide screens and is skipped entirely when the body has no `##` heading. The index also carries the reference's aside blocks: the `Caso de estudio` label with the project's status, and the `Enlaces` label with the project links — or the reference's "no verifiable public deployment" note when a project has none.

S2. `poder meter también esas cajitas`: the markdown renderer supports callout boxes written as GitHub/Obsidian-style admonitions, which is syntax the owner already knows and needs no editor:
   - `> [!NOTE] Title` plus the quoted lines → a neutral callout box.
   - `> [!DECISION] Title` → a numbered decision box (`01`, `02`, … in document order), matching the reference's `case-decision`.
   - `> [!WARNING] Title` → the same box in the warning tone.
   - A plain blockquote keeps its current, quieter styling.
   The admin field description documents the three markers.

S3. `la parte final de volver al trabajo o otro proyecto`: the page ends with the reference's `case-next` row: a block leading back to the work (`← Volver al trabajo` / `Back to work`, linking to the projects section of the home page) and a block naming the next project (`Siguiente proyecto →` / `Next project →`) with its title, following the archive order and wrapping around at the ends. Both strings live in the dictionary.

S4. `dejar todos los proyectos con esa forma`: the shape is the detail page's, not a per-project template, so every project gets it with no extra field: any project with a markdown body gets the index, the callouts and the closing row. A project without a body still gets the same page, aside and closing row, minus the body-derived parts.

S5. `además de poder crear tags`: tags can be created from the admin while editing a project, without leaving the form. Verify the Tags collection allows it (authenticated create, `useAsTitle: 'name'`, localized name) and that nothing in the projects form blocks inline creation; fix it if something does.

S6. Both locales, and no regression on the deployed-markdown rendering: mermaid fences, code blocks, lists and links keep working, and a project without a body keeps falling back to its short description.

## Tasks

- T1 — the section index and the aside blocks — S1, S4
- T2 — admonition callouts in the markdown renderer — S2
- T3 — the closing row — S3
- T4 — inline tag creation — S5
- T5 — verification: the real Clash Hub markdown, both locales, keyboard reachability, and no regression in mermaid or the live preview

## Log

L1 (verbatim): «es para dejar todos los proyectos con esa forma. poder tener los apartados de "En esta página" recuerda que quiero meter markdown, poder meter también esas cajitas y la parte final de volver al trabajo o otro proyecto. me explico? además de poder crear tags»

L2: decision — the section index derives from the markdown headings, because the body is now raw markdown and a hand-kept index would drift from it.
L3: decision — callouts use GitHub/Obsidian admonition syntax (`> [!NOTE]`, `> [!DECISION]`, `> [!WARNING]`), chosen over a bespoke fence so the owner's existing habits keep working and the markdown stays portable.
