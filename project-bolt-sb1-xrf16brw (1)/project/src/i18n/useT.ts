import { useCallback } from 'react';
import { useSettings } from '@/context/useSettings';
import type { MessageKey } from './en';
import { translate, type TranslationValues } from './translate';

export function useT() {
  const { settings } = useSettings();
  const language = settings.language;
  return useCallback(
    (key: MessageKey, values?: TranslationValues) => translate(language, key, values),
    [language],
  );
}
