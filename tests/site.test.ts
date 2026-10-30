import { describe, expect, it } from 'vitest'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { PHOTO_ASSETS } from '../src/data/photos.generated'
import { BIRTHDAY, PHOTO_CAPTIONS } from '../src/data/birthday'

const ROOT = join(__dirname, '..')

describe('photo manifest', () => {
  it('includes every supplied photograph', () => {
    expect(PHOTO_ASSETS.length).toBe(16)
  })

  it('has unique slugs with positive dimensions (no layout shift)', () => {
    const slugs = new Set<string>()
    for (const p of PHOTO_ASSETS) {
      expect(p.slug).toBeTruthy()
      expect(slugs.has(p.slug)).toBe(false)
      slugs.add(p.slug)
      expect(p.width).toBeGreaterThan(0)
      expect(p.height).toBeGreaterThan(0)
    }
  })

  it('has generated files on disk for every photo', () => {
    for (const p of PHOTO_ASSETS) {
      expect(existsSync(join(ROOT, 'public', p.file)), `${p.file} missing`).toBe(true)
      expect(existsSync(join(ROOT, 'public', p.thumb)), `${p.thumb} missing`).toBe(true)
    }
  })

  it('hero photo exists in the manifest', () => {
    expect(PHOTO_ASSETS.some((p) => p.slug === BIRTHDAY.heroPhotoSlug)).toBe(true)
  })

  it('every caption key matches a real photo slug', () => {
    const slugs = new Set(PHOTO_ASSETS.map((p) => p.slug))
    for (const key of Object.keys(PHOTO_CAPTIONS)) {
      expect(slugs.has(key), `caption for unknown slug "${key}"`).toBe(true)
    }
  })
})

describe('birthday config', () => {
  it('has the required personal details', () => {
    expect(BIRTHDAY.name).toBe('Milky')
    expect(BIRTHDAY.ageTurning).toBe(13)
    expect(BIRTHDAY.dateOfBirth).toBe('30 October 2013')
    expect(BIRTHDAY.songPath).toBe('audio/milky-birthday-song.mp3')
  })

  it('brother message is not the raw placeholder', () => {
    expect(BIRTHDAY.brotherMessage).not.toContain('[BROTHER')
    expect(BIRTHDAY.brotherMessage.length).toBeGreaterThan(100)
  })
})
