import { Suspense, lazy, useState } from 'react'
import { Gamepad2, Brain, CakeSlice, Sparkles } from 'lucide-react'
import { Reveal } from './Reveal'

// Games load only when the arcade scrolls into view / a tab is picked.
const BalloonPop = lazy(() => import('./games/BalloonPop'))
const MemoryMatch = lazy(() => import('./games/MemoryMatch'))
const CakeDesigner = lazy(() => import('./games/CakeDesigner'))
const WishMaker = lazy(() => import('./games/WishMaker'))

const TABS = [
  { id: 'balloon', label: 'Balloon Pop', icon: Gamepad2, color: 'bg-cherry text-white' },
  { id: 'memory', label: 'Memory Match', icon: Brain, color: 'bg-sky text-white' },
  { id: 'cake', label: 'Cake Studio', icon: CakeSlice, color: 'bg-butter text-ink' },
  { id: 'wish', label: 'Make a Wish', icon: Sparkles, color: 'bg-leaf text-white' },
] as const

type TabId = (typeof TABS)[number]['id']

function GameFallback() {
  return (
    <div className="flex min-h-64 items-center justify-center" role="status" aria-label="Loading game">
      <p className="font-display animate-pulse text-xl text-ink-soft">Setting up your game…</p>
    </div>
  )
}

export function Arcade() {
  const [tab, setTab] = useState<TabId>('balloon')

  return (
    <section className="px-5 py-14" aria-labelledby="arcade-heading">
      <Reveal className="mx-auto max-w-4xl">
        <h2 id="arcade-heading" className="font-display text-center text-4xl font-bold text-ink sm:text-5xl">
          Milky’s mini arcade 🎮
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-lg text-ink-soft">
          Four little games your brother built for you. No scores leave this page — just fun.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3" role="tablist" aria-label="Arcade games">
          {TABS.map((t) => {
            const active = tab === t.id
            const Icon = t.icon
            return (
              <button
                key={t.id}
                role="tab"
                aria-selected={active}
                type="button"
                onClick={() => setTab(t.id)}
                className={`btn-sticker flex items-center gap-2 px-5 py-2.5 text-base ${t.color} ${active ? 'ring-4 ring-ink/15' : 'opacity-80 hover:opacity-100'}`}
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
                {t.label}
              </button>
            )
          })}
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border-[3px] border-ink bg-white shadow-card" role="tabpanel">
          <Suspense fallback={<GameFallback />}>
            {tab === 'balloon' && <BalloonPop />}
            {tab === 'memory' && <MemoryMatch />}
            {tab === 'cake' && <CakeDesigner />}
            {tab === 'wish' && <WishMaker />}
          </Suspense>
        </div>
      </Reveal>
    </section>
  )
}
