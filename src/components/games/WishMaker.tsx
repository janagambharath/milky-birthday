import { useRef, useState } from 'react'
import { Download, Eraser, Palette } from 'lucide-react'
import { BIRTHDAY } from '../../data/birthday'
import { celebrateSmall } from '../../lib/confetti'

const BG_CHOICES = ['#FFF8EC', '#FFE8E9', '#D6EBFF', '#DFF5E1', '#FFF3C4']
const INK_CHOICES = ['#E63946', '#4DABF7', '#43A854', '#3B2F2F', '#B565D8', '#E8850C']

type StickerKind = 'star' | 'heart' | 'balloon' | 'flower'
interface Sticker { id: number; kind: StickerKind; x: number; y: number } // x,y in 0..1

const STICKER_META: { kind: StickerKind; label: string }[] = [
  { kind: 'star', label: 'star' },
  { kind: 'heart', label: 'heart' },
  { kind: 'balloon', label: 'balloon' },
  { kind: 'flower', label: 'flower' },
]

function StickerSvg({ kind, size = 44 }: { kind: StickerKind; size?: number }) {
  const common = { width: size, height: size, viewBox: '0 0 48 48' } as const
  switch (kind) {
    case 'star':
      return (<svg {...common} aria-hidden="true"><path d="M24 4 L29 17 L43 18 L32 27 L36 41 L24 33 L12 41 L16 27 L5 18 L19 17 Z" fill="#FFC93C" stroke="#3B2F2F" strokeWidth="2.5" strokeLinejoin="round" /></svg>)
    case 'heart':
      return (<svg {...common} aria-hidden="true"><path d="M24 42 C10 30 4 22 4 14 C4 8 9 4 14 4 C19 4 23 7 24 11 C25 7 29 4 34 4 C39 4 44 8 44 14 C44 22 38 30 24 42 Z" fill="#E63946" stroke="#3B2F2F" strokeWidth="2.5" strokeLinejoin="round" /></svg>)
    case 'balloon':
      return (<svg {...common} aria-hidden="true"><ellipse cx="24" cy="18" rx="13" ry="16" fill="#4DABF7" stroke="#3B2F2F" strokeWidth="2.5" /><path d="M24 34 L24 38 L21 41 L27 41 L24 38" fill="#3B2F2F" /><path d="M24 41 C 22 44, 26 45, 24 47" fill="none" stroke="#3B2F2F" strokeWidth="2" /></svg>)
    case 'flower':
      return (<svg {...common} aria-hidden="true"><g fill="#FF9F1C" stroke="#3B2F2F" strokeWidth="2"><circle cx="24" cy="10" r="7" /><circle cx="36" cy="20" r="7" /><circle cx="32" cy="34" r="7" /><circle cx="16" cy="34" r="7" /><circle cx="12" cy="20" r="7" /></g><circle cx="24" cy="23" r="7" fill="#E63946" stroke="#3B2F2F" strokeWidth="2" /></svg>)
  }
}

/** draw the same stickers onto a 2D canvas for the downloadable card */
function drawSticker(ctx: CanvasRenderingContext2D, kind: StickerKind, cx: number, cy: number, s: number) {
  ctx.save()
  ctx.translate(cx, cy)
  ctx.lineWidth = s * 0.06
  ctx.strokeStyle = '#3B2F2F'
  ctx.lineJoin = 'round'
  if (kind === 'star') {
    ctx.beginPath()
    for (let i = 0; i < 10; i++) {
      const r = i % 2 === 0 ? s / 2 : s / 4.4
      const a = (Math.PI / 5) * i - Math.PI / 2
      const x = Math.cos(a) * r, y = Math.sin(a) * r
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
    }
    ctx.closePath(); ctx.fillStyle = '#FFC93C'; ctx.fill(); ctx.stroke()
  } else if (kind === 'heart') {
    ctx.beginPath()
    ctx.moveTo(0, s * 0.32)
    ctx.bezierCurveTo(-s * 0.55, -s * 0.05, -s * 0.32, -s * 0.42, 0, -s * 0.12)
    ctx.bezierCurveTo(s * 0.32, -s * 0.42, s * 0.55, -s * 0.05, 0, s * 0.32)
    ctx.fillStyle = '#E63946'; ctx.fill(); ctx.stroke()
  } else if (kind === 'balloon') {
    ctx.beginPath(); ctx.ellipse(0, -s * 0.1, s * 0.3, s * 0.38, 0, 0, Math.PI * 2)
    ctx.fillStyle = '#4DABF7'; ctx.fill(); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(0, s * 0.28); ctx.lineTo(0, s * 0.45); ctx.stroke()
  } else {
    ctx.fillStyle = '#FF9F1C'
    for (let i = 0; i < 5; i++) {
      const a = (Math.PI * 2 * i) / 5 - Math.PI / 2
      ctx.beginPath(); ctx.arc(Math.cos(a) * s * 0.22, Math.sin(a) * s * 0.22, s * 0.16, 0, Math.PI * 2); ctx.fill(); ctx.stroke()
    }
    ctx.beginPath(); ctx.arc(0, 0, s * 0.15, 0, Math.PI * 2); ctx.fillStyle = '#E63946'; ctx.fill(); ctx.stroke()
  }
  ctx.restore()
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(/\s+/).filter(Boolean)
  const lines: string[] = []
  let line = ''
  for (const w of words) {
    const test = line ? `${line} ${w}` : w
    if (ctx.measureText(test).width > maxWidth && line) { lines.push(line); line = w }
    else line = test
  }
  if (line) lines.push(line)
  return lines.slice(0, 8)
}

