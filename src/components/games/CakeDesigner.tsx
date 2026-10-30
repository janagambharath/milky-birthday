import { useMemo, useState } from 'react'
import { PartyPopper, RotateCcw } from 'lucide-react'
import { celebrateBig } from '../../lib/confetti'
import { BIRTHDAY } from '../../data/birthday'

const BASE_COLORS = ['#F4A7C3', '#E63946', '#4DABF7', '#43A854', '#FFC93C', '#B565D8', '#FF9F1C']
const FROST_COLORS = ['#FFFFFF', '#FFE8E9', '#FFF3C4', '#D6EBFF', '#DFF5E1', '#E63946', '#4DABF7']
const MESSAGES = ['Happy Birthday Milky!', 'Milky is 13!', 'Best Sister Ever', 'Make a Wish!']

/** deterministic pseudo-random from an index — stable across renders */
function prand(i: number, salt: number): number {
  const x = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453
  return x - Math.floor(x)
}

interface CakeSpec {
  base: string
  frosting: string
  sprinkles: boolean
  cherries: boolean
  strawberries: boolean
  candles: number
  message: string
  lit: boolean
}

function CakeSvg({ spec }: { spec: CakeSpec }) {
  const sprinkles = useMemo(
    () =>
      Array.from({ length: 26 }, (_, i) => ({
        x: 70 + prand(i, 1) * 260,
        y: 200 + prand(i, 2) * 110,
        r: 2.6 + prand(i, 3) * 2.2,
        c: BASE_COLORS[Math.floor(prand(i, 4) * BASE_COLORS.length)],
        rot: prand(i, 5) * 90,
      })),
    [],
  )
  const cherryPos = useMemo(
    () => Array.from({ length: 7 }, (_, i) => ({ x: 80 + i * 40 + prand(i, 6) * 14, y: 168 + prand(i, 7) * 10 })),
    [],
  )
  const berryPos = useMemo(
    () => Array.from({ length: 5 }, (_, i) => ({ x: 96 + i * 52, y: 252 + prand(i, 8) * 40 })),
    [],
  )
  const candleXs = useMemo(() => {
    const n = spec.candles
    if (n === 0) return []
    const span = Math.min(240, n * 26)
    const start = 200 - span / 2
    return Array.from({ length: n }, (_, i) => start + (n === 1 ? span / 2 : (span * i) / (n - 1)))
  }, [spec.candles])

  return (
    <svg viewBox="0 0 400 400" className="mx-auto h-auto w-full max-w-sm" role="img" aria-label={`Milky's designed birthday cake: ${spec.message}`}>
      {/* plate */}
      <ellipse cx="200" cy="348" rx="160" ry="22" fill="#F7ECD7" stroke="#3B2F2F" strokeWidth="3" />
      {/* body */}
      <rect x="60" y="190" width="280" height="150" rx="14" fill={spec.base} stroke="#3B2F2F" strokeWidth="3" />
      {/* frosting drips */}
      <path
        d="M60 204 Q60 190 74 190 L326 190 Q340 190 340 204 L340 218 Q330 232 320 218 Q310 204 300 218 Q290 232 280 218 Q270 204 260 218 Q250 232 240 218 Q230 204 220 218 Q210 232 200 218 Q190 204 180 218 Q170 232 160 218 Q150 204 140 218 Q130 232 120 218 Q110 204 100 218 Q90 232 80 218 Q70 206 60 218 Z"
        fill={spec.frosting} stroke="#3B2F2F" strokeWidth="3"
      />
      {/* layers line */}
      <line x1="60" y1="268" x2="340" y2="268" stroke="#3B2F2F" strokeWidth="2" opacity="0.25" />

      {spec.sprinkles && sprinkles.map((s, i) => (
        <rect key={i} x={s.x} y={s.y} width={s.r * 2.4} height={s.r * 1.1} rx={s.r / 2} fill={s.c}
          transform={`rotate(${s.rot} ${s.x} ${s.y})`} />
      ))}

      {spec.strawberries && berryPos.map((p, i) => (
        <g key={i}>
          <path d={`M${p.x} ${p.y} q10 -2 12 10 q-4 12 -12 12 q-8 0 -12 -12 q2 -12 12 -10`} fill="#E63946" stroke="#3B2F2F" strokeWidth="2" />
          <path d={`M${p.x - 8} ${p.y + 2} l16 0 l-4 -8 l-4 4 l-4 -4 Z`} fill="#43A854" stroke="#3B2F2F" strokeWidth="1.6" />
        </g>
      ))}

      {spec.cherries && cherryPos.map((p, i) => (
        <g key={i}>
          <path d={`M${p.x} ${p.y} q2 -14 12 -18`} fill="none" stroke="#2F7D3E" strokeWidth="2.5" />
          <circle cx={p.x} cy={p.y + 6} r="9" fill="#C1121F" stroke="#3B2F2F" strokeWidth="2" />
          <circle cx={p.x - 3} cy={p.y + 3} r="2.6" fill="#fff" opacity="0.7" />
        </g>
      ))}

      {/* candles */}
      {candleXs.map((x, i) => (
        <g key={i}>
          <rect x={x - 5} y={118} width="10" height="52" rx="4" fill={['#4DABF7', '#FFC93C', '#E63946', '#43A854'][i % 4]} stroke="#3B2F2F" strokeWidth="2" />
          <line x1={x} y1={118} x2={x} y2={110} stroke="#3B2F2F" strokeWidth="2.5" />
          {spec.lit && (
            <g className="animate-flicker" style={{ transformOrigin: `${x}px 100px`, transformBox: 'fill-box' }}>
              <ellipse cx={x} cy={100} rx="7" ry="11" fill="#FFC93C" stroke="#E8850C" strokeWidth="1.5" />
              <ellipse cx={x} cy={102} rx="3.4" ry="6" fill="#FFF3C4" />
            </g>
          )}
        </g>
      ))}

      {/* message plaque */}
      <rect x="90" y="292" width="220" height="34" rx="17" fill="#fff" stroke="#3B2F2F" strokeWidth="2.5" />
      <text x="200" y="314" textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight="600" fontSize="16" fill="#3B2F2F">
        {spec.message}
      </text>
    </svg>
  )
}

