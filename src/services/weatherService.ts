import { isValidIsoDate, isValidLocalTimestamp, isValidTimeZone } from '../lib/dateTime';
import type {
  City,
  CurrentWeather,
  ForecastDay,
  SectionResult,
  WeatherData,
} from '../types/weather';
import { fetchWithTimeout, finiteNumber, isRecord } from './http';
import { WeatherServiceError } from './serviceError';

const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';
const CURRENT_FIELDS = [
  'temperature_2m',
  'weather_code',
  'relative_humidity_2m',
  'wind_speed_10m',
  'precipitation',
].join(',');
const DAILY_FIELDS = [
  'weather_code',
  'temperature_2m_max',
  'temperature_2m_min',
  'precipitation_probability_max',
].join(',');

export { WeatherServiceError } from './serviceError';

export async function searchCities(name: string, signal?: AbortSignal): Promise<City[]> {
  const normalizedName = name.trim();
  if (!normalizedName) return [];

  const url = `${GEOCODING_URL}?name=${encodeURIComponent(normalizedName)}&count=10&language=pt&format=json`;
  const payload = await fetchWithTimeout(url, signal);

  if (!isRecord(payload)) {
    throw new WeatherServiceError(
      'invalid-response',
      'A busca de cidades retornou dados inválidos.',
      true,
    );
  }

  if (payload.results === undefined || payload.results === null) return [];
  if (!Array.isArray(payload.results)) {
    throw new WeatherServiceError(
      'invalid-response',
      'A busca de cidades retornou dados inválidos.',
      true,
    );
  }

  return payload.results.slice(0, 10).map((entry): City => {
    if (!isRecord(entry)) {
      throw new WeatherServiceError(
        'invalid-response',
        'Uma localidade retornada é inválida.',
        true,
      );
    }

    const latitude = finiteNumber(entry.latitude);
    const longitude = finiteNumber(entry.longitude);
    if (typeof entry.name !== 'string' || latitude === undefined || longitude === undefined) {
      throw new WeatherServiceError(
        'invalid-response',
        'Uma localidade retornada é inválida.',
        true,
      );
    }

    return {
      id: finiteNumber(entry.id),
      name: entry.name,
      country: typeof entry.country === 'string' ? entry.country : undefined,
      countryCode: typeof entry.country_code === 'string' ? entry.country_code : undefined,
      region: typeof entry.admin1 === 'string' ? entry.admin1 : undefined,
      latitude,
      longitude,
      timezone: typeof entry.timezone === 'string' ? entry.timezone : undefined,
    };
  });
}

function validateUnits(payload: Record<string, unknown>): void {
  const currentUnits = payload.current_units;
  const dailyUnits = payload.daily_units;

  if (!isRecord(currentUnits) || !isRecord(dailyUnits)) {
    throw new WeatherServiceError(
      'invalid-response',
      'A resposta não informou as unidades meteorológicas.',
      true,
    );
  }

  const valid =
    currentUnits.temperature_2m === '°C' &&
    currentUnits.wind_speed_10m === 'km/h' &&
    currentUnits.precipitation === 'mm' &&
    dailyUnits.temperature_2m_max === '°C' &&
    dailyUnits.temperature_2m_min === '°C' &&
    dailyUnits.precipitation_probability_max === '%';

  if (!valid) {
    throw new WeatherServiceError(
      'invalid-response',
      'O serviço retornou unidades incompatíveis.',
      true,
    );
  }
}

function normalizeCurrent(value: unknown): SectionResult<CurrentWeather> {
  if (!isRecord(value)) {
    return { status: 'unavailable', reason: 'invalid-response' };
  }

  const temperatureC = finiteNumber(value.temperature_2m);
  const timestamp =
    typeof value.time === 'string' && isValidLocalTimestamp(value.time) ? value.time : undefined;

  if (temperatureC === undefined || !timestamp) {
    return { status: 'unavailable', reason: 'invalid-response' };
  }

  return {
    status: 'success',
    data: {
      temperatureC,
      timestamp,
      weatherCode: finiteNumber(value.weather_code),
      humidityPercent: finiteNumber(value.relative_humidity_2m),
      windSpeedKmh: finiteNumber(value.wind_speed_10m),
      precipitationMm: value.precipitation === null ? 0 : finiteNumber(value.precipitation),
    },
  };
}

function normalizeForecast(value: unknown): SectionResult<ForecastDay[]> {
  if (!isRecord(value) || !Array.isArray(value.time)) {
    return { status: 'unavailable', reason: 'invalid-response' };
  }

  const dates = value.time;
  const weatherCodes = Array.isArray(value.weather_code) ? value.weather_code : [];
  const maxima = Array.isArray(value.temperature_2m_max) ? value.temperature_2m_max : [];
  const minima = Array.isArray(value.temperature_2m_min) ? value.temperature_2m_min : [];
  const precipitation = Array.isArray(value.precipitation_probability_max)
    ? value.precipitation_probability_max
    : [];
  const days: ForecastDay[] = Array.from({ length: 5 }, (_, index) => {
    const dateValue = dates[index];
    const date = typeof dateValue === 'string' && isValidIsoDate(dateValue) ? dateValue : null;

    return {
      date,
      weatherCode: finiteNumber(weatherCodes[index]),
      temperatureMaxC: finiteNumber(maxima[index]),
      temperatureMinC: finiteNumber(minima[index]),
      precipitationProbabilityPercent: finiteNumber(precipitation[index]),
    };
  });

  if (
    !days.some(
      (day) =>
        day.date !== null &&
        (day.temperatureMaxC !== undefined || day.temperatureMinC !== undefined),
    )
  ) {
    return { status: 'unavailable', reason: 'invalid-response' };
  }

  return { status: 'success', data: days };
}

export async function getWeather(city: City, signal?: AbortSignal): Promise<WeatherData> {
  const params = new URLSearchParams({
    latitude: String(city.latitude),
    longitude: String(city.longitude),
    current: CURRENT_FIELDS,
    daily: DAILY_FIELDS,
    timezone: 'auto',
    forecast_days: '5',
    temperature_unit: 'celsius',
    wind_speed_unit: 'kmh',
    precipitation_unit: 'mm',
  });
  const payload = await fetchWithTimeout(`${FORECAST_URL}?${params.toString()}`, signal);

  if (
    !isRecord(payload) ||
    typeof payload.timezone !== 'string' ||
    !isValidTimeZone(payload.timezone)
  ) {
    throw new WeatherServiceError(
      'invalid-response',
      'A resposta não informou o fuso horário.',
      true,
    );
  }

  if (!isRecord(payload.current) || !isRecord(payload.daily)) {
    throw new WeatherServiceError(
      'invalid-response',
      'A resposta do forecast está incompleta: current e daily são obrigatórios.',
      true,
    );
  }

  validateUnits(payload);

  return {
    city,
    timezone: payload.timezone,
    current: normalizeCurrent(payload.current),
    forecast: normalizeForecast(payload.daily),
  };
}
