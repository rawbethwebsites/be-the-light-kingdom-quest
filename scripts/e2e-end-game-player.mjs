import { chromium } from 'playwright';

const BASE = 'https://light.theboostnation.com';
const PASSCODE = process.env.E2E_HOST_PASSCODE;
if (!PASSCODE) process.exit(1);
function extractRoomCode(text) { return ([...text.matchAll(/\b[A-F0-9]{6}\b/g)].map(m => m[0]))[0]; }

const browser = await chromium.launch({ headless: true });
const host = await browser.newPage();
const player = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true });
try {
  await host.goto(`${BASE}/host`, { waitUntil: 'networkidle' });
  const pass = host.getByPlaceholder(/passcode/i);
  if (await pass.count()) { await pass.fill(PASSCODE); await host.getByRole('button', { name: /^Continue$/i }).click(); await host.waitForTimeout(700); }
  if (!(await host.getByRole('button', { name: /^Create Room$/i }).count())) await host.getByRole('button', { name: /Create New Room/i }).click();
  await host.getByRole('button', { name: /^Create Room$/i }).click();
  await host.waitForTimeout(1800);
  const code = extractRoomCode(await host.locator('body').innerText());

  await player.goto(`${BASE}/play?room=${code}`, { waitUntil: 'networkidle' });
  await player.getByPlaceholder(/nickname/i).fill('EndTester');
  await player.getByRole('button', { name: /Join Game/i }).click();
  await player.getByText(/Waiting to Start/i).waitFor({ timeout: 10000 });

  await host.getByRole('button', { name: /Light Rush/i }).click();
  await player.getByText(/Which verse says/i).waitFor({ timeout: 15000 });

  host.once('dialog', async d => await d.accept());
  await host.getByTitle(/End Game/i).click();
  await host.getByText(/Game Ended/i).waitFor({ timeout: 10000 });
  await player.getByText(/Game Over/i).waitFor({ timeout: 10000 });

  console.log(JSON.stringify({ ok: true, roomCode: code, hostEnded: true, playerGameOver: true }, null, 2));
} catch (err) {
  console.error(JSON.stringify({ ok: false, error: err.message, stack: err.stack }, null, 2));
  process.exitCode = 1;
} finally { await browser.close(); }
