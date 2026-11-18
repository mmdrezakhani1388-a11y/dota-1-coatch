import { useSyncExternalStore } from 'react';

export const SECTION_IDS = [
  'dashboard',
  'draft',
  'knowledge',
  'liveCoach',
  'training',
  'performance',
  'missions',
  'settings',
] as const;

export type SectionId = (typeof SECTION_IDS)[number];

const DEFAULT_SECTION: SectionId = 'dashboard';

export function isSectionId(value: string): value is SectionId {
  return (SECTION_IDS as readonly string[]).includes(value);
}

export function hashSegments(hash: string): string[] {
  return hash
    .replace(/^#\/?/, '')
    .split('/')
    .filter((segment) => segment.length > 0)
    .map((segment) => {
      try {
        return decodeURIComponent(segment);
      } catch {
        return segment;
      }
    });
}

export function sectionFromHash(hash: string): SectionId {
  const [id = ''] = hashSegments(hash);
  return isSectionId(id) ? id : DEFAULT_SECTION;
}

export function sectionHref(id: SectionId): string {
  return `#/${id}`;
}

function subscribeToHash(onChange: () => void) {
  window.addEventListener('hashchange', onChange);
  return () => window.removeEventListener('hashchange', onChange);
}

export function useCurrentHash(): string {
  return useSyncExternalStore(
    subscribeToHash,
    () => window.location.hash,
    () => '',
  );
}

export function useCurrentSection(): SectionId {
  return sectionFromHash(useCurrentHash());
}
