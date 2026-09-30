import { formatLocalDate, isValidIsoDate } from '../lib/dateTime';
import { getDayLabel, getShortDate, isFiniteNumber } from '../lib/format';
import { formatTemperature } from '../lib/temperature';
import { describeWeatherCode } from '../lib/weatherCodes';
import type { ForecastDay, SectionResult, Unit } from '../types/weather';

interface FiveDayForecastProps {
  forecast: SectionResult<ForecastDay[]>;
  unit: Unit;
}

export default function FiveDayForecast({ forecast, unit }: FiveDayForecastProps) {
  return (
    <section aria-labelledby="forecast-heading" className="mt-8">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-wide text-slate-400">Planeje os próximos dias</p>
          <h2 className="mt-1 text-2xl font-semibold text-white" id="forecast-heading">
            Previsão de 5 dias
          </h2>
        </div>
      </div>

      {forecast.status === 'unavailable' ? (
        <p className="rounded-md border border-white/10 bg-white/[0.04] p-5 text-slate-300">
          Previsão indisponível no momento.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {forecast.data.map((day, index) => (
            <ForecastCard
              day={day}
              index={index}
              key={day.date ?? `slot-${index + 1}`}
              unit={unit}
            />
          ))}
        </div>
      )}
    </section>
  );
}

interface ForecastCardProps {
  day: ForecastDay;
  index: number;
  unit: Unit;
}

function ForecastCard({ day, index, unit }: ForecastCardProps) {
  const temperatureMaxC = isFiniteNumber(day.temperatureMaxC) ? day.temperatureMaxC : undefined;
  const temperatureMinC = isFiniteNumber(day.temperatureMinC) ? day.temperatureMinC : undefined;
  const precipitationProbability = isFiniteNumber(day.precipitationProbabilityPercent)
    ? day.precipitationProbabilityPercent
    : undefined;
  const usable =
    isValidIsoDate(day.date) && temperatureMaxC !== undefined && temperatureMinC !== undefined;

  return (
    <article
      aria-label={`${getDayLabel(index, day.date)}, ${getShortDate(day.date)}`}
      className="flex min-h-40 flex-col rounded-md border border-white/10 bg-white/[0.04] p-4"
    >
      <p className="text-sm font-semibold text-slate-200">{getDayLabel(index, day.date)}</p>
      <p className="mt-0.5 text-xs text-slate-400">{formatLocalDate(day.date)}</p>
      {usable ? (
        <>
          <p className="mt-4 min-h-10 text-sm text-cyan-100">
            {describeWeatherCode(day.weatherCode)}
          </p>
          <div className="mt-auto flex items-baseline justify-between gap-2">
            <span className="font-semibold text-white">
              {formatTemperature(temperatureMaxC, unit)}
            </span>
            <span className="text-sm text-slate-400">
              {formatTemperature(temperatureMinC, unit)}
            </span>
          </div>
          {precipitationProbability !== undefined &&
          precipitationProbability >= 0 &&
          precipitationProbability <= 100 ? (
            <p className="mt-3 text-xs text-cyan-100">Chuva {precipitationProbability}%</p>
          ) : null}
        </>
      ) : (
        <p className="mt-auto text-sm text-slate-400">Dados indisponíveis</p>
      )}
    </article>
  );
}
