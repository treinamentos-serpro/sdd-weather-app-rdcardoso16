import type { WeatherErrorCode } from '../types/weather';

export class WeatherServiceError extends Error {
  constructor(
    readonly code: WeatherErrorCode,
    message: string,
    readonly retryable: boolean,
    readonly retryAfterMs?: number,
  ) {
    super(message);
    this.name = 'WeatherServiceError';
  }
}

export { WeatherServiceError as ServiceError };
