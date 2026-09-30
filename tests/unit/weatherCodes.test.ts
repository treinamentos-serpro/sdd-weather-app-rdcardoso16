import { describe, expect, it } from 'vitest';
import { describeWeatherCode } from '../../src/lib/weatherCodes';

describe('describeWeatherCode', () => {
  it('descreve um código WMO conhecido', () => {
    expect(describeWeatherCode(0)).toBe('Céu limpo');
    expect(describeWeatherCode(61)).toBe('Chuva');
  });

  it('usa fallback para código desconhecido ou ausente', () => {
    expect(describeWeatherCode(42)).toBe('Condição indisponível');
    expect(describeWeatherCode(undefined)).toBe('Condição indisponível');
  });
});
