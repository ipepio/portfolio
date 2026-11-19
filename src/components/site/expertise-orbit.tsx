'use client'

import {
  cloneElement,
  useCallback,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type ReactElement,
  type SVGProps,
} from 'react'

import { useLocale } from '@/lib/locale-context'

import styles from './expertise-orbit.module.css'

/**
 * Interactive expertise orbit: the seven areas of expertise on one equidistant ring,
 * with an animated illustration and a caption in the centre for the selected area.
 *
 * Verbatim React port of `expertise-orbit-equidistante.html` (`section.orbit` +
 * `section.detail` and its script). The areas, their copy, the node icons, the scenes
 * and the ring geometry are the reference's own and live in this file; only what React
 * requires changed: JSX instead of `innerHTML` string building, state instead of
 * `classList`/`textContent` mutation, keydown on the widget instead of `document`, and
 * prefixed SVG `id`s so two instances on one page never collide.
 */

/** Areas of expertise, in node order (clockwise from the top). */
type AreaId = 'backend' | 'cloud' | 'ai' | 'quality' | 'data' | 'enterprise' | 'engineering'

/** Which side of its disc the node label hangs from. */
type LabelSide = 'top' | 'bottom' | 'left' | 'right'

type Area = {
  id: AreaId
  /** Mono label beside the node disc, as in the reference. */
  label: string
  /** Accessible name of the node button. */
  ariaLabel: string
  kicker: string
  title: string
  copy: string
  side: LabelSide
  /** Equidistant position on the orbit box, exactly as the reference placed it. */
  x: string
  y: string
}

/**
 * Seven equidistant positions (360 / 7 degrees) on the 82% diameter outer ring. The
 * percentages are the reference's own, so the visual density is unchanged.
 */
const AREAS: readonly Area[] = [
  {
    id: 'backend',
    label: 'SOFTWARE ENGINEER',
    ariaLabel: 'Mostrar Software Engineer',
    kicker: '01 — DEVELOPMENT',
    title: 'Software Engineer',
    copy: 'Desarrollo de software, APIs, microservicios, eventos y lógica de negocio.',
    side: 'top',
    x: '50.000000%',
    y: '9.000000%',
  },
  {
    id: 'cloud',
    label: 'CLOUD',
    ariaLabel: 'Mostrar Cloud',
    kicker: '02 — PLATFORM',
    title: 'Cloud & Infrastructure',
    copy: 'Infraestructura cloud, contenedores, automatización e IaC.',
    side: 'top',
    x: '82.055091%',
    y: '24.436918%',
  },
  {
    id: 'ai',
    label: 'AI',
    ariaLabel: 'Mostrar Inteligencia artificial',
    kicker: '03 — INTELLIGENCE',
    title: 'Artificial Intelligence',
    copy: 'Agentes inteligentes, LLMs y soluciones de IA aplicadas.',
    side: 'right',
    x: '89.972044%',
    y: '59.123358%',
  },
  {
    id: 'quality',
    label: 'QUALITY',
    ariaLabel: 'Mostrar Quality',
    kicker: '04 — RELIABILITY',
    title: 'Quality & Security',
    copy: 'Calidad de software, testing, observabilidad y seguridad.',
    side: 'bottom',
    x: '67.789233%',
    y: '86.939724%',
  },
  {
    id: 'data',
    label: 'DATA',
    ariaLabel: 'Mostrar Data',
    kicker: '05 — INSIGHTS',
    title: 'Data & Analytics',
    copy: 'Modelado de datos, métricas, pipelines y analítica.',
    side: 'bottom',
    x: '32.210767%',
    y: '86.939724%',
  },
  {
    id: 'enterprise',
    label: 'ENTERPRISE',
    ariaLabel: 'Mostrar Enterprise',
    kicker: '06 — SYSTEMS',
    title: 'Enterprise Architecture',
    copy: 'Sistemas empresariales, integraciones y plataformas conectadas.',
    side: 'left',
    x: '10.027956%',
    y: '59.123358%',
  },
  {
    id: 'engineering',
    label: 'ENGINEERING',
    ariaLabel: 'Mostrar Engineering',
    kicker: '07 — DELIVERY',
    title: 'Software Engineering',
    copy: 'Diseño de sistemas, arquitecturas mantenibles y entrega continua.',
    side: 'top',
    x: '17.944909%',
    y: '24.436918%',
  },
]

