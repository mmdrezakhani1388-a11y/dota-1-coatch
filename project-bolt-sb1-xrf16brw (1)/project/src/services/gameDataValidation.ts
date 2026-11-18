import {
  ABILITY_KINDS,
  ATTACK_TYPES,
  ATTRIBUTES,
  DAMAGE_TYPES,
  DEFAULT_PATCH,
  FACTIONS,
  HERO_STAT_KEYS,
  HERO_TAGS,
  ITEM_CATEGORIES,
  ITEM_STAT_KEYS,
  ITEM_TAGS,
  MAP_ID,
  ROLES,
  SCHEMA_VERSION,
  VERIFICATION_STATUSES,
  type AbilityRecord,
  type EntityBase,
  type GameDatabase,
  type HeroRecord,
  type HeroStatKey,
  type ItemRecord,
  type ItemRecipeRecord,
  type ItemStatKey,
} from '@/data/gameDatabase/types';
import { asStringArray, asText, pickOptions } from '@/lib/validation';

export const ENTITY_KINDS = ['heroes', 'abilities', 'items', 'recipes'] as const;
export type EntityKind = (typeof ENTITY_KINDS)[number];

export type IssueCode =
  | 'notObject'
  | 'missingVersion'
  | 'incompatibleMap'
  | 'incompatiblePatch'
  | 'unsupportedSchema'
  | 'invalidRecord'
  | 'duplicateId'
  | 'unknownReference';

export interface ImportIssue {
  code: IssueCode;
  entity?: EntityKind;
  id?: string;
  detail?: string;
}

export interface ImportReport {
  database: GameDatabase | null;
  errors: ImportIssue[];
  warnings: ImportIssue[];
  counts: Record<EntityKind, number>;
  incompleteCounts: Record<EntityKind, number>;
}

type Raw = Record<string, unknown>;

const ID_PATTERN = /^[a-z0-9][a-z0-9-]{0,79}$/;
const EMPTY_COUNTS: Record<EntityKind, number> = { heroes: 0, abilities: 0, items: 0, recipes: 0 };

