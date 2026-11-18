import { DEFAULT_SETTINGS, parseAppSettings, type AppSettings } from '@/types/settings';

const STORAGE_KEY = 'dota-ai-coach.settings';

export function readStoredSettings(): AppSettings {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw === null ? DEFAULT_SETTINGS : parseAppSettings(JSON.parse(raw));
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function writeStoredSettings(settings: AppSettings): boolean {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    return true;
  } catch {
    return false;
  }
}
