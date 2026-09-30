function parseCalendarDate(date: string | null): Date | null {
  if (!date || !/^\d{4}-\d{2}-\d{2}$/u.test(date)) return null;

  const [year, month, day] = date.split('-').map(Number);
  const parsed = new Date(Date.UTC(year, month - 1, day));
  if (
    parsed.getUTCFullYear() !== year ||
    parsed.getUTCMonth() !== month - 1 ||
    parsed.getUTCDate() !== day
  ) {
    return null;
  }

  return parsed;
}

export function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

export function getDayLabel(index: number, date: string | null): string {
  if (index === 0) return 'Hoje';
  if (index === 1) return 'Amanhã';

  const parsed = parseCalendarDate(date);
  if (!parsed) return 'Dia indisponível';

  return new Intl.DateTimeFormat('pt-BR', { weekday: 'long', timeZone: 'UTC' }).format(parsed);
}

export function getShortDate(date: string | null): string {
  const parsed = parseCalendarDate(date);
  if (!parsed) return 'Data indisponível';

  const day = String(parsed.getUTCDate()).padStart(2, '0');
  const month = String(parsed.getUTCMonth() + 1).padStart(2, '0');
  return `${day}/${month}`;
}
