import { BIRTHDAY } from '../data/birthday'
import { Heart } from 'lucide-react'
import { Reveal } from './Reveal'
import { Tape } from './Decor'

/** The brother's letter — lined paper, taped to the scrapbook page. */
export function BrotherMessage() {
  return (
    <section className="px-5 py-14" aria-labelledby="brother-letter-heading">
      <Reveal className="mx-auto max-w-2xl">
        <h2 id="brother-letter-heading" className="font-display mb-8 text-center text-4xl font-bold text-ink sm:text-5xl">
          From your brother, with love <Heart className="inline h-8 w-8 fill-cherry text-cherry" aria-label="love" />
        </h2>

        <article className="relative rotate-[0.6deg] rounded-md border-[3px] border-ink bg-white p-6 shadow-card sm:p-10">
          <Tape color="var(--color-cherry)" rotate="-7deg" className="-top-3 left-1/2 -translate-x-1/2" />
          <div className="letter-lines whitespace-pre-wrap font-body text-[1.05rem] text-ink">
            {BIRTHDAY.brotherMessage}
          </div>
        </article>
      </Reveal>
    </section>
  )
}
