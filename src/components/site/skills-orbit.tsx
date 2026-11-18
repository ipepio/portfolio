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

/**
 * One capability rendered as a node in the orbit. The scene decides which diagram the
 * centre shows while that node is selected, so Payload owns the copy and this widget
 * stays a pure renderer with no hardcoded areas.
 */
export type OrbitCapability = {
  id?: string | number
  title: string
  description?: string | null
  scene: SceneId
}

export type SkillsOrbitProps = {
  capabilities: OrbitCapability[]
  /** Accessible name for the widget, from the dictionary. */
  label: string
}

type LabelSide = 'top' | 'bottom' | 'left' | 'right'

/** A capability flattened into exactly what the orbit renders. */
type OrbitSection = {
  key: string
  title: string
  copy: string
  scene: SceneId
}

/**
 * Ring radius as a percentage of the orbit box — the single source of truth for the
 * node geometry. The reference hand-placed its nodes (hence the uneven gaps), but every
 * one of them sat ~41.3% from the centre, so the ring is pinned to 41: the same visual
 * density, now with one radius and one angular step for all nodes. Being a percentage,
 * it scales with the orbit box at every breakpoint.
 */
const RADIUS = 41

/** First node at the top (12 o'clock), then clockwise. */
const START_ANGLE = -Math.PI / 2

/** Placement percentages on the orbit's own coordinate system plus the label side. */
type NodeGeometry = { x: string; y: string; side: LabelSide }

/**
 * Node position and label side derived from its angle on the ring instead of being
 * hand-placed: the labels hang outwards on whichever side the node faces, and nodes
 * close to the vertical axis (|cos| <= 0.35) take the top/bottom rule instead.
 * The step is derived from the node count, so the ring works for any list length.
 */
function nodeGeometry(index: number, count: number): NodeGeometry {
  const angle = START_ANGLE + ((2 * Math.PI) / Math.max(count, 1)) * index
  const cos = Math.cos(angle)
  const sin = Math.sin(angle)

  return {
    x: `${(50 + RADIUS * cos).toFixed(2)}%`,
    y: `${(50 + RADIUS * sin).toFixed(2)}%`,
    side: cos > 0.35 ? 'right' : cos < -0.35 ? 'left' : sin < 0 ? 'top' : 'bottom',
  }
}

function pad(index: number) {
  return String(index + 1).padStart(2, '0')
}

/** Focused form fields keep the arrow keys: the widget never steals text navigation. */
function isEditable(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false

  return target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)
}

/**
 * Interactive capability orbit for the About section: every capability is a node on a
 * shared ring, and selecting one swaps the animated illustration and the caption in the
 * centre. The nodes, their copy and their scene all come from the `expertise` global, so
 * adding a capability in Payload adds a node here.
 *
 * Arrow keys move the selection while focus is inside the widget; the reference listened
 * on `document`, which would also steal the page's arrow-key scrolling.
 */
export function SkillsOrbit({ capabilities, label }: SkillsOrbitProps) {
  const sections = useMemo<OrbitSection[]>(
    () =>
      capabilities.map((capability, index) => ({
        key: String(capability.id ?? index),
        title: capability.title,
        copy: capability.description?.trim() || '',
        scene: capability.scene,
      })),
    [capabilities],
  )

  const [selected, setSelected] = useState(0)

  const geometry = useMemo(
    () => sections.map((_, index) => nodeGeometry(index, sections.length)),
    [sections],
  )

  // A capability removed in Payload must not leave the selection pointing past the end.
  const activeIndex = Math.min(selected, Math.max(sections.length - 1, 0))
  const active = sections[activeIndex]

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
      setSelected((activeIndex + direction + sections.length) % sections.length)
    },
    [activeIndex, sections.length],
  )

  // Nothing to orbit: the About section simply renders without the widget.
  if (!active) return null

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
              {sections.map((section, index) => (
                <div
                  key={section.key}
                  data-scene={section.scene}
                  className={
                    index === activeIndex ? `${styles.scene} ${styles.sceneActive}` : styles.scene
                  }
                >
                  {createElement(sceneRenderers[section.scene])}
                </div>
              ))}
            </div>
            <span className={styles.stageCategory} data-stage-category>
              {active.scene.toUpperCase()}
            </span>
            <span className={styles.stageIndex} data-stage-index>
              {pad(activeIndex)} / {pad(sections.length - 1)}
            </span>
          </div>
        </div>

        {sections.map((section, index) => {
          const node = geometry[index]
          const isActive = index === activeIndex

          return (
            <button
              key={section.key}
              type="button"
              data-section={section.scene}
              data-label={node.side}
              aria-pressed={isActive}
              onClick={() => setSelected(index)}
              style={{ '--x': node.x, '--y': node.y } as CSSProperties}
              className={isActive ? `${styles.node} ${styles.nodeActive}` : styles.node}
            >
              <span className={styles.nodeDisc}>
                {createElement(skillIcon(section.scene), { 'aria-hidden': true })}
              </span>
              <span className={styles.nodeLabel}>{section.title}</span>
            </button>
          )
        })}
      </div>

      <div aria-live="polite" aria-atomic="true" className={styles.detail} data-orbit-detail>
        <div className={styles.detailKicker} data-detail-kicker>
          {`${pad(activeIndex)} — ${active.scene.toUpperCase()}`}
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
