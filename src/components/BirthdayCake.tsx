import { useEffect, useRef, useState } from 'react'
import { Flame, Mic, VolumeX, Wind } from 'lucide-react'
import { BIRTHDAY } from '../data/birthday'
import { Reveal } from './Reveal'
import { celebrateBig } from '../lib/confetti'

const CANDLE_COLORS = ['#E63946', '#4DABF7', '#FFC93C', '#43A854', '#FF9F1C']

/** One candle: striped stick + flame. Tap toggles it. */
function Candle({ lit, color, index, onToggle }: {
  lit: boolean; color: string; index: number; onToggle: () => void
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={lit}
      aria-label={`Candle ${index + 1}, ${lit ? 'lit' : 'unlit'} — tap to ${lit ? 'blow out' : 'light'}`}
      className="flex w-8 cursor-pointer flex-col items-center focus-visible:outline-3 focus-visible:outline-cherry sm:w-10"
      style={{ touchAction: 'manipulation' }}
    >
      <span className="flex h-10 items-end justify-center sm:h-12" aria-hidden="true">
        {lit ? (
          <span className="animate-flicker block">
            <svg viewBox="0 0 20 30" className="h-9 w-5 sm:h-11 sm:w-6">
              <ellipse cx="10" cy="18" rx="7" ry="11" fill="#FFC93C" stroke="#E8850C" strokeWidth="1.5" />
              <ellipse cx="10" cy="20" rx="3.2" ry="6" fill="#FFF3C4" />
            </svg>
          </span>
        ) : (
          <span className="block h-9 w-1 rounded-full bg-ink/30 sm:h-11" />
        )}
      </span>
      <span
        className="block h-16 w-4 rounded-t-md border-2 border-b-0 border-ink sm:h-20 sm:w-5"
        aria-hidden="true"
        style={{
          background: `repeating-linear-gradient(45deg, ${color}, ${color} 6px, #ffffff 6px, #ffffff 12px)`,
          opacity: lit ? 1 : 0.55,
        }}
      />
    </button>
  )
}

