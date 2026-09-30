import type { Unit } from '../types/weather';

export function convertTemperature(temperatureC: number, unit: Unit): number {
  if (unit === 'celsius') {
    return temperatureC;
  }

  const temperatureF = (temperatureC * 9) / 5 + 32;
  return Math.sign(temperatureF) * Math.round(Math.abs(temperatureF));
}

export function toDisplayTemperature(temperatureC: number, unit: Unit): number {
  return convertTemperature(temperatureC, unit);
}

export function unitLabel(unit: Unit): string {
  return unit === 'celsius' ? 'Celsius' : 'Fahrenheit';
}

export function formatTemperature(temperatureC: number, unit: Unit): string {
  const temperature = convertTemperature(temperatureC, unit);
  const suffix = unit === 'celsius' ? '°C' : '°F';
  return `${temperature}${suffix}`;
}
