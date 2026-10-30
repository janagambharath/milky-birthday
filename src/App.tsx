import { useCallback, useRef, useState } from 'react'
import { Intro } from './components/Intro'
import { Hero } from './components/Hero'
import { BrotherMessage } from './components/BrotherMessage'
import { Gallery } from './components/Gallery'
import { Arcade } from './components/Arcade'
import { BirthdayCake } from './components/BirthdayCake'
import { ClosingNote } from './components/ClosingNote'
import { MusicPlayer, type MusicPlayerHandle } from './components/MusicPlayer'
import { Stitch } from './components/Decor'
import { celebrateBig } from './lib/confetti'

export default function App() {
  const [entered, setEntered] = useState(false)
  const playerRef = useRef<MusicPlayerHandle>(null)

  /** Fired synchronously inside the "Open Your Surprise" tap — the user gesture browsers require for audio. */
  const handleGesture = useCallback(() => {
    playerRef.current?.start()
  }, [])

  const handleOpen = useCallback(() => {
    setEntered(true)
    celebrateBig()
    // Let the intro fade out, then glide to the hero.
    window.setTimeout(() => {
      document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 350)
  }, [])

  return (
    <>
      <a
        href="#hero"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:border-2 focus:border-ink focus:bg-butter focus:px-4 focus:py-2 focus:font-semibold"
      >
        Skip to birthday surprise
      </a>

      {!entered && <Intro onOpen={handleOpen} onGesture={handleGesture} />}

      <main>
        <Hero entered={entered} />
        <Stitch />
        <BrotherMessage />
        <Stitch />
        <Gallery />
        <Stitch />
        <Arcade />
        <Stitch />
        <BirthdayCake />
        <Stitch />
        <ClosingNote />
      </main>

      <MusicPlayer ref={playerRef} hidden={!entered} />
    </>
  )
}
