import { useCurrentHash, hashSegments } from './routes';

export const KNOWLEDGE_TABS = ['heroes', 'items', 'abilities', 'recipes', 'data'] as const;
export type KnowledgeTab = (typeof KNOWLEDGE_TABS)[number];

export type KnowledgeRoute =
  | { kind: 'tab'; tab: KnowledgeTab }
  | { kind: 'hero'; id: string }
  | { kind: 'item'; id: string };

export function parseKnowledgeRoute(hash: string): KnowledgeRoute {
  const [, first = '', second = ''] = hashSegments(hash);
  if (first === 'hero' && second) return { kind: 'hero', id: second };
  if (first === 'item' && second) return { kind: 'item', id: second };
  const tab = (KNOWLEDGE_TABS as readonly string[]).includes(first) ? (first as KnowledgeTab) : 'heroes';
  return { kind: 'tab', tab };
}

export function knowledgeTabHref(tab: KnowledgeTab): string {
  return `#/knowledge/${tab}`;
}

export function heroHref(id: string): string {
  return `#/knowledge/hero/${encodeURIComponent(id)}`;
}

export function itemHref(id: string): string {
  return `#/knowledge/item/${encodeURIComponent(id)}`;
}

export function useKnowledgeRoute(): KnowledgeRoute {
  return parseKnowledgeRoute(useCurrentHash());
}
