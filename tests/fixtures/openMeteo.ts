import type { City, WeatherData } from '../../src/types/weather';

export const saoPaulo: City = {
  id: 3448439,
  name: 'São Paulo',
  country: 'Brasil',
  countryCode: 'BR',
  region: 'São Paulo',
  latitude: -23.55,
  longitude: -46.63,
  timezone: 'America/Sao_Paulo',
};

export const saoPauloGeocodingResponse = {
  results: [
    {
      id: saoPaulo.id,
      name: saoPaulo.name,
      latitude: saoPaulo.latitude,
      longitude: saoPaulo.longitude,
      timezone: saoPaulo.timezone,
      country: saoPaulo.country,
      country_code: saoPaulo.countryCode,
      admin1: saoPaulo.region,
    },
  ],
};

export const saoPauloForecastResponse = {
  timezone: 'America/Sao_Paulo',
  current_units: {
    time: 'iso8601',
    temperature_2m: '°C',
    relative_humidity_2m: '%',
    wind_speed_10m: 'km/h',
    precipitation: 'mm',
  },
  current: {
    time: '2026-09-30T12:30',
    temperature_2m: 20,
    relative_humidity_2m: 65,
    wind_speed_10m: 12,
    precipitation: 0,
    weather_code: 0,
  },
  daily_units: {
    time: 'iso8601',
    temperature_2m_max: '°C',
    temperature_2m_min: '°C',
    precipitation_probability_max: '%',
  },
  daily: {
    time: ['2026-09-30', '2026-10-01', '2026-10-02', '2026-10-03', '2026-10-04'],
    weather_code: [0, 2, 61, 3, 1],
    temperature_2m_max: [24, 25, 22, 21, 23],
    temperature_2m_min: [15, 16, 14, 13, 15],
    precipitation_probability_max: [0, 10, 70, 20, 0],
  },
};

export const saoPauloWeatherData: WeatherData = {
  city: saoPaulo,
  timezone: 'America/Sao_Paulo',
  current: {
    status: 'success',
    data: {
      temperatureC: 20,
      timestamp: '2026-09-30T12:30',
      weatherCode: 0,
      humidityPercent: 65,
      windSpeedKmh: 12,
      precipitationMm: 0,
    },
  },
  forecast: {
    status: 'success',
    data: saoPauloForecastResponse.daily.time.map((date, index) => ({
      date,
      weatherCode: saoPauloForecastResponse.daily.weather_code[index],
      temperatureMaxC: saoPauloForecastResponse.daily.temperature_2m_max[index],
      temperatureMinC: saoPauloForecastResponse.daily.temperature_2m_min[index],
      precipitationProbabilityPercent:
        saoPauloForecastResponse.daily.precipitation_probability_max[index],
    })),
  },
};
