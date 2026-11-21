import { Fragment } from 'react'

import { cn } from '@/lib/utils'

/**
 * The six abstract project diagrams of the reference portfolio
 * (`section.projects` → `.project-visual`). They are decorative, CSS-only
 * (borders, gradients, transforms — no images, no dependencies) and ported from
 * the reference with the site's design tokens: `--accent` → `--primary`,
 * `--card-2` → `--secondary`, `--border-strong` → `--input`, `--soft` → `--muted`.
 */

/** Payload select values for `projects.visual`; keep in sync with the collection. */
export const PROJECT_VISUAL_OPTIONS = [
  { value: 'code-stack', label: 'Code stack' },
  { value: 'agent-orbit', label: 'Agent orbit' },
  { value: 'mock-shell', label: 'Mock shell' },
  { value: 'echo-ring', label: 'Echo ring' },
  { value: 'svc-map', label: 'Service map' },
  { value: 'chat-lines', label: 'Chat lines' },
] as const

export type ProjectVisualName = (typeof PROJECT_VISUAL_OPTIONS)[number]['value']

/** Left/right segments of the `.visual-head` line, as in the reference. */
type VisualMeta = { label: string; tag: string }

const VISUALS: Record<ProjectVisualName, VisualMeta> = {
  'code-stack': { label: 'INFRASTRUCTURE', tag: 'POLICY ENGINE' },
  'agent-orbit': { label: 'AGENT RUNTIME', tag: 'ORCHESTRATION' },
  'mock-shell': { label: 'DESKTOP', tag: 'LOCAL FIRST' },
  'echo-ring': { label: 'VOICE AI', tag: 'PRIVATE ASSISTANT' },
  'svc-map': { label: 'SOFTWARE ARCHITECTURE', tag: 'EVENT DRIVEN' },
  'chat-lines': { label: 'INTEGRATIONS', tag: 'CONTEXT LAYER' },
}

/** Unknown or missing values fall back to the code stack diagram. */
const FALLBACK_VISUAL: ProjectVisualName = 'code-stack'

function isProjectVisualName(value: unknown): value is ProjectVisualName {
  return typeof value === 'string' && Object.prototype.hasOwnProperty.call(VISUALS, value)
}

/** Zero-padded three-digit card number (`001`), as in the reference head line. */
export function formatNumber(value: number | string | null | undefined): string {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return String(Math.max(0, Math.trunc(value))).padStart(3, '0')
  }

  const trimmed = typeof value === 'string' ? value.trim() : ''
  return trimmed || '000'
}

/** Shared border style of the "strong" hairlines (reference `--border-strong`). */
const STRONG_BORDER = 'border-input'
/** Shared border style of the plain hairlines (reference `--border`). */
const HAIRLINE = 'border-border'
/** Solid block used for placeholder bars and avatars in the mock diagrams. */
const BLOCK = 'bg-input'

/**
 * Resolved copy of the head line: the project's own text when it has any, else the
 * diagram's default. Exported so the archive card can paint the same line over a cover
 * image, where no diagram — and therefore no head of its own — is rendered.
 */
export function visualHeadCopy(
  visual: unknown,
  label?: string | null,
  tag?: string | null,
): { label: string; tag: string } {
  const name = isProjectVisualName(visual) ? visual : FALLBACK_VISUAL
  const meta = VISUALS[name]

  return { label: label?.trim() || meta.label, tag: tag?.trim() || meta.tag }
}

