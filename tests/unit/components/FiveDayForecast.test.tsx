import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import FiveDayForecast from '../../../src/components/FiveDayForecast';
import type { ForecastDay, SectionResult } from '../../../src/types/weather';

describe('FiveDayForecast fallbacks', () => {
  it('mostra fallback para slot com data e temperaturas inválidas', () => {
    const forecast = {
      status: 'success',
      data: [
        {
          date: null,
          weatherCode: null,
          temperatureMaxC: Number.NaN,
          temperatureMinC: null,
          precipitationProbabilityPercent: Number.NaN,
        },
      ],
    } as unknown as SectionResult<ForecastDay[]>;

    render(<FiveDayForecast forecast={forecast} unit="fahrenheit" />);

    expect(screen.getByText('Dados indisponíveis')).toBeInTheDocument();
    expect(screen.queryByText(/NaN|undefined|null|Infinity/u)).not.toBeInTheDocument();
  });
});