function Swatches({ label, colors, value, onPick }: {
  label: string; colors: string[]; value: string; onPick: (c: string) => void
}) {
  return (
    <div>
      <p className="font-display mb-2 text-sm font-semibold text-ink" id={`${label}-label`}>{label}</p>
      <div className="flex flex-wrap gap-2" role="group" aria-labelledby={`${label}-label`}>
        {colors.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => onPick(c)}
            aria-label={`${label} ${c}`}
            aria-pressed={value === c}
            className={`h-9 w-9 rounded-full border-[2.5px] transition focus-visible:outline-3 focus-visible:outline-sky ${value === c ? 'border-ink scale-110' : 'border-ink/25'}`}
            style={{ backgroundColor: c }}
          />
        ))}
      </div>
    </div>
  )
}

/** Game 3 — design your own birthday cake, then celebrate it. */
export default function CakeDesigner() {
  const [spec, setSpec] = useState<CakeSpec>({
    base: '#F4A7C3', frosting: '#FFFFFF', sprinkles: true,
    cherries: false, strawberries: false, candles: 13,
    message: MESSAGES[0], lit: false,
  })
  const set = (patch: Partial<CakeSpec>) => setSpec((s) => ({ ...s, ...patch }))

  const toggle = (key: 'sprinkles' | 'cherries' | 'strawberries') => set({ [key]: !spec[key] })

  return (
    <div className="p-4 sm:p-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl bg-paper p-3">
          <CakeSvg spec={spec} />
        </div>

        <div className="flex flex-col gap-5">
          <Swatches label="Cake colour" colors={BASE_COLORS} value={spec.base} onPick={(c) => set({ base: c })} />
          <Swatches label="Frosting colour" colors={FROST_COLORS} value={spec.frosting} onPick={(c) => set({ frosting: c })} />

          <div>
            <p className="font-display mb-2 text-sm font-semibold text-ink">Toppings</p>
            <div className="flex flex-wrap gap-2">
              {(['sprinkles', 'cherries', 'strawberries'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => toggle(t)}
                  aria-pressed={spec[t]}
                  className={`btn-sticker px-4 py-1.5 text-sm capitalize ${spec[t] ? 'bg-leaf text-white' : 'bg-white text-ink'}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="candle-count" className="font-display mb-2 block text-sm font-semibold text-ink">
              Candles: <span className="text-cherry">{spec.candles}</span>
            </label>
            <input
              id="candle-count"
              type="range" min={0} max={13} value={spec.candles}
              onChange={(e) => set({ candles: Number(e.target.value), lit: false })}
              className="w-full accent-[#E63946]"
            />
          </div>

          <div>
            <label htmlFor="cake-message" className="font-display mb-2 block text-sm font-semibold text-ink">Cake message</label>
            <div className="flex flex-wrap gap-2">
              {MESSAGES.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => set({ message: m })}
                  aria-pressed={spec.message === m}
                  className={`btn-sticker px-4 py-1.5 text-sm ${spec.message === m ? 'bg-sky text-white' : 'bg-white text-ink'}`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-auto flex flex-wrap gap-3 pt-2">
            <button
              type="button"
              onClick={() => { set({ lit: true }); celebrateBig() }}
              className="btn-sticker flex items-center gap-2 bg-cherry px-6 py-2.5 text-white"
            >
              <PartyPopper className="h-5 w-5" aria-hidden="true" /> Light it up!
            </button>
            <button
              type="button"
              onClick={() => setSpec({ base: '#F4A7C3', frosting: '#FFFFFF', sprinkles: false, cherries: false, strawberries: false, candles: 13, message: MESSAGES[0], lit: false })}
              className="btn-sticker flex items-center gap-2 bg-white px-6 py-2.5 text-ink"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" /> Reset
            </button>
          </div>
        </div>
      </div>
      <p className="sr-only">Cake designed for {BIRTHDAY.name}</p>
    </div>
  )
}
