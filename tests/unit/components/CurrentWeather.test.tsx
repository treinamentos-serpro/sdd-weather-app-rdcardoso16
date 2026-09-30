import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import CurrentWeather from '../../../src/components/CurrentWeather';
import type {
  CurrentWeather as CurrentWeatherData,
  SectionResult,
} from '../../../src/types/weather';

describe('CurrentWeather fallbacks', () => {
  it('mostra indisponibilidade se a temperatura não for finita', () => {
    const current = {
      status: 'success',
      data: { temperatureC: Number.NaN, timestamp: '2026-09-30T12:30' },
    } as unknown as SectionResult<CurrentWeatherData>;

    render(<CurrentWeather current={current} timezone="America/Sao_Paulo" unit="celsius" />);

    expect(screen.getByText('Dados atuais indisponíveis')).toBeInTheDocument();
    expect(screen.queryByText(/NaN|undefined|null/u)).not.toBeInTheDocument();
  });

  it('mostra indisponibilidade se timestamp vier ausente em runtime', () => {
    const current = {
      status: 'success',
      data: { temperatureC: 20, timestamp: null },
    } as unknown as SectionResult<CurrentWeatherData>;

    render(<CurrentWeather current={current} timezone="America/Sao_Paulo" unit="celsius" />);

    expect(screen.getByText('Dados atuais indisponíveis')).toBeInTheDocument();
    expect(screen.queryByText(/undefined|null|NaN/u)).not.toBeInTheDocument();
  });

  it('omite métricas opcionais nulas ou não finitas', () => {
    const current = {
      status: 'success',
      data: {
        temperatureC: 20,
        timestamp: '2026-09-30T12:30',
        humidityPercent: null,
        windSpeedKmh: Number.NaN,
        precipitationMm: Number.POSITIVE_INFINITY,
      },
    } as unknown as SectionResult<CurrentWeatherData>;

    render(<CurrentWeather current={current} timezone="America/Sao_Paulo" unit="celsius" />);

    expect(screen.getByText('20°C')).toBeInTheDocument();
    expect(screen.queryByText(/NaN|undefined|null|Infinity/u)).not.toBeInTheDocument();
    expect(screen.queryByText('Umidade')).not.toBeInTheDocument();
    expect(screen.queryByText('Vento')).not.toBeInTheDocument();
    expect(screen.queryByText('Precipitação')).not.toBeInTheDocument();
  });
});
