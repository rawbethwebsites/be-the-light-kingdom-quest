import { chromium } from 'playwright';

const BASE = process.env.E2E_BASE_URL || 'http://localhost:3000';
const PASSCODE = process.env.E2E_HOST_PASSCODE;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!PASSCODE) throw new Error('Missing E2E_HOST_PASSCODE');
if (!SUPABASE_URL || !ANON) throw new Error('Missing Supabase env');

const extractRoomCode = text => ([...text.matchAll(/\b[A-F0-9]{6}\b/g)].map(m => m[0]))[0];
const getJson = async path => fetch(`${SUPABASE_URL}/rest/v1/${path}`, { headers: { apikey: ANON } }).then(r => r.json());

const browser = await chromium.launch({ headless: true });
try {
  const host = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const player = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true });
  const display = await browser.newPage({ viewport: { width: 1440, height: 900 } });

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
  await host.waitForTimeout(1500);
  const roomCode = extractRoomCode(await host.locator('body').innerText());
  if (!roomCode) throw new Error('No room code found');

  await display.goto(`${BASE}/display/${roomCode}`, { waitUntil: 'networkidle' });
  await player.goto(`${BASE}/play?room=${roomCode}`, { waitUntil: 'networkidle' });
  await player.evaluate(() => localStorage.clear());
  await player.goto(`${BASE}/play?room=${roomCode}`, { waitUntil: 'networkidle' });
  await player.getByPlaceholder(/nickname/i).fill(`LightQA${Date.now().toString().slice(-4)}`);
  await player.getByRole('button', { name: /Join Game/i }).click();
  await player.getByText(/Waiting to Start/i).waitFor({ timeout: 15000 });

  await host.getByRole('button', { name: /Lights Out/i }).click();
  await player.getByText(/Lights Out/i).waitFor({ timeout: 15000 });
  await display.getByText(/Lights Out/i).waitFor({ timeout: 15000 });

  const rooms = await getJson(`rooms?select=id,active_question_id&code=eq.${roomCode}`);
  const qid = rooms[0]?.active_question_id;
  if (!qid) throw new Error('No active Lights Out question id');
  const qs = await getJson(`game_questions?select=game_key,correct_option,source_label&id=eq.${qid}`);
  if (qs[0]?.game_key !== 'lights_out') throw new Error(`Started wrong game: ${qs[0]?.game_key}`);
  const letter = String.fromCharCode(65 + qs[0].correct_option);

  await player.locator('button').filter({ hasText: new RegExp(`^${letter}\\.`) }).first().click();
  await player.getByText(/Answer Submitted/i).waitFor({ timeout: 10000 });
  await host.getByRole('button', { name: /Reveal Answer/i }).click();
  await player.getByText(/Best Light Move|Light restored/i).waitFor({ timeout: 15000 });
  await display.getByText(/Best Light Move/i).waitFor({ timeout: 15000 });

  const displayText = await display.locator('body').innerText();
  if (!/City light progress|Best Light Move|Lights Out/i.test(displayText)) throw new Error('Display missing Lights Out reveal UI');

  console.log(JSON.stringify({ ok: true, roomCode, game: 'lights_out', answered: letter, displayReveal: /Best Light Move/.test(displayText) }, null, 2));
} catch (err) {
  console.error(JSON.stringify({ ok: false, error: err.message, stack: err.stack }, null, 2));
  process.exitCode = 1;
} finally {
  await browser.close();
}
