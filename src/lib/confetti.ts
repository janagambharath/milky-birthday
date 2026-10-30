/** Lazy confetti — canvas-confetti only loads when first celebrated with. */
let fire: ((opts: Record<string, unknown>) => void) | null = null

async function getFire() {
  if (fire) return fire
  const mod = await import('canvas-confetti')
  fire = mod.default as unknown as (opts: Record<string, unknown>) => void
  return fire
}

const BRAND = ['#FFC93C', '#E63946', '#4DABF7', '#43A854', '#ffffff']

export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** A tasteful burst for meaningful moments. No-op under reduced motion. */
export async function celebrateBig(): Promise<void> {
  if (prefersReducedMotion()) return
  const confetti = await getFire()
  confetti({ particleCount: 90, spread: 75, origin: { y: 0.6 }, colors: BRAND, ticks: 220 })
  window.setTimeout(() => confetti({ particleCount: 45, angle: 60, spread: 60, origin: { x: 0, y: 0.7 }, colors: BRAND }), 180)
  window.setTimeout(() => confetti({ particleCount: 45, angle: 120, spread: 60, origin: { x: 1, y: 0.7 }, colors: BRAND }), 320)
}

/** Small pop for game wins / candle moments. */
export async function celebrateSmall(opts: { x?: number; y?: number } = {}): Promise<void> {
  if (prefersReducedMotion()) return
  const confetti = await getFire()
  confetti({ particleCount: 35, spread: 55, startVelocity: 32, origin: { x: opts.x ?? 0.5, y: opts.y ?? 0.6 }, colors: BRAND, ticks: 140, disableForReducedMotion: true })
}
