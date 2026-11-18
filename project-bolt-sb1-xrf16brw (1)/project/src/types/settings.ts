import { ROLES, type Role } from '@/data/gameDatabase/types';
import { asStringArray, asText, pickOption, pickOptions } from '@/lib/validation';

export const LANGUAGES = ['en', 'fa'] as const;
export type Language = (typeof LANGUAGES)[number];

export const THEMES = ['dark', 'light'] as const;
export type Theme = (typeof THEMES)[number];

export const SKILL_LEVELS = ['beginner', 'intermediate', 'advanced'] as const;
export type SkillLevel = (typeof SKILL_LEVELS)[number];

export const COACH_PERSONALITIES = [
  'friendly',
  'strict',
  'professional',
  'analytical',
  'motivational',
  'minimal',
] as const;
export type CoachPersonality = (typeof COACH_PERSONALITIES)[number];

export const MAX_FAVORITE_HEROES = 12;

export interface AppSettings {
  playerName: string;
  language: Language;
  theme: Theme;
  skillLevel: SkillLevel;
  coachPersonality: CoachPersonality;
  preferredRoles: Role[];
  favoriteHeroIds: string[];
}

export const DEFAULT_SETTINGS: AppSettings = {
  playerName: '',
  language: 'en',
  theme: 'dark',
  skillLevel: 'beginner',
  coachPersonality: 'friendly',
  preferredRoles: [],
  favoriteHeroIds: [],
};

export function parseAppSettings(raw: unknown): AppSettings {
  const source = typeof raw === 'object' && raw !== null ? (raw as Record<string, unknown>) : {};
  return {
    playerName: asText(source.playerName, DEFAULT_SETTINGS.playerName, 40),
    language: pickOption(source.language, LANGUAGES, DEFAULT_SETTINGS.language),
    theme: pickOption(source.theme, THEMES, DEFAULT_SETTINGS.theme),
    skillLevel: pickOption(source.skillLevel, SKILL_LEVELS, DEFAULT_SETTINGS.skillLevel),
    coachPersonality: pickOption(source.coachPersonality, COACH_PERSONALITIES, DEFAULT_SETTINGS.coachPersonality),
    preferredRoles: pickOptions(source.preferredRoles, ROLES),
    favoriteHeroIds: asStringArray(source.favoriteHeroIds, MAX_FAVORITE_HEROES),
  };
}
