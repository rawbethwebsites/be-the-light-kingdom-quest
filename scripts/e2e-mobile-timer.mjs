import { chromium } from 'playwright';
const BASE = process.env.E2E_BASE_URL || 'https://light.theboostnation.com';
const PASSCODE = process.env.E2E_HOST_PASSCODE;
if (!PASSCODE) throw new Error('Missing E2E_HOST_PASSCODE');
const extractRoomCode = text => ([...text.matchAll(/\b[A-F0-9]{6}\b/g)].map(m => m[0]))[0];
const browser = await chromium.launch({ headless: true });
try {
  const host = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const player = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true });
  await host.goto(`${BASE}/host`, { waitUntil: 'networkidle' });
  const pass = host.getByPlaceholder(/passcode/i);
  if (await pass.count()) { await pass.fill(PASSCODE); await host.getByRole('button', { name: /^Continue$/i }).click(); await host.waitForTimeout(700); }
  if (!(await host.getByRole('button', { name: /^Create Room$/i }).count())) await host.getByRole('button', { name: /Create New Room/i }).click();
  await host.getByRole('button', { name: /^Create Room$/i }).click();
  await host.waitForTimeout(1500);
  const roomCode = extractRoomCode(await host.locator('body').innerText());
  await player.goto(`${BASE}/play?room=${roomCode}`, { waitUntil: 'networkidle' });
  await player.evaluate(() => localStorage.clear());
  await player.goto(`${BASE}/play?room=${roomCode}`, { waitUntil: 'networkidle' });
  await player.getByPlaceholder(/nickname/i).fill(`TimerQA${Date.now().toString().slice(-4)}`);
  await player.getByRole('button', { name: /Join Game/i }).click();
  await player.getByText(/Waiting to Start/i).waitFor({ timeout: 15000 });
  await host.getByRole('button', { name: /Light Rush/i }).click();
  await player.locator('button').filter({ hasText: /^A\./ }).first().waitFor({ timeout: 15000 });
  await host.waitForTimeout(1000);
  const snapshots=[];
  for (let i=0;i<4;i++) {
    const timer = await player.locator('[data-testid="player-countdown"]').innerText();
    snapshots.push(Number(timer));
    await host.waitForTimeout(1200);
  }
  if (snapshots.some(n=>!Number.isFinite(n)) || snapshots[0] <= 0 || snapshots.at(-1) >= snapshots[0]) throw new Error(`Bad mobile countdown: ${JSON.stringify(snapshots)}`);
  await player.locator('button').filter({ hasText: /^A\./ }).first().click();
  await player.getByText(/Answer Submitted/i).waitFor({ timeout: 10000 });
  const afterSubmit1 = Number(await player.locator('[data-testid="player-countdown"]').innerText());
  await host.waitForTimeout(1300);
  const afterSubmit2 = Number(await player.locator('[data-testid="player-countdown"]').innerText());
  if (afterSubmit2 >= afterSubmit1) throw new Error(`Countdown stopped after submit: ${afterSubmit1} -> ${afterSubmit2}`);

  await host.getByLabel(/Reset countdown to 15 seconds/i).click();
  await host.waitForTimeout(700);
  const afterReset = Number(await player.locator('[data-testid="player-countdown"]').innerText());
  if (afterReset < 10) throw new Error(`Host reset did not sync to mobile: ${afterReset}`);

  console.log(JSON.stringify({ok:true, roomCode, snapshots, afterSubmit:[afterSubmit1, afterSubmit2], afterReset}, null, 2));
} catch (err) { console.error(JSON.stringify({ok:false,error:err.message,stack:err.stack}, null, 2)); process.exitCode=1; }
finally { await browser.close(); }
