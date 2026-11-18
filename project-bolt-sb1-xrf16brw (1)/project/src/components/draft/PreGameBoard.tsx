import { ArrowLeftRight, Lock, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import { useT } from '@/i18n/useT';
import { FACTION_KEYS } from '@/i18n/labels';
import { buttonClass } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/cn';
import { PLAYER_SLOT_INDEX, enemyFactionOf, type DraftMatch, type TeamSide, type TeamSlots } from '@/types/draft';
import { DraftTeamPanel } from './DraftTeamPanel';
import { HeroPickerModal } from './HeroPickerModal';

type ActionMode = 'swap' | 'wrong';

const TOGGLE_BASE =
  'inline-flex h-10 items-center justify-center gap-2 rounded-lg border px-4 text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-arcane/70 disabled:pointer-events-none disabled:opacity-50';

function toggleClass(active: boolean): string {
  return cn(
    TOGGLE_BASE,
    active ? 'border-gold bg-gold/15 text-gold' : 'border-line bg-card text-ink hover:border-gold/60 hover:text-gold',
  );
}

interface WrongChoiceTarget {
  team: TeamSide;
  slot: number;
}

export function PreGameBoard({
  match,
  locked,
  onChange,
  onConfirm,
}: {
  match: DraftMatch;
  locked: boolean;
  onChange: (next: DraftMatch) => void;
  onConfirm: () => void;
}) {
  const t = useT();
  const [mode, setMode] = useState<ActionMode | null>(null);
  const [swapFirst, setSwapFirst] = useState<number | null>(null);
  const [wrongTarget, setWrongTarget] = useState<WrongChoiceTarget | null>(null);

  const enemyFaction = enemyFactionOf(match.allyFaction);
  const slotsOf = (team: TeamSide): TeamSlots => (team === 'ally' ? match.allyHeroes : match.enemyHeroes);
  const pickedIds = [...match.allyHeroes, ...match.enemyHeroes].filter((id): id is string => id !== null);
  const replacedHeroId = wrongTarget ? slotsOf(wrongTarget.team)[wrongTarget.slot] : null;
  const takenIds = new Set(pickedIds.filter((id) => id !== replacedHeroId));

  const replaceHero = (team: TeamSide, slot: number, heroId: string) => {
    if (pickedIds.includes(heroId)) return;
    const slots = [...slotsOf(team)];
    slots[slot] = heroId;
    onChange(team === 'ally' ? { ...match, allyHeroes: slots } : { ...match, enemyHeroes: slots });
  };

  const swapAllySlots = (first: number, second: number) => {
    const slots = [...match.allyHeroes];
    [slots[first], slots[second]] = [slots[second], slots[first]];
    onChange({ ...match, allyHeroes: slots });
  };

  const toggleMode = (next: ActionMode) => {
    setSwapFirst(null);
    setMode((current) => (current === next ? null : next));
  };

  const handleAllyActivate = (slot: number) => {
    if (mode === 'wrong') {
      setWrongTarget({ team: 'ally', slot });
      return;
    }
    if (swapFirst === slot) {
      setSwapFirst(null);
      return;
    }
    if (swapFirst === null) {
      setSwapFirst(slot);
      return;
    }
    swapAllySlots(swapFirst, slot);
    setSwapFirst(null);
    setMode(null);
  };

  const handleEnemyActivate = (slot: number) => {
    setWrongTarget({ team: 'enemy', slot });
  };

  const allyActivatable = !locked && mode !== null;
  const enemyActivatable = !locked && mode === 'wrong';

  return (
    <div className="space-y-6">
      <Card title={t('pregame.actions')} description={t('pregame.actionsHint')}>
        <div className="flex flex-col gap-4">
          <div role="group" aria-label={t('pregame.actions')} className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              disabled={locked}
              aria-pressed={mode === 'swap'}
              onClick={() => toggleMode('swap')}
              className={toggleClass(mode === 'swap')}
            >
              <ArrowLeftRight className="h-4 w-4" />
              {t('pregame.swap')}
            </button>
            <button
              type="button"
              disabled={locked}
              aria-pressed={mode === 'wrong'}
              onClick={() => toggleMode('wrong')}
              className={toggleClass(mode === 'wrong')}
            >
              <RotateCcw className="h-4 w-4" />
              {t('pregame.wrongChoice')}
            </button>
            <button type="button" disabled={locked} onClick={onConfirm} className={cn(buttonClass('primary'), 'h-10 px-5 text-sm')}>
              <Lock className="h-4 w-4" />
              {t('pregame.pickCorrect')}
            </button>
          </div>
          {locked ? (
            <p className="rounded-xl border border-gold/40 bg-gold/10 px-4 py-3 text-sm text-gold">{t('pregame.locked')}</p>
          ) : mode === 'swap' ? (
            <p className="text-sm text-muted">{t('pregame.swapHint')}</p>
          ) : mode === 'wrong' ? (
            <p className="text-sm text-muted">{t('pregame.wrongHint')}</p>
          ) : null}
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <DraftTeamPanel
          title={t('draft.allyTeam')}
          faction={match.allyFaction}
          slots={match.allyHeroes}
          playerSlot={PLAYER_SLOT_INDEX}
          highlightedSlot={mode === 'swap' ? swapFirst : null}
          onActivate={allyActivatable ? handleAllyActivate : undefined}
        />
        <DraftTeamPanel
          title={t('draft.enemyTeam')}
          faction={enemyFaction}
          slots={match.enemyHeroes}
          onActivate={enemyActivatable ? handleEnemyActivate : undefined}
        />
      </div>

      {wrongTarget && (
        <HeroPickerModal
          currentHeroId={replacedHeroId}
          takenIds={takenIds}
          onSelect={(heroId) => {
            replaceHero(wrongTarget.team, wrongTarget.slot, heroId);
            setWrongTarget(null);
          }}
          onClose={() => setWrongTarget(null)}
        />
      )}
    </div>
  );
}
