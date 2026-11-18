export const MAP_ID = 'dota-allstars';
export const MAP_NAME = 'DotA Allstars';
export const DEFAULT_PATCH = '7.03b2';

export const ROLES = ['carry', 'mid', 'offlane', 'support', 'hard-support'] as const;
export type Role = (typeof ROLES)[number];

export const ATTRIBUTES = ['strength', 'agility', 'intelligence'] as const;
export type Attribute = (typeof ATTRIBUTES)[number];

export const FACTIONS = ['sentinel', 'scourge'] as const;
export type Faction = (typeof FACTIONS)[number];

export const ATTACK_TYPES = ['melee', 'ranged'] as const;
export type AttackType = (typeof ATTACK_TYPES)[number];

export const DAMAGE_TYPES = ['physical', 'magical', 'pure'] as const;
export type DamageType = (typeof DAMAGE_TYPES)[number];

export const HERO_TAGS = [
  'initiator',
  'disabler',
  'nuker',
  'durable',
  'escape',
  'healer',
  'carry',
  'ganker',
  'pusher',
] as const;
export type HeroTag = (typeof HERO_TAGS)[number];

export const HERO_STAT_KEYS = ['strength', 'agility', 'intelligence', 'attackRange', 'movementSpeed'] as const;
export type HeroStatKey = (typeof HERO_STAT_KEYS)[number];

export const ITEM_CATEGORIES = [
  'consumable',
  'mobility',
  'defense',
  'support',
  'damage',
  'disable',
  'utility',
] as const;
export type ItemCategory = (typeof ITEM_CATEGORIES)[number];

export const ITEM_TAGS = [
  'anti-magic',
  'anti-disable',
  'healing',
  'initiation',
  'survivability',
  'mobility',
  'core-damage',
  'utility',
] as const;
export type ItemTag = (typeof ITEM_TAGS)[number];

export const ITEM_STAT_KEYS = [
  'strength',
  'agility',
  'intelligence',
  'damage',
  'armor',
  'moveSpeed',
  'health',
  'mana',
] as const;
export type ItemStatKey = (typeof ITEM_STAT_KEYS)[number];

export const ABILITY_KINDS = ['active', 'passive', 'toggle', 'ultimate'] as const;
export type AbilityKind = (typeof ABILITY_KINDS)[number];

export const VERIFICATION_STATUSES = ['verified', 'unverified'] as const;
export type VerificationStatus = (typeof VERIFICATION_STATUSES)[number];

export interface EntityBase {
  id: string;
  patch: string;
  source: string;
  verification: VerificationStatus;
}

export interface HeroRecord extends EntityBase {
  name: string;
  faction: Faction | null;
  primaryAttribute: Attribute;
  attackType: AttackType;
  damage: DamageType | null;
  roles: Role[];
  tags: HeroTag[];
  stats: Record<HeroStatKey, number | null>;
  abilityIds: string[];
  description: string | null;
}

export interface AbilityRecord extends EntityBase {
  heroId: string;
  name: string;
  kind: AbilityKind;
  description: string | null;
  manaCost: number[] | null;
  cooldown: number[] | null;
  castRange: number | null;
  levelValues: Record<string, number[]>;
  mechanics: string[];
}

export interface ItemRecord extends EntityBase {
  name: string;
  category: ItemCategory;
  tags: ItemTag[];
  cost: number | null;
  bonuses: Partial<Record<ItemStatKey, number>>;
  activeAbility: string | null;
  passiveEffects: string[];
  cooldown: number | null;
  description: string | null;
}

export interface ItemRecipeRecord extends EntityBase {
  resultItemId: string;
  componentItemIds: string[];
  cost: number | null;
}

export interface GameDataVersion {
  schemaVersion: number;
  mapId: string;
  patch: string;
  dataVersion: string;
}

export interface GameDatabase {
  version: GameDataVersion;
  heroes: HeroRecord[];
  abilities: AbilityRecord[];
  items: ItemRecord[];
  recipes: ItemRecipeRecord[];
}

export const SCHEMA_VERSION = 3;
