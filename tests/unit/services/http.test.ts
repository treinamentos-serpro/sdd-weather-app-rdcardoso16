import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchWithTimeout } from '../../../src/services/http';
import { WeatherServiceError } from '../../../src/services/serviceError';

describe('fetchWithTimeout', () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('converte timeout de 10 segundos em WeatherServiceError', async () => {
    vi.useFakeTimers();
    fetchMock.mockImplementation(
      (_url: string, init: RequestInit) =>
        new Promise((_resolve, reject) => {
          init.signal?.addEventListener('abort', () =>
            reject(new DOMException('Aborted', 'AbortError')),
          );
        }),
    );

    const request = fetchWithTimeout('https://example.test/weather').catch(
      (cause: unknown) => cause,
    );
    await vi.advanceTimersByTimeAsync(10_000);
    const error = await request;
    expect(error).toBeInstanceOf(WeatherServiceError);
    expect(error).toMatchObject({
      code: 'timeout',
      message: 'A requisição demorou demais.',
    });
    expect(fetchMock).toHaveBeenCalledOnce();
  });

  it('converte falha de rede em WeatherServiceError', async () => {
    fetchMock.mockRejectedValue(new TypeError('network failure'));

    const error = await fetchWithTimeout('https://example.test/weather').catch(
      (cause: unknown) => cause,
    );

    expect(error).toBeInstanceOf(WeatherServiceError);
    expect(error).toMatchObject({
      code: 'network',
      message: 'Falha de rede.',
    });
  });
});