/** Enterprise is selected on load, as in the reference. */
const INITIAL_INDEX = AREAS.findIndex((area) => area.id === 'enterprise')

/** Scene count as the reference prints it (`06 / 07`). */
const TOTAL = String(AREAS.length).padStart(2, '0')

function pad(index: number) {
  return String(index + 1).padStart(2, '0')
}

/* ---------------------------------------------------------------------------
   Node icons: the reference's inline glyphs, one per area.
   --------------------------------------------------------------------------- */

const NODE_ICONS: Record<AreaId, ReactElement> = {
  backend: <path d="m8 8-4 4 4 4m8-8 4 4-4 4M14 4l-4 16" />,
  cloud: <path d="M7 18h10a4 4 0 0 0 .5-7.97A6 6 0 0 0 6 9.5 4.3 4.3 0 0 0 7 18Z" />,
  ai: (
    <path d="m12 3 1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7L12 3Zm7 12 .9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9L19 15ZM4 2l.9 2.1L7 5l-2.1.9L4 8l-.9-2.1L1 5l2.1-.9L4 2Z" />
  ),
  quality: <path d="m12 2 8 4v6c0 5-3 8.5-8 10-5-1.5-8-5-8-10V6l8-4Zm-4 10 2.6 2.6L16 9" />,
  data: (
    <>
      <ellipse cx="12" cy="5" rx="8" ry="3" />
      <path d="M4 5v14c0 1.6 3.6 3 8 3s8-1.4 8-3V5M4 10c0 1.7 3.6 3 8 3s8-1.3 8-3M4 15c0 1.7 3.6 3 8 3s8-1.3 8-3" />
    </>
  ),
  enterprise: (
    <>
      <rect x="3" y="6" width="18" height="15" rx="1.5" />
      <path d="M8 6V3h8v3M8 10h2v2H8zm6 0h2v2h-2zm-6 5h2v2H8zm6 0h2v2h-2zm-3 6v-4h2v4" />
    </>
  ),
  engineering: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
      <path d="M6.5 10v5a3 3 0 0 0 3 3H14" />
    </>
  ),
}

/* ---------------------------------------------------------------------------
   Scenes: the reference's inline illustrations, one per area.
   --------------------------------------------------------------------------- */

/**
 * Accessible descriptions of the scenes and the region, per locale. The visible copy of
 * the orbit stays verbatim Spanish as ported (the user's decision), but a screen reader
 * must not read Spanish on the English page, so these labels are the one translated part.
 */
const ARIA_LABELS = {
  region: { es: 'Explora siete áreas de especialidad', en: 'Explore seven areas of expertise' },
  backend: { es: 'Consola de API animada', en: 'Animated API console' },
  cloud: { es: 'Infraestructura cloud conectada', en: 'Connected cloud infrastructure' },
  ai: {
    es: 'Red neuronal de inteligencia artificial',
    en: 'Artificial intelligence neural network',
  },
  quality: {
    es: 'Escudo de calidad y pruebas verificadas',
    en: 'Quality shield with verified tests',
  },
  data: { es: 'Datos y analítica en tiempo real', en: 'Real-time data and analytics' },
  enterprise: {
    es: 'Plataforma empresarial con sistemas conectados',
    en: 'Enterprise platform with connected systems',
  },
  engineering: {
    es: 'Ciclo de ingeniería desde diseño hasta despliegue',
    en: 'Engineering cycle from design to deployment',
  },
} as const

