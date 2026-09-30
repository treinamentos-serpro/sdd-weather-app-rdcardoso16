import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../../src/App';
import { useWeather } from '../../src/hooks/useWeather';
import { WeatherServiceError } from '../../src/services/serviceError';
import type { WeatherData } from '../../src/types/weather';
import { saoPaulo, saoPauloWeatherData } from '../fixtures/openMeteo';

vi.mock('../../src/hooks/useWeather', () => ({ useWeather: vi.fn() }));

const mockUseWeather = vi.mocked(useWeather);

function makeHookState(overrides: Partial<ReturnType<typeof useWeather>> = {}) {
  return {
    status: 'idle' as const,
    data: null as WeatherData | null,
    cities: [],
    error: null,
    query: '',
    selectedCity: null,
    search: vi.fn(),
    selectCity: vi.fn(),
    retry: vi.fn(),
    ...overrides,
  };
}

describe('Weather App', () => {
  beforeEach(() => {
    mockUseWeather.mockReset();
  });

  it('renderiza o estado vazio e encaminha uma nova busca', async () => {
    const user = userEvent.setup();
    const search = vi.fn();
    mockUseWeather.mockReturnValue(makeHookState({ status: 'empty', search }));
    render(<App />);

    await user.type(screen.getByRole('searchbox', { name: 'Cidade' }), 'Atlantis');
    await user.click(screen.getByRole('button', { name: 'Buscar cidade' }));

    expect(screen.getByText('Nenhuma cidade encontrada.')).toBeInTheDocument();
    expect(search).toHaveBeenCalledWith('Atlantis');
  });

  it('renderiza sucesso e mantém unidade como estado de UI', async () => {
    const user = userEvent.setup();
    mockUseWeather.mockReturnValue(
      makeHookState({
        status: 'success',
        data: saoPauloWeatherData,
        cities: [saoPaulo],
        selectedCity: saoPaulo,
      }),
    );
    render(<App />);

    expect(screen.getByText('20°C')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Fahrenheit (°F)' }));
    expect(screen.getByText('68°F')).toBeInTheDocument();
  });

  it('liga o retry do estado de erro à ação do hook', async () => {
    const user = userEvent.setup();
    const retry = vi.fn();
    mockUseWeather.mockReturnValue(
      makeHookState({
        status: 'error',
        error: new WeatherServiceError('network', 'Falha de rede.', true),
        retry,
      }),
    );
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Tentar novamente' }));
    expect(retry).toHaveBeenCalledOnce();
  });
});
