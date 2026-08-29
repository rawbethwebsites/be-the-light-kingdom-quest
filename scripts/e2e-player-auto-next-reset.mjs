import { chromium } from 'playwright';

const BASE = 'https://light.theboostnation.com';
const PASSCODE = process.env.E2E_HOST_PASSCODE;
if (!PASSCODE) { console.error('Missing E2E_HOST_PASSCODE'); process.exit(1); }
const extractRoomCode = text => ([...text.matchAll(/\b[A-F0-9]{6}\b/g)].map(m => m[0]))[0];
const sleep = ms => new Promise(r => setTimeout(r, ms));

const browser = await chromium.launch({ headless: true });
try {
  const host = await browser.newPage();
  const player = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true });

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

  await player.goto(`${BASE}/play?room=${roomCode}`, { waitUntil: 'networkidle' });
  await player.evaluate(() => localStorage.clear());
  await player.goto(`${BASE}/play?room=${roomCode}`, { waitUntil: 'networkidle' });
  await player.getByPlaceholder(/nickname/i).fill('AutoNextQA');
  await player.getByRole('button', { name: /Join Game/i }).click();
  try {
    await player.getByText(/Waiting to Start/i).waitFor({ timeout: 15000 });
  } catch (error) {
    const body = await player.locator('body').innerText();
    throw new Error(`Player did not reach lobby. Body: ${body}`);
  }

  await host.getByRole('button', { name: /Light Rush/i }).click();
  await player.locator('button').filter({ hasText: /^A\./ }).first().waitFor({ timeout: 15000 });
  const firstQuestionText = await player.locator('body').innerText();

  await player.locator('button').filter({ hasText: /^A\./ }).first().click();
  await player.getByText(/Answer Submitted/i).waitFor({ timeout: 10000 });

  await player.getByText(/The correct answer was/i).waitFor({ timeout: 40000 });
  const revealText = await player.locator('body').innerText();

  // Wait past the 5-second reveal window for automatic next-question transition.
  await sleep(9000);
  const nextText = await player.locator('body').innerText();
  const hasAnswerButtons = await player.locator('button').filter({ hasText: /^A\./ }).count();

  if (/The correct answer was/i.test(nextText)) {
    throw new Error('Player stayed on reveal page after host auto-advanced');
  }
  if (!hasAnswerButtons) {
    throw new Error('Player did not show answer buttons for the next question');
  }
  if (/Answer Submitted/i.test(nextText)) {
    throw new Error('Player submission state did not reset for next question');
  }

  console.log(JSON.stringify({
    ok: true,
    roomCode,
    sawReveal: /The correct answer was/i.test(revealText),
    leftRevealWithoutRefresh: !/The correct answer was/i.test(nextText),
    nextQuestionHasButtons: hasAnswerButtons > 0,
    submissionReset: !/Answer Submitted/i.test(nextText),
    firstQuestionSnippet: firstQuestionText.slice(0, 140),
    nextQuestionSnippet: nextText.slice(0, 180)
  }, null, 2));
} catch (err) {
  console.error(JSON.stringify({ ok: false, error: err.message, stack: err.stack }, null, 2));
  process.exitCode = 1;
} finally {
  await browser.close();
}
