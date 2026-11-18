import {
  BarChart3,
  BookOpen,
  GraduationCap,
  LayoutDashboard,
  MessageSquareText,
  Settings,
  Swords,
  Trophy,
  type LucideIcon,
} from 'lucide-react';
import type { MessageKey } from '@/i18n/en';
import type { SectionId } from './routes';

export interface SectionDefinition {
  id: SectionId;
  labelKey: MessageKey;
  bodyKey: MessageKey;
  icon: LucideIcon;
  available: boolean;
}

export const SECTIONS: readonly SectionDefinition[] = [
  { id: 'dashboard', labelKey: 'nav.dashboard', bodyKey: 'section.dashboard', icon: LayoutDashboard, available: true },
  { id: 'draft', labelKey: 'nav.draft', bodyKey: 'section.draft', icon: Swords, available: true },
  { id: 'knowledge', labelKey: 'nav.knowledge', bodyKey: 'section.knowledge', icon: BookOpen, available: true },
  { id: 'liveCoach', labelKey: 'nav.liveCoach', bodyKey: 'section.liveCoach', icon: MessageSquareText, available: false },
  { id: 'training', labelKey: 'nav.training', bodyKey: 'section.training', icon: GraduationCap, available: false },
  { id: 'performance', labelKey: 'nav.performance', bodyKey: 'section.performance', icon: BarChart3, available: false },
  { id: 'missions', labelKey: 'nav.missions', bodyKey: 'section.missions', icon: Trophy, available: false },
  { id: 'settings', labelKey: 'nav.settings', bodyKey: 'section.settings', icon: Settings, available: true },
];

export function getSection(id: SectionId): SectionDefinition {
  const section = SECTIONS.find((candidate) => candidate.id === id);
  if (!section) throw new Error(`Unknown section: ${id}`);
  return section;
}
