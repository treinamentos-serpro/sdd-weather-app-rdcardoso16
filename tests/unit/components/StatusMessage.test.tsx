import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import StatusMessage from '../../../src/components/StatusMessage';

describe('StatusMessage', () => {
  it('anuncia o estado de loading', () => {
    render(<StatusMessage title="Carregando previsão…" tone="loading" />);

    expect(screen.getByRole('status')).toHaveTextContent('Carregando previsão…');
  });

  it('apresenta vazio e erro como mensagens identificáveis', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    const { rerender } = render(<StatusMessage title="Nenhuma cidade encontrada." tone="empty" />);

    expect(screen.getByRole('status')).toHaveTextContent('Nenhuma cidade encontrada.');

    rerender(<StatusMessage onRetry={onRetry} title="Falha ao consultar." tone="error" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Falha ao consultar.');
    await user.click(screen.getByRole('button', { name: 'Tentar novamente' }));
    expect(onRetry).toHaveBeenCalledOnce();
  });
});
