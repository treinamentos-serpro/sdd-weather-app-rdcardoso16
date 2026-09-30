interface StatusMessageProps {
  description?: string;
  onRetry?: () => void;
  retryAfterMs?: number;
  title: string;
  tone: 'loading' | 'empty' | 'error' | 'partial';
}

export default function StatusMessage({
  description,
  onRetry,
  retryAfterMs = 0,
  title,
  tone,
}: StatusMessageProps) {
  const isError = tone === 'error';
  const role = isError ? 'alert' : 'status';
  const retryLabel =
    retryAfterMs > 0
      ? `Tentar novamente (aguardar ${Math.ceil(retryAfterMs / 1000)} s)`
      : 'Tentar novamente';

  return (
    <div
      aria-live={isError ? 'assertive' : 'polite'}
      className={`rounded-md border px-4 py-3 ${
        tone === 'error'
          ? 'border-rose-300/30 bg-rose-300/10 text-rose-100'
          : tone === 'partial'
            ? 'border-amber-300/30 bg-amber-300/10 text-amber-100'
            : 'border-white/10 bg-white/[0.04] text-slate-200'
      }`}
      role={role}
    >
      <p className="font-medium">{title}</p>
      {description ? <p className="mt-1 text-sm opacity-80">{description}</p> : null}
      {onRetry ? (
        <button
          className="mt-3 rounded border border-current/30 px-3 py-1.5 text-sm font-medium hover:bg-white/10"
          onClick={onRetry}
          type="button"
        >
          {retryLabel}
        </button>
      ) : null}
    </div>
  );
}
