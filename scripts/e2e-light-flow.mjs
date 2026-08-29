import { chromium } from 'playwright';

const BASE = 'https://light.theboostnation.com';
const PASSCODE = process.env.E2E_HOST_PASSCODE;

if (!PASSCODE) {
  console.error('Missing E2E_HOST_PASSCODE environment variable');
  process.exit(1);
}

function extractRoomCode(text) {
  const matches = [...text.matchAll(/\b[A-F0-9]{6}\b/g)].map(m => m[0]);
  return matches.find(code => !['000000'].includes(code));
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const hostContext = await browser.newContext();
  const playerContext = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true });
  const host = await hostContext.newPage();
  const player = await playerContext.newPage();

  const hostLogs = [];
  const playerLogs = [];
  host.on('console', msg => hostLogs.push(`${msg.type()}: ${msg.text()}`));
  player.on('console', msg => playerLogs.push(`${msg.type()}: ${msg.text()}`));
  host.on('pageerror', err => hostLogs.push(`PAGEERROR: ${err.message}`));
  player.on('pageerror', err => playerLogs.push(`PAGEERROR: ${err.message}`));

  // Host creates room
  await host.goto(`${BASE}/host`, { waitUntil: 'networkidle' });
  const initialPasscode = host.getByPlaceholder(/passcode/i);
  if (await initialPasscode.count()) {
    await initialPasscode.fill(PASSCODE);
    await host.getByRole('button', { name: /^Continue$/i }).click();
    await host.waitForTimeout(500);
  }
  const createRoomModalButton = host.getByRole('button', { name: /^Create Room$/i });
  if (!(await createRoomModalButton.count())) {
    await host.getByRole('button', { name: /Create New Room/i }).click();
  }
  const passcode = host.getByPlaceholder(/passcode/i);
  if (await passcode.count()) {
    await passcode.fill(PASSCODE);
    await host.getByRole('button', { name: /^Continue$/i }).click();
    await host.waitForTimeout(500);
  }
  await host.getByRole('button', { name: /^Create Room$/i }).click();
  await host.waitForTimeout(2500);
  const hostText = await host.locator('body').innerText();
  const roomCode = extractRoomCode(hostText);
  if (!roomCode) throw new Error(`No room code found on host page. Text: ${hostText.slice(0, 500)}`);

  // Player joins via QR/deep link path
  await player.goto(`${BASE}/play?room=${roomCode}`, { waitUntil: 'networkidle' });
  await player.waitForTimeout(1000);
  const prefill = await player.getByPlaceholder(/ROOM CODE/i).inputValue();
  if (prefill !== roomCode) throw new Error(`Room code did not prefill. Expected ${roomCode}, got ${prefill}`);
  await player.getByPlaceholder(/nickname/i).fill('E2EPlayer');
  await player.getByRole('button', { name: /Join Game/i }).click();
  await player.getByText(/Waiting to Start/i).waitFor({ timeout: 10000 });

  // Host sees team and starts Light Rush
  await host.getByRole('button', { name: /Light Rush/i }).click();
  await player.getByText(/Which verse says/i).waitFor({ timeout: 15000 });

  // Player answers B correctly
  await player.getByRole('button', { name: /B\.Matthew 5:14/i }).click();
  await player.getByText(/Waiting for reveal/i).waitFor({ timeout: 10000 });

  // Host reveals answer
  await host.getByRole('button', { name: /Reveal Answer/i }).click();
  await player.getByText(/Correct|Well done|Matthew 5:14/i).waitFor({ timeout: 15000 });

  // Host advances to next question
  await host.getByRole('button', { name: /Next Question/i }).click();
  await player.getByText(/What did David use/i).waitFor({ timeout: 15000 });

  const finalHostText = await host.locator('body').innerText();
  const finalPlayerText = await player.locator('body').innerText();

  await browser.close();

  console.log(JSON.stringify({
    ok: true,
    roomCode,
    checks: [
      'Host created room',
      'Player QR/deep link prefilled room code',
      'Player joined lobby',
      'Host started Light Rush',
      'Player received question via Realtime',
      'Player submitted answer and waited for reveal',
      'Host revealed answer',
      'Player saw reveal result',
      'Host advanced to next question',
      'Player received next question'
    ],
    hostConsole: hostLogs,
    playerConsole: playerLogs,
    hostTextSample: finalHostText.slice(0, 800),
    playerTextSample: finalPlayerText.slice(0, 800)
  }, null, 2));
}

main().catch(err => {
  console.error(JSON.stringify({ ok: false, error: err.message, stack: err.stack }, null, 2));
  process.exit(1);
});
