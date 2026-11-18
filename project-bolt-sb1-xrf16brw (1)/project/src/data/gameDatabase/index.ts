import { DEFAULT_PATCH, MAP_ID, SCHEMA_VERSION, type GameDatabase, type HeroRecord, type ItemRecord, type AbilityRecord } from './types';
import { SEED_HEROES, SEED_ITEMS } from './seed';

export * from './types';

export const DEFAULT_GAME_DATABASE: GameDatabase = {
  version: {
    schemaVersion: SCHEMA_VERSION,
    mapId: MAP_ID,
    patch: DEFAULT_PATCH,
    dataVersion: '0.1.0-builtin',
  },
  heroes: SEED_HEROES,
  abilities: [],
  items: SEED_ITEMS,
  recipes: [],
};

export interface GameDatabaseIndex {
  heroById: Map<string, HeroRecord>;
  itemById: Map<string, ItemRecord>;
  abilityById: Map<string, AbilityRecord>;
}

export function indexGameDatabase(database: GameDatabase): GameDatabaseIndex {
  return {
    heroById: new Map(database.heroes.map((hero) => [hero.id, hero])),
    itemById: new Map(database.items.map((item) => [item.id, item])),
    abilityById: new Map(database.abilities.map((ability) => [ability.id, ability])),
  };
}
