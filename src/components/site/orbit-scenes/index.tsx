import type { ReactElement } from 'react'

import styles from '../skills-orbit.module.css'

/**
 * The seven animated inline-SVG scenes of the skills orbit, ported from the
 * reference `expertise-orbit-interactivo.html` file.
 *
 * The reference hardcoded one dark green palette (lime highlights over near-black
 * surfaces). Here the greens are rebuilt from `var(--primary)` plus `color-mix()`
 * against the portfolio surface tokens, so the illustrations follow the theme
 * (dark/light) instead of pinning one set of hex values. Animation and typography
 * classes come from the CSS module; geometry, opacity and blur values are unchanged.
 */

export type SceneId = 'backend' | 'cloud' | 'ai' | 'quality' | 'data' | 'enterprise' | 'engineering'

/* Accent ramp, from the reference's lime highlights to its deep green panels. */
const accent = 'var(--primary)'
const accentSoft = 'color-mix(in srgb, var(--primary) 72%, var(--foreground))'
const accentMid = 'color-mix(in srgb, var(--primary) 55%, var(--muted-foreground))'
const accentDeep = 'color-mix(in srgb, var(--primary) 32%, var(--card))'

/* Line ramp. */
const line = 'color-mix(in srgb, var(--primary) 24%, var(--border))'
const lineBright = 'color-mix(in srgb, var(--primary) 42%, var(--border))'
const lineDim = 'color-mix(in srgb, var(--primary) 12%, var(--border))'

/* Surface ramp. */
const panel = 'var(--card)'
const panelDeep = 'color-mix(in srgb, var(--card) 80%, var(--background))'
const panelTint = 'color-mix(in srgb, var(--card) 88%, var(--primary))'

/* Text ramp. */
const text = 'var(--foreground)'
const textMuted = 'var(--muted-foreground)'
const textDim = 'color-mix(in srgb, var(--muted-foreground) 72%, var(--background))'

/** BACKEND — API console with a request/response trace. */
function BackendScene() {
  return (
    <svg viewBox="0 0 310 215" role="img" aria-label="Consola de API animada">
      <defs>
        <linearGradient id="orbit-terminal-glass" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor={panelTint} />
          <stop offset="1" stopColor={panelDeep} />
        </linearGradient>
        <filter id="orbit-term-glow">
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
          fill="url(#orbit-terminal-glass)"
          stroke={line}
        />
        <path d="M36 54H274" stroke={lineDim} />
        <circle cx="54" cy="39" r="3.2" fill={accentMid} />
        <circle cx="65" cy="39" r="3.2" fill={line} />
        <circle cx="76" cy="39" r="3.2" fill={line} />
        <text
          x="155"
          y="42"
          textAnchor="middle"
          fontSize="7"
          letterSpacing="2"
          fill={textDim}
          className={styles.sMono}
        >
          SERVICE / API
        </text>
      </g>
      <g className={`${styles.sMono} ${styles.enterDelay}`} fontSize="9">
        <text x="52" y="79" fill={accentSoft}>
          GET
        </text>
        <text x="80" y="79" fill={textMuted}>
          /api/v1/resources
        </text>
        <rect x="216" y="66" width="42" height="19" rx="4" fill={accentDeep} />
        <text x="237" y="79" textAnchor="middle" fontSize="8" fill={accent}>
          200
        </text>
        <text x="52" y="106" fill={textDim}>
          {'{'}
        </text>
        <text x="67" y="122" fill={accent}>
          &quot;status&quot;
        </text>
        <text x="116" y="122" fill={textDim}>
          :
        </text>
        <text x="128" y="122" fill={text}>
          &quot;ok&quot;,
        </text>
        <text x="67" y="138" fill={accent}>
          &quot;latency&quot;
        </text>
        <text x="125" y="138" fill={textDim}>
          :
        </text>
        <text x="137" y="138" fill={text}>
          &quot;24ms&quot;
        </text>
        <text x="52" y="155" fill={textDim}>
          {'}'}
        </text>
        <rect className={styles.blink} x="64" y="158" width="5" height="10" fill={accent} />
      </g>
      <path d="M64 192H246" stroke={lineDim} strokeDasharray="3 7" />
      <circle cx="97" cy="192" r="3" fill={accent} className={styles.nodeLight} />
      <circle
        cx="155"
        cy="192"
        r="3"
        fill={accent}
        className={styles.nodeLight}
        style={{ animationDelay: '-.7s' }}
      />
      <circle
        cx="213"
        cy="192"
        r="3"
        fill={accent}
        className={styles.nodeLight}
        style={{ animationDelay: '-1.4s' }}
      />
    </svg>
  )
}

