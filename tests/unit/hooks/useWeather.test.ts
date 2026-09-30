import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useWeather } from '../../../src/hooks/useWeather';
import { WeatherServiceError } from '../../../src/services/serviceError';
import { getWeather, searchCities } from '../../../src/services/weatherService';
import { saoPaulo, saoPauloWeatherData } from '../../fixtures/openMeteo';

vi.mock('../../../src/services/weatherService', () => ({
  getWeather: vi.fn(),
  searchCities: vi.fn(),
}));

const mockGetWeather = vi.mocked(getWeather);
const mockSearchCities = vi.mocked(searchCities);

describe('useWeather', () => {
  beforeEach(() => {
    mockGetWeather.mockReset();
    mockSearchCities.mockReset();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('retorna empty sem chamar os services para uma busca vazia', async () => {
    const { result } = renderHook(() => useWeather());

    await act(async () => result.current.search('   '));

    expect(result.current.status).toBe('empty');
    expect(result.current.cities).toEqual([]);
    expect(mockSearchCities).not.toHaveBeenCalled();
    expect(mockGetWeather).not.toHaveBeenCalled();
  });

  it('retorna empty se o geocoding não encontrar cidades', async () => {
    mockSearchCities.mockResolvedValue([]);
    const { result } = renderHook(() => useWeather());

    await act(async () => result.current.search('Atlantis'));

    expect(result.current.status).toBe('empty');
    expect(mockGetWeather).not.toHaveBeenCalled();
  });

  it('carrega automaticamente o clima do primeiro resultado', async () => {
    mockSearchCities.mockResolvedValue([saoPaulo, { ...saoPaulo, id: 456, name: 'Campinas' }]);
    mockGetWeather.mockResolvedValue(saoPauloWeatherData);
    const { result } = renderHook(() => useWeather());

    await act(async () => result.current.search('São Paulo'));

    expect(result.current.status).toBe('success');
    expect(result.current.cities).toHaveLength(2);
    expect(result.current.selectedCity).toEqual(saoPaulo);
    expect(mockGetWeather).toHaveBeenCalledWith(saoPaulo, expect.any(AbortSignal));
  });

  it('ignora uma resposta de busca antiga que chega depois da mais recente', async () => {
    const olderCity = { ...saoPaulo, id: 111, name: 'Cidade antiga' };
    const latestCity = { ...saoPaulo, id: 222, name: 'Cidade atual' };
    let resolveOlderSearch: (cities: (typeof saoPaulo)[]) => void = () => {};
    const olderSearch = new Promise<(typeof saoPaulo)[]>((resolve) => {
      resolveOlderSearch = resolve;
    });
    mockSearchCities.mockImplementationOnce(() => olderSearch).mockResolvedValueOnce([latestCity]);
    mockGetWeather.mockResolvedValue({ ...saoPauloWeatherData, city: latestCity });
    const { result } = renderHook(() => useWeather());

    let olderSearchAction!: Promise<void>;
    await act(async () => {
      olderSearchAction = result.current.search('Cidade antiga');
      await result.current.search('Cidade atual');
    });

    expect(result.current.selectedCity).toEqual(latestCity);
    expect(mockGetWeather).toHaveBeenCalledExactlyOnceWith(latestCity, expect.any(AbortSignal));

    await act(async () => {
      resolveOlderSearch([olderCity]);
      await olderSearchAction;
    });

    expect(result.current.cities).toEqual([latestCity]);
    expect(result.current.selectedCity).toEqual(latestCity);
    expect(mockGetWeather).toHaveBeenCalledTimes(1);
  });

  it('retry repete a última operação de forecast que falhou', async () => {
    mockSearchCities.mockResolvedValue([saoPaulo]);
    mockGetWeather
      .mockRejectedValueOnce(new WeatherServiceError('network', 'Falha de rede.', true))
      .mockResolvedValueOnce(saoPauloWeatherData);
    const { result } = renderHook(() => useWeather());

    await act(async () => result.current.search('São Paulo'));
    expect(result.current.status).toBe('error');

    await act(async () => result.current.retry());
    await waitFor(() => expect(result.current.status).toBe('success'));
    expect(mockSearchCities).toHaveBeenCalledOnce();
    expect(mockGetWeather).toHaveBeenCalledTimes(2);
  });
});
