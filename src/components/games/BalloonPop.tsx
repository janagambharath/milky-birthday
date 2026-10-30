import { useCallback, useEffect, useRef, useState } from 'react'
import { Play, RotateCcw, Timer, Trophy } from 'lucide-react'
import { celebrateSmall, prefersReducedMotion } from '../../lib/confetti'

const COLORS = ['#E63946', '#FFC93C', '#4DABF7', '#43A854', '#FF9F1C', '#B565D8']
const DURATION = 30
const BEST_KEY = 'milky-balloon-best-v1'

interface BalloonT { id: number; x: number; color: string; riseMs: number; size: number }

function readBest(): number {
  try { return Number(localStorage.getItem(BEST_KEY) ?? 0) || 0 } catch { return 0 }
}

/** Game 1 — pop as many balloons as you can in 30 seconds. */
export default function BalloonPop() {
  const [playing, setPlaying] = useState(false)
  const [timeLeft, setTimeLeft] = useState(DURATION)
  const [score, setScore] = useState(0)
  const [balloons, setBalloons] = useState<BalloonT[]>([])
  const [best, setBest] = useState(readBest)
  const [newBest, setNewBest] = useState(false)
  const [popped, setPopped] = useState(0) // bump to retrigger score animation
  const idRef = useRef(0)
  const arenaRef = useRef<HTMLDivElement>(null)
  const motionOK = !prefersReducedMotion()

  const spawn = useCallback(() => {
    const arena = arenaRef.current
    const w = arena?.clientWidth ?? 320
    idRef.current += 1
    const b: BalloonT = {
      id: idRef.current,
      x: 8 + Math.random() * Math.max(w - 90, 40),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      riseMs: 4200 + Math.random() * 2200,
      size: 44 + Math.random() * 22,
    }
    setBalloons((prev) => (prev.length > 14 ? prev : [...prev, b]))
    if (!motionOK) {
      // reduced motion: balloons sit still briefly instead of rising
      window.setTimeout(() => setBalloons((prev) => prev.filter((x) => x.id !== b.id)), 2600)
    }
  }, [motionOK])

  const stop = useCallback(() => {
    setPlaying(false)
    setBalloons([])
  }, [])

  const start = useCallback(() => {
    setScore(0)
    setTimeLeft(DURATION)
    setBalloons([])
    setNewBest(false)
    setPlaying(true)
  }, [])

  // game clock
  useEffect(() => {
    if (!playing) return
    const t = window.setInterval(() => {
      setTimeLeft((s) => {
        if (s <= 1) {
          window.clearInterval(t)
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => window.clearInterval(t)
  }, [playing])

  // spawner
  useEffect(() => {
    if (!playing) return
    spawn()
    const t = window.setInterval(spawn, 750)
    return () => window.clearInterval(t)
  }, [playing, spawn])

  // end of round
  useEffect(() => {
    if (playing && timeLeft === 0) {
      stop()
      setBest((prev) => {
        if (score > prev) {
          try { localStorage.setItem(BEST_KEY, String(score)) } catch { /* private mode */ }
          setNewBest(true)
          celebrateSmall()
          return score
        }
        return prev
      })
    }
  }, [playing, timeLeft, score, stop])

  const pop = (id: number) => {
    setBalloons((prev) => prev.filter((b) => b.id !== id))
    setScore((s) => s + 1)
    setPopped((p) => p + 1)
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          <p className="font-display text-lg" aria-live="polite">
            Score: <span key={popped} className="inline-block animate-pop-in text-2xl font-bold text-cherry">{score}</span>
          </p>
          <p className="flex items-center gap-1.5 text-ink-soft">
            <Timer className="h-4 w-4" aria-hidden="true" />
            <span className="font-display text-lg font-semibold tabular-nums" aria-live="polite">{timeLeft}s</span>
          </p>
          <p className="flex items-center gap-1.5 text-ink-soft">
            <Trophy className="h-4 w-4 text-butter-deep" aria-hidden="true" />
            <span className="text-sm font-semibold">Best: {best}</span>
          </p>
        </div>
        <button
          type="button"
          onClick={playing ? stop : start}
          className={`btn-sticker flex items-center gap-2 px-5 py-2 ${playing ? 'bg-white text-ink' : 'bg-cherry text-white'}`}
        >
          {playing ? <><RotateCcw className="h-4 w-4" aria-hidden="true" /> Stop</> : <><Play className="h-4 w-4" aria-hidden="true" /> {score > 0 ? 'Play again' : 'Start popping'}</>}
        </button>
      </div>

      <div
        ref={arenaRef}
        className="relative mt-4 h-80 overflow-hidden rounded-xl border-2 border-dashed border-ink/25 bg-paper sm:h-96"
        aria-label="Balloon arena"
      >
        {!playing && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
            {score > 0 || newBest ? (
              <>
                <p className="font-display text-3xl font-bold text-ink">
                  {newBest ? '🎉 New best score!' : `You popped ${score}!`}
                </p>
                <p className="text-ink-soft">{newBest ? `Amazing — ${score} balloons!` : 'Nice popping! Try to beat your best.'}</p>
              </>
            ) : (
              <>
                <p className="font-display text-2xl font-semibold text-ink">Tap the balloons before they float away!</p>
                <p className="text-ink-soft">You have {DURATION} seconds. How many can you pop?</p>
              </>
            )}
          </div>
        )}

        {balloons.map((b) => (
          <button
            key={b.id}
            type="button"
            onClick={() => pop(b.id)}
            aria-label="Pop balloon"
            className="absolute bottom-0 cursor-pointer p-1 focus-visible:outline-3 focus-visible:outline-cherry"
            style={{
              left: b.x,
              ...(motionOK ? { animation: `balloonUp ${b.riseMs}ms linear forwards` } : { bottom: `${10 + (b.id * 37) % 60}%` }),
            }}
            onAnimationEnd={() => motionOK && setBalloons((prev) => prev.filter((x) => x.id !== b.id))}
          >
            <svg viewBox="0 0 60 90" width={b.size} height={b.size * 1.5} aria-hidden="true">
              <ellipse cx="30" cy="34" rx="24" ry="30" fill={b.color} stroke="#3B2F2F" strokeWidth="2.5" />
              <ellipse cx="22" cy="24" rx="7" ry="10" fill="#ffffff" opacity="0.45" />
              <path d="M30 64 L30 70 L26 74 L34 74 L30 70" fill="#3B2F2F" />
              <path d="M30 74 C 26 80, 34 84, 30 90" fill="none" stroke="#3B2F2F" strokeWidth="2" />
            </svg>
          </button>
        ))}
      </div>
    </div>
  )
}
