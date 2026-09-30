const descriptions: Array<[number, number, string]> = [
  [0, 0, 'Céu limpo'],
  [1, 3, 'Parcialmente nublado'],
  [45, 48, 'Nevoeiro'],
  [51, 57, 'Garoa'],
  [61, 67, 'Chuva'],
  [71, 77, 'Neve'],
  [80, 82, 'Pancadas de chuva'],
  [85, 86, 'Pancadas de neve'],
  [95, 99, 'Trovoadas'],
];

export function describeWeatherCode(code: number | undefined): string {
  if (code === undefined || !Number.isFinite(code)) {
    return 'Condição indisponível';
  }

  return (
    descriptions.find(([minimum, maximum]) => code >= minimum && code <= maximum)?.[2] ??
    'Condição indisponível'
  );
}
