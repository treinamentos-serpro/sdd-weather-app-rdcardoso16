export function isValidIsoDate(date: string | null): date is string {
  if (!date || !/^\d{4}-\d{2}-\d{2}$/u.test(date)) return false;
  const [year, month, day] = date.split('-').map(Number);
  const parsedDate = new Date(Date.UTC(year, month - 1, day));

  return !(
    parsedDate.getUTCFullYear() !== year ||
    parsedDate.getUTCMonth() !== month - 1 ||
    parsedDate.getUTCDate() !== day
  );
}

export function isValidLocalTimestamp(timestamp: unknown): timestamp is string {
  if (typeof timestamp !== 'string') return false;
  const match = timestamp.match(/^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2})$/u);
  if (!match || !isValidIsoDate(match[1])) return false;
  return Number(match[2]) <= 23 && Number(match[3]) <= 59;
}

export function isValidTimeZone(timezone: string): boolean {
  if (!timezone.trim()) return false;
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: timezone });
    return true;
  } catch {
    return false;
  }
}

export function formatLocalDate(date: string | null): string {
  if (!isValidIsoDate(date)) return 'Data indisponível';
  const [year, month, day] = date.split('-').map(Number);

  return `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`;
}

export function formatLocalTime(timestamp: string): string {
  if (!isValidLocalTimestamp(timestamp)) return 'Horário indisponível';
  const match = timestamp.match(/T(\d{2}:\d{2})/u);
  return match?.[1] ?? 'Horário indisponível';
}
