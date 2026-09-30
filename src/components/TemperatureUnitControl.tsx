import { unitLabel } from '../lib/temperature';
import type { Unit } from '../types/weather';

interface TemperatureUnitControlProps {
  onChange: (unit: Unit) => void;
  value: Unit;
}

export default function TemperatureUnitControl({ onChange, value }: TemperatureUnitControlProps) {
  return (
    <div
      aria-label="Unidade de temperatura"
      className="inline-flex rounded-md border border-white/10 bg-night-900/70 p-1"
      role="group"
    >
      <button
        aria-label={`${unitLabel('celsius')} (°C)`}
        aria-pressed={value === 'celsius'}
        className={`min-h-10 rounded px-3 text-sm font-semibold transition ${value === 'celsius' ? 'bg-white text-night-900' : 'text-slate-300 hover:text-white'}`}
        onClick={() => onChange('celsius')}
        type="button"
      >
        °C
      </button>
      <button
        aria-label={`${unitLabel('fahrenheit')} (°F)`}
        aria-pressed={value === 'fahrenheit'}
        className={`min-h-10 rounded px-3 text-sm font-semibold transition ${value === 'fahrenheit' ? 'bg-white text-night-900' : 'text-slate-300 hover:text-white'}`}
        onClick={() => onChange('fahrenheit')}
        type="button"
      >
        °F
      </button>
    </div>
  );
}
