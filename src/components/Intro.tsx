import { useEffect, useRef, useState } from 'react'
import { BIRTHDAY } from '../data/birthday'
import { DoodleStar } from './Decor'

/**
 * The surprise gate. A hand-made envelope with a wax seal; opening it
 * triggers the whole birthday (music, confetti, scroll to hero).
 */
export function Intro({ onOpen, onGesture }: { onOpen: () => void; onGesture: () => void }) {
  const [opening, setOpening] = useState(false)
  const [fading, setFading] = useState(false)
  const timer = useRef<number | null>(null)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
      if (timer.current) window.clearTimeout(timer.current)
    }
  }, [])

  const handleOpen = () => {
    if (opening) return
    onGesture() // the tap itself: the one moment browsers allow audio to start
    setOpening(true)
    // flap (0.7s) + letter slide (0.8s @ 0.45s) → fade out, then hand over
    timer.current = window.setTimeout(() => setFading(true), 1450)
    timer.current = window.setTimeout(onOpen, 1850)
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-paper px-6 transition-opacity duration-500 ${fading ? 'opacity-0' : 'opacity-100'}`}
      role="dialog"
      aria-modal="true"
      aria-label="A birthday surprise for Milky"
    >
      <DoodleStar className="absolute left-[12%] top-[14%] h-10 w-10 animate-float-slow" color="#FFC93C" />
      <DoodleStar className="absolute right-[14%] top-[22%] h-7 w-7 animate-float-slow" color="#4DABF7" />
      <DoodleStar className="absolute bottom-[18%] left-[18%] h-8 w-8 animate-float-slow" color="#43A854" />

      <p className="font-display mb-2 text-center text-2xl font-semibold text-ink sm:text-3xl">
        {BIRTHDAY.introTeaser}
      </p>
      <p className="mb-10 text-center text-ink-soft">{BIRTHDAY.introMadeWithLove}</p>

      {/* Envelope */}
      <div className="relative h-56 w-80 max-w-[85vw] sm:h-64 sm:w-96" aria-hidden={!opening}>
        {/* letter peeking out */}
        <div
          className={`absolute inset-x-6 top-2 bottom-6 rounded-lg border-2 border-ink/70 bg-white shadow-card ${opening ? 'letter-out' : 'opacity-0'}`}
        >
          <div className="flex h-full flex-col items-center justify-center gap-1 px-4 text-center">
            <span className="font-display text-lg font-semibold text-cherry">It’s your day,</span>
            <span className="font-display text-2xl font-bold text-ink">{BIRTHDAY.name}!</span>
          </div>
        </div>

        {/* envelope body */}
        <div className="absolute inset-0 rounded-xl border-[3px] border-ink bg-cherry shadow-card" />
        <svg viewBox="0 0 320 224" className="absolute inset-0 h-full w-full" aria-hidden="true">
          <path d="M4 220 L160 108 L316 220" fill="none" stroke="#3B2F2F" strokeWidth="5" strokeLinejoin="round" opacity="0.55" />
        </svg>

        {/* flap */}
        <div
          className={`absolute inset-x-0 top-0 h-[52%] ${opening ? 'envelope-flap-open' : ''}`}
          style={{ transformOrigin: 'top center', zIndex: opening ? 0 : 2 }}
        >
          <svg viewBox="0 0 320 116" className="h-full w-full" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0 4 L160 112 L320 4 L320 0 L0 0 Z" fill="#C1121F" stroke="#3B2F2F" strokeWidth="5" strokeLinejoin="round" />
          </svg>
        </div>

        {/* wax seal */}
        {!opening && (
          <div className="absolute left-1/2 top-[46%] z-[3] flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-[3px] border-ink bg-butter shadow-sticker">
            <span className="font-display text-2xl font-bold text-ink">M</span>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={handleOpen}
        disabled={opening}
        className="btn-sticker mt-10 bg-butter px-8 py-3.5 text-xl text-ink disabled:opacity-70"
      >
        {opening ? 'Opening…' : BIRTHDAY.introButton}
      </button>

      <p className="mt-6 max-w-xs text-center text-sm text-ink-soft">
        psst… turn your sound on for the full surprise 🔊
      </p>
    </div>
  )
}
