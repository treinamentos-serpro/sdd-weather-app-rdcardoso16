export type Unit = 'celsius' | 'fahrenheit';

export interface City {
  id?: number;
  name: string;
  country?: string;
  countryCode?: string;
  region?: string;
  latitude: number;
  longitude: number;
  timezone?: string;
}

export interface CurrentWeather {
  temperatureC: number;
  timestamp: string;
  weatherCode?: number;
  humidityPercent?: number;
  windSpeedKmh?: number;
  precipitationMm?: number;
}

export interface ForecastDay {
  date: string | null;
  weatherCode?: number;
  temperatureMaxC?: number;
  temperatureMinC?: number;
  precipitationProbabilityPercent?: number;
}

export type WeatherErrorCode = 'network' | 'timeout' | 'provider' | 'invalid-response';

export type SectionResult<T> =
  | { status: 'success'; data: T }
  | { status: 'unavailable'; reason: WeatherErrorCode };

export interface WeatherData {
  city: City;
  timezone: string;
  current: SectionResult<CurrentWeather>;
  forecast: SectionResult<ForecastDay[]>;
}
