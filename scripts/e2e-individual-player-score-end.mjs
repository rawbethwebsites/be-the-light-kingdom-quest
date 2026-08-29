import { chromium } from 'playwright';

const BASE = process.env.E2E_BASE_URL || 'https://light.theboostnation.com';
const PASSCODE = process.env.E2E_HOST_PASSCODE;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!PASSCODE) { console.error('Missing E2E_HOST_PASSCODE'); process.exit(1); }
if (!SUPABASE_URL || !ANON) { console.error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY'); process.exit(1); }
const extractRoomCode = text => ([...text.matchAll(/\b[A-F0-9]{6}\b/g)].map(m => m[0]))[0];
const getJson = async path => fetch(`${SUPABASE_URL}/rest/v1/${path}`, { headers: { apikey: ANON } }).then(r => r.json());

const browser = await chromium.launch({ headless: true });
try {
  const host = await browser.newPage();
  const p1 = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true });
  const p2 = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true });

  await host.goto(`${BASE}/host`, { waitUntil: 'networkidle' });
  const pass = host.getByPlaceholder(/passcode/i);
  if (await pass.count()) {
    await pass.fill(PASSCODE);
    await host.getByRole('button', { name: /^Continue$/i }).click();
    await host.waitForTimeout(700);
  }
  if (!(await host.getByRole('button', { name: /^Create Room$/i }).count())) await host.getByRole('button', { name: /Create New Room/i }).click();
  await host.getByRole('button', { name: /^Create Room$/i }).click();
  await host.waitForTimeout(1500);
  const roomCode = extractRoomCode(await host.locator('body').innerText());

  async function join(page, name) {
    await page.goto(`${BASE}/play?room=${roomCode}`, { waitUntil: 'networkidle' });
    await page.evaluate(() => localStorage.clear());
    await page.goto(`${BASE}/play?room=${roomCode}`, { waitUntil: 'networkidle' });
    await page.getByPlaceholder(/nickname/i).fill(name);
    await page.getByRole('button', { name: /Join Game/i }).click();
  }

  await join(p1, 'RobQA');
  await p1.getByText(/Waiting to Start/i).waitFor({ timeout: 15000 });
  const p1Lobby = await p1.locator('body').innerText();
  if (/RobQA's Team/i.test(p1Lobby) || /Your Team/i.test(p1Lobby)) throw new Error('Player lobby still shows team language');

  await join(p2, 'RobQA');
  await p2.getByText(/already taken/i).waitFor({ timeout: 15000 });

  await host.getByRole('button', { name: /Light Rush/i }).click();
  await p1.locator('button').filter({ hasText: /^A\./ }).first().waitFor({ timeout: 15000 });
  await host.waitForTimeout(1000);
  const rooms = await getJson(`rooms?select=id,active_question_id&code=eq.${roomCode}`);
  const qid = rooms[0].active_question_id;
  const qs = await getJson(`game_questions?select=correct_option&id=eq.${qid}`);
  const correct = qs[0].correct_option;
  const letter = String.fromCharCode(65 + correct);
  await p1.locator('button').filter({ hasText: new RegExp(`^${letter}\\.`) }).first().click();
  await p1.getByText(/Answer Submitted/i).waitFor({ timeout: 10000 });

  p1.on('dialog', dialog => dialog.accept());
  host.on('dialog', dialog => dialog.accept());
  await host.getByRole('button', { name: /End Game/i }).click();
  await host.getByText(/Game Ended/i).waitFor({ timeout: 15000 });
  const confirmText = await host.locator('body').innerText();
  if (!/Game Ended/i.test(confirmText)) {
    // Browser confirm may be native; try accepting dialog path in future if needed.
    throw new Error('Host did not end game');
  }

  await p1.getByText(/Game Over/i).waitFor({ timeout: 30000 });
  const p1End = await p1.locator('body').innerText();
  if (/last question|The correct answer was/i.test(p1End)) throw new Error('Player stayed on last reveal/answer after game ended');
  if (/RobQA's Team/i.test(p1End) || /Your Team/i.test(p1End)) throw new Error('Game over still shows team language');
  if (/0 points/i.test(p1End)) throw new Error(`Current player final score showed zero. Body: ${p1End}`);

  console.log(JSON.stringify({ ok: true, roomCode, duplicateBlocked: true, plainName: true, gameOverWithoutRefresh: true, ownFinalScoreNonZero: true, p1EndSnippet: p1End.slice(0, 220) }, null, 2));
} catch (err) {
  console.error(JSON.stringify({ ok: false, error: err.message, stack: err.stack }, null, 2));
  process.exitCode = 1;
} finally {
  await browser.close();
}
