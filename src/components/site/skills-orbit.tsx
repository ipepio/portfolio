'use client'

import {
  createElement,
  useCallback,
  useMemo,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from 'react'

import { sceneRenderers, type SceneId } from '@/components/site/orbit-scenes'
import { skillIcon } from '@/lib/skill-icons'

import styles from './skills-orbit.module.css'

/** One area rendered as a node in the orbit. `number`/`items` are accepted but unused. */
export type OrbitGroup = {
  id?: string | number
  label?: string | null
  title: string
  icon?: string | null
  number?: string | null
  items?: { name: string }[] | null
}

export type SkillsOrbitProps = {
  groups: OrbitGroup[]
  /** Accessible name for the widget, from the dictionary. */
  label: string
}

type LabelSide = 'top' | 'bottom' | 'left' | 'right'

type OrbitSection = {
  id: SceneId
  /** Node label and stage category. */
  label: string
  title: string
  kicker: string
  copy: string
  /** `skill-icons` key used when no stored group maps to this section. */
  icon: string
}

/**
 * The seven areas of the reference design, verbatim. The reference shipped this as
 * Spanish-only copy and it is kept that way for the English locale too: the section
 * copy is design copy, not Payload content, so it still needs translating.
 */
const SECTIONS: readonly OrbitSection[] = [
  {
    id: 'backend',
    label: 'BACKEND',
    title: 'Backend Engineering',
    kicker: '01 — SERVICES',
    copy: 'APIs, microservicios, eventos y lógica de negocio robusta.',
    icon: 'code',
  },
  {
    id: 'cloud',
    label: 'CLOUD',
    title: 'Cloud & Infrastructure',
    kicker: '02 — PLATFORM',
    copy: 'Infraestructura cloud, contenedores, automatización e IaC.',
    icon: 'cloud',
  },
  {
    id: 'ai',
    label: 'AI',
    title: 'Artificial Intelligence',
    kicker: '03 — INTELLIGENCE',
    copy: 'Agentes inteligentes, LLMs y soluciones de IA aplicadas.',
    icon: 'ai',
  },
  {
    id: 'quality',
    label: 'QUALITY',
    title: 'Quality & Security',
    kicker: '04 — RELIABILITY',
    copy: 'Calidad de software, testing, observabilidad y seguridad.',
    icon: 'shield',
  },
  {
    id: 'data',
    label: 'DATA',
    title: 'Data & Analytics',
    kicker: '05 — INSIGHTS',
    copy: 'Modelado de datos, métricas, pipelines y analítica.',
    icon: 'database',
  },
  {
    id: 'enterprise',
    label: 'ENTERPRISE',
    title: 'Enterprise Architecture',
    kicker: '06 — SYSTEMS',
    copy: 'Sistemas empresariales, integraciones y plataformas conectadas.',
    icon: 'enterprise',
  },
  {
    id: 'engineering',
    label: 'ENGINEERING',
    title: 'Software Engineering',
    kicker: '07 — DELIVERY',
    copy: 'Diseño de sistemas, arquitecturas mantenibles y entrega continua.',
    icon: 'engineering',
  },
] as const

/**
 * Ring radius as a percentage of the orbit box — the single source of truth for the
 * node geometry. The reference hand-placed its seven nodes (hence the uneven gaps),
 * but every one of them sat ~41.3% from the centre, so the ring is pinned to 41: the
 * same visual density, now with one radius and one angular step for all nodes.
 * Being a percentage, it scales with the orbit box at every breakpoint.
 */
const RADIUS = 41

/** First node at the top (12 o'clock), then clockwise: 360° / 7 = 51.43° per step. */
const START_ANGLE = -Math.PI / 2
const ANGLE_STEP = (2 * Math.PI) / SECTIONS.length

/** Placement percentages on the orbit's own coordinate system plus the label side. */
type NodeGeometry = { x: string; y: string; side: LabelSide }

/**
 * Node position and label side derived from its angle on the ring instead of being
 * hand-placed: the labels hang outwards on whichever side the node faces, and nodes
 * close to the vertical axis (|cos| <= 0.35) take the top/bottom rule instead.
 */
function nodeGeometry(index: number): NodeGeometry {
  const angle = START_ANGLE + ANGLE_STEP * index
  const cos = Math.cos(angle)
  const sin = Math.sin(angle)

  return {
    x: `${(50 + RADIUS * cos).toFixed(2)}%`,
    y: `${(50 + RADIUS * sin).toFixed(2)}%`,
    side: cos > 0.35 ? 'right' : cos < -0.35 ? 'left' : sin < 0 ? 'top' : 'bottom',
  }
}

/** Computed once: the ring is deterministic, so the render only looks the entry up. */
const NODE_GEOMETRY: readonly NodeGeometry[] = SECTIONS.map((_, index) => nodeGeometry(index))

/**
 * Payload editors type the short label themselves, so matching is tolerant:
 * accents, punctuation and casing are stripped before comparing, and the longer
 * titles are accepted too (in case a label is left empty).
 */
const LABEL_ALIASES: Record<SceneId, string[]> = {
  backend: ['backend', 'backendengineering', 'back'],
  cloud: ['cloud', 'cloudinfrastructure', 'devops', 'nube'],
  ai: ['ai', 'ia', 'artificialintelligence', 'inteligenciaartificial'],
  quality: ['quality', 'qualitysecurity', 'calidad', 'qa'],
  data: ['data', 'dataanalytics', 'databases', 'database', 'datos'],
  enterprise: ['enterprise', 'enterprisearchitecture', 'sap', 'empresa'],
  engineering: ['engineering', 'softwareengineering', 'ingenieria'],
}

/** Default selection: the reference opens on Enterprise Architecture (06 — SYSTEMS). */
const DEFAULT_SECTION: SceneId = 'enterprise'

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '')
}

