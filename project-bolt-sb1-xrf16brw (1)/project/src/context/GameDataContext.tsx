import { createContext, useCallback, useMemo, useState, type ReactNode } from 'react';
import { DEFAULT_GAME_DATABASE, indexGameDatabase, type GameDatabase, type GameDatabaseIndex } from '@/data/gameDatabase';
import { mergeGameDatabases } from '@/services/gameDataValidation';
import { readStoredGameDatabase, writeStoredGameDatabase } from '@/services/gameDataStorage';

export interface GameDataContextValue {
  database: GameDatabase;
  index: GameDatabaseIndex;
  isImported: boolean;
  saveFailed: boolean;
  mergeDatabase: (incoming: GameDatabase) => { added: number; updated: number };
  resetDatabase: () => void;
}

export const GameDataContext = createContext<GameDataContextValue | null>(null);

export function GameDataProvider({ children }: { children: ReactNode }) {
  const [stored] = useState<GameDatabase | null>(readStoredGameDatabase);
  const [database, setDatabase] = useState<GameDatabase>(stored ?? DEFAULT_GAME_DATABASE);
  const [isImported, setIsImported] = useState(stored !== null);
  const [saveFailed, setSaveFailed] = useState(false);

  const index = useMemo(() => indexGameDatabase(database), [database]);

  const mergeDatabase = useCallback(
    (incoming: GameDatabase) => {
      const result = mergeGameDatabases(database, incoming);
      setDatabase(result.database);
      setIsImported(true);
      setSaveFailed(!writeStoredGameDatabase(result.database));
      return { added: result.added, updated: result.updated };
    },
    [database],
  );

  const resetDatabase = useCallback(() => {
    setDatabase(DEFAULT_GAME_DATABASE);
    setIsImported(false);
    setSaveFailed(!writeStoredGameDatabase(null));
  }, []);

  const value = useMemo(
    () => ({ database, index, isImported, saveFailed, mergeDatabase, resetDatabase }),
    [database, index, isImported, saveFailed, mergeDatabase, resetDatabase],
  );

  return <GameDataContext.Provider value={value}>{children}</GameDataContext.Provider>;
}
