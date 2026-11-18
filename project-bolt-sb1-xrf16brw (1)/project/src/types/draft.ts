import { FACTIONS, type Faction } from '@/data/gameDatabase/types';
import { createId } from '@/lib/id';
import { asText } from '@/lib/validation';

export const DRAFT_MATCHES_STORAGE_KEY = 'dota-ai-coach.draftMatches';
export const TEAM_SIZE = 5;
export const PLAYER_SLOT_INDEX = 2;
export const PREGAME_TIMER_MS = 60_000;
export const UNDO_WINDOW_MS = 10_000;

export const DRAFT_STAGES = ['draft', 'pregame', 'locked', 'live', 'exited'] as const;
export type DraftStage = (typeof DRAFT_STAGES)[number];

export type TeamSide = 'ally' | 'enemy';
export type TeamSlots = (string | null)[];

export type TowerStatus = 'alive' | 'destroyed';
export interface TowerState {
  id: string;
  status: TowerStatus;
}

export type HeroPosAssignments = Record<string, string | null>;

// Map farm marker id (F01–F04) to the hero id currently assigned solo farm on it.
export type FarmAssignments = Record<string, string | null>;

export interface MatchMapState {
  heroPositions: HeroPosAssignments;
  towerStates: TowerState[];
  farmAssignments?: FarmAssignments;
}

export interface DraftMatch {
  id: string;
  createdAt: number;
  stage: DraftStage;
  confirmedAt: number | null;
  liveEnteredAt: number | null;
  allyFaction: Faction | null;
  allyHeroes: TeamSlots;
  enemyHeroes: TeamSlots;
  mapState: MatchMapState | null;
}

export function enemyFactionOf(allyFaction: Faction | null): Faction | null {
  if (allyFaction === null) return null;
  return allyFaction === 'sentinel' ? 'scourge' : 'sentinel';
}

function emptySlots(): TeamSlots {
  return Array.from({ length: TEAM_SIZE }, (): null => null);
}

export function createDraftMatch(): DraftMatch {
  return {
    id: createId(),
    createdAt: Date.now(),
    stage: 'draft',
    confirmedAt: null,
    liveEnteredAt: null,
    allyFaction: null,
    allyHeroes: emptySlots(),
    enemyHeroes: emptySlots(),
    mapState: null,
  };
}

export function isDraftComplete(match: DraftMatch): boolean {
  return [...match.allyHeroes, ...match.enemyHeroes].every((heroId) => heroId !== null);
}

function parseSlots(raw: unknown): TeamSlots | null {
  if (!Array.isArray(raw) || raw.length !== TEAM_SIZE) return null;
  return raw.map((value) => (typeof value === 'string' && value.length > 0 && value.length <= 80 ? value : null));
}

const HERO_POS_ID_RE = /^H(0[1-9]|10)$/;
const FARM_ID_RE = /^F(0[1-4])$/;

function parseHeroPositions(raw: unknown): HeroPosAssignments {
  const result: HeroPosAssignments = {};
  if (typeof raw !== 'object' || raw === null) return result;
  const source = raw as Record<string, unknown>;
  for (const key of Object.keys(source)) {
    if (!HERO_POS_ID_RE.test(key)) continue;
    const val = source[key];
    if (typeof val === 'string' && val.length > 0 && val.length <= 80) result[key] = val;
  }
  return result;
}

function parseTowerStates(raw: unknown): TowerState[] {
  if (!Array.isArray(raw)) return [];
  const states: TowerState[] = [];
  for (const entry of raw) {
    if (typeof entry !== 'object' || entry === null) continue;
    const e = entry as Record<string, unknown>;
    const id = typeof e.id === 'string' ? e.id : null;
    const status = e.status === 'alive' || e.status === 'destroyed' ? e.status : null;
    if (id && status) states.push({ id, status });
  }
  return states;
}

function parseFarmAssignments(raw: unknown): FarmAssignments {
  const result: FarmAssignments = {};
  if (typeof raw !== 'object' || raw === null) return result;
  const source = raw as Record<string, unknown>;
  for (const key of Object.keys(source)) {
    if (!FARM_ID_RE.test(key)) continue;
    const val = source[key];
    if (typeof val === 'string' && val.length > 0 && val.length <= 80) result[key] = val;
  }
  return result;
}

function parseMapState(raw: unknown): MatchMapState | null {
  if (typeof raw !== 'object' || raw === null) return null;
  const source = raw as Record<string, unknown>;
  const heroPositions = parseHeroPositions(source.heroPositions);
  const towerStates = parseTowerStates(source.towerStates);
  const farmAssignments = parseFarmAssignments(source.farmAssignments);
  if (
    Object.keys(heroPositions).length === 0 &&
    towerStates.length === 0 &&
    Object.keys(farmAssignments).length === 0
  )
    return null;
  return { heroPositions, towerStates, farmAssignments };
}

function parseDraftMatch(raw: unknown): DraftMatch | null {
  if (typeof raw !== 'object' || raw === null) return null;
  const source = raw as Record<string, unknown>;
  const id = asText(source.id, '', 80);
  const allyHeroes = parseSlots(source.allyHeroes);
  const enemyHeroes = parseSlots(source.enemyHeroes);
  if (!id || !allyHeroes || !enemyHeroes) return null;

  const requestedStage = DRAFT_STAGES.find((stage) => stage === source.stage) ?? 'draft';
  const confirmedAt = typeof source.confirmedAt === 'number' ? source.confirmedAt : null;
  const liveEnteredAt = typeof source.liveEnteredAt === 'number' ? source.liveEnteredAt : null;
  const complete = [...allyHeroes, ...enemyHeroes].every((heroId) => heroId !== null);
  const mapState = parseMapState(source.mapState);
  const afterLock = requestedStage === 'locked' || requestedStage === 'live';
  let stage: DraftStage = requestedStage;
  if (!complete) stage = 'draft';
  else if (afterLock && confirmedAt === null) stage = 'pregame';

  return {
    id,
    createdAt: typeof source.createdAt === 'number' ? source.createdAt : 0,
    stage,
    confirmedAt,
    liveEnteredAt,
    allyFaction: FACTIONS.find((faction) => faction === source.allyFaction) ?? null,
    allyHeroes,
    enemyHeroes,
    mapState,
  };
}

export function parseDraftMatches(raw: unknown): DraftMatch[] {
  if (!Array.isArray(raw)) return [];
  return raw.map(parseDraftMatch).filter((match): match is DraftMatch => match !== null);
}
