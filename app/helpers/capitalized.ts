export function capitalized(str: string): string {
  return str !== '' ? `${str[0].toUpperCase()}${str.slice(1)}` : ''
}