const SCENES: Record<AreaId, ReactElement<SVGProps<SVGSVGElement>>> = {
  /* SOFTWARE ENGINEER: active development/API console with request/response trace */
  backend: (
    <svg viewBox="0 0 310 215" role="img" aria-label="Consola de API animada">
      <defs>
        <linearGradient id="expertise-terminal-glass" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#1c2b20" />
          <stop offset="1" stopColor="#101915" />
        </linearGradient>
        <filter id="expertise-term-glow">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>
      <g className={styles.enter}>
        <rect
          x="36"
          y="23"
          width="238"
          height="160"
          rx="13"
          fill="url(#expertise-terminal-glass)"
          stroke="#40523d"
        />
        <path d="M36 54H274" stroke="#304334" />
        <circle cx="54" cy="39" r="3.2" fill="#6a8b50" />
        <circle cx="65" cy="39" r="3.2" fill="#41574b" />
        <circle cx="76" cy="39" r="3.2" fill="#41574b" />
        <text
          x="155"
          y="42"
          textAnchor="middle"
          fontSize="7"
          letterSpacing="2"
          fill="#849789"
          className={styles.sMono}
        >
          SERVICE / API
        </text>
      </g>
      <g className={`${styles.sMono} ${styles.enterDelay}`} fontSize="9">
        <text x="52" y="79" fill="#d3fc8b">
          GET
        </text>
        <text x="80" y="79" fill="#a3b5a7">
          /api/v1/resources
        </text>
        <rect x="216" y="66" width="42" height="19" rx="4" fill="#254022" />
        <text x="237" y="79" textAnchor="middle" fontSize="8" fill="#cbff74">
          200
        </text>
        <text x="52" y="106" fill="#7a9383">
          {'{'}
        </text>
        <text x="67" y="122" fill="#cbff74">
          &quot;status&quot;
        </text>
        <text x="116" y="122" fill="#7a9383">
          :
        </text>
        <text x="128" y="122" fill="#cbd8ce">
          &quot;ok&quot;,
        </text>
        <text x="67" y="138" fill="#cbff74">
          &quot;latency&quot;
        </text>
        <text x="125" y="138" fill="#7a9383">
          :
        </text>
        <text x="137" y="138" fill="#cbd8ce">
          &quot;24ms&quot;
        </text>
        <text x="52" y="155" fill="#7a9383">
          {'}'}
        </text>
        <rect className={styles.blink} x="64" y="158" width="5" height="10" fill="#bffc56" />
      </g>
      <path d="M64 192H246" stroke="#253c2b" strokeDasharray="3 7" />
      <circle cx="97" cy="192" r="3" fill="#bffc56" className={styles.nodeLight} />
      <circle
        cx="155"
        cy="192"
        r="3"
        fill="#bffc56"
        className={styles.nodeLight}
        style={{ animationDelay: '-.7s' }}
      />
      <circle
        cx="213"
        cy="192"
        r="3"
        fill="#bffc56"
        className={styles.nodeLight}
        style={{ animationDelay: '-1.4s' }}
      />
    </svg>
  ),

  /* CLOUD: cloud with live service topology */
  cloud: (
    <svg viewBox="0 0 310 215" role="img" aria-label="Infraestructura cloud conectada">
      <defs>
        <filter id="expertise-cloud-light">
          <feGaussianBlur stdDeviation="10" />
        </filter>
      </defs>
      <ellipse
        cx="155"
        cy="74"
        rx="67"
        ry="34"
        fill="#bffc56"
        opacity=".06"
        filter="url(#expertise-cloud-light)"
      />
      <g className={styles.float}>
        <path
          d="M103 104c-20 0-31-12-31-27 0-14 12-26 27-27 6-21 25-35 46-35 25 0 43 15 49 36 19-1 34 11 34 28s-13 25-30 25H103Z"
          fill="#142119"
          stroke="#9ece61"
          strokeWidth="1.6"
          className={styles.draw}
        />
        <path
          d="M120 65l-11 11 11 11M143 65l11 11-11 11M138 61l-11 31"
          fill="none"
          stroke="#caff49"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.7"
        />
        <circle cx="181" cy="73" r="4" fill="#caff49" className={styles.pulse} />
      </g>
      <g fill="none" stroke="#87b454" strokeWidth="1.4" className={styles.dashOffset}>
        <path d="M154 106V129H71V145" />
        <path d="M154 106V145" />
        <path d="M154 129H239V145" />
      </g>
      <g className={styles.enterDelay}>
        <rect x="45" y="146" width="52" height="37" rx="7" fill="#17271b" stroke="#536e4b" />
        <rect x="129" y="146" width="52" height="37" rx="7" fill="#17271b" stroke="#536e4b" />
        <rect x="213" y="146" width="52" height="37" rx="7" fill="#17271b" stroke="#536e4b" />
        <g stroke="#718f69">
          <path d="M54 160H87M54 169H87M138 160H171M138 169H171M222 160H255M222 169H255" />
        </g>
        <g fill="#caff49">
          <circle className={styles.nodeLight} cx="59" cy="160" r="2" />
          <circle
            className={styles.nodeLight}
            cx="143"
            cy="160"
            r="2"
            style={{ animationDelay: '-.8s' }}
          />
          <circle
            className={styles.nodeLight}
            cx="227"
            cy="160"
            r="2"
            style={{ animationDelay: '-1.5s' }}
          />
        </g>
      </g>
      <text
        x="71"
        y="199"
        textAnchor="middle"
        fontSize="7.5"
        fill="#819787"
        className={styles.sMono}
      >
        NODE A
      </text>
      <text
        x="155"
        y="199"
        textAnchor="middle"
        fontSize="7.5"
        fill="#819787"
        className={styles.sMono}
      >
        NODE B
      </text>
      <text
        x="239"
        y="199"
        textAnchor="middle"
        fontSize="7.5"
        fill="#819787"
        className={styles.sMono}
      >
        NODE C
      </text>
    </svg>
  ),

  /* AI: neural graph, edge signals, central brain */
  ai: (
    <svg viewBox="0 0 310 215" role="img" aria-label="Red neuronal de inteligencia artificial">
      <g className={styles.rotateSlow} stroke="#314f37" fill="none">
        <ellipse cx="155" cy="105" rx="86" ry="68" strokeDasharray="3 11" />
        <ellipse cx="155" cy="105" rx="108" ry="87" strokeDasharray="2 13" />
      </g>
      <g className={styles.flow} fill="none" stroke="#b2df67" strokeWidth="1.3">
        <path d="M53 62L115 52L155 106L113 157L51 151" />
        <path d="M115 52L189 43L255 65L214 105L255 151L192 170L113 157" />
        <path d="M53 62L155 106L255 65M51 151L155 106L255 151M189 43L155 106L192 170" />
      </g>
      <g fill="#1a2a1d" stroke="#84ad60" strokeWidth="1.3">
        <circle cx="53" cy="62" r="8" />
        <circle cx="51" cy="151" r="8" />
        <circle cx="115" cy="52" r="8" />
        <circle cx="113" cy="157" r="8" />
        <circle cx="189" cy="43" r="8" />
        <circle cx="192" cy="170" r="8" />
        <circle cx="255" cy="65" r="8" />
        <circle cx="255" cy="151" r="8" />
        <circle cx="214" cy="105" r="7" />
      </g>
      <g fill="#caff49">
        <circle cx="53" cy="62" r="3" className={styles.nodeLight} />
        <circle cx="51" cy="151" r="3" className={styles.nodeLight} />
        <circle cx="115" cy="52" r="3" className={styles.nodeLight} />
        <circle cx="113" cy="157" r="3" className={styles.nodeLight} />
        <circle cx="189" cy="43" r="3" className={styles.nodeLight} />
        <circle cx="192" cy="170" r="3" className={styles.nodeLight} />
        <circle cx="255" cy="65" r="3" className={styles.nodeLight} />
        <circle cx="255" cy="151" r="3" className={styles.nodeLight} />
        <circle cx="214" cy="105" r="2.5" className={styles.nodeLight} />
      </g>
      <circle cx="155" cy="106" r="32" fill="#172617" stroke="#aad96b" strokeWidth="1.7" />
      <circle
        cx="155"
        cy="106"
        r="42"
        fill="none"
        stroke="#9bd04e"
        strokeWidth="1"
        className={styles.ping}
      />
      <g
        transform="translate(136 86)"
        stroke="#caff49"
        strokeWidth="1.6"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M19 5c-5-6-15-1-14 6-8 4-6 15 0 17-1 7 9 10 14 5 5 5 15 2 14-5 6-2 8-13 0-17 1-7-9-12-14-6Z" />
        <path d="M19 5v28M6 15c7-2 10 2 13 7m14-7c-7-2-10 2-14 7M10 27l9-5 9 5" />
      </g>
    </svg>
  ),

  /* QUALITY: shield scan + checks */
  quality: (
    <svg viewBox="0 0 310 215" role="img" aria-label="Escudo de calidad y pruebas verificadas">
      <circle
        cx="155"
        cy="103"
        r="93"
        fill="none"
        stroke="#284131"
        strokeWidth="1"
        strokeDasharray="2 10"
      />
      <circle cx="155" cy="103" r="78" fill="none" stroke="#354d38" strokeWidth="1" />
      <path
        d="M155 35 218 61v47c0 42-24 66-63 83-39-17-63-41-63-83V61l63-26Z"
        fill="#122019"
        stroke="#8cb760"
        strokeWidth="1.8"
        className={styles.draw}
      />
      <path
        d="M155 48 206 69v39c0 33-18 54-51 70-33-16-51-37-51-70V69l51-21Z"
        fill="none"
        stroke="#375439"
        strokeWidth="1"
      />
      <g>
        <path
          d="m126 108 19 20 40-43"
          stroke="#caff49"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          className={styles.draw}
        />
        <path
          d="m126 108 19 20 40-43"
          stroke="#caff49"
          strokeWidth="11"
          opacity=".08"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </g>
      <g className={styles.sweep}>
        <rect x="104" y="100" width="102" height="2" rx="1" fill="#caff49" />
        <rect x="104" y="102" width="102" height="17" fill="#caff49" opacity=".035" />
      </g>
      <g className={styles.sMono} fontSize="7.5" letterSpacing="1" fill="#92ad8b">
        <text x="39" y="88">
          TEST
        </text>
        <text x="247" y="88">
          PASS
        </text>
        <text x="39" y="158">
          CI/CD
        </text>
        <text x="247" y="158">
          100%
        </text>
      </g>
      <circle cx="41" cy="100" r="3" fill="#caff49" className={styles.blink} />
      <circle cx="271" cy="100" r="3" fill="#caff49" className={styles.blink} />
    </svg>
  ),

  /* DATA: animated chart and live trend */
  data: (
    <svg viewBox="0 0 310 215" role="img" aria-label="Datos y analítica en tiempo real">
      <g className={styles.enter}>
        <rect x="34" y="22" width="242" height="169" rx="11" fill="#111d17" stroke="#344a38" />
        <text x="52" y="43" className={styles.sMono} fontSize="8" letterSpacing="1" fill="#90a395">
          LIVE METRICS
        </text>
        <circle cx="255" cy="40" r="3" fill="#caff49" className={styles.blink} />
        <text x="51" y="73" className={styles.sMono} fontSize="22" fill="#e5f4dc">
          24.8%
        </text>
        <text x="146" y="70" className={styles.sMono} fontSize="8" fill="#b5ec6a">
          ↗ +8.4%
        </text>
        <g stroke="#293e30" strokeWidth="1">
          <path d="M51 93H258M51 119H258M51 145H258M51 171H258" />
        </g>
      </g>
      <g className={styles.enterDelay}>
        <rect
          className={styles.growBar}
          x="62"
          y="135"
          width="16"
          height="36"
          rx="3"
          fill="#46643e"
        />
        <rect
          className={styles.growBar}
          x="91"
          y="122"
          width="16"
          height="49"
          rx="3"
          fill="#668a46"
          style={{ animationDelay: '-.5s' }}
        />
        <rect
          className={styles.growBar}
          x="120"
          y="134"
          width="16"
          height="37"
          rx="3"
          fill="#587944"
          style={{ animationDelay: '-1.7s' }}
        />
        <rect
          className={styles.growBar}
          x="149"
          y="112"
          width="16"
          height="59"
          rx="3"
          fill="#83b04b"
          style={{ animationDelay: '-1.2s' }}
        />
        <rect
          className={styles.growBar}
          x="178"
          y="99"
          width="16"
          height="72"
          rx="3"
          fill="#9bd74a"
          style={{ animationDelay: '-2.1s' }}
        />
        <rect
          className={styles.growBar}
          x="207"
          y="82"
          width="16"
          height="89"
          rx="3"
          fill="#caff49"
          style={{ animationDelay: '-.8s' }}
        />
        <path
          d="M70 128 99 117 128 124 157 101 186 87 215 78"
          stroke="#d1ff88"
          strokeWidth="1.4"
          strokeDasharray="3 5"
          fill="none"
          className={styles.flow}
        />
        <circle cx="215" cy="78" r="5" fill="#caff49" />
        <circle cx="215" cy="78" r="10" fill="none" stroke="#caff49" className={styles.ping} />
      </g>
    </svg>
  ),

  /* ENTERPRISE: connected services and buildings */
  enterprise: (
    <svg
      viewBox="0 0 310 215"
      role="img"
      aria-label="Plataforma empresarial con sistemas conectados"
    >
      <defs>
        <linearGradient id="expertise-building-grad" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#243721" />
          <stop offset="1" stopColor="#111f17" />
        </linearGradient>
      </defs>
      <g fill="none" stroke="#557e45" strokeWidth="1.2" className={styles.dashOffset}>
        <path d="M155 48V25H76V65" />
        <path d="M155 48V25H234V65" />
        <path d="M76 144v25h79v-18" />
        <path d="M234 144v25h-79" />
      </g>
      <g fill="#bffc56">
        <circle className={styles.nodeLight} cx="76" cy="62" r="3" />
        <circle className={styles.nodeLight} cx="234" cy="62" r="3" />
        <circle className={styles.nodeLight} cx="76" cy="170" r="3" />
        <circle className={styles.nodeLight} cx="234" cy="170" r="3" />
      </g>
      <g className={styles.enter}>
        <rect x="44" y="70" width="63" height="72" rx="7" fill="#111c16" stroke="#47613e" />
        <rect x="203" y="70" width="63" height="72" rx="7" fill="#111c16" stroke="#47613e" />
        <path d="M58 84h35v45H58zM217 84h35v45h-35z" fill="none" stroke="#415a3d" />
        <g fill="#84aa60">
          <rect x="63" y="91" width="7" height="7" rx="1" />
          <rect x="80" y="91" width="7" height="7" rx="1" />
          <rect x="63" y="108" width="7" height="7" rx="1" />
          <rect x="80" y="108" width="7" height="7" rx="1" />
          <rect x="222" y="91" width="7" height="7" rx="1" />
          <rect x="239" y="91" width="7" height="7" rx="1" />
          <rect x="222" y="108" width="7" height="7" rx="1" />
          <rect x="239" y="108" width="7" height="7" rx="1" />
        </g>
      </g>
      <g className={styles.enterDelay}>
        <rect
          x="116"
          y="50"
          width="78"
          height="115"
          rx="9"
          fill="url(#expertise-building-grad)"
          stroke="#afd56a"
          strokeWidth="1.7"
        />
        <path d="M116 70h78" stroke="#4b6941" />
        <g
          stroke="#caff49"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M143 61h24M155 52v17" />
        </g>
        <g fill="#88b65f">
          <rect x="131" y="83" width="10" height="10" rx="2" />
          <rect x="150" y="83" width="10" height="10" rx="2" />
          <rect x="169" y="83" width="10" height="10" rx="2" />
          <rect x="131" y="103" width="10" height="10" rx="2" />
          <rect x="150" y="103" width="10" height="10" rx="2" />
          <rect x="169" y="103" width="10" height="10" rx="2" />
        </g>
        <g fill="#caff49">
          <rect x="131" y="123" width="10" height="10" rx="2" className={styles.nodeLight} />
          <rect x="150" y="123" width="10" height="10" rx="2" className={styles.nodeLight} />
          <rect x="169" y="123" width="10" height="10" rx="2" className={styles.nodeLight} />
        </g>
        <rect x="147" y="146" width="16" height="19" rx="2" fill="#394e30" />
        <circle
          cx="155"
          cy="108"
          r="54"
          fill="none"
          stroke="#bffc56"
          opacity=".18"
          className={styles.ping}
        />
      </g>
      <g className={styles.sMono} fontSize="7.5" fill="#90a78d">
        <text x="75" y="155" textAnchor="middle">
          SYSTEM A
        </text>
        <text x="235" y="155" textAnchor="middle">
          SYSTEM B
        </text>
        <text x="155" y="192" textAnchor="middle" letterSpacing="1.5">
          CONNECTED PLATFORM
        </text>
      </g>
    </svg>
  ),

  /* ENGINEERING: delivery pipeline and animated states */
  engineering: (
    <svg
      viewBox="0 0 310 215"
      role="img"
      aria-label="Ciclo de ingeniería desde diseño hasta despliegue"
    >
      <g className={styles.rotateSlow}>
        <circle cx="155" cy="102" r="96" stroke="#2a4432" strokeDasharray="3 12" fill="none" />
      </g>
      <path
        d="M74 104H237"
        stroke="#3d5b3b"
        strokeWidth="2"
        strokeDasharray="4 7"
        className={styles.flow}
      />
      <g className={styles.enter}>
        <rect x="25" y="72" width="80" height="63" rx="9" fill="#15241a" stroke="#678953" />
        <rect x="115" y="72" width="80" height="63" rx="9" fill="#182a1b" stroke="#a7d56a" />
        <rect x="205" y="72" width="80" height="63" rx="9" fill="#15241a" stroke="#678953" />
        <g
          stroke="#b8e86a"
          fill="none"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m58 93-10 10 10 10m15-20 10 10-10 10" />
          <path d="M144 110v-19h22v19h-22Zm-5 0h32M151 91v-7h8v7" />
          <path d="m231 102 12 12 21-25" />
        </g>
        <g className={styles.sMono} fontSize="8" letterSpacing="1.3" fill="#a1b39b">
          <text x="65" y="124" textAnchor="middle">
            DESIGN
          </text>
          <text x="155" y="124" textAnchor="middle">
            BUILD
          </text>
          <text x="245" y="124" textAnchor="middle">
            SHIP
          </text>
        </g>
      </g>
      <g className={styles.enterDelay}>
        <circle cx="110" cy="104" r="5" fill="#caff49" className={styles.pulse} />
        <circle cx="200" cy="104" r="5" fill="#caff49" className={styles.pulse} />
        <path
          d="M65 148v14h180v-14"
          fill="none"
          stroke="#46683e"
          strokeDasharray="4 6"
          className={styles.dashOffset}
        />
        <text
          x="155"
          y="184"
          textAnchor="middle"
          fill="#9bb191"
          fontSize="8"
          className={styles.sMono}
          letterSpacing="1.4"
        >
          CONTINUOUS DELIVERY
        </text>
      </g>
    </svg>
  ),
}

