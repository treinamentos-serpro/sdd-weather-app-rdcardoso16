import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import CitySearchForm from '../../../src/components/CitySearchForm';

describe('CitySearchForm', () => {
  it('não dispara onSearch com input vazio e associa a validação ao campo', async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();
    render(<CitySearchForm isLoading={false} onSearch={onSearch} />);

    await user.click(screen.getByRole('button', { name: 'Buscar cidade' }));

    expect(onSearch).not.toHaveBeenCalled();
    expect(screen.getByRole('alert')).toHaveTextContent('Informe o nome de uma cidade.');
    expect(screen.getByRole('searchbox', { name: 'Cidade' })).toHaveAttribute(
      'aria-invalid',
      'true',
    );
  });

  it('envia o termo digitado', async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();
    render(<CitySearchForm isLoading={false} onSearch={onSearch} />);

    await user.type(screen.getByRole('searchbox', { name: 'Cidade' }), 'São Paulo');
    await user.click(screen.getByRole('button', { name: 'Buscar cidade' }));

    expect(onSearch).toHaveBeenCalledWith('São Paulo');
  });
});
