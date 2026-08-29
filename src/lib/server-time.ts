let serverOffsetMs = 0;
let lastSyncMs = 0;

export async function syncServerClock() {
  const before = Date.now();
  const response = await fetch('/api/server-time', { cache: 'no-store' });
  const after = Date.now();
  if (!response.ok) return serverOffsetMs;
  const data = await response.json();
  const serverNow = Number(data.now);
  if (!Number.isFinite(serverNow)) return serverOffsetMs;
  const estimatedClientAtResponse = before + (after - before) / 2;
  serverOffsetMs = serverNow - estimatedClientAtResponse;
  lastSyncMs = after;
  return serverOffsetMs;
}

export async function ensureServerClock() {
  if (!lastSyncMs || Date.now() - lastSyncMs > 60_000) {
    try {
      await syncServerClock();
    } catch {
      // Fall back to local clock if the time endpoint is unavailable.
    }
  }
  return serverOffsetMs;
}

export function serverNowMs() {
  return Date.now() + serverOffsetMs;
}

export async function serverTimerEndsAt(seconds: number) {
  await ensureServerClock();
  return new Date(serverNowMs() + seconds * 1000).toISOString();
}

export function getServerRemainingSeconds(endsAt?: string | null) {
  if (!endsAt) return 0;
  return Math.max(0, Math.ceil((new Date(endsAt).getTime() - serverNowMs()) / 1000));
}
