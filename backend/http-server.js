import { createServer } from 'node:http';
import { calculateIrrigation, IrrigationInputError } from './irrigation-calculator.js';

const BODY_LIMIT_BYTES = 100 * 1024;

class HttpInputError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}

function sendJson(response, statusCode, payload) {
  response.statusCode = statusCode;
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.end(JSON.stringify(payload));
}

async function readJsonBody(request) {
  const chunks = [];
  let size = 0;
  for await (const chunk of request) {
    size += chunk.length;
    if (size > BODY_LIMIT_BYTES) {
      throw new HttpInputError('Request body is too large.', 413);
    }
    chunks.push(chunk);
  }
  if (size === 0) {
    throw new HttpInputError('Request body must contain JSON.');
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch {
    throw new HttpInputError('Request body contains invalid JSON.');
  }
}

export function createApiServer({ saveSchedule }) {
  if (typeof saveSchedule !== 'function') {
    throw new TypeError('saveSchedule must be a function.');
  }

  return createServer(async (request, response) => {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (request.method === 'OPTIONS') {
      response.statusCode = 204;
      response.end();
      return;
    }

    const pathname = new URL(request.url ?? '/', 'http://localhost').pathname;
    if (request.method === 'GET' && pathname === '/api/health') {
      sendJson(response, 200, {
        status: 'ok',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    if (request.method !== 'POST' || pathname !== '/api/generate-schedule') {
      sendJson(response, 404, { error: 'Not found' });
      return;
    }

    if (!String(request.headers['content-type'] ?? '').toLowerCase().startsWith('application/json')) {
      sendJson(response, 400, { error: 'Expected application/json request body.' });
      return;
    }

    let payload;
    try {
      payload = await readJsonBody(request);
    } catch (error) {
      sendJson(response, error.statusCode ?? 400, { error: error.message });
      return;
    }

    const userId = payload?.userId;
    const formData = payload?.formData;
    if (typeof userId !== 'string' || !userId.trim() || userId.includes('/') ||
        !formData || typeof formData !== 'object' || Array.isArray(formData)) {
      sendJson(response, 400, { error: 'Missing or invalid userId or formData.' });
      return;
    }

    let schedule;
    try {
      schedule = calculateIrrigation(formData);
    } catch (error) {
      if (error instanceof IrrigationInputError) {
        sendJson(response, 400, { error: error.message });
        return;
      }
      console.error('Error calculating irrigation schedule:', error);
      sendJson(response, 500, { error: 'Failed to calculate irrigation schedule.' });
      return;
    }

    try {
      const id = await saveSchedule(userId.trim(), formData, schedule);
      sendJson(response, 200, { success: true, id, schedule });
    } catch (error) {
      console.error('Error saving irrigation schedule:', error);
      sendJson(response, 500, { error: 'Failed to save irrigation schedule.' });
    }
  });
}