/** CLOUD — cloud with a live service topology. */
function CloudScene() {
  return (
    <svg viewBox="0 0 310 215" role="img" aria-label="Infraestructura cloud conectada">
      <defs>
        <filter id="orbit-cloud-light">
          <feGaussianBlur stdDeviation="10" />
        </filter>
      </defs>
      <ellipse
        cx="155"
        cy="74"
        rx="67"
        ry="34"
        fill={accent}
        opacity=".06"
        filter="url(#orbit-cloud-light)"
      />
      <g className={styles.float}>
        <path
          d="M103 104c-20 0-31-12-31-27 0-14 12-26 27-27 6-21 25-35 46-35 25 0 43 15 49 36 19-1 34 11 34 28s-13 25-30 25H103Z"
          fill={panel}
          stroke={lineBright}
          strokeWidth="1.6"
          className={styles.draw}
        />
        <path
          d="M120 65l-11 11 11 11M143 65l11 11-11 11M138 61l-11 31"
          fill="none"
          stroke={accent}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.7"
        />
        <circle cx="181" cy="73" r="4" fill={accent} className={styles.pulse} />
      </g>
      <g fill="none" stroke={accentMid} strokeWidth="1.4" className={styles.dashOffset}>
        <path d="M154 106V129H71V145" />
        <path d="M154 106V145" />
        <path d="M154 129H239V145" />
      </g>
      <g className={styles.enterDelay}>
        <rect x="45" y="146" width="52" height="37" rx="7" fill={panel} stroke={line} />
        <rect x="129" y="146" width="52" height="37" rx="7" fill={panel} stroke={line} />
        <rect x="213" y="146" width="52" height="37" rx="7" fill={panel} stroke={line} />
        <g stroke={lineBright}>
          <path d="M54 160H87M54 169H87M138 160H171M138 169H171M222 160H255M222 169H255" />
        </g>
        <g fill={accent}>
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
        fill={textMuted}
        className={styles.sMono}
      >
        NODE A
      </text>
      <text
        x="155"
        y="199"
        textAnchor="middle"
        fontSize="7.5"
        fill={textMuted}
        className={styles.sMono}
      >
        NODE B
      </text>
      <text
        x="239"
        y="199"
        textAnchor="middle"
        fontSize="7.5"
        fill={textMuted}
        className={styles.sMono}
      >
        NODE C
      </text>
    </svg>
  )
}

/** AI — neural graph with edge signals and a central brain. */
function AiScene() {
  return (
    <svg viewBox="0 0 310 215" role="img" aria-label="Red neuronal de inteligencia artificial">
      <g className={styles.rotateSlow} stroke={lineDim} fill="none">
        <ellipse cx="155" cy="105" rx="86" ry="68" strokeDasharray="3 11" />
        <ellipse cx="155" cy="105" rx="108" ry="87" strokeDasharray="2 13" />
      </g>
      <g className={styles.flow} fill="none" stroke={accentMid} strokeWidth="1.3">
        <path d="M53 62L115 52L155 106L113 157L51 151" />
        <path d="M115 52L189 43L255 65L214 105L255 151L192 170L113 157" />
        <path d="M53 62L155 106L255 65M51 151L155 106L255 151M189 43L155 106L192 170" />
      </g>
      <g fill={panel} stroke={lineBright} strokeWidth="1.3">
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
      <g fill={accent}>
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
      <circle cx="155" cy="106" r="32" fill={panel} stroke={lineBright} strokeWidth="1.7" />
      <circle
        cx="155"
        cy="106"
        r="42"
        fill="none"
        stroke={accentMid}
        strokeWidth="1"
        className={styles.ping}
      />
      <g
        transform="translate(136 86)"
        stroke={accent}
        strokeWidth="1.6"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M19 5c-5-6-15-1-14 6-8 4-6 15 0 17-1 7 9 10 14 5 5 5 15 2 14-5 6-2 8-13 0-17 1-7-9-12-14-6Z" />
        <path d="M19 5v28M6 15c7-2 10 2 13 7m14-7c-7-2-10 2-14 7M10 27l9-5 9 5" />
      </g>
    </svg>
  )
}