function isRecord(value: unknown): value is Raw {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function oneOf<T extends string>(value: unknown, options: readonly T[]): T | null {
  return typeof value === 'string' && (options as readonly string[]).includes(value) ? (value as T) : null;
}

function finiteNumber(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function optionalText(value: unknown): string | null {
  const text = asText(value, '', 2000);
  return text.length > 0 ? text : null;
}

function numberList(value: unknown): number[] | null {
  if (!Array.isArray(value) || value.length === 0) return null;
  const numbers = value.map(finiteNumber);
  return numbers.every((item): item is number => item !== null && item >= 0) ? numbers : null;
}

function parseBase(raw: Raw): EntityBase | null {
  const id = asText(raw.id, '', 80);
  if (!ID_PATTERN.test(id) || raw.patch !== DEFAULT_PATCH) return null;
  return {
    id,
    patch: DEFAULT_PATCH,
    source: asText(raw.source, 'Source not specified', 300),
    verification: oneOf(raw.verification, VERIFICATION_STATUSES) ?? 'unverified',
  };
}

function parseHero(raw: Raw): HeroRecord | null {
  const base = parseBase(raw);
  const name = asText(raw.name, '', 80);
  const primaryAttribute = oneOf(raw.primaryAttribute, ATTRIBUTES);
  const attackType = oneOf(raw.attackType, ATTACK_TYPES);
  if (!base || !name || !primaryAttribute || !attackType) return null;
  const statsRaw = isRecord(raw.stats) ? raw.stats : {};
  const stats = {} as Record<HeroStatKey, number | null>;
  for (const key of HERO_STAT_KEYS) {
    const value = finiteNumber(statsRaw[key]);
    stats[key] = value !== null && value >= 0 ? value : null;
  }
  return {
    ...base,
    name,
    faction: oneOf(raw.faction, FACTIONS),
    primaryAttribute,
    attackType,
    damage: oneOf(raw.damage, DAMAGE_TYPES),
    roles: pickOptions(raw.roles, ROLES),
    tags: pickOptions(raw.tags, HERO_TAGS),
    stats,
    abilityIds: asStringArray(raw.abilityIds, 50),
    description: optionalText(raw.description),
  };
}

function parseAbility(raw: Raw): AbilityRecord | null {
  const base = parseBase(raw);
  const name = asText(raw.name, '', 80);
  const heroId = asText(raw.heroId, '', 80);
  const kind = oneOf(raw.kind, ABILITY_KINDS);
  if (!base || !name || !heroId || !kind) return null;
  const levelValues: Record<string, number[]> = {};
  if (isRecord(raw.levelValues)) {
    for (const [key, value] of Object.entries(raw.levelValues)) {
      const list = numberList(value);
      if (list) levelValues[key.slice(0, 40)] = list;
    }
  }
  const castRange = finiteNumber(raw.castRange);
  return {
    ...base,
    heroId,
    name,
    kind,
    description: optionalText(raw.description),
    manaCost: numberList(raw.manaCost),
    cooldown: numberList(raw.cooldown),
    castRange: castRange !== null && castRange >= 0 ? castRange : null,
    levelValues,
    mechanics: asStringArray(raw.mechanics, 30),
  };
}

function parseItem(raw: Raw): ItemRecord | null {
  const base = parseBase(raw);
  const name = asText(raw.name, '', 80);
  const category = oneOf(raw.category, ITEM_CATEGORIES);
  if (!base || !name || !category) return null;
  const bonusesRaw = isRecord(raw.bonuses) ? raw.bonuses : {};
  const bonuses: Partial<Record<ItemStatKey, number>> = {};
  for (const key of ITEM_STAT_KEYS) {
    const value = finiteNumber(bonusesRaw[key]);
    if (value !== null) bonuses[key] = value;
  }
  const cost = finiteNumber(raw.cost);
  const cooldown = finiteNumber(raw.cooldown);
  return {
    ...base,
    name,
    category,
    tags: pickOptions(raw.tags, ITEM_TAGS),
    cost: cost !== null && cost >= 0 ? cost : null,
    bonuses,
    activeAbility: optionalText(raw.activeAbility),
    passiveEffects: asStringArray(raw.passiveEffects, 20),
    cooldown: cooldown !== null && cooldown >= 0 ? cooldown : null,
    description: optionalText(raw.description),
  };
}

function parseRecipe(raw: Raw): ItemRecipeRecord | null {
  const base = parseBase(raw);
  const resultItemId = asText(raw.resultItemId, '', 80);
  const componentItemIds = asStringArray(raw.componentItemIds, 6);
  if (!base || !resultItemId || componentItemIds.length === 0) return null;
  const cost = finiteNumber(raw.cost);
  return {
    ...base,
    resultItemId,
    componentItemIds,
    cost: cost !== null && cost >= 0 ? cost : null,
  };
}

function countMissingFields(record: Raw): number {
  return Object.values(record).reduce<number>((total, value) => {
    if (value === null || value === undefined) return total + 1;
    if (Array.isArray(value)) return value.length === 0 ? total + 1 : total;
    if (isRecord(value)) {
      const nulls = Object.values(value).filter((item) => item === null).length;
      return total + nulls + (Object.keys(value).length === 0 ? 1 : 0);
    }
    return total;
  }, 0);
}

function fail(code: IssueCode, detail?: string): ImportReport {
  return {
    database: null,
    errors: [{ code, detail }],
    warnings: [],
    counts: { ...EMPTY_COUNTS },
    incompleteCounts: { ...EMPTY_COUNTS },
  };
}

interface CollectionResult<T extends { id: string }> {
  records: T[];
  incomplete: number;
}

function readCollection<T extends { id: string }>(
  raw: Raw,
  key: string,
  entity: EntityKind,
  parse: (item: Raw) => T | null,
  seenIds: Set<string>,
  warnings: ImportIssue[],
): CollectionResult<T> {
  const list = raw[key];
  const records: T[] = [];
  let incomplete = 0;
  if (list === undefined) return { records, incomplete };
  if (!Array.isArray(list)) {
    warnings.push({ code: 'invalidRecord', entity, detail: 'collection is not a list' });
    return { records, incomplete };
  }
  for (const item of list) {
    const parsed = isRecord(item) ? parse(item) : null;
    if (!parsed) {
      const id = isRecord(item) && typeof item.id === 'string' ? item.id.slice(0, 80) : undefined;
      warnings.push({ code: 'invalidRecord', entity, id });
      continue;
    }
    if (seenIds.has(parsed.id)) {
      warnings.push({ code: 'duplicateId', entity, id: parsed.id });
      continue;
    }
    seenIds.add(parsed.id);
    if (countMissingFields(item) > 0) incomplete += 1;
    records.push(parsed);
  }
  return { records, incomplete };
}

export function validateGameDatabase(raw: unknown): ImportReport {
  if (!isRecord(raw)) return fail('notObject');
  if (!isRecord(raw.version)) return fail('missingVersion');
  const version = raw.version;
  if (version.mapId !== MAP_ID) return fail('incompatibleMap', typeof version.mapId === 'string' ? version.mapId : undefined);
  if (version.patch !== DEFAULT_PATCH) return fail('incompatiblePatch', typeof version.patch === 'string' ? version.patch : undefined);
  if (version.schemaVersion !== SCHEMA_VERSION) return fail('unsupportedSchema');

  const warnings: ImportIssue[] = [];
  const seenIds = new Set<string>();
  const heroes = readCollection(raw, 'heroes', 'heroes', parseHero, seenIds, warnings);
  const abilities = readCollection(raw, 'abilities', 'abilities', parseAbility, seenIds, warnings);
  const items = readCollection(raw, 'items', 'items', parseItem, seenIds, warnings);
  const recipes = readCollection(raw, 'recipes', 'recipes', parseRecipe, seenIds, warnings);

  const heroIds = new Set(heroes.records.map((hero) => hero.id));
  const itemIds = new Set(items.records.map((item) => item.id));
  const abilityIds = new Set(abilities.records.map((ability) => ability.id));

  for (const hero of heroes.records) {
    for (const abilityId of hero.abilityIds) {
      if (!abilityIds.has(abilityId)) warnings.push({ code: 'unknownReference', entity: 'heroes', id: hero.id, detail: abilityId });
    }
  }
  for (const ability of abilities.records) {
    if (!heroIds.has(ability.heroId)) warnings.push({ code: 'unknownReference', entity: 'abilities', id: ability.id, detail: ability.heroId });
  }
  for (const recipe of recipes.records) {
    const missing = [recipe.resultItemId, ...recipe.componentItemIds].find((id) => !itemIds.has(id));
    if (missing) warnings.push({ code: 'unknownReference', entity: 'recipes', id: recipe.id, detail: missing });
  }

  const database: GameDatabase = {
    version: {
      schemaVersion: SCHEMA_VERSION,
      mapId: MAP_ID,
      patch: DEFAULT_PATCH,
      dataVersion: asText(version.dataVersion, 'unversioned', 60),
    },
    heroes: heroes.records,
    abilities: abilities.records,
    items: items.records,
    recipes: recipes.records,
  };

  return {
    database,
    errors: [],
    warnings,
    counts: {
      heroes: heroes.records.length,
      abilities: abilities.records.length,
      items: items.records.length,
      recipes: recipes.records.length,
    },
    incompleteCounts: {
      heroes: heroes.incomplete,
      abilities: abilities.incomplete,
      items: items.incomplete,
      recipes: recipes.incomplete,
    },
  };
}

interface MergeResult<T extends { id: string }> {
  records: T[];
  added: number;
  updated: number;
}

function mergeCollection<T extends { id: string }>(current: T[], incoming: T[]): MergeResult<T> {
  const currentIds = new Set(current.map((record) => record.id));
  const incomingById = new Map(incoming.map((record) => [record.id, record]));
  const updated = current.filter((record) => incomingById.has(record.id)).length;
  const added = incoming.filter((record) => !currentIds.has(record.id)).length;
  const records = [
    ...current.map((record) => incomingById.get(record.id) ?? record),
    ...incoming.filter((record) => !currentIds.has(record.id)),
  ];
  return { records, added, updated };
}

export interface MergeSummary {
  database: GameDatabase;
  added: number;
  updated: number;
}

export function mergeGameDatabases(current: GameDatabase, incoming: GameDatabase): MergeSummary {
  const heroes = mergeCollection(current.heroes, incoming.heroes);
  const abilities = mergeCollection(current.abilities, incoming.abilities);
  const items = mergeCollection(current.items, incoming.items);
  const recipes = mergeCollection(current.recipes, incoming.recipes);
  return {
    database: {
      version: incoming.version,
      heroes: heroes.records,
      abilities: abilities.records,
      items: items.records,
      recipes: recipes.records,
    },
    added: heroes.added + abilities.added + items.added + recipes.added,
    updated: heroes.updated + abilities.updated + items.updated + recipes.updated,
  };
}
