# portfolio-skills-expertise

Replace the skills section with the "Lo que hago" expertise block copied from `portfolio_ipepio_expertise.html`, model capabilities and both tool belts in Payload, keep the About orbit fed by those capabilities, and renumber every section heading.

Branch: `main` (repo convention: everything lands on `main`; no remote configured yet).

## Specs

S1. The skills section is copied from `/Users/ipepio/Desktop/portfolio_ipepio_expertise.html`, section `03 / LO QUE HAGO`:
    - aside: eyebrow, display heading `Del problema al sistema.`, description, note `Las herramientas cambian. El criterio permanece.`
    - a list of 5 capabilities, each with a title and a description: `Arquitectura de software`, `Ingeniería de producto`, `Cloud, DevOps y operaciones`, `IA aplicada a ingeniería`, `Liderazgo técnico y calidad`
    - a labelled `CAPACIDADES / CÓMO APORTO VALOR` heading over the list
    - an ordered `01 — 05` counter next to that heading

S2. `Las herramientas core, y las presentes las pondremos en payload. Al igual que las capacidades.` Concretely:
    - core toolkit, label `HERRAMIENTAS CON LAS QUE MÁS ME IDENTIFICO` / small `CORE TOOLKIT`: `Node.js`, `TypeScript`, `React`, `PostgreSQL`, `AWS`, `Docker`, `Kubernetes`
    - extended toolkit, label `TAMBIÉN PRESENTES EN MI TRABAJO Y PROYECTOS` / small `EXTENDED TOOLKIT`: `Vue`, `Kotlin`, `Go`, `Terraform / OpenTofu`, `Linux`, `GitHub Actions`, `llama.cpp`, `LiteLLM`
    - toolbelt foot: `El stack es una caja de herramientas. En cada proyecto, elijo lo que aporta simplicidad, rendimiento y autonomía al equipo.`
    - capabilities, core tools and extended tools are all editable in Payload, not hardcoded in the component

S3. Capability descriptions, verbatim from the reference:
    - `Diseño de sistemas, separación de dominios, APIs, arquitecturas event-driven y modernización incremental sin perder el control de producción.`
    - `Construcción fullstack, diseño de plataformas, integraciones y desarrollo de producto desde la idea hasta una solución mantenible.`
    - `Infraestructura como código, contenedores, CI/CD, automatización de despliegues y operación de servicios en AWS y Linux.`
    - `Agentes, RAG, inferencia local, gateways LLM y herramientas que automatizan trabajo real sin perder observabilidad ni control.`
    - `Dirección de equipos, criterios de arquitectura, code review, QA, seguridad y mejora del ciclo de entrega.`

S4. `esto será la parte de skills`: the expertise block *is* the skills section. It replaces the current card grid and the section is no longer driven by `skill-groups`.

S5. The About orbit stays. `Mantenerla en About`: the orbit remains in the About section and its nodes are the five capabilities from the same Payload model, so capabilities feed both the About orbit and the skills list.

S6. Section order becomes, in page order: `Inicio`, `Sobre mi`, `Skills`, `Proyectos`, `Experiencia`, `Contacto`.

S7. `en cada título ... recuerd poner el número, estilo en proyectos, y numeralo bien`: every section heading carries its ordinal prefix in the same style the projects heading already uses, and the ordinals follow the order of S6: `01 / Sobre mí`, `02 / Skills`, `03 / Proyectos`, `04 / Experiencia`, `05 / Contacto`. The hero keeps no ordinal. Both locales get the same treatment.

## Tasks

- T1 — Payload model `expertise` global (capabilities, core tools, extended tools, toolbelt foot); retire `skill-groups` — S1, S2, S5
- T2 — seed content for the new global and drop the obsolete skill-group seeds — S1, S2, S3
- T3 — `expertise-section` component copying the reference layout — S1, S2, S3
- T4 — About orbit consumes capabilities instead of skill groups — S5
- T5 — page order per S6 and section ordinals per S7 in both locales — S6, S7
- T6 — stories for the new section and for the orbit change — S1, S5
- T7 — verification: typecheck, lint, dev smoke on both locales (order, ordinals, capability and tool content) — S1–S7

## Log

L1 (verbatim): «/Users/ipepio/Desktop/portfolio_ipepio_expertise.html para la parte de skills, copiaremos la de /lo que hago des este html, teniendo en cuenta que las herramientas core, y las presentes las pondremos en payload. Al igual que las capacidades. vale?»

L2 (verbatim): «esto será la parte de skills btw y en cada título del hero, recuerd poner el número, estilo en poryectos, y numeralo bien»

L3: decision — orbit stays in About, fed by the capability list (user picked "Mantenerla en About").
L4: decision — section order `Inicio, Sobre mi, Skills, Proyectos, Experiencia, Contacto` (user answer, custom option).
