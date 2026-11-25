export const DEFAULT_PORT = 5000;

export function readServerPort(rawPort = process.env.PORT) {
  if (rawPort === undefined || rawPort === null || rawPort.trim() === '') {
    return DEFAULT_PORT;
  }

  const normalized = rawPort.trim();
  if (!/^\d+$/.test(normalized)) {
    throw new TypeError('PORT must be an integer between 1 and 65535.');
  }

  const port = Number(normalized);
  if (!Number.isSafeInteger(port) || port < 1 || port > 65535) {
    throw new TypeError('PORT must be an integer between 1 and 65535.');
  }

  return port;
}