/**
 * Bind the stored skill groups to the seven fixed sections: first by label, then
 * whatever is left fills the remaining sections in its stored order.
 */
function bindGroups(groups: OrbitGroup[]): Map<SceneId, OrbitGroup> {
  const bound = new Map<SceneId, OrbitGroup>()
  const unmatched: OrbitGroup[] = []

  for (const group of groups) {
    const key = normalize(group.label?.trim() || group.title?.trim() || '')
    const section = key
      ? SECTIONS.find((item) => !bound.has(item.id) && LABEL_ALIASES[item.id].includes(key))
      : undefined

    if (section) bound.set(section.id, group)
    else unmatched.push(group)
  }

  const pending = SECTIONS.filter((item) => !bound.has(item.id))
  pending.forEach((item, index) => {
    const group = unmatched[index]
    if (group) bound.set(item.id, group)
  })

  return bound
}

function pad(index: number) {
  return String(index + 1).padStart(2, '0')
}

/** Renders the shared lucide glyph through `createElement` (no component in render). */
function NodeGlyph({ icon }: { icon?: string | null }) {
  return createElement(skillIcon(icon), { 'aria-hidden': true })
}

/** Focused form fields keep the arrow keys: the widget never steals text navigation. */
function isEditable(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false

  return target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)
}

/**
 * Interactive skills orbit for the About section: seven areas on a shared ring, each
 * swapping the animated illustration and the caption in the centre. Ported from the
 * reference "expertise orbit" page, minus its page chrome and its viewport-tall
 * wrapper (the About section owns the height).
 *
 * Arrow keys move the selection while focus is inside the widget; the reference
 * listened on `document`, which would also steal the page's arrow-key scrolling.
 */
export function SkillsOrbit({ groups, label }: SkillsOrbitProps) {
  const [selected, setSelected] = useState<SceneId>(DEFAULT_SECTION)
  const bound = useMemo(() => bindGroups(groups), [groups])

  const activeIndex = SECTIONS.findIndex((section) => section.id === selected)
  const active = SECTIONS[activeIndex] ?? SECTIONS[0]

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLElement>) => {
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return
      if (isEditable(event.target)) return

      const direction =
        event.key === 'ArrowRight' || event.key === 'ArrowDown'
          ? 1
          : event.key === 'ArrowLeft' || event.key === 'ArrowUp'
            ? -1
            : 0

      if (direction === 0) return

      event.preventDefault()
      const current = SECTIONS.findIndex((section) => section.id === selected)
      const next = SECTIONS[(current + direction + SECTIONS.length) % SECTIONS.length]
      setSelected(next.id)
    },
    [selected],
  )

  return (
    <section aria-label={label} className={styles.root} data-skills-orbit onKeyDown={handleKeyDown}>
      <div className={styles.orbit}>
        <div aria-hidden className={`${styles.orbitRing} ${styles.orbitRingOuter}`} />
        <div aria-hidden className={`${styles.orbitRing} ${styles.orbitRingMiddle}`} />
        <div aria-hidden className={`${styles.orbitRing} ${styles.orbitRingInner}`} />
        <div aria-hidden className={styles.centerWash} />

        <div aria-hidden className={styles.centerContent}>
          <div className={styles.centerStack}>
            <div className={styles.sceneWindow}>
              {SECTIONS.map((section) => (
                <div
                  key={section.id}
                  data-scene={section.id}
                  className={
                    section.id === selected ? `${styles.scene} ${styles.sceneActive}` : styles.scene
                  }
                >
                  {createElement(sceneRenderers[section.id])}
                </div>
              ))}
            </div>
            <span className={styles.stageCategory} data-stage-category>
              {active.label}
            </span>
            <span className={styles.stageIndex} data-stage-index>
              {pad(activeIndex)} / 07
            </span>
          </div>
        </div>

        {SECTIONS.map((section, index) => {
          const group = bound.get(section.id)
          const geometry = NODE_GEOMETRY[index]
          const isActive = section.id === selected

          return (
            <button
              key={section.id}
              type="button"
              data-section={section.id}
              data-label={geometry.side}
              aria-pressed={isActive}
              onClick={() => setSelected(section.id)}
              style={{ '--x': geometry.x, '--y': geometry.y } as CSSProperties}
              className={isActive ? `${styles.node} ${styles.nodeActive}` : styles.node}
            >
              <span className={styles.nodeDisc}>
                <NodeGlyph icon={group?.icon ?? section.icon} />
              </span>
              <span className={styles.nodeLabel}>{group?.label?.trim() || section.label}</span>
            </button>
          )
        })}
      </div>

      <div aria-live="polite" aria-atomic="true" className={styles.detail} data-orbit-detail>
        <div className={styles.detailKicker} data-detail-kicker>
          {active.kicker}
        </div>
        <p className={styles.detailTitle} data-detail-title>
          {active.title}
        </p>
        <p className={styles.detailCopy} data-detail-copy>
          {active.copy}
        </p>
      </div>
    </section>
  )
}
