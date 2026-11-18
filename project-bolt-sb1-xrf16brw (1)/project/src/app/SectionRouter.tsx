import type { SectionId } from './routes';
import { DashboardPage } from '@/pages/DashboardPage';
import { DraftPage } from '@/pages/DraftPage';
import { KnowledgePage } from '@/pages/KnowledgePage';
import { PlannedPage } from '@/pages/PlannedPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { getSection } from './sectionRegistry';

export function SectionRouter({ id }: { id: SectionId }) {
  switch (id) {
    case 'dashboard':
      return <DashboardPage />;
    case 'draft':
      return <DraftPage />;
    case 'knowledge':
      return <KnowledgePage />;
    case 'settings':
      return <SettingsPage />;
    default:
      return <PlannedPage section={getSection(id)} />;
  }
}
