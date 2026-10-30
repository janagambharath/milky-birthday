/**
 * ─────────────────────────────────────────────────────────────
 *  MILKY'S BIRTHDAY — PERSONAL CONFIGURATION
 *  Everything editable lives here. Change text, swap photos,
 *  point the song at your file — no other code needs touching.
 * ─────────────────────────────────────────────────────────────
 */

export const BIRTHDAY = {
  name: 'Milky',
  /** Displayed on the hero + cake sections */
  headline: 'Happiest 13th Birthday, Milky! 🎂',
  subheading: 'Today, the world celebrates someone who makes it a little brighter.',
  dateOfBirth: '30 October 2013',
  birthdayDate: '30 October 2026',
  ageTurning: 13,

  /** Slug of the hero photograph (see PHOTO_CAPTIONS keys). */
  heroPhotoSlug: 'me-and-sis',

  /** Shown on the intro envelope. */
  introTeaser: 'Someone special has a surprise waiting…',
  introMadeWithLove: 'Made with love, just for Milky ❤️',
  introButton: 'Open Your Surprise 🎁',

  /**
   * The brother's letter. EDIT THIS — write it in your own words.
   * Keep it true: no invented memories, just how you feel about her.
   */
  brotherMessage: `Dear Milky,

Thirteen. Can you believe it? It feels like just yesterday you were the tiny kid stealing my snacks and my side of the bed — and somehow you've grown into the coolest person I know.

You're funny without even trying, kind when nobody's watching, and braver than you think you are. I'm proud of you every single day, not just on your birthday.

This little website is my gift to you — I built every bit of it myself, with your photos, your games, and a cake you can't actually eat (sorry). Play the games, make a wish, and blow out the candles.

No matter how old you get or how far you go, I'll always be your brother — your teammate, your backup, and your biggest fan.

Happy birthday, Milky. This year is going to be amazing, I can feel it.

— Your brother, with all my love ❤️`,

  /** Final section. Keep the required line, edit around it freely. */
  closingEyebrow: 'One more thing…',
  closingNote:
    'Keep smiling, keep exploring, keep being you. Happy Birthday, Milky! ❤️\n\n— made with love by your brother',

  /** ── Music ────────────────────────────────────────────────
   *  Drop ONE Telugu brother-to-sister dedication song at:
   *      public/audio/milky-birthday-song.mp3
   *  Then set SONG_TITLE below to its real title. The player
   *  hides itself gracefully until the file exists.
   */
  songTitle: 'Hridayam Muriyum Makane',
  songPath: 'audio/milky-birthday-song.mp3',
} as const

/** Optional caption per photo slug. Omit a key for no caption. */
export const PHOTO_CAPTIONS: Record<string, string> = {
  'tiny-smile': 'The smile that started it all',
  'birthday-bash': 'Birthday girl, cake and all',
  'temple-visit': 'Little devotee at the temple',
  'rangoli-artist': 'Milky’s rangoli masterpiece',
  'little-queen': 'All dressed up, feeling like a queen',
  'cheeky-grin': 'That cheeky grin',
  'school-days': 'Off to conquer school',
  'holi-fun': 'Holi colours, Milky style',
  'grown-up-gorgeous': 'Thirteen and radiant',
  'garden-day': 'Sunshine in the garden',
  'snow-day': 'Snow day with her furry best friend',
  'red-dress': 'Twirling in red',
  'shades-on': 'Shades on — cool mode activated',
  'rainbow-doodles': 'Doodles and giggles',
  'butterfly-baby': 'Butterfly kisses',
  'me-and-sis': 'Us — the best team',
}
