import { chromium } from 'playwright';

const BASE = 'https://light.theboostnation.com';
const PASSCODE = process.env.E2E_HOST_PASSCODE;
if (!PASSCODE) { console.error('Missing E2E_HOST_PASSCODE'); process.exit(1); }
const codeRe = /\b[A-F0-9]{6}\b/g;
const extractRoomCode = text => ([...text.matchAll(codeRe)].map(m => m[0]))[0];

async function createStartedRoom(browser, label) {
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
  await player.getByPlaceholder(/nickname/i).fill(label);
  await player.getByRole('button', { name: /Join Game/i }).click();
  await player.getByText(/Waiting to Start/i).waitFor({ timeout: 10000 });

  await host.getByRole('button', { name: /Light Rush/i }).click();
  await host.waitForTimeout(2500);
  await player.locator('button').filter({ hasText: /^A\./ }).first().waitFor({ timeout: 15000 });

  const hostText = await host.locator('body').innerText();
  const playerText = await player.locator('body').innerText();
  const questionText = (playerText.split('seconds remaining').pop() || '').split('A.')[0].trim();
  const noEarlyReveal = !/correct answer was|Correct!|The correct answer/i.test(playerText);
  const hostHas30Timer = /\b(2[6-9]|30)\b/.test(hostText);
  const playerHas30Timer = /\b(2[6-9]|30)\b/.test(playerText);

  return { host, player, roomCode, questionText, noEarlyReveal, hostHas30Timer, playerHas30Timer };
}

const browser = await chromium.launch({ headless: true });
try {
  const one = await createStartedRoom(browser, 'TimerOne');
  const two = await createStartedRoom(browser, 'TimerTwo');

  if (!one.noEarlyReveal) throw new Error('Player saw reveal/correct-answer language before reveal');
  if (!one.hostHas30Timer) throw new Error('Host did not show a running ~30s timer after start');
  if (!one.playerHas30Timer) throw new Error('Player did not show a running ~30s timer after start');

  await one.player.waitForTimeout(36000);
  const after36 = await one.player.locator('body').innerText();
  const autoRevealedOrAdvanced = /correct answer was|Question|Game Over/i.test(after36) && !/30\s*seconds remaining/i.test(after36);
  if (!autoRevealedOrAdvanced) throw new Error('Game did not auto reveal/advance after timer expiry');

  console.log(JSON.stringify({
    ok: true,
    roomOne: one.roomCode,
    roomTwo: two.roomCode,
    questionOne: one.questionText.slice(0, 120),
    questionTwo: two.questionText.slice(0, 120),
    firstQuestionsDifferent: one.questionText !== two.questionText,
    noEarlyReveal: one.noEarlyReveal,
    hostTimerStarted: one.hostHas30Timer,
    playerTimerStarted: one.playerHas30Timer,
    autoTimerExpiredFlowWorked: autoRevealedOrAdvanced
  }, null, 2));
} catch (err) {
  console.error(JSON.stringify({ ok: false, error: err.message, stack: err.stack }, null, 2));
  process.exitCode = 1;
} finally {
  await browser.close();
}
