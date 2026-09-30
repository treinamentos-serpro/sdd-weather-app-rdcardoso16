import { describe, expect, it } from 'vitest';
import { convertTemperature, formatTemperature, unitLabel } from '../../src/lib/temperature';

describe('conversão e apresentação de temperatura', () => {
  it.each([
    [0, 32],
    [100, 212],
    [-40, -40],
  ])('converte %i °C para %i °F', (celsius, fahrenheit) => {
    expect(convertTemperature(celsius, 'fahrenheit')).toBe(fahrenheit);
  });

  it('mantém Celsius e converte para Fahrenheit conforme a unidade solicitada', () => {
    expect(convertTemperature(18, 'celsius')).toBe(18);
    expect(convertTemperature(18, 'fahrenheit')).toBe(64);
  });

  it('formata temperatura arredondada com o símbolo da unidade', () => {
    expect(formatTemperature(12.5, 'fahrenheit')).toBe('55°F');
    expect(formatTemperature(0, 'celsius')).toBe('0°C');
  });

  it('retorna o nome legível da unidade', () => {
    expect(unitLabel('celsius')).toBe('Celsius');
    expect(unitLabel('fahrenheit')).toBe('Fahrenheit');
  });
});
