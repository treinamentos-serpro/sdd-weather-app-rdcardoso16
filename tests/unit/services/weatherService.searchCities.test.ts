import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { searchCities, WeatherServiceError } from '../../../src/services/weatherService';

describe('searchCities em weatherService', () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('retorna lista vazia sem chamar a rede quando o nome está vazio', async () => {
    await expect(searchCities('   ')).resolves.toEqual([]);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('retorna lista vazia quando results está ausente', async () => {
    fetchMock.mockResolvedValue({ ok: true, json: async () => ({}) });

    await expect(searchCities('Atlantis')).resolves.toEqual([]);
  });

  it('mantém opcionais de City ausentes como undefined', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ results: [{ name: 'Cidade', latitude: 1, longitude: 2 }] }),
    });

    const [city] = await searchCities('Cidade');

    expect(city).toMatchObject({ name: 'Cidade', latitude: 1, longitude: 2 });
    expect(city?.country).toBeUndefined();
    expect(city?.region).toBeUndefined();
    expect(city?.timezone).toBeUndefined();
  });

  it('codifica o nome e mapeia results para City', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        results: [
          {
            id: 123,
            name: 'São Paulo',
            country: 'Brasil',
            country_code: 'BR',
            admin1: 'São Paulo',
            latitude: -23.55,
            longitude: -46.63,
            timezone: 'America/Sao_Paulo',
          },
        ],
      }),
    });

    await expect(searchCities('São Paulo')).resolves.toEqual([
      {
        id: 123,
        name: 'São Paulo',
        country: 'Brasil',
        countryCode: 'BR',
        region: 'São Paulo',
        latitude: -23.55,
        longitude: -46.63,
        timezone: 'America/Sao_Paulo',
      },
    ]);
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('name=S%C3%A3o%20Paulo'),
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
  });

  it('lança WeatherServiceError em resposta HTTP não-ok', async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 503,
      headers: new Headers(),
    });

    await expect(searchCities('São Paulo')).rejects.toBeInstanceOf(WeatherServiceError);
  });
});
