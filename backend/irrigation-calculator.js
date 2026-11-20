export class IrrigationInputError extends Error {
  constructor(message) {
    super(message);
    this.name = 'IrrigationInputError';
  }
}

const normalizeToken = (value) => String(value).trim().toLowerCase().replace(/[\\s_-]+/g, '');

const AREA_TO_ACRES = {
  acre: 1,
  acres: 1,
  hectare: 2.47105,
  hectares: 2.47105,
  ha: 2.47105,
  sqft: 1 / 43560,
  squarefoot: 1 / 43560,
  squarefeet: 1 / 43560,
};

export function calculateIrrigation(data, now = new Date()) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw new IrrigationInputError('Form data must be an object.');
  }

  const areaValue = data.area;
  if ((typeof areaValue !== 'number' && typeof areaValue !== 'string') ||
      (typeof areaValue === 'string' && !areaValue.trim())) {
    throw new IrrigationInputError('Farm area must be a positive number.');
  }
  const area = Number(areaValue);
  if (!Number.isFinite(area) || area <= 0) {
    throw new IrrigationInputError('Farm area must be a positive number.');
  }

  const unit = normalizeToken(data.unit ?? 'acres');
  const conversion = AREA_TO_ACRES[unit];
  if (conversion === undefined) {
    throw new IrrigationInputError('Unsupported farm-area unit. Use acres, hectares, or square feet.');
  }
  const areaInAcres = area * conversion;

  const cropName = String(data.cropName ?? 'default').trim() || 'default';
  const season = normalizeToken(data.season ?? 'rabi');
  const soilType = normalizeToken(data.soilType ?? 'loamy');

  const seasonalMultipliers = { kharif: 0.8, rabi: 1.1, zaid: 1.5 };
  if (seasonalMultipliers[season] === undefined) {
    throw new IrrigationInputError('Unsupported season. Use Kharif, Rabi, or Zaid.');
  }
  if (!['sandy', 'clay', 'loamy', 'silt'].includes(soilType)) {
    throw new IrrigationInputError('Unsupported soil type. Use Sandy, Clay, Loamy, or Silt.');
  }

  const baseWaterPerAcre = 5000;
  const cropKey = cropName.toLowerCase();
  const cropFactor = cropKey.includes('wheat') ? 1.2 : cropKey.includes('rice') ? 1.8 : 1.0;
  const seasonalMultiplier = seasonalMultipliers[season];
  const soilAdjustment = soilType === 'sandy' ? 1.4 : soilType === 'clay' ? 0.7 : 1.0;
  const totalWater = areaInAcres * baseWaterPerAcre * cropFactor * seasonalMultiplier * soilAdjustment;
  const frequency = soilType === 'sandy' ? 'Daily' : 'Twice a week';

  const schedule = Array.from({ length: 4 }, (_, index) => {
    const date = new Date(now);
    date.setDate(date.getDate() + index * 7);
    return {
      week: index + 1,
      date: date.toISOString().split('T')[0],
      waterQuantityLiters: Math.round(totalWater / 4),
      frequency,
      instructions: `Water in the early ${index % 2 === 0 ? 'morning' : 'evening'} for best results.`,
    };
  });

  return {
    summary: {
      cropName,
      totalMonthlyWater: Math.round(totalWater),
      averageFrequency: frequency,
      metrics: {
        cropFactor,
        seasonalMultiplier,
        soilAdjustment,
        areaInAcres: areaInAcres.toFixed(2),
      },
    },
    schedule,
  };
}
