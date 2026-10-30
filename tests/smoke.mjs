/**
 * Playwright smoke test — the full Milky journey:
 * intro → open surprise → hero → letter → gallery → lightbox →
 * arcade (all 4 games) → candles → closing. Screenshots at mobile + desktop.
 *
 * Run:  npm run preview  (in one terminal)
 *        node tests/smoke.mjs
 */
import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'

const BASE = process.env.SMOKE_URL ?? 'http://localhost:4173'
const OUT = 'tests/screenshots'

const MOBILE = { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true }
const DESKTOP = { width: 1280, height: 800, deviceScaleFactor: 1 }

async function main() {
  await mkdir(OUT, { recursive: true })
  const browser = await chromium.launch({
    executablePath: '/tmp/chrome-test/chrome-headless-shell-linux64/chrome-headless-shell',
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  })

  for (const [name, vp] of [['mobile', MOBILE], ['desktop', DESKTOP]]) {
    const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: vp.deviceScaleFactor, isMobile: vp.isMobile ?? false, hasTouch: vp.hasTouch ?? false })
    // block the (not yet provided) song so the run is deterministic
    await ctx.route('**/milky-birthday-song.mp3', (r) => r.abort())
    const page = await ctx.newPage()
    const errors = []
    page.on('pageerror', (e) => errors.push(String(e)))

    await page.goto(BASE, { waitUntil: 'networkidle' })
    await page.screenshot({ path: `${OUT}/${name}-01-intro.png` })

    // open the surprise
    await page.getByRole('button', { name: /open your surprise/i }).click()
    await page.waitForTimeout(2300)
    await page.screenshot({ path: `${OUT}/${name}-02-hero.png` })

    // letter
    await page.locator('text=From your brother, with love').scrollIntoViewIfNeeded()
    await page.waitForTimeout(900)
    await page.screenshot({ path: `${OUT}/${name}-03-letter.png` })

    // gallery + lightbox
    await page.locator('#gallery-heading').scrollIntoViewIfNeeded()
    await page.waitForTimeout(900)
    await page.screenshot({ path: `${OUT}/${name}-04-gallery.png` })
    await page.getByRole('button', { name: /open featured photo/i }).click()
    await page.waitForTimeout(600)
    await page.screenshot({ path: `${OUT}/${name}-05-lightbox.png` })
    await page.keyboard.press('ArrowRight')
    await page.waitForTimeout(400)
    await page.keyboard.press('Escape')

    // arcade: visit each tab
    await page.locator('#arcade-heading').scrollIntoViewIfNeeded()
    for (const tab of ['Balloon Pop', 'Memory Match', 'Cake Studio', 'Make a Wish']) {
      await page.getByRole('tab', { name: tab }).click()
      await page.waitForTimeout(900)
    }
    await page.screenshot({ path: `${OUT}/${name}-06-arcade.png` })

    // balloon pop: start and pop one balloon
    await page.getByRole('tab', { name: 'Balloon Pop' }).click()
    await page.getByRole('button', { name: /start popping/i }).click()
    await page.waitForTimeout(2500)
    await page.screenshot({ path: `${OUT}/${name}-07-balloon.png` })
    await page.getByRole('button', { name: /stop/i }).click()

    // cake: light all, blow out
    await page.locator('#cake-heading').scrollIntoViewIfNeeded()
    await page.getByRole('button', { name: /light all candles/i }).click()
    await page.waitForTimeout(700)
    await page.screenshot({ path: `${OUT}/${name}-08-cake-lit.png` })
    await page.getByRole('button', { name: /blow them out \(tap\)/i }).click()
    await page.waitForTimeout(2500)

    // closing
    await page.locator('#closing-heading').scrollIntoViewIfNeeded()
    await page.waitForTimeout(900)
    await page.screenshot({ path: `${OUT}/${name}-09-closing.png` })

    console.log(`${name}: ${errors.length ? 'PAGE ERRORS: ' + errors.join(' | ') : 'no page errors'}`)
    await ctx.close()
  }
  await browser.close()
  console.log('done →', OUT)
}

main().catch((e) => { console.error(e); process.exit(1) })
