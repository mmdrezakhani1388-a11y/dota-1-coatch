import { Plus, X } from 'lucide-react';
import { useGameData } from '@/context/useGameData';
import { useT } from '@/i18n/useT';
import { ATTRIBUTE_KEYS, FACTION_KEYS } from '@/i18n/labels';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { HeroEmblem } from '@/components/knowledge/HeroEmblem';
import { cn } from '@/lib/cn';

const FOCUS_RING = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-arcane/70';

interface DraftSlotProps {
  number: number;
  heroId: string | null;
  isPlayer: boolean;
  highlighted?: boolean;
  onPick?: () => void;
  onClear?: () => void;
  onActivate?: () => void;
}

export function DraftSlot({ number, heroId, isPlayer, highlighted = false, onPick, onClear, onActivate }: DraftSlotProps) {
  const t = useT();
  const { index } = useGameData();
  const hero = heroId === null ? undefined : index.heroById.get(heroId);

  const content = hero ? (
    <>
      <HeroEmblem name={hero.name} attribute={hero.primaryAttribute} />
      <div className="min-w-0 space-y-1">
        <p className="truncate font-display font-semibold text-ink">{hero.name}</p>
        <p className="text-sm text-muted">
          {hero.faction ? t(FACTION_KEYS[hero.faction]) : t('draft.factionUnknown')} · {t(ATTRIBUTE_KEYS[hero.primaryAttribute])}
        </p>
      </div>
    </>
  ) : heroId !== null ? (
    <p className="text-sm text-danger">{t('draft.unknownHero')}</p>
  ) : onPick ? (
    <button
      type="button"
      onClick={onPick}
      className={cn(
        'flex flex-1 items-center gap-3 rounded-lg border border-dashed border-line px-4 py-3 text-muted transition-colors hover:border-gold/60 hover:text-gold',
        FOCUS_RING,
      )}
    >
      <Plus className="h-4 w-4 shrink-0" />
      {t('draft.emptySlot')}
    </button>
  ) : null;

  const body = (
    <>
      <span className="w-14 shrink-0 text-xs font-medium text-muted">{t('draft.slot', { number })}</span>
      {content}
    </>
  );

  return (
    <li
      className={cn(
        'flex flex-col gap-3 rounded-xl border p-3 transition-colors sm:flex-row sm:items-center',
        isPlayer ? 'border-gold bg-gold/10 shadow-[0_0_24px_rgb(var(--c-gold)/0.15)]' : 'border-line bg-panel',
        highlighted && 'ring-2 ring-arcane/70',
      )}
    >
      {onActivate ? (
        <button
          type="button"
          onClick={onActivate}
          aria-pressed={highlighted}
          className={cn('flex min-w-0 flex-1 items-center gap-3 rounded-lg text-start transition-colors hover:text-ink', FOCUS_RING)}
        >
          {body}
        </button>
      ) : (
        <div className="flex min-w-0 flex-1 items-center gap-3">{body}</div>
      )}

      <div className="flex items-center gap-2 sm:justify-end">
        {isPlayer && <Badge tone="gold">{t('draft.you')}</Badge>}
        {heroId !== null && onPick && (
          <Button variant="secondary" size="sm" onClick={onPick}>
            {t('draft.changeHero')}
          </Button>
        )}
        {heroId !== null && onClear && (
          <Button variant="ghost" size="sm" onClick={onClear} aria-label={t('draft.removeHero')}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </li>
  );
}
