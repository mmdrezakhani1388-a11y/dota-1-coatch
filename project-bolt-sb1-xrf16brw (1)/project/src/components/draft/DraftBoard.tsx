import { useState } from 'react';
import { FACTIONS } from '@/data/gameDatabase/types';
import { useT } from '@/i18n/useT';
import { FACTION_KEYS } from '@/i18n/labels';
import { Card } from '@/components/ui/Card';
import { chipClass } from '@/components/ui/formControls';
import { cn } from '@/lib/cn';
import { PLAYER_SLOT_INDEX, enemyFactionOf, type DraftMatch, type TeamSide } from '@/types/draft';
import { DraftTeamPanel } from './DraftTeamPanel';
import { HeroPickerModal } from './HeroPickerModal';

interface PickTarget {
  team: TeamSide;
  slot: number;
}

const FOCUS_RING = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-arcane/70';

export function DraftBoard({ match, onChange }: { match: DraftMatch; onChange: (next: DraftMatch) => void }) {
  const t = useT();
  const [target, setTarget] = useState<PickTarget | null>(null);

  const enemyFaction = enemyFactionOf(match.allyFaction);
  const slotsOf = (team: TeamSide) => (team === 'ally' ? match.allyHeroes : match.enemyHeroes);
  const pickedIds = [...match.allyHeroes, ...match.enemyHeroes].filter((id): id is string => id !== null);

  const setSlot = (team: TeamSide, slot: number, heroId: string | null) => {
    if (heroId !== null && pickedIds.includes(heroId)) return;
    const slots = [...slotsOf(team)];
    slots[slot] = heroId;
    onChange(team === 'ally' ? { ...match, allyHeroes: slots } : { ...match, enemyHeroes: slots });
  };

  const selectHero = (heroId: string) => {
    if (target) setSlot(target.team, target.slot, heroId);
    setTarget(null);
  };

  const currentHeroId = target ? slotsOf(target.team)[target.slot] : null;
  const takenIds = new Set(pickedIds.filter((id) => id !== currentHeroId));

  return (
    <div className="space-y-6">
      <Card title={t('draft.factionTitle')} description={t('draft.factionHint')}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div role="group" aria-label={t('draft.factionTitle')} className="flex flex-wrap gap-2">
            {FACTIONS.map((faction) => {
              const active = match.allyFaction === faction;
              return (
                <button
                  key={faction}
                  type="button"
                  aria-pressed={active}
                  onClick={() => onChange({ ...match, allyFaction: faction })}
                  className={cn(chipClass(active), FOCUS_RING)}
                >
                  {t(FACTION_KEYS[faction])}
                </button>
              );
            })}
          </div>
          <p className="text-sm text-muted">
            {t('draft.enemyFaction')}:{' '}
            <span className="font-medium text-ink">
              {enemyFaction ? t(FACTION_KEYS[enemyFaction]) : t('draft.factionUnset')}
            </span>
          </p>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <DraftTeamPanel
          title={t('draft.allyTeam')}
          faction={match.allyFaction}
          slots={match.allyHeroes}
          playerSlot={PLAYER_SLOT_INDEX}
          onPick={(slot) => setTarget({ team: 'ally', slot })}
          onClear={(slot) => setSlot('ally', slot, null)}
        />
        <DraftTeamPanel
          title={t('draft.enemyTeam')}
          faction={enemyFaction}
          slots={match.enemyHeroes}
          onPick={(slot) => setTarget({ team: 'enemy', slot })}
          onClear={(slot) => setSlot('enemy', slot, null)}
        />
      </div>

      {target && (
        <HeroPickerModal
          currentHeroId={currentHeroId}
          takenIds={takenIds}
          onSelect={selectHero}
          onClose={() => setTarget(null)}
        />
      )}
    </div>
  );
}
