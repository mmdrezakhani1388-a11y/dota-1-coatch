import { useSettings } from '@/context/useSettings';
import { useT } from '@/i18n/useT';
import { createId } from '@/lib/id';
import { GOALS_STORAGE_KEY, MATCHES_STORAGE_KEY, parseGoals, parseMatchRecords, type MatchDraft } from '@/types/dashboard';
import { usePersistentList } from '@/hooks/usePersistentList';
import { PageHeader } from '@/components/layout/PageHeader';
import { CoachIntroCard } from '@/components/dashboard/CoachIntroCard';
import { FavoriteHeroesPanel } from '@/components/dashboard/FavoriteHeroesPanel';
import { PlayerProfileCard } from '@/components/dashboard/PlayerProfileCard';
import { ProgressPanel } from '@/components/dashboard/ProgressPanel';
import { QuickAccessGrid } from '@/components/dashboard/QuickAccessGrid';
import { RecentMatchesPanel } from '@/components/dashboard/RecentMatchesPanel';

export function DashboardPage() {
  const t = useT();
  const { settings } = useSettings();
  const matches = usePersistentList(MATCHES_STORAGE_KEY, parseMatchRecords);
  const goals = usePersistentList(GOALS_STORAGE_KEY, parseGoals);
  const name = settings.playerName || t('common.player');
  const saveFailed = matches.saveFailed || goals.saveFailed;

  const addMatch = (draft: MatchDraft) => {
    matches.setItems((current) => [{ ...draft, id: createId(), createdAt: Date.now() }, ...current]);
  };

  return (
    <div className="space-y-8">
      <PageHeader title={t('dashboard.welcome', { name })} subtitle={t('dashboard.subtitle')} />

      {saveFailed && (
        <p role="alert" className="rounded-xl border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger">
          {t('dashboard.saveFailed')}
        </p>
      )}

      <div className="grid items-start gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <PlayerProfileCard matchCount={matches.items.length} />
          <QuickAccessGrid />
          <FavoriteHeroesPanel />
          <RecentMatchesPanel matches={matches.items} onAdd={addMatch} />
        </div>
        <div className="space-y-6">
          <CoachIntroCard />
          <ProgressPanel matchCount={matches.items.length} goals={goals.items} setGoals={goals.setItems} />
        </div>
      </div>
    </div>
  );
}
