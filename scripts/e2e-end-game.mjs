import { chromium } from 'playwright';

const BASE = 'https://light.theboostnation.com';
const PASSCODE = process.env.E2E_HOST_PASSCODE;
if (!PASSCODE) {
  console.error('Missing E2E_HOST_PASSCODE');
  process.exit(1);
}
function extractRoomCode(text) {
  return ([...text.matchAll(/\b[A-F0-9]{6}\b/g)].map(m => m[0]))[0];
}

const browser = await chromium.launch({ headless: true });
const host = await browser.newPage();
host.on('console', msg => console.log('HOST_CONSOLE', msg.type(), msg.text()));
host.on('pageerror', err => console.log('HOST_PAGEERROR', err.message));
try {
  await host.goto(`${BASE}/host`, { waitUntil: 'networkidle' });
  const pass = host.getByPlaceholder(/passcode/i);
  if (await pass.count()) {
    await pass.fill(PASSCODE);
    await host.getByRole('button', { name: /^Continue$/i }).click();
    await host.waitForTimeout(700);
  }
  if (!(await host.getByRole('button', { name: /^Create Room$/i }).count())) {
    await host.getByRole('button', { name: /Create New Room/i }).click();
  }
  await host.getByRole('button', { name: /^Create Room$/i }).click();
  await host.waitForTimeout(1800);
  const roomCode = extractRoomCode(await host.locator('body').innerText());
  await host.getByRole('button', { name: /Light Rush/i }).click();
  await host.getByText(/Question 1 of/i).waitFor({ timeout: 10000 });
  host.once('dialog', async dialog => {
    console.log('DIALOG', dialog.message());
    await dialog.accept();
  });
  await host.getByTitle(/End Game/i).click();
  await host.waitForTimeout(2500);
  const body = await host.locator('body').innerText();
  console.log(JSON.stringify({ ok: true, roomCode, body: body.slice(0, 1500) }, null, 2));
} catch (err) {
  console.error(JSON.stringify({ ok: false, error: err.message, stack: err.stack }, null, 2));
  process.exitCode = 1;
} finally {
  await browser.close();
}
