/** Hand-drawn-feel SVG decorations — one visual family: paper bunting, tape, doodles. */

const BUNTING_COLORS = ['#E63946', '#FFC93C', '#4DABF7', '#43A854', '#FF9F1C']

export function Bunting({ className = '' }: { className?: string }) {
  const flags = 14
  const w = 560
  const seg = w / flags
  return (
    <svg viewBox={`0 0 ${w} 84`} className={className} aria-hidden="true" preserveAspectRatio="xMidYMin meet">
      <path d={`M0,6 Q${w / 2},44 ${w},6`} fill="none" stroke="#3B2F2F" strokeWidth="2.5" strokeLinecap="round" />
      {Array.from({ length: flags }, (_, i) => {
        const x = seg * i + seg / 2
        const t = i / (flags - 1)
        const y = 6 + Math.sin(t * Math.PI) * 30
        const c = BUNTING_COLORS[i % BUNTING_COLORS.length]
        return (
          <g key={i}>
            <path d={`M${x - seg / 2 + 2},${y + 2} L${x + seg / 2 - 2},${y + 2} L${x},${y + 26} Z`} fill={c} stroke="#3B2F2F" strokeWidth="2" strokeLinejoin="round" />
            <circle cx={x} cy={y + 2} r="2.4" fill="#3B2F2F" />
          </g>
        )
      })}
    </svg>
  )
}

export function Tape({ className = '', color = 'var(--color-butter)', rotate = '-6deg' }: {
  className?: string
  color?: string
  rotate?: string
}) {
  return (
    <span
      className={`tape ${className}`}
      aria-hidden="true"
      style={{ ['--tape-color' as string]: color, transform: `rotate(${rotate})` }}
    />
  )
}

/** Wobbly hand-drawn star */
export function DoodleStar({ className = '', color = '#E63946' }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <path
        d="M20 3 L24.5 14.5 L36.5 15 L27 22.5 L30 34.5 L20 28 L10 34.5 L13 22.5 L3.5 15 L15.5 14.5 Z"
        fill="none" stroke={color} strokeWidth="3" strokeLinejoin="round" strokeLinecap="round"
      />
    </svg>
  )
}

/** Squiggle underline for headings */
export function Squiggle({ className = '', color = '#E63946' }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 120 12" className={className} aria-hidden="true" preserveAspectRatio="none">
      <path d="M2 8 Q 12 2, 22 8 T 42 8 T 62 8 T 82 8 T 102 8 T 122 8" fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" />
    </svg>
  )
}

/** Section divider: stitched dashed line */
export function Stitch({ className = '' }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`mx-auto max-w-md border-t-[3px] border-dashed border-ink/20 ${className}`} />
  )
}
