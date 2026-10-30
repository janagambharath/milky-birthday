import { useCallback, useEffect, useRef } from 'react'
import { BIRTHDAY, PHOTO_CAPTIONS } from '../data/birthday'
import type { PhotoAsset } from '../data/photos.generated'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

/**
 * Full-screen lightbox: keyboard (←/→/Esc), touch swipe, captions,
 * scroll-lock, focus on open. Shows the full-size WebP, not the thumbnail.
 */
export function Lightbox({ photos, index, onClose, onStep }: {
  photos: PhotoAsset[]
  index: number
  onClose: () => void
  onStep: (dir: 1 | -1) => void
}) {
  const photo = photos[index]
  const caption = PHOTO_CAPTIONS[photo.slug]
  const closeRef = useRef<HTMLButtonElement>(null)
  const touchX = useRef<number | null>(null)

  useEffect(() => {
    closeRef.current?.focus()
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowRight') onStep(1)
      else if (e.key === 'ArrowLeft') onStep(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose, onStep])

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touchX.current = e.touches[0].clientX
  }, [])
  const onTouchEnd = useCallback((e: React.TouchEvent) => {
    if (touchX.current === null) return
    const dx = e.changedTouches[0].clientX - touchX.current
    if (Math.abs(dx) > 48) onStep(dx < 0 ? 1 : -1)
    touchX.current = null
  }, [onStep])

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-ink/92 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={`Photo viewer — ${caption ?? `photo ${index + 1} of ${photos.length}`}`}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="flex items-center justify-between px-4 py-3">
        <p className="font-display text-sm font-medium text-white/85" aria-live="polite">
          {index + 1} / {photos.length}
        </p>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close photo viewer"
          className="rounded-full border-2 border-white/70 p-2 text-white transition hover:bg-white/15 focus-visible:outline-3 focus-visible:outline-butter"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-12 sm:px-20">
        <button
          type="button"
          onClick={() => onStep(-1)}
          aria-label="Previous photo"
          className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full border-2 border-white/70 p-2.5 text-white transition hover:bg-white/15 focus-visible:outline-3 focus-visible:outline-butter sm:left-5"
        >
          <ChevronLeft className="h-6 w-6" aria-hidden="true" />
        </button>

        <figure key={photo.slug} className="max-h-full animate-pop-in">
          <img
            src={photo.file}
            alt={`${BIRTHDAY.name}${caption ? ` — ${caption}` : ''}`}
            width={photo.width}
            height={photo.height}
            className="max-h-[74vh] w-auto max-w-full rounded-md border-[3px] border-white/90 object-contain shadow-card"
          />
          {caption && (
            <figcaption className="font-display mt-3 text-center text-xl text-white">
              {caption}
            </figcaption>
          )}
        </figure>

        <button
          type="button"
          onClick={() => onStep(1)}
          aria-label="Next photo"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full border-2 border-white/70 p-2.5 text-white transition hover:bg-white/15 focus-visible:outline-3 focus-visible:outline-butter sm:right-5"
        >
          <ChevronRight className="h-6 w-6" aria-hidden="true" />
        </button>
      </div>

      <p className="pb-6 pt-2 text-center text-sm text-white/60">
        Swipe or use ← → keys to wander through memories
      </p>
    </div>
  )
}
