import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Cake, Candy, Flower2, Gift, Heart, Music, PartyPopper, RotateCcw, Star } from 'lucide-react'
import { celebrateSmall } from '../../lib/confetti'

const SYMBOLS = [
  { icon: Cake, label: 'cake', bg: 'bg-cherry', fg: 'text-white' },
  { icon: Gift, label: 'gift', bg: 'bg-sky', fg: 'text-white' },
  { icon: Star, label: 'star', bg: 'bg-butter', fg: 'text-ink' },
  { icon: Heart, label: 'heart', bg: 'bg-leaf', fg: 'text-white' },
  { icon: Music, label: 'music note', bg: 'bg-cherry-deep', fg: 'text-white' },
  { icon: Flower2, label: 'flower', bg: 'bg-sky-deep', fg: 'text-white' },
  { icon: PartyPopper, label: 'party popper', bg: 'bg-leaf-deep', fg: 'text-white' },
  { icon: Candy, label: 'candy', bg: 'bg-butter-deep', fg: 'text-white' },
]

interface CardT { uid: number; sym: number }

function shuffledDeck(): CardT[] {
  const deck: CardT[] = []
  let uid = 0
  SYMBOLS.forEach((_, sym) => {
    deck.push({ uid: uid++, sym }, { uid: uid++, sym })
  })
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[deck[i], deck[j]] = [deck[j], deck[i]]
  }
  return deck
}

function formatTime(s: number) {
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

/** Game 2 — flip the cards, find all 8 matching pairs. */
export default function MemoryMatch() {
  const [deck, setDeck] = useState<CardT[]>(() => shuffledDeck())
  const [open, setOpen] = useState<number[]>([])
  const [matched, setMatched] = useState<Set<number>>(new Set())
  const [moves, setMoves] = useState(0)
  const [seconds, setSeconds] = useState(0)
  const [started, setStarted] = useState(false)
  const [won, setWon] = useState(false)
  const lock = useRef(false)

  const reset = useCallback(() => {
    setDeck(shuffledDeck())
    setOpen([])
    setMatched(new Set())
    setMoves(0)
    setSeconds(0)
    setStarted(false)
    setWon(false)
    lock.current = false
  }, [])

  useEffect(() => {
    if (!started || won) return
    const t = window.setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => window.clearInterval(t)
  }, [started, won])

  const flip = (uid: number) => {
    if (lock.current || won || open.includes(uid) || matched.has(uid)) return
    if (!started) setStarted(true)
    const next = [...open, uid]
    setOpen(next)
    if (next.length === 2) {
      setMoves((m) => m + 1)
      const [a, b] = next
      const ca = deck.find((c) => c.uid === a)!
      const cb = deck.find((c) => c.uid === b)!
      if (ca.sym === cb.sym) {
        window.setTimeout(() => {
          setMatched((prev) => {
            const s = new Set(prev)
            s.add(ca.sym)
            if (s.size === SYMBOLS.length) {
              setWon(true)
              celebrateSmall()
            }
            return s
          })
          setOpen([])
        }, 450)
      } else {
        lock.current = true
        window.setTimeout(() => {
          setOpen([])
          lock.current = false
        }, 800)
      }
    }
  }

  const grid = useMemo(() => deck, [deck])

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          <p className="font-display text-lg">Moves: <span className="font-bold tabular-nums">{moves}</span></p>
          <p className="font-display text-lg">Time: <span className="font-bold tabular-nums" aria-live="off">{formatTime(seconds)}</span></p>
          <p className="font-display text-lg">Pairs: <span className="font-bold text-leaf-deep tabular-nums">{matched.size}/8</span></p>
        </div>
        <button type="button" onClick={reset} className="btn-sticker flex items-center gap-2 bg-white px-5 py-2 text-ink">
          <RotateCcw className="h-4 w-4" aria-hidden="true" /> Shuffle
        </button>
      </div>

      {won && (
        <div className="mt-4 rounded-xl border-2 border-leaf bg-leaf/10 p-4 text-center" role="status">
          <p className="font-display text-2xl font-bold text-leaf-deep">🎉 You found them all!</p>
          <p className="text-ink-soft">{moves} moves in {formatTime(seconds)} — brilliant memory, Milky!</p>
        </div>
      )}

      <div className="mt-4 grid grid-cols-4 gap-2.5 sm:gap-3" role="group" aria-label="Memory cards">
        {grid.map((card) => {
          const sym = SYMBOLS[card.sym]
          const faceUp = open.includes(card.uid) || matched.has(card.sym)
          const Icon = sym.icon
          return (
            <button
              key={card.uid}
              type="button"
              onClick={() => flip(card.uid)}
              aria-label={faceUp ? sym.label : 'Face-down card'}
              aria-pressed={faceUp}
              className="card3d aspect-square w-full cursor-pointer focus-visible:outline-3 focus-visible:outline-sky"
              style={{ touchAction: 'manipulation' }}
            >
              <span className={`card3d-inner ${faceUp ? 'flipped' : ''}`}>
                <span className="card3d-face rounded-xl border-[2.5px] border-ink bg-paper-deep" aria-hidden="true">
                  <Star className="h-7 w-7 text-butter-deep" />
                </span>
                <span className={`card3d-face card3d-back rounded-xl border-[2.5px] border-ink ${sym.bg}`} aria-hidden="true">
                  <Icon className={`h-8 w-8 sm:h-10 sm:w-10 ${sym.fg}`} />
                </span>
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
