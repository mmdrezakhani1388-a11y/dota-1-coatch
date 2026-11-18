export const MAP_IMAGE_PATH = '/assets/maps/allstarsmap.jpg';
export const MAP_ASPECT_RATIO = 512 / 435;

export interface TowerDef {
  id: string;
  x: number;
  y: number;
}

const TOWER_DEFS: TowerDef[] = [
  { id: 'T01', x: 0.2129, y: 0.1080 },
  { id: 'T02', x: 0.4941, y: 0.1080 },
  { id: 'T03', x: 0.1211, y: 0.3954 },
  { id: 'T04', x: 0.1230, y: 0.5701 },
  { id: 'T05', x: 0.4062, y: 0.5908 },
  { id: 'T06', x: 0.6426, y: 0.3862 },
  { id: 'T07', x: 0.5508, y: 0.5011 },
  { id: 'T08', x: 0.8633, y: 0.4943 },
  { id: 'T09', x: 0.8594, y: 0.6046 },
  { id: 'T10', x: 0.2852, y: 0.7034 },
  { id: 'T11', x: 0.4688, y: 0.9287 },
  { id: 'T12', x: 0.8008, y: 0.9103 },
];

export const TOWERS: TowerDef[] = TOWER_DEFS;

export interface HeroPosDef {
  id: string;
  x: number;
  y: number;
}

// 10 green hero positions. H01–H05 belong to the ally team, H06–H10 to the enemy team.
// H01/H02 and H09/H10 sit around the two red camps, H05/H06 are the MID positions.
const HERO_POS_DEFS: HeroPosDef[] = [
  { id: 'H01', x: 0.7988, y: 0.8207 },
  { id: 'H02', x: 0.8887, y: 0.8736 },
  { id: 'H03', x: 0.0859, y: 0.3195 },
  { id: 'H04', x: 0.1758, y: 0.3218 },
  { id: 'H05', x: 0.3477, y: 0.6483 },
  { id: 'H06', x: 0.5977, y: 0.4483 },
  { id: 'H07', x: 0.8008, y: 0.6989 },
  { id: 'H08', x: 0.8887, y: 0.6897 },
  { id: 'H09', x: 0.1211, y: 0.1471 },
  { id: 'H10', x: 0.2109, y: 0.1954 },
];

export const HERO_POSITIONS: HeroPosDef[] = HERO_POS_DEFS;

const ALLY_POS_IDS = new Set(['H01', 'H02', 'H03', 'H04', 'H05']);

export function heroPosTeam(posId: string): 'ally' | 'enemy' {
  return ALLY_POS_IDS.has(posId) ? 'ally' : 'enemy';
}

const FARM_DEFS: HeroPosDef[] = [
  { id: 'F01', x: 0.4375, y: 0.2184 },
  { id: 'F02', x: 0.2402, y: 0.5103 },
  { id: 'F03', x: 0.7344, y: 0.5011 },
  { id: 'F04', x: 0.5039, y: 0.7816 },
];

export const FARM_MARKERS: HeroPosDef[] = FARM_DEFS;

const ALLY_FARM_IDS = new Set(['F01', 'F02']);

export function farmTeam(farmId: string): 'ally' | 'enemy' {
  return ALLY_FARM_IDS.has(farmId) ? 'ally' : 'enemy';
}