/** QUALITY — shield with a scan sweep and verified checks. */
function QualityScene() {
  return (
    <svg viewBox="0 0 310 215" role="img" aria-label="Escudo de calidad y pruebas verificadas">
      <circle
        cx="155"
        cy="103"
        r="93"
        fill="none"
        stroke={lineDim}
        strokeWidth="1"
        strokeDasharray="2 10"
      />
      <circle cx="155" cy="103" r="78" fill="none" stroke={line} strokeWidth="1" />
      <path
        d="M155 35 218 61v47c0 42-24 66-63 83-39-17-63-41-63-83V61l63-26Z"
        fill={panelDeep}
        stroke={lineBright}
        strokeWidth="1.8"
        className={styles.draw}
      />
      <path
        d="M155 48 206 69v39c0 33-18 54-51 70-33-16-51-37-51-70V69l51-21Z"
        fill="none"
        stroke={line}
        strokeWidth="1"
      />
      <g>
        <path
          d="m126 108 19 20 40-43"
          stroke={accent}
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          className={styles.draw}
        />
        <path
          d="m126 108 19 20 40-43"
          stroke={accent}
          strokeWidth="11"
          opacity=".08"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </g>
      <g className={styles.sweep}>
        <rect x="104" y="100" width="102" height="2" rx="1" fill={accent} />
        <rect x="104" y="102" width="102" height="17" fill={accent} opacity=".035" />
      </g>
      <g className={styles.sMono} fontSize="7.5" letterSpacing="1" fill={textMuted}>
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
      <circle cx="41" cy="100" r="3" fill={accent} className={styles.blink} />
      <circle cx="271" cy="100" r="3" fill={accent} className={styles.blink} />
    </svg>
  )
}

/** DATA — animated chart with a live trend. */
function DataScene() {
  return (
    <svg viewBox="0 0 310 215" role="img" aria-label="Datos y analítica en tiempo real">
      <g className={styles.enter}>
        <rect x="34" y="22" width="242" height="169" rx="11" fill={panelDeep} stroke={line} />
        <text
          x="52"
          y="43"
          className={styles.sMono}
          fontSize="8"
          letterSpacing="1"
          fill={textMuted}
        >
          LIVE METRICS
        </text>
        <circle cx="255" cy="40" r="3" fill={accent} className={styles.blink} />
        <text x="51" y="73" className={styles.sMono} fontSize="22" fill={text}>
          24.8%
        </text>
        <text x="146" y="70" className={styles.sMono} fontSize="8" fill={accentSoft}>
          ↗ +8.4%
        </text>
        <g stroke={lineDim} strokeWidth="1">
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
          fill="color-mix(in srgb, var(--primary) 18%, var(--card))"
        />
        <rect
          className={styles.growBar}
          x="91"
          y="122"
          width="16"
          height="49"
          rx="3"
          fill="color-mix(in srgb, var(--primary) 28%, var(--card))"
          style={{ animationDelay: '-.5s' }}
        />
        <rect
          className={styles.growBar}
          x="120"
          y="134"
          width="16"
          height="37"
          rx="3"
          fill="color-mix(in srgb, var(--primary) 24%, var(--card))"
          style={{ animationDelay: '-1.7s' }}
        />
        <rect
          className={styles.growBar}
          x="149"
          y="112"
          width="16"
          height="59"
          rx="3"
          fill="color-mix(in srgb, var(--primary) 38%, var(--card))"
          style={{ animationDelay: '-1.2s' }}
        />
        <rect
          className={styles.growBar}
          x="178"
          y="99"
          width="16"
          height="72"
          rx="3"
          fill="color-mix(in srgb, var(--primary) 52%, var(--card))"
          style={{ animationDelay: '-2.1s' }}
        />
        <rect
          className={styles.growBar}
          x="207"
          y="82"
          width="16"
          height="89"
          rx="3"
          fill={accent}
          style={{ animationDelay: '-.8s' }}
        />
        <path
          d="M70 128 99 117 128 124 157 101 186 87 215 78"
          stroke={accentSoft}
          strokeWidth="1.4"
          strokeDasharray="3 5"
          fill="none"
          className={styles.flow}
        />
        <circle cx="215" cy="78" r="5" fill={accent} />
        <circle cx="215" cy="78" r="10" fill="none" stroke={accent} className={styles.ping} />
      </g>
    </svg>
  )
}

