import { useEffect, useState } from 'react';
import { readLocalList, writeLocalList } from '@/services/localList';

export function usePersistentList<T>(storageKey: string, parse: (raw: unknown) => T[]) {
  const [items, setItems] = useState<T[]>(() => readLocalList(storageKey, parse));
  const [saveFailed, setSaveFailed] = useState(false);

  useEffect(() => {
    setSaveFailed(!writeLocalList(storageKey, items));
  }, [storageKey, items]);

  return { items, setItems, saveFailed };
}
