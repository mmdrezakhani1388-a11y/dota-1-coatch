import type { GameDatabase } from '@/data/gameDatabase/types';
import { validateGameDatabase } from './gameDataValidation';

const GAME_DATA_STORAGE_KEY = 'dota-ai-coach.gameData';

export function readStoredGameDatabase(): GameDatabase | null {
  try {
    const raw = window.localStorage.getItem(GAME_DATA_STORAGE_KEY);
    if (!raw) return null;
    const report = validateGameDatabase(JSON.parse(raw));
    return report.errors.length === 0 ? report.database : null;
  } catch {
    return null;
  }
}

export function writeStoredGameDatabase(database: GameDatabase | null): boolean {
  try {
    if (database === null) {
      window.localStorage.removeItem(GAME_DATA_STORAGE_KEY);
    } else {
      window.localStorage.setItem(GAME_DATA_STORAGE_KEY, JSON.stringify(database));
    }
    return true;
  } catch {
    return false;
  }
}