/**
 * The graph. Selecting a node (click) or pressing the arrow keys swaps the centre scene,
 * the mono category and index, and the detail block under the ring — the same four
 * places the reference rewrote from its script.
 */
export function ExpertiseOrbit() {
  const [selected, setSelected] = useState(INITIAL_INDEX)
  const locale = useLocale()
  const aria = useCallback((key: AreaId | 'region') => ARIA_LABELS[key][locale], [locale])

  const active = AREAS[selected] ?? AREAS[0]

  const select = useCallback((id: AreaId) => {
    const next = AREAS.findIndex((area) => area.id === id)
    if (next === -1) return
    setSelected((current) => (next === current ? current : next))
  }, [])

  // Arrow keys are handled on the widget instead of on `document`, so the widget never
  // steals the page's arrow-key scrolling; the key map is the reference's.
  const handleKeyDown = useCallback((event: KeyboardEvent<HTMLDivElement>) => {
    if (event.altKey || event.metaKey || event.ctrlKey) return

    const direction =
      event.key === 'ArrowRight' || event.key === 'ArrowDown'
        ? 1
        : event.key === 'ArrowLeft' || event.key === 'ArrowUp'
          ? -1
          : 0

    if (direction === 0) return

    event.preventDefault()
    setSelected((current) => (current + direction + AREAS.length) % AREAS.length)
  }, [])

  const sceneClass = `${styles.scene} ${styles.sceneActive}`

  return (
    <div className={styles.root} data-expertise-orbit onKeyDown={handleKeyDown}>
      <section className={styles.orbit} aria-label={aria('region')}>
        <div className={`${styles.orbitRing} ${styles.orbitRingOuter}`} aria-hidden="true" />
        <div className={`${styles.orbitRing} ${styles.orbitRingMiddle}`} aria-hidden="true" />
        <div className={`${styles.orbitRing} ${styles.orbitRingInner}`} aria-hidden="true" />
        <div className={styles.centerWash} aria-hidden="true" />

        <div className={styles.centerContent} aria-hidden="true">
          <div className={styles.centerStack}>
            <div className={styles.sceneWindow}>
              {AREAS.map((area) => (
                <div
                  key={area.id}
                  data-scene={area.id}
                  className={area.id === active.id ? sceneClass : styles.scene}
                >
                  {cloneElement(SCENES[area.id], { 'aria-label': aria(area.id) })}
                </div>
              ))}
            </div>
            <span className={styles.stageCategory}>{active.label}</span>
            <span className={styles.stageIndex}>{`${pad(selected)} / ${TOTAL}`}</span>
          </div>
        </div>

        {AREAS.map((area, index) => {
          const isActive = index === selected

          return (
            <button
              key={area.id}
              type="button"
              data-section={area.id}
              data-label={area.side}
              aria-label={area.ariaLabel}
              aria-pressed={isActive}
              onClick={() => select(area.id)}
              style={{ '--x': area.x, '--y': area.y } as CSSProperties}
              className={isActive ? `${styles.node} ${styles.nodeActive}` : styles.node}
            >
              <span className={styles.nodeDisc} aria-hidden="true">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  {NODE_ICONS[area.id]}
                </svg>
              </span>
              <span className={styles.nodeLabel}>{area.label}</span>
            </button>
          )
        })}
      </section>

      {/* The reference used an `h1`; the hero owns the page `h1`, so the detail title is
          a paragraph with the same class and metrics. */}
      <section className={styles.detail} aria-live="polite" aria-atomic="true">
        <div className={styles.detailKicker}>{active.kicker}</div>
        <p className={styles.detailTitle}>{active.title}</p>
        <p className={styles.detailCopy}>{active.copy}</p>
      </section>
    </div>
  )
}
