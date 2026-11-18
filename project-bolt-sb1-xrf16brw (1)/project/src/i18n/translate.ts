import { en, type MessageKey } from './en';
import { fa } from './fa';
import type { Language } from '@/types/settings';

export type TranslationValues = Record<string, string | number>;

export function translate(language: Language, key: MessageKey, values?: TranslationValues): string {
  const template = (language === 'fa' ? fa : en)[key];
  if (!values) return template;
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in values ? String(values[name]) : match,
  );
}
