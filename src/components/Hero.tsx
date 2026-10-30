import { BIRTHDAY } from '../data/birthday'
import { PHOTO_ASSETS } from '../data/photos.generated'
import { Bunting, Squiggle, Tape } from './Decor'
import { Cake } from 'lucide-react'

/** CSS balloon — pure decoration, hidden from assistive tech. */
function Balloon({ className, color, delay }: { className: string; color: string; delay: string }) {
  return (
    <div className={`pointer-events-none absolute ${className}`} aria-hidden="true" style={{ animationDelay: delay }}>
      <div className="animate-float-slow">
        <svg viewBox="0 0 60 90" className="h-20 w-14 sm:h-24 sm:w-16">
          <ellipse cx="30" cy="34" rx="24" ry="30" fill={color} stroke="#3B2F2F" strokeWidth="2.5" />
          <ellipse cx="22" cy="24" rx="7" ry="10" fill="#ffffff" opacity="0.45" />
          <path d="M30 64 L30 70 L26 74 L34 74 L30 70" fill="#3B2F2F" />
          <path d="M30 74 C 26 80, 34 84, 30 90" fill="none" stroke="#3B2F2F" strokeWidth="2" />
        </svg>
      </div>
    </div>
  )
}

export function Hero({ entered }: { entered: boolean }) {
  const hero = PHOTO_ASSETS.find((p) => p.slug === BIRTHDAY.heroPhotoSlug) ?? PHOTO_ASSETS[0]

  return (
    <section id="hero" className="relative overflow-hidden px-5 pb-16 pt-6 sm:pt-10" aria-label="Birthday hero">
      <Bunting className="mx-auto mb-8 h-16 w-full max-w-lg sm:h-20" />
      <Balloon className="left-[4%] top-[30%]" color="#E63946" delay="0s" />
      <Balloon className="right-[5%] top-[24%]" color="#4DABF7" delay="1.4s" />
      <Balloon className="bottom-[8%] right-[10%] hidden sm:block" color="#43A854" delay="2.6s" />

      <div className={`mx-auto max-w-3xl text-center ${entered ? 'animate-rise' : 'opacity-0'}`}>
        <p className="mb-3 inline-flex items-center gap-2 rounded-full border-2 border-ink bg-white px-4 py-1.5 text-sm font-semibold text-ink shadow-sticker">
          <Cake className="h-4 w-4 text-cherry" aria-hidden="true" />
          30 October 2013 — the day the world got {BIRTHDAY.name}
        </p>

        <h1 className="font-display text-5xl font-bold leading-[1.05] text-ink sm:text-7xl">
          Happiest 13th Birthday, <span className="text-cherry">{BIRTHDAY.name}</span>! 🎂
        </h1>
        <Squiggle className="mx-auto mt-4 h-3 w-56" color="#FFC93C" />

        <p className="mx-auto mt-5 max-w-xl text-lg text-ink-soft sm:text-xl">{BIRTHDAY.subheading}</p>

        {/* Polaroid hero photo */}
        <figure className="relative mx-auto mt-10 w-fit rotate-[-2deg] rounded-lg border-[3px] border-ink bg-white p-3 pb-5 shadow-card transition-transform duration-300 hover:rotate-0">
          <Tape color="var(--color-sky)" rotate="-8deg" className="-top-3 left-8" />
          <Tape color="var(--color-cherry)" rotate="10deg" className="-top-3 right-8" />
          <img
            src={hero.file}
            alt={`${BIRTHDAY.name} and her brother — the birthday hero photo`}
            width={hero.width}
            height={hero.height}
            fetchPriority="high"
            className="h-auto max-h-[62vh] w-auto max-w-[78vw] rounded-sm object-contain sm:max-h-[68vh]"
          />
          <figcaption className="font-display mt-3 text-lg text-ink">
            thirteen &amp; radiant ✨
          </figcaption>
        </figure>

        <p className="mt-8 inline-block rounded-full bg-butter px-5 py-2 font-display text-lg font-semibold text-ink shadow-sticker">
          Scroll down — your surprise has only just begun ↓
        </p>
      </div>
    </section>
  )
}