export function VisualHead({ number, label, tag }: { number: string; label: string; tag: string }) {
  return (
    <div className="mono relative z-[2] flex items-center justify-between gap-3 text-[9px] leading-[1.3] font-[650] tracking-[0.08em] text-muted">
      <span className="min-w-0 truncate">{`${number} / ${label}`}</span>
      <span className="shrink-0 whitespace-nowrap text-primary">{tag}</span>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* 001 — code-stack: rows of policy checks, each with its verdict.             */
/* -------------------------------------------------------------------------- */

const CODE_ROWS = [
  ['request.auth', 'PASS'],
  ['quota.reserve', 'OK'],
  ['model.route', 'READY'],
] as const

function CodeStackDiagram() {
  return (
    <div className="absolute top-[63px] right-[32px] left-[32px] z-[1] grid gap-[9px]">
      {CODE_ROWS.map(([step, verdict]) => (
        <div
          key={step}
          className={cn(
            'mono flex justify-between gap-[10px] rounded-lg border bg-card px-[12px] py-[10px] text-[10px] leading-none font-semibold text-muted-foreground',
            STRONG_BORDER,
          )}
        >
          <span className="truncate">{step}</span>
          <strong className="shrink-0 font-semibold text-primary">{verdict}</strong>
        </div>
      ))}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* 002 — agent-orbit: π core inside a slowly turning dashed orbit, three       */
/* agents on it.                                                              */
/* -------------------------------------------------------------------------- */

const AGENT_DOTS = [
  { key: 'a', label: 'A1', position: 'top-[32%] left-[25%]' },
  { key: 'b', label: 'A2', position: 'top-[32%] right-[25%]' },
  { key: 'c', label: 'A3', position: 'bottom-[16%] left-1/2 -translate-x-1/2' },
] as const

function AgentOrbitDiagram() {
  return (
    <>
      <div
        className={cn(
          'absolute top-[54%] left-1/2 z-[1] size-[178px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed motion-safe:animate-spin motion-safe:[animation-duration:26s]',
          STRONG_BORDER,
        )}
      />
      <div className="mono absolute top-[54%] left-1/2 z-[2] grid size-[62px] -translate-x-1/2 -translate-y-1/2 rotate-[-8deg] place-items-center rounded-[16px] bg-primary text-[22px] leading-none font-extrabold text-primary-foreground ring-[10px] ring-primary/10">
        π
      </div>
      {AGENT_DOTS.map((dot) => (
        <div
          key={dot.key}
          className={cn(
            'mono absolute z-[3] grid size-[40px] place-items-center rounded-[12px] border bg-card text-[9px] leading-none font-bold text-foreground',
            STRONG_BORDER,
            dot.position,
          )}
        >
          {dot.label}
        </div>
      ))}
    </>
  )
}

/* -------------------------------------------------------------------------- */
/* 003 — mock-shell: a desktop window with sidebar, terminal and prompt.       */
/* -------------------------------------------------------------------------- */

function MockShellDiagram() {
  return (
    <div
      className={cn(
        'absolute top-[59px] right-[37px] -bottom-[12px] left-[37px] z-[1] overflow-hidden rounded-t-[10px] border bg-card shadow-[var(--shadow)]',
        STRONG_BORDER,
      )}
    >
      <div className={cn('flex h-[27px] items-center gap-[5px] border-b pl-[11px]', HAIRLINE)}>
        {[0, 1, 2].map((dot) => (
          <i key={dot} className="block size-[5px] rounded-full bg-muted" />
        ))}
      </div>

      <div className="grid h-[calc(100%-27px)] grid-cols-[50px_1fr]">
        <div className={cn('grid content-start gap-[10px] border-r px-[11px] py-[12px]', HAIRLINE)}>
          {[0, 1, 2, 3].map((bar) => (
            <b key={bar} className={cn('block h-[4px] rounded', BLOCK)} />
          ))}
        </div>

        <div className="mono overflow-hidden p-[15px] text-[9px] leading-[1.8] font-semibold text-muted-foreground">
          <strong className="font-semibold text-primary">nabla › agent.run()</strong>
          <br />
          <span>› workspace initialized</span>
          <div className={cn('my-[7px] h-[5px] w-[72%] rounded', BLOCK)} />
          <div className={cn('my-[7px] h-[5px] w-[46%] rounded', BLOCK)} />
          <span className="text-primary">✓ ready</span>
        </div>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* 004 — echo-ring: a glowing voice ring with an equalizer underneath.        */
/* -------------------------------------------------------------------------- */

/** Reference bars: height in px and animation delay in seconds. */
const ECHO_WAVE = [
  { height: '8px', delay: '-.1s' },
  { height: '18px', delay: '-.3s' },
  { height: '11px', delay: '-.5s' },
  { height: '26px', delay: '-.7s' },
  { height: '15px', delay: '-.3s' },
  { height: '23px', delay: '-.9s' },
  { height: '9px', delay: '-.2s' },
  { height: '20px', delay: '-.6s' },
  { height: '12px', delay: '-.4s' },
]

/** `--accent-soft` → primary at low alpha, without hardcoding a colour. */
const SOFT = (percentage: number) =>
  `color-mix(in srgb, var(--primary) ${percentage}%, transparent)`

const ECHO_KEYFRAMES = '@keyframes pv-wave{to{height:4px;opacity:.55}}'

function EchoRingDiagram() {
  return (
    <>
      <style>{ECHO_KEYFRAMES}</style>
      <div
        className="absolute top-[56%] left-1/2 z-[1] size-[120px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary"
        style={{
          boxShadow: `0 0 0 24px ${SOFT(10)}, 0 0 0 48px ${SOFT(4)}, inset 0 0 25px ${SOFT(10)}`,
        }}
      >
        <div
          className="absolute top-1/2 left-1/2 size-[40px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary"
          style={{ boxShadow: `0 0 30px ${SOFT(10)}` }}
        />
      </div>
      <div className="absolute bottom-[24px] left-1/2 z-[2] flex h-[28px] -translate-x-1/2 items-center gap-[4px]">
        {ECHO_WAVE.map((bar, index) => (
          <i
            key={index}
            className="block w-[3px] rounded-[8px] bg-primary opacity-90 motion-safe:animate-[pv-wave_1.5s_ease-in-out_infinite_alternate]"
            style={{ height: bar.height, animationDelay: bar.delay }}
          />
        ))}
      </div>
    </>
  )
}

/* -------------------------------------------------------------------------- */
/* 005 — svc-map: gateway → domain core → event bus, with events below.       */
/* -------------------------------------------------------------------------- */

const SERVICES = [
  { label: 'API', secondary: 'GATEWAY', center: false },
  { label: 'DOMAIN', secondary: 'CORE', center: true },
  { label: 'EVENT', secondary: 'BUS', center: false },
] as const

function ServiceMapDiagram() {
  return (
    <>
      <div className="absolute top-[70px] right-[9%] left-[9%] z-[1] grid grid-cols-[1fr_18px_1fr_18px_1fr] items-center gap-[4px]">
        {SERVICES.map((service, index) => (
          <Fragment key={service.label}>
            {index > 0 ? <div className="text-center text-[17px] text-primary">→</div> : null}
            <div
              className={cn(
                'mono rounded-lg border bg-card px-[5px] py-[16px] text-center text-[9px] leading-[1.4] font-[650]',
                service.center
                  ? 'border-primary text-foreground'
                  : cn(STRONG_BORDER, 'text-muted-foreground'),
              )}
            >
              {service.label}
              <br />
              {service.secondary}
            </div>
          </Fragment>
        ))}
      </div>
      <div className="absolute top-[138px] right-[17%] left-[17%] z-[1] flex h-[18px] items-center justify-between">
        {[0, 1, 2, 3, 4].map((event) => (
          <b key={event} className="size-[7px] rotate-45 rounded-[2px] bg-primary" />
        ))}
      </div>
    </>
  )
}

/* -------------------------------------------------------------------------- */
/* 006 — chat-lines: three message rows, the last one from the accent bot.    */
/* -------------------------------------------------------------------------- */

function ChatLine({ bot = false }: { bot?: boolean }) {
  return (
    <div className="flex items-center gap-[9px]">
      <i className={cn('block size-[25px] shrink-0 rounded-[9px]', bot ? 'bg-primary' : BLOCK)} />
      <div className="min-w-0 flex-1">
        <b
          className={cn(
            'mb-[6px] block h-[5px] rounded-[3px]',
            bot ? 'w-[54%] bg-primary' : cn('w-[78%]', BLOCK),
          )}
        />
        <b className="block h-[5px] w-[53%] rounded-[3px] bg-muted opacity-60" />
      </div>
    </div>
  )
}

function ChatLinesDiagram() {
  return (
    <div className="absolute top-[65px] right-[33px] left-[33px] z-[1] grid gap-[12px]">
      <ChatLine />
      <ChatLine />
      <ChatLine bot />
    </div>
  )
}

/* -------------------------------------------------------------------------- */

function ProjectDiagram({ visual }: { visual: ProjectVisualName }) {
  switch (visual) {
    case 'agent-orbit':
      return <AgentOrbitDiagram />
    case 'mock-shell':
      return <MockShellDiagram />
    case 'echo-ring':
      return <EchoRingDiagram />
    case 'svc-map':
      return <ServiceMapDiagram />
    case 'chat-lines':
      return <ChatLinesDiagram />
    case 'code-stack':
      return <CodeStackDiagram />
    default:
      return <CodeStackDiagram />
  }
}

export type ProjectVisualProps = {
  /** Payload `projects.visual`; anything unknown renders the code stack. */
  visual?: string | null
  /** Card number in the head line; numbers are zero-padded to three digits. */
  number?: number | string | null
  /** Override of the left segment (Payload `projects.card.category`). */
  label?: string | null
  /** Optional override of the diagram's accent tag (right side of the head). */
  tag?: string
  /** Extra classes for the panel, e.g. a max width on the detail page. */
  className?: string
}

/**
 * Decorative 202px project diagram panel with the mono head line
 * (`NNN / LABEL` + accent tag) and the faint grid mask, as in the reference.
 */
export function ProjectVisual({ visual, number, label, tag, className }: ProjectVisualProps) {
  const name = isProjectVisualName(visual) ? visual : FALLBACK_VISUAL
  const head = visualHeadCopy(visual, label, tag)

  return (
    <div
      aria-hidden
      className={cn('relative h-[202px] overflow-hidden bg-secondary p-[21px]', className)}
    >
      <div className="grid-lines pointer-events-none absolute inset-0 opacity-80 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
      <VisualHead
        number={formatNumber(number)}
        label={head.label}
        tag={head.tag}
      />
      <ProjectDiagram visual={name} />
    </div>
  )
}
