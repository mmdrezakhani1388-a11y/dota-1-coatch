import type { Language } from '@/types/settings';

export function todayIsoDate(): string {
  const now = new Date();
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

export function formatIsoDate(isoDate: string, language: Language): string {
  const date = new Date(`${isoDate}T00:00:00`);
  return new Intl.DateTimeFormat(language === 'fa' ? 'fa-IR' : 'en-GB', { dateStyle: 'medium' }).format(date);
}
