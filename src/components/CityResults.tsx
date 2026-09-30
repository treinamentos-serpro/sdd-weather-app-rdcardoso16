import type { City } from '../types/weather';

interface CityResultsProps {
  cities: City[];
  onSelect: (city: City) => void;
  selectedCity?: City;
}

function cityKey(city: City): string {
  return `${city.id ?? 'city'}-${city.latitude}-${city.longitude}`;
}

export default function CityResults({ cities, onSelect, selectedCity }: CityResultsProps) {
  if (cities.length === 0) return null;

  return (
    <section aria-labelledby="city-results-heading" className="mt-5">
      <h2
        className="mb-3 text-sm font-medium uppercase tracking-wide text-slate-400"
        id="city-results-heading"
      >
        Resultados da busca
      </h2>
      <ul className="grid gap-2 sm:grid-cols-2">
        {cities.map((city) => {
          const selected = selectedCity ? cityKey(city) === cityKey(selectedCity) : false;
          const details = [city.region, city.country].filter(Boolean).join(', ');

          return (
            <li key={cityKey(city)}>
              <button
                aria-pressed={selected}
                className={`flex min-h-16 w-full items-center justify-between rounded-md border px-4 py-3 text-left transition ${
                  selected
                    ? 'border-cyan-300/70 bg-cyan-300/10'
                    : 'border-white/10 bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.06]'
                }`}
                onClick={() => onSelect(city)}
                type="button"
              >
                <span>
                  <span className="block font-medium text-white">{city.name}</span>
                  {details ? (
                    <span className="mt-1 block text-sm text-slate-400">{details}</span>
                  ) : null}
                </span>
                <span aria-hidden="true" className="ml-4 text-cyan-200">
                  ↗
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
