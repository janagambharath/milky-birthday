import { BIRTHDAY } from '../data/birthday'
import { Reveal } from './Reveal'
import { DoodleStar, Squiggle, Tape } from './Decor'

/** The emotional landing — not a footer, a hug in text form. */
export function ClosingNote() {
  return (
    <section className="relative overflow-hidden px-5 pb-24 pt-14" aria-labelledby="closing-heading">
      <DoodleStar className="absolute left-[8%] top-[20%] h-8 w-8 animate-float-slow" color="#FFC93C" />
      <DoodleStar className="absolute right-[10%] top-[34%] h-6 w-6 animate-float-slow" color="#E63946" />
      <DoodleStar className="absolute bottom-[16%] left-[14%] h-7 w-7 animate-float-slow" color="#4DABF7" />

      <Reveal className="mx-auto max-w-2xl text-center">
        <p className="font-display text-2xl font-semibold text-ink-soft">{BIRTHDAY.closingEyebrow}</p>
        <Squiggle className="mx-auto mt-3 h-3 w-40" color="#E63946" />

        <div className="relative mt-8 rotate-[-0.8deg] rounded-lg border-[3px] border-ink bg-white p-8 shadow-card sm:p-10">
          <Tape color="var(--color-sky)" rotate="-6deg" className="-top-3 left-8" />
          <Tape color="var(--color-butter)" rotate="8deg" className="-top-3 right-8" />
          <h2 id="closing-heading" className="sr-only">A final note</h2>
          <p className="whitespace-pre-wrap font-body text-xl leading-relaxed text-ink sm:text-2xl">
            {BIRTHDAY.closingNote}
          </p>
        </div>

        <p className="font-display mt-10 text-lg text-ink-soft">
          Handmade with love, by your brother — no templates, no shortcuts, just for you 💛
        </p>
      </Reveal>
    </section>
  )
}