/** The birthday cake: 13 candles to light, then blow out — by tap, or for real with the mic. */
export function BirthdayCake() {
  const [lit, setLit] = useState<boolean[]>(Array(13).fill(false))
  const [listening, setListening] = useState(false)
  const [micError, setMicError] = useState<string | null>(null)
  const [wished, setWished] = useState(false)
  const celebrated = useRef(false)
  const stopMic = useRef<(() => void) | null>(null)

  const litCount = lit.filter(Boolean).length
  const allOut = litCount === 0

  useEffect(() => {
    if (allOut && !celebrated.current && wished) {
      celebrated.current = true
      celebrateBig()
    }
  }, [allOut, wished])

  useEffect(() => () => stopMic.current?.(), [])

  const lightAll = () => {
    celebrated.current = false
    setWished(false)
    setLit(Array(13).fill(true))
  }

  const blowAll = () => {
    stopMic.current?.()
    setListening(false)
    // staggered poof, one by one
    lit.forEach((isLit, i) => {
      if (!isLit) return
      window.setTimeout(() => {
        setLit((prev) => {
          const next = [...prev]
          next[i] = false
          return next
        })
      }, i * 120)
    })
    setWished(true)
  }

  const toggle = (i: number) => {
    celebrated.current = false
    setLit((prev) => {
      const next = [...prev]
      next[i] = !next[i]
      return next
    })
  }

  const blowWithMic = async () => {
    setMicError(null)
    if (!navigator.mediaDevices?.getUserMedia) {
      setMicError('This browser can’t use the microphone — tap “Blow them out” instead!')
      return
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      const ctx = new Ctx()
      const src = ctx.createMediaStreamSource(stream)
      const analyser = ctx.createAnalyser()
      analyser.fftSize = 2048
      src.connect(analyser)
      const buf = new Float32Array(analyser.fftSize)
      setListening(true)

      let loudStreak = 0
      let alive = true
      stopMic.current = () => {
        alive = false
        stream.getTracks().forEach((t) => t.stop())
        void ctx.close()
        setListening(false)
      }

      const tick = () => {
        if (!alive) return
        analyser.getFloatTimeDomainData(buf)
        let sum = 0
        for (let i = 0; i < buf.length; i++) sum += buf[i] * buf[i]
        const rms = Math.sqrt(sum / buf.length)
        loudStreak = rms > 0.22 ? loudStreak + 1 : 0
        if (loudStreak >= 3) {
          blowAll()
          return
        }
        window.setTimeout(tick, 110)
      }
      tick()
    } catch {
      setMicError('Microphone blocked — no worries, the tap button works just as well!')
      setListening(false)
    }
  }

  return (
    <section className="px-5 py-14" aria-labelledby="cake-heading">
      <Reveal className="mx-auto max-w-3xl text-center">
        <h2 id="cake-heading" className="font-display text-4xl font-bold text-ink sm:text-5xl">
          A little birthday surprise 🎂
        </h2>
        <p className="font-display mt-4 text-2xl text-cherry">Make a wish, {BIRTHDAY.name}! ✨</p>
        <p className="mx-auto mt-2 max-w-md text-ink-soft">
          Tap each candle to light it. Then close your eyes, make your wish… and blow them all out.
        </p>

        <div className="mx-auto mt-8 max-w-2xl rounded-2xl border-[3px] border-ink bg-white p-6 shadow-card sm:p-10">
          {/* candles */}
          <div className="flex flex-wrap items-end justify-center gap-1 sm:gap-2" role="group" aria-label="13 birthday candles">
            {lit.map((isLit, i) => (
              <Candle key={i} lit={isLit} color={CANDLE_COLORS[i % CANDLE_COLORS.length]} index={i} onToggle={() => toggle(i)} />
            ))}
          </div>

          {/* cake */}
          <svg viewBox="0 0 400 150" className="mx-auto -mt-1 h-auto w-full max-w-md" aria-hidden="true">
            <ellipse cx="200" cy="132" rx="170" ry="16" fill="#F7ECD7" stroke="#3B2F2F" strokeWidth="3" />
            <rect x="70" y="52" width="260" height="76" rx="12" fill="#F4A7C3" stroke="#3B2F2F" strokeWidth="3" />
            <path d="M70 66 Q70 52 84 52 L316 52 Q330 52 330 66 L330 76 Q322 88 314 76 Q306 64 298 76 Q290 88 282 76 Q274 64 266 76 Q258 88 250 76 Q242 64 234 76 Q226 88 218 76 Q210 64 202 76 Q194 88 186 76 Q178 64 170 76 Q162 88 154 76 Q146 64 138 76 Q130 88 122 76 Q114 64 106 76 Q98 88 90 76 Q82 66 70 76 Z"
              fill="#fff" stroke="#3B2F2F" strokeWidth="3" />
            <text x="200" y="108" textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight="600" fontSize="20" fill="#3B2F2F">
              Milky is 13!
            </text>
          </svg>

          <p className="mt-2 text-sm font-semibold tabular-nums text-ink-soft" aria-live="polite">
            {litCount} of 13 candles lit
          </p>

          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <button type="button" onClick={lightAll} className="btn-sticker flex items-center gap-2 bg-butter px-5 py-2.5 text-ink">
              <Flame className="h-5 w-5" aria-hidden="true" /> Light all candles
            </button>
            <button
              type="button"
              onClick={blowAll}
              disabled={allOut}
              className="btn-sticker flex items-center gap-2 bg-sky px-5 py-2.5 text-white disabled:opacity-50"
            >
              <Wind className="h-5 w-5" aria-hidden="true" /> Blow them out (tap)
            </button>
            <button
              type="button"
              onClick={listening ? () => { stopMic.current?.(); setListening(false) } : blowWithMic}
              disabled={allOut && !listening}
              className={`btn-sticker flex items-center gap-2 px-5 py-2.5 ${listening ? 'animate-pulse bg-cherry text-white' : 'bg-white text-ink'} disabled:opacity-50`}
            >
              {listening ? <VolumeX className="h-5 w-5" aria-hidden="true" /> : <Mic className="h-5 w-5" aria-hidden="true" />}
              {listening ? 'Stop listening' : 'Blow for real (mic)'}
            </button>
          </div>

          {listening && (
            <p className="mt-3 font-semibold text-cherry" role="status">Listening… blow into your mic! 🌬️</p>
          )}
          {micError && (
            <p className="mx-auto mt-3 max-w-sm text-sm text-ink-soft" role="alert">{micError}</p>
          )}
          {wished && allOut && (
            <div className="mt-5 animate-pop-in rounded-xl border-2 border-butter-deep bg-butter/20 p-4" role="status">
              <p className="font-display text-2xl font-bold text-ink">Your wish is on its way to the stars ✨</p>
              <p className="text-ink-soft">Happy 13th birthday, {BIRTHDAY.name}!</p>
            </div>
          )}
        </div>
      </Reveal>
    </section>
  )
}
