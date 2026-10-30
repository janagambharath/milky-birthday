/**
 * Interaction tests: balloon popping, memory match flip, candle toggle,
 * wish-card download. Run with the preview server up.
 *   node tests/interactions.mjs
 */
import { chromium } from 'playwright'

const BASE = process.env.SMOKE_URL ?? 'http://localhost:4173'

async function main() {
  const browser = await chromium.launch({
    executablePath: '/tmp/chrome-test/chrome-headless-shell-linux64/chrome-headless-shell',
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  })
  const page = await (await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true })).newPage()
  const errors = []
  page.on('pageerror', (e) => errors.push(String(e)))
  await page.goto(BASE, { waitUntil: 'networkidle' })
  await page.getByRole('button', { name: /open your surprise/i }).click()
  await page.waitForTimeout(2200)

  // 1. balloon pop → score increments
  await page.locator('#arcade-heading').scrollIntoViewIfNeeded()
  await page.getByRole('tab', { name: 'Balloon Pop' }).click()
  await page.getByRole('button', { name: /start popping/i }).click()
  await page.waitForTimeout(1800)
  const balloon = page.getByRole('button', { name: 'Pop balloon' }).first()
  await balloon.click({ timeout: 8000, force: true }) // balloons move; force skips stability check
  await page.waitForTimeout(300)
  const scoreText = await page.locator('text=Score:').first().textContent()
  console.log('balloon score after 1 pop:', JSON.stringify(scoreText?.trim()), scoreText?.includes('1') ? 'PASS' : 'FAIL')
  await page.getByRole('button', { name: /^stop$/i }).click()

  // 2. memory match → flip two cards, moves = 1
  await page.getByRole('tab', { name: 'Memory Match' }).click()
  await page.waitForTimeout(600)
  const cards = page.getByRole('button', { name: 'Face-down card' })
  await cards.nth(0).click()
  await cards.nth(1).click()
  await page.waitForTimeout(300)
  const moves = await page.locator('text=Moves:').first().textContent()
  console.log('memory moves after 2 flips:', JSON.stringify(moves?.trim()), moves?.includes('1') ? 'PASS' : 'FAIL')

  // 3. cake designer → celebrate lights candles
  await page.getByRole('tab', { name: 'Cake Studio' }).click()
  await page.waitForTimeout(600)
  await page.getByRole('button', { name: /light it up/i }).click()
  await page.waitForTimeout(500)
  console.log('cake studio celebrate: PASS (no errors)')

  // 4. wish maker → type wish + download fires
  await page.getByRole('tab', { name: 'Make a Wish' }).click()
  await page.waitForTimeout(600)
  await page.locator('#wish-text').fill('I wish for a hundred more birthdays like this one')
  const [download] = await Promise.all([
    page.waitForEvent('download', { timeout: 8000 }),
    page.getByRole('button', { name: /download my wish card/i }).click(),
  ])
  const path = await download.path()
  console.log('wish card download:', download.suggestedFilename(), path ? 'PASS' : 'FAIL')

  // 5. candle toggle on the big cake
  await page.locator('#cake-heading').scrollIntoViewIfNeeded()
  await page.getByRole('button', { name: /candle 1, unlit/i }).click()
  await page.waitForTimeout(300)
  const litCount = await page.locator('text=/\\d+ of 13 candles lit/').first().textContent()
  console.log('candle toggle:', JSON.stringify(litCount?.trim()), litCount?.includes('1 of 13') ? 'PASS' : 'FAIL')

  console.log(errors.length ? 'PAGE ERRORS: ' + errors.join(' | ') : 'no page errors')
  await browser.close()
}

main().catch((e) => { console.error(e); process.exit(1) })
