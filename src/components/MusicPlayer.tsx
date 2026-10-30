import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { Music, Pause, Play, Volume2, VolumeX } from 'lucide-react'
import { BIRTHDAY } from '../data/birthday'

export interface MusicPlayerHandle {
  /** Start playback — must be called from a user gesture. */
  start: () => void
}

/**
 * Floating music player. Exactly one song, looped. If the mp3 is missing
 * (not yet added), the player quietly stays hidden — nothing breaks.
 */
export const MusicPlayer = forwardRef<MusicPlayerHandle, { hidden?: boolean }>(function MusicPlayer({ hidden }, ref) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [available, setAvailable] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(false)
  const [volume, setVolume] = useState(0.75)
  const [expanded, setExpanded] = useState(false)
  /** True only when the user pressed pause themselves — auto-resume must not fight it. */
  const userPaused = useRef(false)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = volume
    const onCanPlay = () => setAvailable(true)
    const onError = () => setAvailable(false)
    const onPlay = () => setPlaying(true)
    const onPause = () => setPlaying(false)
    audio.addEventListener('canplay', onCanPlay)
    audio.addEventListener('error', onError)
    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)
    return () => {
      audio.removeEventListener('canplay', onCanPlay)
      audio.removeEventListener('error', onError)
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = muted ? 0 : volume
  }, [volume, muted])

  // Backup auto-resume: if the intro-tap play() was ever interrupted (slow
  // network, browser hiccup), the next tap anywhere starts the music by
  // itself — she never has to hunt for a play button.
  useEffect(() => {
    const tryPlay = () => {
      const audio = audioRef.current
      if (available && audio && audio.paused && !userPaused.current) {
        audio.play().catch(() => undefined)
      }
    }
    document.addEventListener('pointerdown', tryPlay)
    return () => document.removeEventListener('pointerdown', tryPlay)
  }, [available])

  useImperativeHandle(ref, () => ({
    start: () => {
      const audio = audioRef.current
      if (!audio) return
      audio.play().catch(() => {
        // autoplay blocked or file missing — the play button stays available
      })
    },
  }), [])

  const toggle = () => {
    const audio = audioRef.current
    if (!audio) return
    if (playing) {
      userPaused.current = true
      audio.pause()
    } else {
      userPaused.current = false
      audio.play().catch(() => undefined)
    }
  }

  // NOTE: the <audio> element stays in a stable tree position across renders —
  // remounting it (e.g. by moving it inside the player div) would stop playback.
  return (
    <>
      <audio ref={audioRef} src={BIRTHDAY.songPath} loop preload="metadata" className="hidden" aria-hidden="true" />
      {available && !hidden && (
        <div className="safe-bottom fixed bottom-4 right-4 z-40">
          <div className="flex items-center gap-2 rounded-full border-[2.5px] border-ink bg-white/95 py-2 pl-2 pr-3 shadow-card backdrop-blur">
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? 'Pause birthday song' : 'Play birthday song'}
          className="btn-sticker flex h-10 w-10 items-center justify-center !border-2 bg-cherry text-white"
        >
          {playing ? <Pause className="h-5 w-5" aria-hidden="true" /> : <Play className="ml-0.5 h-5 w-5" aria-hidden="true" />}
        </button>

        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          aria-expanded={expanded}
          aria-label="Song details"
          className="flex max-w-36 items-center gap-1.5 overflow-hidden text-left"
        >
          <Music className="h-4 w-4 shrink-0 text-cherry" aria-hidden="true" />
          <span className="truncate text-sm font-semibold text-ink">{BIRTHDAY.songTitle}</span>
        </button>

        {expanded && (
          <span className="flex animate-pop-in items-center gap-2">
            <button
              type="button"
              onClick={() => setMuted((m) => !m)}
              aria-label={muted ? 'Unmute' : 'Mute'}
              className="rounded-full p-1.5 text-ink transition hover:bg-paper-deep focus-visible:outline-3 focus-visible:outline-sky"
            >
              {muted ? <VolumeX className="h-4 w-4" aria-hidden="true" /> : <Volume2 className="h-4 w-4" aria-hidden="true" />}
            </button>
            <label className="sr-only" htmlFor="song-volume">Volume</label>
            <input
              id="song-volume"
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={muted ? 0 : volume}
              onChange={(e) => { setVolume(Number(e.target.value)); setMuted(false) }}
              className="w-20 accent-[#E63946]"
            />
          </span>
          )}
          </div>
        </div>
      )}
    </>
  )
})
