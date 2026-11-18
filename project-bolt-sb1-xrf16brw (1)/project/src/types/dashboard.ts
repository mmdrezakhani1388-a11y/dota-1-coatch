import { ROLES, type Role } from '@/data/gameDatabase/types';
import { asText } from '@/lib/validation';

export const MATCHES_STORAGE_KEY = 'dota-ai-coach.matches';
export const GOALS_STORAGE_KEY = 'dota-ai-coach.goals';

export const MATCH_RESULTS = ['win', 'loss'] as const;
export type MatchResult = (typeof MATCH_RESULTS)[number];

export interface MatchRecord {
  id: string;
  heroId: string;
  role: Role;
  result: MatchResult;
  playedOn: string;
  notes: string;
  createdAt: number;
}

export type MatchDraft = Omit<MatchRecord, 'id' | 'createdAt'>;

export interface Goal {
  id: string;
  text: string;
  completed: boolean;
}

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function parseMatchRecord(raw: unknown): MatchRecord | null {
  if (typeof raw !== 'object' || raw === null) return null;
  const source = raw as Record<string, unknown>;
  const id = asText(source.id, '', 80);
  const heroId = asText(source.heroId, '', 80);
  const role = ROLES.find((candidate) => candidate === source.role);
  const result = MATCH_RESULTS.find((candidate) => candidate === source.result);
  const playedOn = typeof source.playedOn === 'string' && ISO_DATE_PATTERN.test(source.playedOn) ? source.playedOn : '';
  if (!id || !heroId || !role || !result || !playedOn) return null;
  return {
    id,
    heroId,
    role,
    result,
    playedOn,
    notes: asText(source.notes, '', 500),
    createdAt: typeof source.createdAt === 'number' ? source.createdAt : 0,
  };
}

export function parseMatchRecords(raw: unknown): MatchRecord[] {
  if (!Array.isArray(raw)) return [];
  return raw.map(parseMatchRecord).filter((match): match is MatchRecord => match !== null);
}

function parseGoal(raw: unknown): Goal | null {
  if (typeof raw !== 'object' || raw === null) return null;
  const source = raw as Record<string, unknown>;
  const id = asText(source.id, '', 80);
  const text = asText(source.text, '', 200);
  if (!id || !text) return null;
  return { id, text, completed: source.completed === true };
}

export function parseGoals(raw: unknown): Goal[] {
  if (!Array.isArray(raw)) return [];
  return raw.map(parseGoal).filter((goal): goal is Goal => goal !== null);
}
