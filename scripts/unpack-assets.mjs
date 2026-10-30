// Unpacks binary assets (photos, fonts, song) that are stored in git as a
// base64 tarball (vendor/assets.tar.b64), because the deploy pipeline only
// pushes UTF-8 text files. Runs automatically as `prebuild`.
// Skips entirely when the assets are already present (local dev).
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { execSync } from 'node:child_process'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const publicDir = join(root, 'public')

if (existsSync(join(publicDir, 'photos', 'full')) && existsSync(join(publicDir, 'audio', 'milky-birthday-song.mp3'))) {
  console.log('[unpack-assets] assets already present, skipping')
  process.exit(0)
}

const b64Path = join(root, 'vendor', 'assets.tar.b64')
if (!existsSync(b64Path)) {
  console.error('[unpack-assets] vendor/assets.tar.b64 not found — cannot build without binary assets')
  process.exit(1)
}

const tmpTar = '/tmp/milky-assets.tar'
writeFileSync(tmpTar, Buffer.from(readFileSync(b64Path, 'utf8'), 'base64'))
mkdirSync(publicDir, { recursive: true })
execSync(`tar -xf ${tmpTar} -C ${publicDir}`)
console.log('[unpack-assets] extracted binary assets into public/')
