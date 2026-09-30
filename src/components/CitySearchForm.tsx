import { type FormEvent, useState } from 'react';

interface CitySearchFormProps {
  isLoading: boolean;
  validationMessage?: string;
  onSearch: (term: string) => void;
}

export default function CitySearchForm({
  isLoading,
  validationMessage,
  onSearch,
}: CitySearchFormProps) {
  const [term, setTerm] = useState('');
  const [emptyError, setEmptyError] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!term.trim()) {
      setEmptyError(true);
      return;
    }

    setEmptyError(false);
    onSearch(term);
  }

  const displayedError =
    validationMessage ?? (emptyError ? 'Informe o nome de uma cidade.' : undefined);

  return (
    <form className="flex flex-col gap-3 sm:flex-row" onSubmit={handleSubmit}>
      <div className="flex-1">
        <label className="sr-only" htmlFor="city-search">
          Cidade
        </label>
        <input
          autoComplete="address-level2"
          className="min-h-12 w-full rounded-md border border-white/10 bg-night-800/80 px-4 text-white placeholder:text-slate-400"
          id="city-search"
          aria-describedby={displayedError ? 'city-search-error' : undefined}
          aria-invalid={Boolean(displayedError)}
          onChange={(event) => {
            setTerm(event.target.value);
            setEmptyError(false);
          }}
          placeholder="Digite uma cidade"
          type="search"
          value={term}
        />
        {displayedError ? (
          <p className="mt-2 text-sm text-rose-300" id="city-search-error" role="alert">
            {displayedError}
          </p>
        ) : null}
      </div>
      <button
        className="min-h-12 rounded-md bg-cyan-300 px-6 font-semibold text-night-900 transition hover:bg-cyan-200"
        type="submit"
      >
        {isLoading ? 'Buscar novamente' : 'Buscar cidade'}
      </button>
    </form>
  );
}
