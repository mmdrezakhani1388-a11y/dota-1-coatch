import { useContext } from 'react';
import { GameDataContext, type GameDataContextValue } from './GameDataContext';

export function useGameData(): GameDataContextValue {
  const value = useContext(GameDataContext);
  if (!value) throw new Error('useGameData must be used within GameDataProvider');
  return value;
}
