export type SearchTermResult =
  | { valid: true; value: string }
  | { valid: false; reason: 'empty' | 'control-character' };

export function normalizeSearchTerm(term: string): SearchTermResult {
  const value = term.trim();

  if (!value) {
    return { valid: false, reason: 'empty' };
  }

  const containsControlCharacter = Array.from(value).some((character) => {
    const code = character.charCodeAt(0);
    return code <= 0x1f || code === 0x7f;
  });

  if (containsControlCharacter) {
    return { valid: false, reason: 'control-character' };
  }

  return { valid: true, value };
}
