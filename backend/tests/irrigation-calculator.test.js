import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateIrrigation, IrrigationInputError } from '../irrigation-calculator.js';

const fixedDate = new Date('2026-11-20T12:00:00.000Z');

test('converts acres, hectares, and square feet to the same acre value', () => {
  const acreCases = [
    ['Acres', 1],
    ['Hectares', 2.47105],
    ['Sq Ft', 1],
  ];
  for (const [unit, expected] of acreCases) {
    const area = unit === 'Sq Ft' ? 43560 : 1;
    const result = calculateIrrigation({ area, unit, season: 'Rabi', soilType: 'Loamy' }, fixedDate);
    assert.equal(result.summary.metrics.areaInAcres, expected.toFixed(2), unit);
  }
});

test('normalizes case for crop, season, and soil multipliers', () => {
  const result = calculateIrrigation({ area: 1, unit: 'Acres', cropName: 'WHEAT', season: 'Kharif', soilType: 'Sandy' }, fixedDate);
  assert.equal(result.summary.metrics.cropFactor, 1.2);
  assert.equal(result.summary.metrics.seasonalMultiplier, 0.8);
  assert.equal(result.summary.metrics.soilAdjustment, 1.4);
  assert.equal(result.summary.totalMonthlyWater, 6720);
  assert.equal(result.summary.averageFrequency, 'Daily');
});

test('applies Zaid and clay adjustments to rice', () => {
  const result = calculateIrrigation({ area: 2, unit: 'acres', cropName: 'Rice', season: 'Zaid', soilType: 'Clay' }, fixedDate);
  assert.equal(result.summary.metrics.seasonalMultiplier, 1.5);
  assert.equal(result.summary.metrics.soilAdjustment, 0.7);
  assert.equal(result.summary.totalMonthlyWater, 18900);
  assert.equal(result.summary.averageFrequency, 'Twice a week');
});

test('creates a four-week schedule with stable dates for the supplied date', () => {
  const result = calculateIrrigation({ area: 1, unit: 'acres', cropName: 'Corn', season: 'Rabi', soilType: 'Silt' }, fixedDate);
  assert.equal(result.schedule.length, 4);
  assert.deepEqual(result.schedule.map(item => item.date), [
    '2026-11-20', '2026-11-27', '2026-12-04', '2026-12-11',
  ]);
  assert.equal(result.schedule[0].week, 1);
  assert.equal(result.schedule[3].week, 4);
});

test('rejects invalid farm areas, units, seasons, and soils', () => {
  const invalidInputs = [
    { area: 0, unit: 'acres' },
    { area: -1, unit: 'acres' },
    { area: 'not-a-number', unit: 'acres' },
    { area: true, unit: 'acres' },
    { area: {}, unit: 'acres' },
    { area: 1, unit: 'bigha' },
    { area: 1, unit: 'acres', season: 'monsoon' },
    { area: 1, unit: 'acres', soilType: 'rock' },
  ];
  for (const input of invalidInputs) {
    assert.throws(() => calculateIrrigation(input, fixedDate), IrrigationInputError, JSON.stringify(input));
  }
});
