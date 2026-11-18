import { GitCompareArrows, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useGameData } from '@/context/useGameData';
import { useT } from '@/i18n/useT';
import { ATTRIBUTE_KEYS, FACTION_KEYS, ROLE_KEYS } from '@/i18n/labels';
import { ATTRIBUTES, FACTIONS, type Attribute, type Faction, type HeroRecord } from '@/data/gameDatabase/types';
import { heroHref } from '@/app/knowledgeRoute';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { chipClass, inputClass } from '@/components/ui/formControls';
import { cn } from '@/lib/cn';
import { HeroComparison } from './HeroComparison';
import { HeroEmblem } from './HeroEmblem';

const COMPARE_LIMIT = 2;
const FOCUS_RING = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-arcane/70';

type FactionFilter = Faction | 'all';
const FACTION_FILTERS: FactionFilter[] = ['all', ...FACTIONS];

function isConfirmed(hero: HeroRecord): hero is HeroRecord & { faction: Faction } {
  return hero.verification === 'verified' && hero.faction !== null;
}

export function HeroCatalog() {
  const t = useT();
  const { database, index } = useGameData();
  const [query, setQuery] = useState('');
  const [factionFilter, setFactionFilter] = useState<FactionFilter>('all');
  const [attribute, setAttribute] = useState<Attribute>('strength');
  const [compareIds, setCompareIds] = useState<string[]>([]);

  const confirmedHeroes = useMemo(() => database.heroes.filter(isConfirmed), [database.heroes]);

  const factionCounts = useMemo(() => {
    const counts = Object.fromEntries(FACTIONS.map((value) => [value, 0])) as Record<Faction, number>;
    for (const hero of confirmedHeroes) counts[hero.faction] += 1;
    return counts;
  }, [confirmedHeroes]);

  const attributeCounts = useMemo(() => {
    const counts = Object.fromEntries(ATTRIBUTES.map((value) => [value, 0])) as Record<Attribute, number>;
    for (const hero of confirmedHeroes) {
      if (factionFilter === 'all' || hero.faction === factionFilter) counts[hero.primaryAttribute] += 1;
    }
    return counts;
  }, [confirmedHeroes, factionFilter]);

  const needle = query.trim().toLowerCase();
  const matchesQuery = (hero: HeroRecord) => hero.name.toLowerCase().includes(needle);
  const matchesFaction = (hero: HeroRecord) => factionFilter === 'all' || hero.faction === factionFilter;

  const groupHeroes = confirmedHeroes.filter(
    (hero) => hero.primaryAttribute === attribute && matchesFaction(hero) && matchesQuery(hero),
  );

  const unverifiedHeroes =
    factionFilter === 'all' ? database.heroes.filter((hero) => !isConfirmed(hero) && matchesQuery(hero)) : [];

  const toggleCompare = (id: string) => {
    setCompareIds((current) => {
      if (current.includes(id)) return current.filter((item) => item !== id);
      return [...current, id].slice(-COMPARE_LIMIT);
    });
  };

  const compared = compareIds
    .map((id) => index.heroById.get(id))
    .filter((hero): hero is HeroRecord => hero !== undefined);

  if (database.heroes.length === 0) {
    return (
      <EmptyState
        icon={GitCompareArrows}
        title={t('knowledge.noHeroes')}
        body={t('knowledge.noHeroesBody')}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2" role="group" aria-label={t('knowledge.filterFaction')}>
        {FACTION_FILTERS.map((value) => {
          const active = value === factionFilter;
          const count = value === 'all' ? confirmedHeroes.length : factionCounts[value];
          return (
            <button
              key={value}
              type="button"
              aria-pressed={active}
              onClick={() => setFactionFilter(value)}
              className={cn(chipClass(active), FOCUS_RING)}
            >
              {value === 'all' ? t('knowledge.factionAll') : t(FACTION_KEYS[value])}
              <span className="ms-2 rounded-md bg-panel px-1.5 text-xs text-muted">{count}</span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div role="tablist" aria-label={t('knowledge.filterAttribute')} className="flex flex-wrap gap-2">
          {ATTRIBUTES.map((value) => {
            const active = value === attribute;
            return (
              <button
                key={value}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setAttribute(value)}
                className={cn(chipClass(active), FOCUS_RING)}
              >
                {t(ATTRIBUTE_KEYS[value])}
                <span className="ms-2 rounded-md bg-panel px-1.5 text-xs text-muted">{attributeCounts[value]}</span>
              </button>
            );
          })}
        </div>
        <input
          type="search"
          value={query}
          placeholder={t('knowledge.searchHeroes')}
          aria-label={t('knowledge.searchHeroes')}
          onChange={(event) => setQuery(event.target.value)}
          className={cn(inputClass, 'lg:max-w-xs')}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted">
        <span>{t('knowledge.resultsCount', { count: groupHeroes.length, total: attributeCounts[attribute] })}</span>
        <span>{compareIds.length === 0 ? t('knowledge.compareHint') : t('knowledge.compareSelected', { count: compareIds.length, max: COMPARE_LIMIT })}</span>
      </div>

      {groupHeroes.length === 0 ? (
        <p className="py-10 text-center text-sm text-muted">{t('knowledge.noResults')}</p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {groupHeroes.map((hero) => (
            <HeroCard
              key={hero.id}
              hero={hero}
              selected={compareIds.includes(hero.id)}
              onToggleCompare={() => toggleCompare(hero.id)}
            />
          ))}
        </ul>
      )}

      {unverifiedHeroes.length > 0 && (
        <section className="space-y-4">
          <div className="space-y-1">
            <h2 className="font-display text-lg font-semibold text-ink">{t('knowledge.unverifiedTitle')}</h2>
            <p className="text-sm text-muted">{t('knowledge.unverifiedBody')}</p>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {unverifiedHeroes.map((hero) => (
              <HeroCard
                key={hero.id}
                hero={hero}
                selected={compareIds.includes(hero.id)}
                onToggleCompare={() => toggleCompare(hero.id)}
              />
            ))}
          </ul>
        </section>
      )}

      {compared.length === COMPARE_LIMIT && (
        <section className="space-y-4 rounded-2xl border border-gold/30 bg-card p-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-display text-lg font-semibold text-ink">{t('knowledge.heroCompareTitle')}</h2>
            <Button variant="ghost" size="sm" onClick={() => setCompareIds([])}>
              <X className="h-4 w-4" />
              {t('knowledge.compareClear')}
            </Button>
          </div>
          <HeroComparison first={compared[0]} second={compared[1]} />
        </section>
      )}
    </div>
  );
}

function HeroCard({
  hero,
  selected,
  onToggleCompare,
}: {
  hero: HeroRecord;
  selected: boolean;
  onToggleCompare: () => void;
}) {
  const t = useT();
  const confirmed = isConfirmed(hero);
  const roles = hero.roles.length > 0 ? hero.roles.map((role) => t(ROLE_KEYS[role])).join(', ') : null;

  return (
    <li className="relative">
      <a
        href={heroHref(hero.id)}
        className={cn(
          'flex h-full items-center gap-4 rounded-2xl border bg-card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-gold/50 hover:shadow-lg',
          FOCUS_RING,
          selected ? 'border-gold/70' : 'border-line',
        )}
      >
        <HeroEmblem name={hero.name} attribute={hero.primaryAttribute} />
        <div className="min-w-0 space-y-1.5 pe-16">
          <p className="truncate font-display text-lg font-semibold text-ink">{hero.name}</p>
          <p className="text-sm text-muted">
            {confirmed
              ? `${t(FACTION_KEYS[hero.faction])} · ${t(ATTRIBUTE_KEYS[hero.primaryAttribute])}`
              : t('common.unverified')}
            {roles && ` · ${roles}`}
          </p>
        </div>
      </a>
      <button
        type="button"
        aria-pressed={selected}
        onClick={onToggleCompare}
        className={cn(
          'absolute end-4 top-4 rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors',
          FOCUS_RING,
          selected ? 'border-gold bg-gold/15 text-gold' : 'border-line text-muted hover:border-gold/50 hover:text-ink',
        )}
      >
        {selected ? t('knowledge.compareRemove') : t('knowledge.compareAdd')}
      </button>
    </li>
  );
}
