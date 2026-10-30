# 🎂 Milky's 13th Birthday — a handmade surprise website

A premium, interactive birthday experience built by her brother for **Milky** (13th birthday, 30 October 2026).
Static site · React + TypeScript + Vite + Tailwind v4 · no backend, no analytics, no tracking.

## What's inside

| Section | What it is |
|---|---|
| Surprise envelope | Tap-to-open intro, starts the song + confetti |
| Hero | "Happiest 13th Birthday, Milky!" with her real photo in a polaroid frame |
| From your brother, with love | Handwritten-style letter (editable) |
| Our little memory world | Scrapbook masonry gallery of all 10 real photos + lightbox (keyboard, swipe) |
| Milky's mini arcade | 4 real games: Balloon Pop · Memory Match · Cake Studio · Wish Maker (downloadable card) |
| Birthday cake | 13 candles — light them, then blow them out by tap **or** for real with the mic |
| Closing note | "One more thing…" — the emotional landing |
| Floating music player | One Telugu dedication song, looped, with play/pause/mute/volume |

## Quick start

```bash
npm install
npm run photos     # optimize photos → public/photos + manifest (run after adding photos)
npm run dev        # local dev at http://localhost:5173
npm run build      # production build → dist/
npm run test       # vitest checks (manifest, config)
```

Playwright smoke test (needs the site served): `npm run preview` in one terminal, then `node tests/smoke.mjs`.

## 🎵 Adding the birthday song (REQUIRED — the slot is empty)

1. Get **one** Telugu brother-to-sister dedication song you own or are licensed to use.
   Never download an unauthorized copy of a copyrighted song.
2. Save it as `public/audio/milky-birthday-song.mp3` (MP3 works on every phone).
3. Open `src/data/birthday.ts` and set `songTitle` to the song's real title.
4. Rebuild (`npm run build`).

Until the file exists, the music player hides itself gracefully — nothing breaks.

## 📸 Adding more photographs

1. Drop the new JPEG/PNG into the source folder (currently `~/workspace/user/files/` —
   change `SOURCE_DIR` in `scripts/process-photos.mjs` if yours live elsewhere).
2. Add one line to the `PHOTOS` array in `scripts/process-photos.mjs`:
   `['exact-filename.jpg', 'my-slug'],`
   (If it's a screenshot with UI chrome, add a trim entry to `CHROME_TRIM`.)
3. Run `npm run photos` — it strips EXIF/GPS, writes optimized WebP
   (full ≤1600px + thumbnails) and regenerates the manifest with dimensions.
4. Optional: add a caption in `src/data/birthday.ts` → `PHOTO_CAPTIONS['my-slug']`.

The gallery discovers photos from the generated manifest — no gallery code to rewrite.

## ✏️ Editing text

Everything personal lives in **`src/data/birthday.ts`**: name, dates, hero photo,
brother's letter, song title/path, photo captions, closing note.

## 🚀 Deployment

`npm run build` → deploy the `dist/` folder to **Vercel** or **Cloudflare Pages**
(both serve static folders; no build config needed beyond `npm run build`).

### ⚠️ Privacy — read before you publish (photos of a minor)

- The site ships `<meta name="robots" content="noindex, nofollow">`, **no analytics**,
  **no social share buttons**, and all photo EXIF/GPS metadata is stripped at build time.
- **noindex is not access protection.** Anyone with the URL can see the photos.
- **Recommended:** share via an access-controlled route instead of a public URL —
  e.g. Vercel [Password Protection](https://vercel.com/docs/security/password-protection)
  (Pro), Cloudflare Access, or simply send the `dist/` folder privately
  (a `python3 -m http.server` on a family laptop, or a private link).
- Do **not** publish the photos to a fully public website without thinking through
  who can find them.

## Design notes

- Visual identity: *magical birthday scrapbook × playful mini arcade* — warm paper,
  butter yellow / cherry red / sky blue / fresh green, Fredoka + DM Sans (self-hosted).
- One orchestrated intro animation; purposeful micro-interactions elsewhere;
  `prefers-reduced-motion` is respected throughout.
- Mobile-first (iPhone Safari / Android Chrome), safe-area aware, touch-friendly.
- Games are code-split (`React.lazy`) so the first load stays light.
