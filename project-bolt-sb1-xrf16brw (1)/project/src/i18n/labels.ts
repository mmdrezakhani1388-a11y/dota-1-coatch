import type { AbilityKind, AttackType, Attribute, DamageType, Faction, HeroStatKey, ItemCategory, ItemStatKey, Role, VerificationStatus } from '@/data/gameDatabase/types';
import type { MatchResult } from '@/types/dashboard';
import type { CoachPersonality, Language, SkillLevel, Theme } from '@/types/settings';
import type { MessageKey } from './en';

export const LANGUAGE_NAMES: Record<Language, string> = {
  en: 'English',
  fa: 'فارسی',
};

export const THEME_KEYS: Record<Theme, MessageKey> = {
  dark: 'theme.dark',
  light: 'theme.light',
};

export const SKILL_LEVEL_KEYS: Record<SkillLevel, MessageKey> = {
  beginner: 'level.beginner',
  intermediate: 'level.intermediate',
  advanced: 'level.advanced',
};

export const PERSONALITY_KEYS: Record<CoachPersonality, MessageKey> = {
  friendly: 'personality.friendly',
  strict: 'personality.strict',
  professional: 'personality.professional',
  analytical: 'personality.analytical',
  motivational: 'personality.motivational',
  minimal: 'personality.minimal',
};

export const PERSONALITY_BODY_KEYS: Record<CoachPersonality, MessageKey> = {
  friendly: 'personality.friendly.body',
  strict: 'personality.strict.body',
  professional: 'personality.professional.body',
  analytical: 'personality.analytical.body',
  motivational: 'personality.motivational.body',
  minimal: 'personality.minimal.body',
};

export const ROLE_KEYS: Record<Role, MessageKey> = {
  carry: 'role.carry',
  mid: 'role.mid',
  offlane: 'role.offlane',
  support: 'role.support',
  'hard-support': 'role.hard-support',
};

export const ATTRIBUTE_KEYS: Record<Attribute, MessageKey> = {
  strength: 'attribute.strength',
  agility: 'attribute.agility',
  intelligence: 'attribute.intelligence',
};

export const FACTION_KEYS: Record<Faction, MessageKey> = {
  sentinel: 'faction.sentinel',
  scourge: 'faction.scourge',
};

export const RESULT_KEYS: Record<MatchResult, MessageKey> = {
  win: 'result.win',
  loss: 'result.loss',
};

export const ATTACK_TYPE_KEYS: Record<AttackType, MessageKey> = {
  melee: 'knowledge.attack.melee',
  ranged: 'knowledge.attack.ranged',
};

export const DAMAGE_TYPE_KEYS: Record<DamageType, MessageKey> = {
  physical: 'damage.physical',
  magical: 'damage.magical',
  pure: 'damage.pure',
};

export const ITEM_CATEGORY_KEYS: Record<ItemCategory, MessageKey> = {
  consumable: 'category.consumable',
  mobility: 'category.mobility',
  defense: 'category.defense',
  support: 'category.support',
  damage: 'category.damage',
  disable: 'category.disable',
  utility: 'category.utility',
};

export const ABILITY_KIND_KEYS: Record<AbilityKind, MessageKey> = {
  active: 'ability.kind.active',
  passive: 'ability.kind.passive',
  toggle: 'ability.kind.toggle',
  ultimate: 'ability.kind.ultimate',
};

export const HERO_STAT_LABEL_KEYS: Record<HeroStatKey, MessageKey> = {
  strength: 'attribute.strength',
  agility: 'attribute.agility',
  intelligence: 'attribute.intelligence',
  attackRange: 'hero.attackRange',
  movementSpeed: 'hero.movementSpeed',
};

export const ITEM_STAT_LABEL_KEYS: Record<ItemStatKey, MessageKey> = {
  strength: 'attribute.strength',
  agility: 'attribute.agility',
  intelligence: 'attribute.intelligence',
  damage: 'stat.damage',
  armor: 'stat.armor',
  moveSpeed: 'hero.movementSpeed',
  health: 'stat.health',
  mana: 'stat.mana',
};

export const VERIFICATION_KEYS: Record<VerificationStatus, MessageKey> = {
  verified: 'common.verified',
  unverified: 'common.unverified',
};
