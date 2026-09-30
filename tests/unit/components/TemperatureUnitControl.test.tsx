import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import CurrentWeather from '../../../src/components/CurrentWeather';
import TemperatureUnitControl from '../../../src/components/TemperatureUnitControl';
import type { Unit } from '../../../src/types/weather';

function TemperaturePreview() {
  const [unit, setUnit] = useState<Unit>('celsius');

  return (
    <>
      <TemperatureUnitControl onChange={setUnit} value={unit} />
      <CurrentWeather
        current={{
          status: 'success',
          data: { temperatureC: 0, timestamp: '2026-09-30T12:00' },
        }}
        timezone="America/Sao_Paulo"
        unit={unit}
      />
    </>
  );
}

describe('TemperatureUnitControl com CurrentWeather', () => {
  it('converte 0 °C para 32 °F ao selecionar Fahrenheit', async () => {
    const user = userEvent.setup();
    render(<TemperaturePreview />);

    await user.click(screen.getByRole('button', { name: 'Fahrenheit (°F)' }));

    expect(screen.getByText('32°F')).toBeInTheDocument();
  });
});
