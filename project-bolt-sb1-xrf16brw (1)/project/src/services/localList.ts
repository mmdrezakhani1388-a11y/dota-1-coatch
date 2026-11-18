export function readLocalList<T>(key: string, parse: (raw: unknown) => T[]): T[] {
  try {
    const raw = window.localStorage.getItem(key);
    return raw === null ? [] : parse(JSON.parse(raw));
  } catch {
    return [];
  }
}

export function writeLocalList<T>(key: string, items: T[]): boolean {
  try {
    window.localStorage.setItem(key, JSON.stringify(items));
    return true;
  } catch {
    return false;
  }
}
