import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { readStoredSettings, writeStoredSettings } from '@/services/settingsStorage';
import type { AppSettings } from '@/types/settings';

export interface SettingsContextValue {
  settings: AppSettings;
  updateSettings: (patch: Partial<AppSettings>) => void;
  saveFailed: boolean;
}

export const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(readStoredSettings);
  const [saveFailed, setSaveFailed] = useState(false);

  useEffect(() => {
    document.documentElement.lang = settings.language;
    document.documentElement.dir = settings.language === 'fa' ? 'rtl' : 'ltr';
    document.documentElement.dataset.theme = settings.theme;
    setSaveFailed(!writeStoredSettings(settings));
  }, [settings]);

  const updateSettings = useCallback((patch: Partial<AppSettings>) => {
    setSettings((previous) => ({ ...previous, ...patch }));
  }, []);

  const value = useMemo(
    () => ({ settings, updateSettings, saveFailed }),
    [settings, updateSettings, saveFailed],
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}
