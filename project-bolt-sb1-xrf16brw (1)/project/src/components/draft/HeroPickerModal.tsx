import { useState } from 'react';
import { Coins, Repeat } from 'lucide-react';
import { useGameData } from '@/context/useGameData';
import { useT } from '@/i18n/useT';
import { ATTRIBUTE_KEYS, FACTION_KEYS } from '@/i18n/labels';
import { ATTRIBUTES, type Attribute, type HeroRecord } from '@/data/gameDatabase/types';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { chipClass, inputClass } from '@/components/ui/formControls';
import { HeroEmblem } from '@/components/knowledge/HeroEmblem';
import { cn } from '@/lib/cn';

type AttributeFilter = Attribute | 'all';

const ATTRIBUTE_FILTERS: AttributeFilter[] = ['all', ...ATTRIBUTES];
const FOCUS_RING = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-arcane/70';

interface SoloFarmControl {
  active: boolean;
  onToggle: () => void;
}

interface HeroPickerModalProps {
  currentHeroId: string | null;
  takenIds: ReadonlySet<string>;
  teamHeroes?: string[];
  teamLabel?: string;
  onSelect: (heroId: string) => void;
  onRemove?: () => void;
  soloFarm?: SoloFarmControl;
  onStartSwap?: () => void;
  onClose: () => void;
}

export function HeroPickerModal({
  currentHeroId,
  takenIds,
  teamHeroes,
  teamLabel,
  onSelect,
  onRemove,
  soloFarm,
  onStartSwap,
  onClose,
}: HeroPickerModalProps) {
  const t = useT();
  const { database } = useGameData();
  const [query, setQuery] = useState('');
  const [attribute, setAttribute] = useState<AttributeFilter>('all');

  const needle = query.trim().toLowerCase();
  // When teamHeroes is provided, only heroes picked for that team in the Draft Center are selectable.
  const heroes = database.heroes.filter(
    (hero) =>
      (!teamHeroes || teamHeroes.includes(hero.id)) &&
      (attribute === 'all' || hero.primaryAttribute === attribute) &&
      hero.name.toLowerCase().includes(needle),
  );

  return (
    <Modal open title={teamLabel ? `${t('draft.pickerTitle')} — ${teamLabel}` : t('draft.pickerTitle')} onClose={onClose}>
      <div className="space-y-5">
        <input
          type="search"
          value={query}
          placeholder={t('knowledge.searchHeroes')}
          aria-label={t('knowledge.searchHeroes')}
          onChange={(event) => setQuery(event.target.value)}
          className={inputClass}
        />

        <div role="group" aria-label={t('knowledge.filterAttribute')} className="flex flex-wrap gap-2">
          {ATTRIBUTE_FILTERS.map((value) => (
            <button
              key={value}
              type="button"
              aria-pressed={value === attribute}
              onClick={() => setAttribute(value)}
              className={cn(chipClass(value === attribute), FOCUS_RING)}
            >
              {value === 'all' ? t('draft.attributeAll') : t(ATTRIBUTE_KEYS[value])}
            </button>
          ))}
        </div>

        {onStartSwap && (
          <button
            type="button"
            onClick={onStartSwap}
            className={cn(
              'flex w-full items-center justify-center gap-2 rounded-xl border border-arcane/40 bg-arcane/10 px-3 py-2 text-sm font-medium text-arcane transition-colors hover:bg-arcane/20',
              FOCUS_RING,
            )}
          >
            <Repeat className="h-4 w-4" />
            {t('map.swap.pickTarget')}
          </button>
        )}

        {soloFarm && (
          <button
            type="button"
            aria-pressed={soloFarm.active}
            onClick={soloFarm.onToggle}
            className={cn(
              'flex w-full items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition-colors',
              soloFarm.active
                ? 'border-gold bg-gold/20 text-gold'
                : 'border-gold/40 bg-gold/10 text-gold hover:bg-gold/20',
              FOCUS_RING,
            )}
          >
            <Coins className="h-4 w-4" />
            {soloFarm.active ? t('map.soloFarmOff') : t('map.soloFarmOn')}
          </button>
        )}

        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className={cn(
              'w-full rounded-xl border border-danger/40 bg-danger/10 px-3 py-2 text-sm font-medium text-danger transition-colors hover:bg-danger/20',
              FOCUS_RING,
            )}
          >
            {t('map.removeHero')}
          </button>
        )}
        {heroes.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted">{t('draft.noHeroResults')}</p>
        ) : (
          <ul className="grid gap-2 sm:grid-cols-2">
            {heroes.map((hero) => (
              <PickerOption
                key={hero.id}
                hero={hero}
                current={hero.id === currentHeroId}
                taken={takenIds.has(hero.id)}
                onSelect={() => onSelect(hero.id)}
              />
            ))}
          </ul>
        )}
      </div>
    </Modal>
  );
}

function PickerOption({
  hero,
  current,
  taken,
  onSelect,
}: {
  hero: HeroRecord;
  current: boolean;
  taken: boolean;
  onSelect: () => void;
}) {
  const t = useT();

  return (
    <li>
      <button
        type="button"
        disabled={taken}
        aria-pressed={current}
        onClick={onSelect}
        className={cn(
          'flex w-full items-center gap-3 rounded-xl border bg-panel p-3 text-start transition-colors hover:border-gold/50',
          'disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:border-line',
          FOCUS_RING,
          current ? 'border-gold bg-gold/10' : 'border-line',
        )}
      >
        <HeroEmblem name={hero.name} attribute={hero.primaryAttribute} />
        <div className="min-w-0 flex-1 space-y-1">
          <p className="truncate font-display font-semibold text-ink">{hero.name}</p>
          <p className="text-xs text-muted">
            {hero.faction ? t(FACTION_KEYS[hero.faction]) : t('draft.factionUnknown')} · {t(ATTRIBUTE_KEYS[hero.primaryAttribute])}
          </p>
        </div>
        {current ? (
          <Badge tone="gold">{t('draft.currentHero')}</Badge>
        ) : taken ? (
          <Badge>{t('draft.takenHero')}</Badge>
        ) : null}
      </button>
    </li>
  );
}
