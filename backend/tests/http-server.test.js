import test from 'node:test';
import net from 'node:net';
import assert from 'node:assert/strict';
import { createApiServer } from '../http-server.js';

async function withServer(saveSchedule, run) {
  const server = createApiServer({ saveSchedule });
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });
  const address = server.address();
  try {
    await run(`http://127.0.0.1:${address.port}`);
  } finally {
    await new Promise(resolve => server.close(resolve));
  }
}

test('health route returns an OK status and timestamp', async () => {
  await withServer(async () => 'unused', async baseUrl => {
    const response = await fetch(`${baseUrl}/api/health`);
    const body = await response.json();
    assert.equal(response.status, 200);
    assert.equal(body.status, 'ok');
    assert.ok(Number.isFinite(Date.parse(body.timestamp)));
  });
});

test('schedule route validates, calculates, and persists the payload', async () => {
  let saved;
  await withServer(async (userId, formData, schedule) => {
    saved = { userId, formData, schedule };
    return 'schedule-123';
  }, async baseUrl => {
    const response = await fetch(`${baseUrl}/api/generate-schedule`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ userId: 'user-1', formData: { area: 1, unit: 'Hectares', cropName: 'Wheat', season: 'Kharif', soilType: 'Sandy' } }),
    });
    const body = await response.json();
    assert.equal(response.status, 200);
    assert.equal(body.success, true);
    assert.equal(body.id, 'schedule-123');
    assert.equal(body.schedule.summary.metrics.areaInAcres, '2.47');
    assert.equal(saved.userId, 'user-1');
    assert.equal(saved.schedule.schedule.length, 4);
  });
});

test('rejects malformed JSON and invalid input without saving', async () => {
  let saveCalls = 0;
  await withServer(async () => { saveCalls += 1; return 'unused'; }, async baseUrl => {
    const malformed = await fetch(`${baseUrl}/api/generate-schedule`, {
      method: 'POST', headers: { 'content-type': 'application/json' }, body: '{bad',
    });
    assert.equal(malformed.status, 400);
    const invalid = await fetch(`${baseUrl}/api/generate-schedule`, {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ userId: 'user-1', formData: { area: 0, unit: 'Acres' } }),
    });
    assert.equal(invalid.status, 400);
    assert.equal(saveCalls, 0);
  });
});

test('rejects path-like user IDs and missing payload fields', async () => {
  await withServer(async () => 'unused', async baseUrl => {
    const requests = [
      { userId: 'user/other', formData: { area: 1 } },
      { userId: 'user-1' },
      { formData: { area: 1 } },
    ];
    for (const payload of requests) {
      const response = await fetch(`${baseUrl}/api/generate-schedule`, {
        method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload),
      });
      assert.equal(response.status, 400);
    }
  });
});

test('responds to CORS preflight', async () => {
  await withServer(async () => 'unused', async baseUrl => {
    const response = await fetch(`${baseUrl}/api/generate-schedule`, {
      method: 'OPTIONS',
      headers: { origin: 'http://localhost:5173', 'access-control-request-method': 'POST' },
    });
    assert.equal(response.status, 204);
    assert.equal(response.headers.get('access-control-allow-origin'), '*');
    assert.match(response.headers.get('access-control-allow-methods'), /POST/);
  });
});

test('returns 404 for unknown routes', async () => {
  await withServer(async () => 'unused', async baseUrl => {
    const response = await fetch(`${baseUrl}/unknown`);
    assert.equal(response.status, 404);
  });
});


test('returns 400 for malformed request-target URLs without crashing the server', async () => {
  await withServer(async () => 'unused', async baseUrl => {
    const { port } = new URL(baseUrl);
    const responseText = await new Promise((resolve, reject) => {
      const socket = net.connect(Number(port), '127.0.0.1');
      let data = '';
      socket.setEncoding('utf8');
      socket.on('data', chunk => { data += chunk; });
      socket.once('error', reject);
      socket.once('end', () => resolve(data));
      socket.write('GET http://[::1/api/health HTTP/1.1\r\nHost: localhost\r\nConnection: close\r\n\r\n');
    });
    assert.match(responseText, /HTTP\/1\.1 400/);
    assert.match(responseText, /Invalid request URL/);
  });
});
