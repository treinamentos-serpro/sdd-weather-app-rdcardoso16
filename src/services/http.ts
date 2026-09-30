import { WeatherServiceError } from './serviceError';

export async function fetchWithTimeout(url: string, signal?: AbortSignal): Promise<unknown> {
  const controller = new AbortController();
  let didTimeout = false;
  const timeoutId = globalThis.setTimeout(() => {
    didTimeout = true;
    controller.abort();
  }, 10_000);
  const abortFromCaller = () => controller.abort();

  if (signal?.aborted) {
    globalThis.clearTimeout(timeoutId);
    throw new DOMException('Requisição cancelada.', 'AbortError');
  }

  signal?.addEventListener('abort', abortFromCaller, { once: true });

  try {
    const response = await fetch(url, { signal: controller.signal });

    if (!response.ok) {
      const retryable = response.status === 429 || response.status >= 500;
      const retryAfterHeader = response.headers.get('Retry-After');
      const retryAfterSeconds = retryAfterHeader ? Number(retryAfterHeader) : NaN;
      const retryAfterDate = retryAfterHeader ? Date.parse(retryAfterHeader) : NaN;
      const retryAfterMs = Number.isFinite(retryAfterSeconds)
        ? Math.max(0, retryAfterSeconds * 1000)
        : Number.isFinite(retryAfterDate)
          ? Math.max(0, retryAfterDate - Date.now())
          : undefined;

      throw new WeatherServiceError(
        'provider',
        'O serviço meteorológico não conseguiu concluir a consulta.',
        retryable,
        retryAfterMs,
      );
    }

    return await response.json();
  } catch (error) {
    if (signal?.aborted) {
      throw new DOMException('Requisição cancelada.', 'AbortError');
    }

    if (didTimeout || (error instanceof DOMException && error.name === 'AbortError')) {
      throw new WeatherServiceError('timeout', 'A requisição demorou demais.', true);
    }

    if (error instanceof WeatherServiceError) throw error;

    if (error instanceof SyntaxError) {
      throw new WeatherServiceError('invalid-response', 'O serviço retornou JSON inválido.', true);
    }

    throw new WeatherServiceError('network', 'Falha de rede.', true);
  } finally {
    globalThis.clearTimeout(timeoutId);
    signal?.removeEventListener('abort', abortFromCaller);
  }
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function finiteNumber(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}
