import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getWeather, WeatherServiceError } from '../../../src/services/weatherService';
import { saoPaulo, saoPauloForecastResponse } from '../../fixtures/openMeteo';

describe('getWeather', () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('chama forecast com current/daily e mapeia os arrays paralelos para cinco dias', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => saoPauloForecastResponse,
    });

    const weather = await getWeather(saoPaulo);
    const requestUrl = new URL(fetchMock.mock.calls[0]?.[0] as string);

    expect(requestUrl.origin + requestUrl.pathname).toBe('https://api.open-meteo.com/v1/forecast');
    expect(requestUrl.searchParams.get('current')).toContain('temperature_2m');
    expect(requestUrl.searchParams.get('daily')).toContain('temperature_2m_max');
    expect(requestUrl.searchParams.get('timezone')).toBe('auto');
    expect(weather.current).toEqual({
      status: 'success',
      data: {
        temperatureC: 20,
        timestamp: '2026-09-30T12:30',
        weatherCode: 0,
        humidityPercent: 65,
        windSpeedKmh: 12,
        precipitationMm: 0,
      },
    });
    expect(weather.forecast).toMatchObject({ status: 'success', data: expect.any(Array) });
    if (weather.forecast.status === 'success') {
      expect(weather.forecast.data).toHaveLength(5);
      expect(weather.forecast.data[0]).toMatchObject({
        date: '2026-09-30',
        weatherCode: 0,
        temperatureMaxC: 24,
        temperatureMinC: 15,
        precipitationProbabilityPercent: 0,
      });
    }
  });

  it.each([
    'current',
    'daily',
  ] as const)('lança WeatherServiceError quando %s está ausente', async (section) => {
    const incompleteResponse = { ...saoPauloForecastResponse, [section]: undefined };
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => incompleteResponse,
    });

    await expect(getWeather(saoPaulo)).rejects.toBeInstanceOf(WeatherServiceError);
  });

  it('converte precipitação atual null para zero', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        ...saoPauloForecastResponse,
        current: { ...saoPauloForecastResponse.current, precipitation: null },
      }),
    });

    const weather = await getWeather(saoPaulo);

    expect(weather.current).toMatchObject({
      status: 'success',
      data: { precipitationMm: 0 },
    });
  });

  it('retorna forecast utilizável como sucesso parcial quando current está incompleto', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        ...saoPauloForecastResponse,
        current: { ...saoPauloForecastResponse.current, temperature_2m: null },
      }),
    });

    const weather = await getWeather(saoPaulo);

    expect(weather.current).toEqual({ status: 'unavailable', reason: 'invalid-response' });
    expect(weather.forecast).toMatchObject({ status: 'success', data: expect.any(Array) });
  });

  it('omite opcionais null e preserva slot daily com campos ausentes', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        ...saoPauloForecastResponse,
        current: {
          ...saoPauloForecastResponse.current,
          weather_code: null,
          relative_humidity_2m: null,
          wind_speed_10m: null,
          precipitation: null,
        },
        daily: {
          ...saoPauloForecastResponse.daily,
          time: [null, ...saoPauloForecastResponse.daily.time.slice(1)],
          weather_code: [null, ...saoPauloForecastResponse.daily.weather_code.slice(1)],
          temperature_2m_max: [null, ...saoPauloForecastResponse.daily.temperature_2m_max.slice(1)],
          temperature_2m_min: [null, ...saoPauloForecastResponse.daily.temperature_2m_min.slice(1)],
          precipitation_probability_max: [
            null,
            ...saoPauloForecastResponse.daily.precipitation_probability_max.slice(1),
          ],
        },
      }),
    });

    const weather = await getWeather(saoPaulo);

    expect(weather.current).toMatchObject({ status: 'success', data: { precipitationMm: 0 } });
    if (weather.current.status === 'success') {
      expect(weather.current.data.weatherCode).toBeUndefined();
      expect(weather.current.data.humidityPercent).toBeUndefined();
      expect(weather.current.data.windSpeedKmh).toBeUndefined();
    }
    expect(weather.forecast.status).toBe('success');
    if (weather.forecast.status === 'success') {
      expect(weather.forecast.data[0]).toEqual({
        date: null,
        weatherCode: undefined,
        temperatureMaxC: undefined,
        temperatureMinC: undefined,
        precipitationProbabilityPercent: undefined,
      });
    }
  });

  it('lança WeatherServiceError para resposta HTTP não-ok', async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 503,
      headers: new Headers(),
    });

    await expect(getWeather(saoPaulo)).rejects.toBeInstanceOf(WeatherServiceError);
  });
});
