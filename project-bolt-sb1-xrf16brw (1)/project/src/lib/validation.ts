export function pickOption<T extends string>(value: unknown, options: readonly T[], fallback: T): T {
  return typeof value === 'string' && (options as readonly string[]).includes(value) ? (value as T) : fallback;
}

export function pickOptions<T extends string>(value: unknown, options: readonly T[]): T[] {
  if (!Array.isArray(value)) return [];
  return options.filter((option) => value.includes(option));
}

export function asText(value: unknown, fallback: string, maxLength = 2000): string {
  if (typeof value !== 'string') return fallback;
  const trimmed = value.trim().slice(0, maxLength);
  return trimmed.length > 0 ? trimmed : fallback;
}

export function asStringArray(value: unknown, maxItems: number): string[] {
  if (!Array.isArray(value)) return [];
  const items = value
    .filter((item): item is string => typeof item === 'string')
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
  return [...new Set(items)].slice(0, maxItems);
}
