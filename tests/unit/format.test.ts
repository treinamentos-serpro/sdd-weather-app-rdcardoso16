import { describe, expect, it } from 'vitest';
import { getDayLabel, getShortDate } from '../../src/lib/format';

describe('format helpers', () => {
  it('rotula hoje, amanhã e dias seguintes', () => {
    expect(getDayLabel(0, '2026-09-30')).toBe('Hoje');
    expect(getDayLabel(1, '2026-10-01')).toBe('Amanhã');
    expect(getDayLabel(2, '2026-10-02')).toBe('sexta-feira');
  });

  it('formata uma data curta e trata datas inválidas', () => {
    expect(getShortDate('2026-09-30')).toBe('30/09');
    expect(getShortDate(null)).toBe('Data indisponível');
  });
});
