import { useState } from 'react';
import CityResults from './components/CityResults';
import CitySearchForm from './components/CitySearchForm';
import CurrentWeather from './components/CurrentWeather';
import FiveDayForecast from './components/FiveDayForecast';
import StatusMessage from './components/StatusMessage';
import TemperatureUnitControl from './components/TemperatureUnitControl';
import { useWeather } from './hooks/useWeather';
import type { Unit } from './types/weather';

export default function App() {
  const { status, data, cities, error, selectedCity, search, selectCity, retry } = useWeather();
  const [unit, setUnit] = useState<Unit>('celsius');
  const searchError = status === 'error' && !selectedCity ? error : null;
  const weatherError = status === 'error' && selectedCity ? error : null;

  return (
    <main className="min-h-screen overflow-hidden bg-night-900 px-4 py-5 text-white sm:px-8 sm:py-8">
      <div className="mx-auto max-w-6xl">
        <header className="flex items-center justify-between border-b border-white/10 pb-5">
          <a
            aria-label="Clima Local, início"
            className="text-lg font-bold tracking-wide text-white"
            href="/"
          >
            CLIMA<span className="text-cyan-300">/</span>LOCAL
          </a>
          <span className="text-xs font-medium uppercase tracking-wider text-slate-400 sm:text-sm">
            Previsão em tempo local
          </span>
        </header>

        <div className="grid gap-8 py-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:py-12">
          <section aria-labelledby="search-heading" className="min-w-0">
            <p className="text-sm font-semibold uppercase tracking-wide text-cyan-200">
              Clima na sua cidade
            </p>
            <h1
              className="mt-2 text-3xl font-semibold leading-tight text-white sm:text-4xl"
              id="search-heading"
            >
              Um olhar sobre o céu de hoje.
            </h1>
            <p className="mt-3 max-w-xl text-slate-400">
              Consulte as condições atuais e os próximos cinco dias.
            </p>

            <div className="mt-7">
              <CitySearchForm
                isLoading={status === 'loading' && !selectedCity}
                onSearch={search}
                validationMessage={searchError?.retryable ? undefined : searchError?.message}
              />
            </div>

            <div aria-live="polite" className="mt-4 space-y-3">
              {status === 'loading' && !selectedCity ? (
                <StatusMessage title="Buscando cidades…" tone="loading" />
              ) : null}
              {status === 'empty' ? (
                <StatusMessage
                  description="Confira a grafia ou tente outra cidade."
                  title="Nenhuma cidade encontrada."
                  tone="empty"
                />
              ) : null}
              {searchError?.retryable ? (
                <StatusMessage
                  onRetry={retry}
                  retryAfterMs={searchError.retryAfterMs}
                  title={searchError.message}
                  tone="error"
                />
              ) : null}
            </div>

            {cities.length > 0 ? (
              <CityResults
                cities={cities}
                onSelect={selectCity}
                selectedCity={selectedCity ?? undefined}
              />
            ) : null}
          </section>

          <section aria-label="Condições meteorológicas" className="min-w-0">
            <div className="mb-4 flex flex-col gap-3 border-b border-white/10 pb-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="min-w-0">
                <p className="text-sm text-slate-400">Localidade selecionada</p>
                <h2 className="mt-1 truncate text-xl font-medium text-white">
                  {selectedCity
                    ? [selectedCity.name, selectedCity.region, selectedCity.country]
                        .filter(Boolean)
                        .join(', ')
                    : 'Aguardando busca'}
                </h2>
              </div>
              <TemperatureUnitControl onChange={setUnit} value={unit} />
            </div>

            {status === 'idle' || (status === 'loading' && !selectedCity) ? (
              <div className="flex min-h-56 items-center rounded-md border border-dashed border-white/15 bg-white/[0.02] px-6 py-8 text-slate-400">
                <p>As condições e a previsão aparecerão aqui após buscar uma cidade.</p>
              </div>
            ) : null}

            {status === 'loading' && selectedCity ? (
              <StatusMessage title="Carregando previsão…" tone="loading" />
            ) : null}

            {weatherError ? (
              <StatusMessage
                onRetry={weatherError.retryable ? retry : undefined}
                retryAfterMs={weatherError.retryAfterMs}
                title={weatherError.message}
                tone="error"
              />
            ) : null}

            {status === 'success' && data ? (
              <CurrentWeather current={data.current} timezone={data.timezone} unit={unit} />
            ) : null}
          </section>
        </div>

        {status === 'success' && data ? (
          <FiveDayForecast forecast={data.forecast} unit={unit} />
        ) : null}

        <footer className="mt-10 border-t border-white/10 pt-4 text-xs text-slate-500">
          Dados meteorológicos fornecidos pela Open-Meteo.
        </footer>
      </div>
    </main>
  );
}
