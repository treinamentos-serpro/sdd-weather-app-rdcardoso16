import type { City, WeatherData, WeatherErrorCode } from './weather';

export interface AppError {
  code: WeatherErrorCode;
  message: string;
  retryable: boolean;
  retryAfterMs?: number;
}

export type SearchState =
  | { status: 'idle' }
  | { status: 'loading'; term: string }
  | { status: 'success'; term: string; results: City[] }
  | { status: 'empty'; term: string }
  | { status: 'error'; term: string; error: AppError };

export type WeatherState =
  | { status: 'idle' }
  | { status: 'loading'; city: City }
  | { status: 'success'; data: WeatherData }
  | { status: 'partial'; data: WeatherData }
  | { status: 'error'; city: City; error: AppError };
