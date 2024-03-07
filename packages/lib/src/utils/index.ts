export function capitalize(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function pad(number: number): string {
  return String(number).padStart(2, '0');
}
