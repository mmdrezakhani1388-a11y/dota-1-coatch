import { Plus, Star, X } from 'lucide-react';
import { useState } from 'react';
import { useSettings } from '@/context/useSettings';
import { useT } from '@/i18n/useT';
import { ATTRIBUTE_KEYS, ROLE_KEYS } from '@/i18n/labels';
import { useGameData } from '@/context/useGameData';
import type { HeroRecord } from '@/data/gameDatabase';
import { MAX_FAVORITE_HEROES } from '@/types/settings';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Modal } from '@/components/ui/Modal';
import { inputClass } from '@/components/ui/formControls';
import { cn } from '@/lib/cn';

export function FavoriteHeroesPanel() {
  const t = useT();
  const { settings, updateSettings } = useSettings();
  const { index } = useGameData();
  const [picking, setPicking] = useState(false);

  const favorites = settings.favoriteHeroIds
    .map((id) => index.heroById.get(id) ?? null)
    .filter((hero): hero is HeroRecord => hero !== null);

  const removeFavorite = (id: string) => {
    updateSettings({ favoriteHeroIds: settings.favoriteHeroIds.filter((item) => item !== id) });
  };

  const addButton = (
    <Button variant="secondary" size="sm" onClick={() => setPicking(true)}>
      <Plus className="h-4 w-4" />
      {t('favorites.add')}
    </Button>
  );

  return (
    <Card title={t('dashboard.favorites')} actions={favorites.length > 0 ? addButton : undefined}>
      {favorites.length === 0 ? (
        <EmptyState icon={Star} title={t('dashboard.favorites')} body={t('dashboard.favoritesEmpty')} action={addButton} />
      ) : (
        <>
          <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {favorites.map((hero) => (
              <li
                key={hero.id}
                className="relative flex items-center gap-3 rounded-xl border border-line bg-panel/60 p-3 ps-3 transition-colors duration-200 hover:border-gold/40"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-arcane/40 bg-arcane/10 font-display text-base font-semibold text-arcane">
                  {hero.name.charAt(0)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate pe-6 text-sm font-medium text-ink">{hero.name}</p>
                  <p className="truncate text-xs text-muted">
                    {t(ATTRIBUTE_KEYS[hero.primaryAttribute])}
                    {hero.roles.length > 0 && ` · ${hero.roles.map((role) => t(ROLE_KEYS[role])).join(', ')}`}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removeFavorite(hero.id)}
                  aria-label={t('favorites.remove', { name: hero.name })}
                  className="absolute end-2 top-2 rounded-md p-1 text-muted transition-colors hover:bg-danger/10 hover:text-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-arcane/70"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs leading-relaxed text-muted">{t('favorites.detailsSoon')}</p>
        </>
      )}
      <HeroPickerModal open={picking} onClose={() => setPicking(false)} />
    </Card>
  );
}

function HeroPickerModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const t = useT();
  return (
    <Modal open={open} title={t('favorites.pickerTitle')} onClose={onClose}>
      <HeroPicker />
    </Modal>
  );
}

function HeroPicker() {
  const t = useT();
  const { settings, updateSettings } = useSettings();
  const { database } = useGameData();
  const [query, setQuery] = useState('');
  const selected = settings.favoriteHeroIds;
  const atLimit = selected.length >= MAX_FAVORITE_HEROES;
  const normalizedQuery = query.trim().toLowerCase();
  const heroes = database.heroes.filter((hero) => hero.name.toLowerCase().includes(normalizedQuery));

  const toggleHero = (id: string) => {
    if (selected.includes(id)) {
      updateSettings({ favoriteHeroIds: selected.filter((item) => item !== id) });
    } else if (!atLimit) {
      updateSettings({ favoriteHeroIds: [...selected, id] });
    }
  };

  return (
    <div className="space-y-4">
      <input
        type="search"
        value={query}
        placeholder={t('favorites.search')}
        aria-label={t('favorites.search')}
        onChange={(event) => setQuery(event.target.value)}
        className={inputClass}
      />
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
        <span className="font-medium text-gold">
          {t('favorites.selected', { count: selected.length, max: MAX_FAVORITE_HEROES })}
        </span>
        <span className="text-xs text-muted">{t('favorites.pickerHint')}</span>
      </div>
      {atLimit && (
        <p role="status" className="rounded-lg border border-warning/40 bg-warning/10 px-3 py-2 text-sm text-warning">
          {t('favorites.limit')}
        </p>
      )}
      {heroes.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted">{t('favorites.noResults')}</p>
      ) : (
        <div className="grid max-h-[50vh] grid-cols-2 gap-2 overflow-y-auto pe-1 sm:grid-cols-3">
          {heroes.map((hero) => {
            const active = selected.includes(hero.id);
            const disabled = !active && atLimit;
            return (
              <button
                key={hero.id}
                type="button"
                aria-pressed={active}
                disabled={disabled}
                onClick={() => toggleHero(hero.id)}
                className={cn(
                  'rounded-xl border p-3 text-start transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-arcane/70 disabled:cursor-not-allowed disabled:opacity-40',
                  active ? 'border-gold bg-gold/15 text-gold' : 'border-line bg-panel/60 text-ink hover:border-gold/50',
                )}
              >
                <span className="block truncate text-sm font-medium">{hero.name}</span>
                <span className="block truncate text-xs text-muted">{t(ATTRIBUTE_KEYS[hero.primaryAttribute])}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