/** ENTERPRISE — connected services and buildings. */
function EnterpriseScene() {
  return (
    <svg
      viewBox="0 0 310 215"
      role="img"
      aria-label="Plataforma empresarial con sistemas conectados"
    >
      <defs>
        <linearGradient id="orbit-building-grad" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor={panelTint} />
          <stop offset="1" stopColor={panelDeep} />
        </linearGradient>
      </defs>
      <g fill="none" stroke={accentMid} strokeWidth="1.2" className={styles.dashOffset}>
        <path d="M155 48V25H76V65" />
        <path d="M155 48V25H234V65" />
        <path d="M76 144v25h79v-18" />
        <path d="M234 144v25h-79" />
      </g>
      <g fill={accent}>
        <circle className={styles.nodeLight} cx="76" cy="62" r="3" />
        <circle className={styles.nodeLight} cx="234" cy="62" r="3" />
        <circle className={styles.nodeLight} cx="76" cy="170" r="3" />
        <circle className={styles.nodeLight} cx="234" cy="170" r="3" />
      </g>
      <g className={styles.enter}>
        <rect x="44" y="70" width="63" height="72" rx="7" fill={panel} stroke={line} />
        <rect x="203" y="70" width="63" height="72" rx="7" fill={panel} stroke={line} />
        <path d="M58 84h35v45H58zM217 84h35v45h-35z" fill="none" stroke={line} />
        <g fill={lineBright}>
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
          fill="url(#orbit-building-grad)"
          stroke={lineBright}
          strokeWidth="1.7"
        />
        <path d="M116 70h78" stroke={line} />
        <g
          stroke={accent}
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M143 61h24M155 52v17" />
        </g>
        <g fill={lineBright}>
          <rect x="131" y="83" width="10" height="10" rx="2" />
          <rect x="150" y="83" width="10" height="10" rx="2" />
          <rect x="169" y="83" width="10" height="10" rx="2" />
          <rect x="131" y="103" width="10" height="10" rx="2" />
          <rect x="150" y="103" width="10" height="10" rx="2" />
          <rect x="169" y="103" width="10" height="10" rx="2" />
        </g>
        <g fill={accent}>
          <rect x="131" y="123" width="10" height="10" rx="2" className={styles.nodeLight} />
          <rect x="150" y="123" width="10" height="10" rx="2" className={styles.nodeLight} />
          <rect x="169" y="123" width="10" height="10" rx="2" className={styles.nodeLight} />
        </g>
        <rect x="147" y="146" width="16" height="19" rx="2" fill={line} />
        <circle
          cx="155"
          cy="108"
          r="54"
          fill="none"
          stroke={accent}
          opacity=".18"
          className={styles.ping}
        />
      </g>
      <g className={styles.sMono} fontSize="7.5" fill={textMuted}>
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
  )
}

/** ENGINEERING — delivery pipeline from design to deploy. */
function EngineeringScene() {
  return (
    <svg
      viewBox="0 0 310 215"
      role="img"
      aria-label="Ciclo de ingeniería desde diseño hasta despliegue"
    >
      <g className={styles.rotateSlow}>
        <circle cx="155" cy="102" r="96" stroke={lineDim} strokeDasharray="3 12" fill="none" />
      </g>
      <path
        d="M74 104H237"
        stroke={line}
        strokeWidth="2"
        strokeDasharray="4 7"
        className={styles.flow}
      />
      <g className={styles.enter}>
        <rect x="25" y="72" width="80" height="63" rx="9" fill={panel} stroke={line} />
        <rect x="115" y="72" width="80" height="63" rx="9" fill={panelTint} stroke={lineBright} />
        <rect x="205" y="72" width="80" height="63" rx="9" fill={panel} stroke={line} />
        <g
          stroke={accentSoft}
          fill="none"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m58 93-10 10 10 10m15-20 10 10-10 10" />
          <path d="M144 110v-19h22v19h-22Zm-5 0h32M151 91v-7h8v7" />
          <path d="m231 102 12 12 21-25" />
        </g>
        <g className={styles.sMono} fontSize="8" letterSpacing="1.3" fill={textMuted}>
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
        <circle cx="110" cy="104" r="5" fill={accent} className={styles.pulse} />
        <circle cx="200" cy="104" r="5" fill={accent} className={styles.pulse} />
        <path
          d="M65 148v14h180v-14"
          fill="none"
          stroke={line}
          strokeDasharray="4 6"
          className={styles.dashOffset}
        />
        <text
          x="155"
          y="184"
          textAnchor="middle"
          fill={textMuted}
          fontSize="8"
          className={styles.sMono}
          letterSpacing="1.4"
        >
          CONTINUOUS DELIVERY
        </text>
      </g>
    </svg>
  )
}

/** The scene rendered inside the orbit centre, keyed by section id. */
export const sceneRenderers: Record<SceneId, () => ReactElement> = {
  backend: BackendScene,
  cloud: CloudScene,
  ai: AiScene,
  quality: QualityScene,
  data: DataScene,
  enterprise: EnterpriseScene,
  engineering: EngineeringScene,
}