/** Game 4 — write a wish, doodle, add stickers, download your birthday card. */
export default function WishMaker() {
  const [wish, setWish] = useState('')
  const [bg, setBg] = useState(BG_CHOICES[0])
  const [ink, setInk] = useState(INK_CHOICES[3])
  const [activeSticker, setActiveSticker] = useState<StickerKind | null>(null)
  const [stickers, setStickers] = useState<Sticker[]>([])
  const [downloading, setDownloading] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const drawing = useRef(false)
  const last = useRef<{ x: number; y: number } | null>(null)
  const stickerId = useRef(0)
  const wrapRef = useRef<HTMLDivElement>(null)

  const canvasPos = (e: React.PointerEvent) => {
    const c = canvasRef.current!
    const r = c.getBoundingClientRect()
    return { x: ((e.clientX - r.left) / r.width) * c.width, y: ((e.clientY - r.top) / r.height) * c.height }
  }

  const onPointerDown = (e: React.PointerEvent) => {
    if (activeSticker) {
      const wrap = wrapRef.current!
      const r = wrap.getBoundingClientRect()
      stickerId.current += 1
      setStickers((s) => [...s, { id: stickerId.current, kind: activeSticker, x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height }])
      setActiveSticker(null)
      return
    }
    drawing.current = true
    last.current = canvasPos(e)
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drawing.current || !last.current) return
    const c = canvasRef.current!
    const ctx = c.getContext('2d')!
    const p = canvasPos(e)
    ctx.strokeStyle = ink
    ctx.lineWidth = 7
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.beginPath()
    ctx.moveTo(last.current.x, last.current.y)
    ctx.lineTo(p.x, p.y)
    ctx.stroke()
    last.current = p
  }
  const onPointerUp = () => { drawing.current = false; last.current = null }

  const clearDoodle = () => {
    const c = canvasRef.current!
    c.getContext('2d')!.clearRect(0, 0, c.width, c.height)
  }

  const download = async () => {
    setDownloading(true)
    try {
      const W = 1080, H = 1350
      const card = document.createElement('canvas')
      card.width = W; card.height = H
      const ctx = card.getContext('2d')!

      // background + border
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H)
      ctx.strokeStyle = '#3B2F2F'; ctx.lineWidth = 10; ctx.strokeRect(14, 14, W - 28, H - 28)

      // title
      ctx.fillStyle = '#3B2F2F'
      ctx.textAlign = 'center'
      ctx.font = '700 64px Fredoka, sans-serif'
      ctx.fillText(`Milky's Wish ✨`, W / 2, 130)

      // doodle layer (canvas is 900x520 in layout → scale into card)
      const doodle = canvasRef.current!
      ctx.drawImage(doodle, 60, 190, W - 120, ((W - 120) * doodle.height) / doodle.width)

      // stickers
      for (const s of stickers) {
        drawSticker(ctx, s.kind, s.x * W, 190 + s.y * (((W - 120) * doodle.height) / doodle.width), 110)
      }

      // wish text
      const wishText = wish.trim() || 'My birthday wish…'
      ctx.font = '500 44px "DM Sans", sans-serif'
      ctx.fillStyle = '#3B2F2F'
      const lines = wrapText(ctx, wishText, W - 220)
      const startY = H - 120 - lines.length * 56
      lines.forEach((ln, i) => ctx.fillText(ln, W / 2, startY + i * 56))

      ctx.font = '600 34px Fredoka, sans-serif'
      ctx.fillStyle = '#B21E2E'
      ctx.fillText('— made with love by Milky', W / 2, H - 70)

      const url = card.toDataURL('image/png')
      const a = document.createElement('a')
      a.href = url
      a.download = 'milkys-birthday-wish.png'
      document.body.appendChild(a)
      a.click()
      a.remove()
      celebrateSmall()
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="grid gap-6 md:grid-cols-[1fr_320px]">
        {/* Card preview */}
        <div>
          <div ref={wrapRef} className="relative overflow-hidden rounded-xl border-[3px] border-ink shadow-card" style={{ backgroundColor: bg }}>
            <p className="font-display px-4 pt-4 text-center text-2xl font-bold text-ink">Milky’s Wish ✨</p>
            <div
              className="relative mx-4 mt-2 touch-none rounded-lg border-2 border-dashed border-ink/25 bg-white/60"
              style={{ cursor: activeSticker ? 'copy' : 'crosshair' }}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              role="application"
              aria-label={activeSticker ? 'Tap to place sticker' : 'Doodle area — draw with your finger or mouse'}
            >
              <canvas ref={canvasRef} width={900} height={520} className="block h-auto w-full" />
              {stickers.map((s) => (
                <span key={s.id} className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${s.x * 100}%`, top: `${s.y * 100}%` }}>
                  <StickerSvg kind={s.kind} size={52} />
                </span>
              ))}
              {activeSticker && (
                <span className="pointer-events-none absolute left-1/2 top-2 -translate-x-1/2 rounded-full bg-ink px-3 py-1 text-xs font-semibold text-white">
                  Tap anywhere to place your {activeSticker}
                </span>
              )}
            </div>
            <p className="font-display min-h-16 px-6 py-4 text-center text-lg text-ink" aria-live="polite">
              {wish.trim() ? `“${wish.trim()}”` : 'Your wish will appear here…'}
            </p>
          </div>
          {stickers.length > 0 && (
            <button type="button" onClick={() => setStickers([])} className="mt-2 text-sm font-semibold text-ink-soft underline">
              Remove all stickers
            </button>
          )}
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-5">
          <div>
            <label htmlFor="wish-text" className="font-display mb-2 block text-sm font-semibold text-ink">Your wish</label>
            <textarea
              id="wish-text"
              value={wish}
              onChange={(e) => setWish(e.target.value.slice(0, 220))}
              rows={3}
              maxLength={220}
              placeholder="I wish for…"
              className="w-full rounded-xl border-2 border-ink/30 bg-white p-3 text-ink placeholder:text-ink-soft/60 focus:border-sky focus-visible:outline-3 focus-visible:outline-sky"
            />
          </div>

          <div>
            <p className="font-display mb-2 flex items-center gap-1.5 text-sm font-semibold text-ink"><Palette className="h-4 w-4" aria-hidden="true" /> Doodle colour</p>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Doodle colour">
              {INK_CHOICES.map((c) => (
                <button key={c} type="button" onClick={() => setInk(c)} aria-label={`Doodle in ${c}`} aria-pressed={ink === c}
                  className={`h-9 w-9 rounded-full border-[2.5px] ${ink === c ? 'border-ink scale-110' : 'border-ink/25'}`} style={{ backgroundColor: c }} />
              ))}
              <button type="button" onClick={clearDoodle} aria-label="Clear doodle"
                className="btn-sticker flex h-9 items-center gap-1 bg-white px-3 text-xs text-ink">
                <Eraser className="h-4 w-4" aria-hidden="true" /> Clear
              </button>
            </div>
          </div>

          <div>
            <p className="font-display mb-2 text-sm font-semibold text-ink">Stickers</p>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Stickers">
              {STICKER_META.map((s) => (
                <button
                  key={s.kind}
                  type="button"
                  onClick={() => setActiveSticker((a) => (a === s.kind ? null : s.kind))}
                  aria-pressed={activeSticker === s.kind}
                  aria-label={`Place ${s.label} sticker`}
                  className={`rounded-xl border-[2.5px] p-1.5 transition ${activeSticker === s.kind ? 'border-ink bg-butter scale-110' : 'border-ink/25 bg-white'}`}
                >
                  <StickerSvg kind={s.kind} size={40} />
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="font-display mb-2 text-sm font-semibold text-ink">Card colour</p>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Card colour">
              {BG_CHOICES.map((c) => (
                <button key={c} type="button" onClick={() => setBg(c)} aria-label={`Card background ${c}`} aria-pressed={bg === c}
                  className={`h-9 w-9 rounded-full border-[2.5px] ${bg === c ? 'border-ink scale-110' : 'border-ink/25'}`} style={{ backgroundColor: c }} />
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={download}
            disabled={downloading}
            className="btn-sticker mt-auto flex items-center justify-center gap-2 bg-leaf px-6 py-3 text-lg text-white disabled:opacity-60"
          >
            <Download className="h-5 w-5" aria-hidden="true" />
            {downloading ? 'Making your card…' : 'Download my wish card'}
          </button>
          <p className="text-xs text-ink-soft">For {BIRTHDAY.name}, from {BIRTHDAY.name} — keep it forever 💛</p>
        </div>
      </div>
    </div>
  )
}
