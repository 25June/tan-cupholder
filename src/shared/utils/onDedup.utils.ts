export function getUniqueItems<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}
