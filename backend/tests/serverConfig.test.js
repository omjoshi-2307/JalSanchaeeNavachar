import test from 'node:test';
import assert from 'node:assert/strict';
import { DEFAULT_PORT, readServerPort } from '../serverConfig.js';

test('uses the default port for absent or blank values', () => {
  assert.equal(readServerPort(undefined), DEFAULT_PORT);
  assert.equal(readServerPort(''), DEFAULT_PORT);
  assert.equal(readServerPort('   '), DEFAULT_PORT);
});

test('accepts valid port boundaries and whitespace', () => {
  assert.equal(readServerPort('1'), 1);
  assert.equal(readServerPort('65535'), 65535);
  assert.equal(readServerPort(' 5000 '), 5000);
});

test('rejects zero, out-of-range, fractional, and malformed ports', () => {
  for (const value of ['0', '65536', '-1', '1.5', '1e3', 'NaN', 'Infinity', 'abc']) {
    assert.throws(() => readServerPort(value), {
      name: 'TypeError',
      message: 'PORT must be an integer between 1 and 65535.',
    }, value);
  }
});

test('rejects ports that overflow safe integer parsing', () => {
  assert.throws(() => readServerPort('999999999999999999999999999999999'), /PORT must be/);
});
