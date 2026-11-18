# portfolio-experience-contact

Port the experience and contact sections from `portfolio_ipepio_experiencia_contacto.html`, replace the About orbit with the equidistant graph from `expertise-orbit-equidistante.html`, and add the manifesto line at the end of the skills section.

Branch: `main`.

## Specs

S1. `mira la parte de experiencia y contacto /Users/ipepio/Desktop/portfolio_ipepio_experiencia_contacto.html la de experiencia podemos copiarla tal cual.`
The experience section is copied from that file's `section.experience` (line 669): the two-column `experience-layout` with its intro column (eyebrow, heading, description, the `2017 →` stat) and the timeline of roles. Its real content replaces the empty collection, so the seed must populate it. Nothing is invented: every company, role, date and description comes from that file.

S2. `grafo /Users/ipepio/Desktop/expertise-orbit-equidistante.html pasa este html a un componente y metelo tal cual`
The orbit from that file (`main.experience` → `section.orbit` + `section.detail`, plus its script) becomes a React client component used in place of the current About orbit. Verbatim port: its own seven areas (`backend`, `cloud`, `ai`, `quality`, `data`, `enterprise`, `engineering`) with their copy inside the component, its equidistant ring geometry, its scenes and its detail block. It no longer reads the `expertise` global.

S3. `del primer html ves la linea de Build it. ship ip Own it? pues pona tal cual al terminar la sección 02 (lo que hago)`
The manifesto band from `portfolio_ipepio_expertise.html` line 598 — `<p>Build it. Ship it. Own it.</p><span>IDEA → CODE → PRODUCTION ↗</span>` — renders verbatim immediately after the skills section.

S4. `después pon la sección 04 y la 05`: after that come section 04 (experiencia) and 05 (contacto), keeping the ordinals already in place.

S5. The contact form sends an email to the address stored in the `contact` global (`email`), which is editable in Payload. No address is hardcoded. The form keeps the reference structure (name, email, message, honeypot `website` field, submit, submit state) and validates input on the server. Transport is SMTP through Payload's nodemailer adapter, configured only from environment variables; when those are absent the route must fail loudly with a clear message instead of silently dropping the message.

S6. Both locales: every new string and every ported section copy exists in Spanish and English, taken from the dictionaries already inside the two reference files.

## Tasks

- T1 — equidistant orbit component, replacing the capability-driven orbit in About — S2
- T2 — manifesto band after the skills section — S3
- T3 — experience section copied from the reference, with its real content seeded — S1, S4
- T4 — contact section with the email-sending form and SMTP transport — S4, S5
- T5 — verification: typecheck, lint, dev smoke on both locales (order, ordinals, sections rendering), and the seed reporting the experience rows — S1–S6

## Segunda tanda (experiencia separada, CV y accesos)

S7. `mira como queda la parte del cv (hay que añadirlo)`: the experience section gains the `.cv-callout` block from `portfolio_ipepio_experiencia_separada.html:713` — icon, `Trayectoria en PDF` (`cv.title`), `Experiencia · formación · competencias` (`cv.subtitle`), and the `Descargar CV ↓` link (`cv.download`) with `download` and `rel="noopener noreferrer"`. English: `Career in PDF`, `Experience · education · skills`, `Download CV`. The PDF `/Users/ipepio/Desktop/CV_Isaac_Pepio.pdf` is served by the app itself (static asset), not linked to an external host, so the download works locally and in deploy.

S8. `la separación entre 04 y 05`: the diamond separator from that file (`.section-separator` markup at line 725, CSS at lines 305-308) sits between the experience section and the contact section: 44px tall, gradient rules either side of a 12px rotated square in the accent colour with a 5px halo ring, `width:min(calc(100% - 92px), var(--max))` and `calc(100% - 40px)` under 780px, `aria-hidden="true"`.

S9. `como quedan los accesos a github y linkedin`: the contact section renders each social of the `contact` global as the reference `.social-link` — inline SVG icon, a `strong` label and a `small` handle — underlined, opening in a new tab. LinkedIn (`https://www.linkedin.com/in/ipepio/`, label `LinkedIn`, handle `linkedin.com/in/ipepio`) is added to the global's socials and to the seed; GitHub (`https://github.com/ipepio`, handle `github.com/ipepio`) keeps its place.

S10. The experience roles match that file's timeline exactly, including `EASYGOBAND WORLD` as the current role (`SEP 2025 — ACTUALIDAD`). Reconcile the seed against it; the reference is the source of truth.

- T6 — CV callout plus the PDF served as a static asset — S7
- T7 — diamond separator between 04 and 05 — S8
- T8 — GitHub and LinkedIn social links in the contact section, with LinkedIn added to the global and the seed — S9
- T9 — reconcile the experience timeline with the reference and verify both locales — S10

## Log

L1 (verbatim): «mira la parte de experiencia y contacto /Users/ipepio/Desktop/portfolio_ipepio_experiencia_contacto.html la de experiencia podemos copiarla tal cual. Te comento las modificaciones que vamos a hacer. Primera, grafo /Users/ipepio/Desktop/expertise-orbit-equidistante.html pasa este html a un componente y metelo tal cual y del primer html ves la linea de Build it. ship ip Own it? pues pona tal cual al terminar la sección 02 (lo que hago) después pon la sección 04 y la 05»

L2: decision — the equidistant orbit is ported verbatim with its seven hardcoded areas; it stops reading the `expertise` global, and that global keeps feeding only the skills section.
L3: decision — the contact form sends an email to the user's address (the `contact` global's `email`), not a Payload collection and not a clipboard fallback.
L4: constraint — SMTP credentials live in environment variables, which this session cannot write; the code must read them and fail loudly when missing.
L5 (verbatim): «/Users/ipepio/Desktop/CV_Isaac_Pepio.pdf /Users/ipepio/Desktop/portfolio_ipepio_experiencia_separada.html mira como queda la parte del cv (hay que añadirlo) la separación entre 04 y 05 y como quedan los accesos a github y linkedin. acolpalo please»
