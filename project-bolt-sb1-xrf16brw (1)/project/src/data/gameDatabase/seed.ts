import {
  DEFAULT_PATCH,
  type AttackType,
  type Attribute,
  type Faction,
  type HeroRecord,
  type HeroTag,
  type ItemCategory,
  type ItemRecord,
  type ItemTag,
  type Role,
} from './types';

const SEED_SOURCE = 'Built-in roster: names, primary attribute and roles only. Stats not imported.';
const ROSTER_SOURCE = 'DotA Allstars hero list (Rubattle.net): faction and primary attribute.';

const CONFIRMED_FACTIONS: Record<string, Faction> = {
  axe: 'scourge',
  'crystal-maiden': 'sentinel',
  lich: 'scourge',
  juggernaut: 'sentinel',
};

const EMPTY_STATS = { strength: null, agility: null, intelligence: null, attackRange: null, movementSpeed: null };

function seedHero(
  id: string,
  name: string,
  attribute: Attribute,
  attackType: AttackType,
  roles: Role[],
  tags: HeroTag[],
): HeroRecord {
  const faction = CONFIRMED_FACTIONS[id] ?? null;
  return {
    id,
    name,
    faction,
    primaryAttribute: attribute,
    attackType,
    damage: null,
    roles,
    tags,
    stats: { ...EMPTY_STATS },
    abilityIds: [],
    description: null,
    patch: DEFAULT_PATCH,
    source: faction ? ROSTER_SOURCE : SEED_SOURCE,
    verification: faction ? 'verified' : 'unverified',
  };
}

function seedItem(id: string, name: string, category: ItemCategory, tags: ItemTag[]): ItemRecord {
  return {
    id,
    name,
    category,
    tags,
    cost: null,
    bonuses: {},
    activeAbility: null,
    passiveEffects: [],
    cooldown: null,
    description: null,
    patch: DEFAULT_PATCH,
    source: 'Built-in item list: name and category only. Cost and properties not imported.',
    verification: 'unverified',
  };
}

export const SEED_HEROES: HeroRecord[] = [
  seedHero('sven', 'Sven', 'strength', 'melee', ['carry', 'offlane'], ['carry', 'initiator', 'durable']),
  seedHero('axe', 'Axe', 'strength', 'melee', ['offlane'], ['initiator', 'durable', 'disabler']),
  seedHero('pudge', 'Pudge', 'strength', 'melee', ['offlane', 'support'], ['disabler', 'initiator', 'ganker']),
  seedHero('dragon-knight', 'Dragon Knight', 'strength', 'melee', ['offlane'], ['durable', 'initiator']),
  seedHero('lion', 'Lion', 'intelligence', 'ranged', ['support', 'mid'], ['disabler', 'nuker', 'initiator']),
  seedHero('crystal-maiden', 'Crystal Maiden', 'intelligence', 'ranged', ['support', 'hard-support'], ['disabler', 'healer']),
  seedHero('witch-doctor', 'Witch Doctor', 'intelligence', 'ranged', ['hard-support'], ['healer', 'nuker']),
  seedHero('lich', 'Lich', 'intelligence', 'ranged', ['mid', 'support'], ['nuker', 'healer']),
  seedHero('lina', 'Lina', 'intelligence', 'ranged', ['mid', 'carry'], ['nuker', 'carry']),
  seedHero('tinker', 'Tinker', 'intelligence', 'ranged', ['mid'], ['pusher', 'nuker']),
  seedHero('sniper', 'Sniper', 'agility', 'ranged', ['carry'], ['carry']),
  seedHero('juggernaut', 'Juggernaut', 'agility', 'melee', ['carry', 'mid'], ['carry', 'escape']),
  seedHero('mirana', 'Mirana', 'agility', 'ranged', ['mid', 'support'], ['escape', 'initiator']),
];

export const SEED_ITEMS: ItemRecord[] = [
  seedItem('boots-of-speed', 'Boots of Speed', 'mobility', ['mobility']),
  seedItem('blink-dagger', 'Blink Dagger', 'mobility', ['initiation', 'mobility']),
  seedItem('black-king-bar', 'Black King Bar', 'defense', ['anti-disable', 'anti-magic']),
  seedItem('ghost-scepter', 'Ghost Scepter', 'defense', ['anti-magic', 'survivability']),
  seedItem('vanguard', 'Vanguard', 'defense', ['survivability']),
  seedItem('heart-of-tarrasque', 'Heart of Tarrasque', 'defense', ['survivability']),
  seedItem('mekansm', 'Mekansm', 'support', ['healing']),
  seedItem('magic-wand', 'Magic Wand', 'utility', ['healing', 'utility']),
  seedItem('healing-salve', 'Healing Salve', 'consumable', ['healing']),
  seedItem('divine-rapier', 'Divine Rapier', 'damage', ['core-damage']),
  seedItem('sheepstick', 'Sheepstick', 'disable', ['utility']),
  seedItem('town-portal-scroll', 'Town Portal Scroll', 'utility', ['utility']),
];
