import { chromium } from 'playwright';

const BASE = 'https://light.theboostnation.com';
const PASSCODE = 'be-the-light-host-2026';
function extractRoomCode(text) {
  const matches = [...text.matchAll(/\b[A-F0-9]{6}\b/g)].map(m => m[0]);
  return matches[0];
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
page.on('console', msg => console.log('console', msg.type(), msg.text()));
page.on('pageerror', err => console.log('pageerror', err.message));
await page.goto(`${BASE}/host`, { waitUntil: 'networkidle' });
const pass = page.getByPlaceholder(/passcode/i);
if (await pass.count()) {
  await pass.fill(PASSCODE);
  await page.getByRole('button', { name: /^Continue$/i }).click();
  await page.waitForTimeout(700);
}
if (!(await page.getByRole('button', { name: /^Create Room$/i }).count())) {
  await page.getByRole('button', { name: /Create New Room/i }).click();
}
await page.getByRole('button', { name: /^Create Room$/i }).click();
await page.waitForTimeout(2500);
let body = await page.locator('body').innerText();
const code = extractRoomCode(body);
console.log('ROOM', code);
console.log('BEFORE START BODY\n', body.slice(0, 1200));
const buttonsBefore = await page.locator('button').evaluateAll(btns => btns.map(b => b.innerText || b.getAttribute('aria-label') || b.textContent));
console.log('BUTTONS BEFORE', JSON.stringify(buttonsBefore, null, 2));
await page.getByRole('button', { name: /Light Rush/i }).click();
await page.waitForTimeout(3500);
body = await page.locator('body').innerText();
console.log('AFTER START BODY\n', body.slice(0, 2000));
const buttonsAfter = await page.locator('button').evaluateAll(btns => btns.map(b => b.innerText || b.getAttribute('aria-label') || b.textContent));
console.log('BUTTONS AFTER', JSON.stringify(buttonsAfter, null, 2));
await browser.close();
