import { useGameData } from '@/context/useGameData';
import { useT } from '@/i18n/useT';
import { ABILITY_KIND_KEYS, ATTACK_TYPE_KEYS, ATTRIBUTE_KEYS, DAMAGE_TYPE_KEYS, FACTION_KEYS, HERO_STAT_LABEL_KEYS, ROLE_KEYS } from '@/i18n/labels';
import { HERO_STAT_KEYS, type HeroRecord } from '@/data/gameDatabase/types';
import { ComparisonTable, type ComparisonRow } from './ComparisonTable';

function numberCell(value: number | null): string | null {
  return value === null ? null : String(value);
}

export function HeroComparison({ first, second }: { first: HeroRecord; second: HeroRecord }) {
  const t = useT();
  const { database } = useGameData();
  const heroes = [first, second];

  const rolesText = (hero: HeroRecord) => (hero.roles.length > 0 ? hero.roles.map((role) => t(ROLE_KEYS[role])).join(', ') : null);
  const abilityText = (hero: HeroRecord) => {
    const names = database.abilities.filter((ability) => ability.heroId === hero.id).map((ability) => ability.name);
    return names.length > 0 ? names.join(', ') : null;
  };

  const rows: ComparisonRow[] = [
    { label: t('hero.faction'), cells: heroes.map((hero) => (hero.verification === 'verified' && hero.faction ? t(FACTION_KEYS[hero.faction]) : null)) },
    { label: t('hero.attribute'), cells: heroes.map((hero) => t(ATTRIBUTE_KEYS[hero.primaryAttribute])) },
    { label: t('knowledge.attackType'), cells: heroes.map((hero) => t(ATTACK_TYPE_KEYS[hero.attackType])) },
    { label: t('hero.damage'), cells: heroes.map((hero) => (hero.damage ? t(DAMAGE_TYPE_KEYS[hero.damage]) : null)) },
    { label: t('hero.roles'), cells: heroes.map(rolesText) },
    ...HERO_STAT_KEYS.map((key) => ({
      label: t(HERO_STAT_LABEL_KEYS[key]),
      cells: heroes.map((hero) => numberCell(hero.stats[key])),
    })),
    { label: t('hero.abilities'), cells: heroes.map(abilityText) },
  ];

  return <ComparisonTable columns={heroes.map((hero) => hero.name)} rows={rows} />;
}
