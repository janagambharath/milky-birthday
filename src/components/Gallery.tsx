import { useCallback, useState } from 'react'
import { BIRTHDAY, PHOTO_CAPTIONS } from '../data/birthday'
import { PHOTO_ASSETS, type PhotoAsset } from '../data/photos.generated'
import { Reveal } from './Reveal'
import { Lightbox } from './Lightbox'
import { Tape } from './Decor'
import { Camera } from 'lucide-react'

const TAPE_COLORS = ['var(--color-butter)', 'var(--color-sky)', 'var(--color-cherry)', 'var(--color-leaf)']

function MemoryCard({ photo, index, onOpen, featured }: {
  photo: PhotoAsset
  index: number
  onOpen: (index: number) => void
  featured?: boolean
}) {
  const caption = PHOTO_CAPTIONS[photo.slug]
  const rotate = featured ? '0deg' : `${index % 2 === 0 ? -1.6 : 1.6}deg`
  return (
    <figure
      className="group relative mb-5 break-inside-avoid rounded-md border-[2.5px] border-ink bg-white p-2.5 pb-3 shadow-card transition-transform duration-300 hover:z-10 hover:scale-[1.03] hover:rotate-0"
      style={{ transform: `rotate(${rotate})` }}
    >
      <Tape color={TAPE_COLORS[index % TAPE_COLORS.length]} rotate={index % 2 ? '9deg' : '-9deg'} className="-top-2.5 left-6" />
      <button
        type="button"
        onClick={() => onOpen(index)}
        className="block w-full cursor-zoom-in focus-visible:outline-3 focus-visible:outline-sky"
        aria-label={`Open photo: ${caption ?? `Milky, photo ${index + 1}`}`}
      >
        <img
          src={photo.thumb}
          alt={caption ? `${BIRTHDAY.name} — ${caption}` : `${BIRTHDAY.name} childhood photo ${index + 1}`}
          width={photo.width}
          height={photo.height}
          loading="lazy"
          decoding="async"
          className="h-auto w-full rounded-[3px] bg-paper-deep object-cover"
        />
      </button>
      {caption && (
        <figcaption className="font-display px-1 pt-2 text-center text-[0.95rem] font-medium text-ink">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}

/**
 * "Our little memory world" — editorial scrapbook masonry.
 * The first photo is featured large; the rest flow as taped polaroids.
 */
export function Gallery() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const open = useCallback((i: number) => setLightboxIndex(i), [])
  const close = useCallback(() => setLightboxIndex(null), [])
  const step = useCallback((dir: 1 | -1) => {
    setLightboxIndex((cur) => (cur === null ? cur : (cur + dir + PHOTO_ASSETS.length) % PHOTO_ASSETS.length))
  }, [])

  const [featured, ...rest] = PHOTO_ASSETS

  return (
    <section className="px-5 py-14" aria-labelledby="gallery-heading">
      <Reveal className="mx-auto max-w-5xl">
        <h2 id="gallery-heading" className="font-display text-center text-4xl font-bold text-ink sm:text-5xl">
          Our little memory world 📸
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-lg text-ink-soft">
          Thirteen years of Milky, taped into one page. Tap any photo to look closer.
        </p>

        {/* Featured memory */}
        <figure className="relative mx-auto mt-10 w-fit max-w-full rotate-[-1deg] rounded-lg border-[3px] border-ink bg-white p-3 pb-4 shadow-card">
          <Tape color="var(--color-butter)" rotate="-6deg" className="-top-3 left-10" />
          <Tape color="var(--color-leaf)" rotate="7deg" className="-top-3 right-10" />
          <button
            type="button"
            onClick={() => open(0)}
            className="block cursor-zoom-in focus-visible:outline-3 focus-visible:outline-sky"
            aria-label={`Open featured photo: ${PHOTO_CAPTIONS[featured.slug] ?? 'Milky'}`}
          >
            <img
              src={featured.thumb}
              alt={`${BIRTHDAY.name} — ${PHOTO_CAPTIONS[featured.slug] ?? 'a favourite memory'}`}
              width={featured.width}
              height={featured.height}
              loading="lazy"
              decoding="async"
              className="h-auto max-h-[60vh] w-auto max-w-full rounded-sm object-contain"
            />
          </button>
          <figcaption className="mt-2 flex items-center justify-center gap-2 text-center font-display text-lg text-ink">
            <Camera className="h-5 w-5 text-cherry" aria-hidden="true" />
            {PHOTO_CAPTIONS[featured.slug] ?? 'A favourite memory'}
          </figcaption>
        </figure>

        {/* Masonry of the rest */}
        <div className="mt-10 columns-2 gap-5 md:columns-3">
          {rest.map((photo, i) => (
            <MemoryCard key={photo.slug} photo={photo} index={i + 1} onOpen={open} />
          ))}
        </div>
      </Reveal>

      {lightboxIndex !== null && (
        <Lightbox
          photos={PHOTO_ASSETS}
          index={lightboxIndex}
          onClose={close}
          onStep={step}
        />
      )}
    </section>
  )
}
