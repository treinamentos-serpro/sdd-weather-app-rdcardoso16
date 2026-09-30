import { useEffect, useRef, useState } from 'react';
import { normalizeSearchTerm } from '../lib/searchTerm';
import { WeatherServiceError } from '../services/serviceError';
import { getWeather, searchCities } from '../services/weatherService';
import type { City, WeatherData } from '../types/weather';

export type WeatherStatus = 'idle' | 'loading' | 'success' | 'error' | 'empty';

type RetryOperation = { kind: 'search'; name: string } | { kind: 'weather'; city: City };

export function useWeather() {
  const [status, setStatus] = useState<WeatherStatus>('idle');
  const [data, setData] = useState<WeatherData | null>(null);
  const [cities, setCities] = useState<City[]>([]);
  const [error, setError] = useState<WeatherServiceError | null>(null);
  const [query, setQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const operationId = useRef(0);
  const controller = useRef<AbortController | null>(null);
  const lastOperation = useRef<RetryOperation | null>(null);

  async function loadWeather(city: City): Promise<void> {
    controller.current?.abort();
    const requestController = new AbortController();
    controller.current = requestController;
    const currentOperation = ++operationId.current;
    lastOperation.current = { kind: 'weather', city };
    setSelectedCity(city);
    setData(null);
    setError(null);
    setStatus('loading');

    try {
      const weather = await getWeather(city, requestController.signal);
      if (currentOperation !== operationId.current) return;
      setData(weather);
      setStatus('success');
    } catch (cause) {
      if (requestController.signal.aborted || currentOperation !== operationId.current) return;
      const serviceError =
        cause instanceof WeatherServiceError
          ? cause
          : new WeatherServiceError('network', 'Falha de rede.', true);
      setError(serviceError);
      setStatus('error');
    }
  }

  async function search(name: string): Promise<void> {
    const normalized = normalizeSearchTerm(name);
    setQuery(name);
    setData(null);
    setCities([]);
    setSelectedCity(null);
    setError(null);

    if (!normalized.valid) {
      lastOperation.current = { kind: 'search', name };
      if (normalized.reason === 'empty') {
        setStatus('empty');
      } else {
        setError(
          new WeatherServiceError(
            'invalid-response',
            'Remova caracteres inválidos do nome da cidade.',
            false,
          ),
        );
        setStatus('error');
      }
      return;
    }

    controller.current?.abort();
    const requestController = new AbortController();
    controller.current = requestController;
    const currentOperation = ++operationId.current;
    lastOperation.current = { kind: 'search', name };
    setStatus('loading');

    try {
      const results = await searchCities(normalized.value, requestController.signal);
      if (currentOperation !== operationId.current) return;

      if (results.length === 0) {
        setStatus('empty');
        return;
      }

      setCities(results);
      await loadWeather(results[0]);
    } catch (cause) {
      if (requestController.signal.aborted || currentOperation !== operationId.current) return;
      const serviceError =
        cause instanceof WeatherServiceError
          ? cause
          : new WeatherServiceError('network', 'Falha de rede.', true);
      setError(serviceError);
      setStatus('error');
    }
  }

  function selectCity(city: City): void {
    void loadWeather(city);
  }

  function retry(): void {
    const operation = lastOperation.current;
    if (!operation) return;

    const failedOperationId = operationId.current;
    const retryOperation = () => {
      if (operationId.current !== failedOperationId) return;
      if (operation.kind === 'search') {
        void search(operation.name);
      } else {
        void loadWeather(operation.city);
      }
    };

    if (error?.retryAfterMs && error.retryAfterMs > 0) {
      globalThis.setTimeout(retryOperation, error.retryAfterMs);
    } else {
      retryOperation();
    }
  }

  useEffect(() => {
    return () => controller.current?.abort();
  }, []);

  return {
    status,
    data,
    cities,
    error,
    query,
    selectedCity,
    search,
    selectCity,
    retry,
  };
}
