import { formatLocalTime, isValidLocalTimestamp } from '../lib/dateTime';
import { isFiniteNumber } from '../lib/format';
import { formatTemperature } from '../lib/temperature';
import { describeWeatherCode } from '../lib/weatherCodes';
import type { CurrentWeather as CurrentWeatherData, SectionResult, Unit } from '../types/weather';

interface CurrentWeatherProps {
  current: SectionResult<CurrentWeatherData>;
  timezone: string;
  unit: Unit;
}

export default function CurrentWeather({ current, timezone, unit }: CurrentWeatherProps) {
  if (
    current.status === 'unavailable' ||
    !isFiniteNumber(current.data.temperatureC) ||
    !isValidLocalTimestamp(current.data.timestamp)
  ) {
    return (
      <section
        aria-labelledby="current-weather-heading"
        className="rounded-md border border-white/10 bg-white/[0.04] p-5 sm:p-7"
      >
        <h2
          className="text-sm font-medium uppercase tracking-wide text-slate-400"
          id="current-weather-heading"
        >
          Agora
        </h2>
        <p className="mt-5 text-slate-300">Dados atuais indisponíveis</p>
      </section>
    );
  }

  const { data } = current;
  const metrics = [
    isFiniteNumber(data.humidityPercent)
      ? { label: 'Umidade', value: `${data.humidityPercent}%` }
      : null,
    isFiniteNumber(data.windSpeedKmh)
      ? { label: 'Vento', value: `${data.windSpeedKmh} km/h` }
      : null,
    isFiniteNumber(data.precipitationMm)
      ? { label: 'Precipitação', value: `${data.precipitationMm} mm` }
      : null,
  ].filter((metric) => metric !== null);

  return (
    <section
      aria-labelledby="current-weather-heading"
      className="rounded-md border border-white/10 bg-white/[0.05] p-5 backdrop-blur-md sm:p-7"
    >
      <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
        <div>
          <h2
            className="text-sm font-medium uppercase tracking-wide text-slate-400"
            id="current-weather-heading"
          >
            Agora
          </h2>
          <p className="mt-3 text-lg text-cyan-100">{describeWeatherCode(data.weatherCode)}</p>
          <p className="mt-2 text-sm text-slate-400">
            Atualizado às {formatLocalTime(data.timestamp)} · horário local
          </p>
        </div>
        <p className="text-6xl font-semibold leading-none tracking-normal text-white sm:text-7xl">
          {formatTemperature(data.temperatureC, unit)}
        </p>
      </div>
      {metrics.length > 0 ? (
        <dl className="mt-8 grid grid-cols-2 gap-y-4 border-t border-white/10 pt-5 sm:grid-cols-3">
          {metrics.map((metric) => (
            <div key={metric.label}>
              <dt className="text-sm text-slate-400">{metric.label}</dt>
              <dd className="mt-1 font-medium text-white">{metric.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}
      <span className="sr-only">Fuso horário: {timezone}</span>
    </section>
  );
}
