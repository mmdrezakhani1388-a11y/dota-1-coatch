import { useT } from '@/i18n/useT';
import { useGameData } from '@/context/useGameData';
import { ATTACK_TYPE_KEYS, ATTRIBUTE_KEYS, DAMAGE_TYPE_KEYS, FACTION_KEYS, HERO_STAT_LABEL_KEYS, ROLE_KEYS } from '@/i18n/labels';
import { HERO_STAT_KEYS, type HeroRecord } from '@/data/gameDatabase/types';
import { heroHref } from '@/app/knowledgeRoute';
import { Card } from '@/components/ui/Card';
import { FieldValue, VerificationBadge } from './FieldValue';
import { HeroEmblem } from './HeroEmblem';

export function HeroDetail({ hero }: { hero: HeroRecord }) {
  const t = useT();
  const { database } = useGameData();

  const abilities = database.abilities.filter((ability) => ability.heroId === hero.id);
  const related = database.heroes.filter(
    (other) => other.id !== hero.id && other.roles.some((role) => hero.roles.includes(role)),
  );

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-6 rounded-2xl border border-line bg-card p-6 sm:flex-row sm:items-center">
        <HeroEmblem name={hero.name} attribute={hero.primaryAttribute} size="lg" />
        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-display text-3xl font-semibold text-ink">{hero.name}</h1>
            <VerificationBadge status={hero.verification} />
          </div>
          <p className="text-sm text-muted">{t('hero.portraitNote')}</p>
          <dl className="grid gap-4 text-sm sm:grid-cols-2 xl:grid-cols-4">
            <div>
              <dt className="text-muted">{t('hero.faction')}</dt>
              <dd className="mt-1"><FieldValue value={hero.verification === 'verified' && hero.faction ? t(FACTION_KEYS[hero.faction]) : null} /></dd>
            </div>
            <div>
              <dt className="text-muted">{t('hero.attribute')}</dt>
              <dd className="mt-1"><FieldValue value={t(ATTRIBUTE_KEYS[hero.primaryAttribute])} /></dd>
            </div>
            <div>
              <dt className="text-muted">{t('knowledge.attackType')}</dt>
              <dd className="mt-1"><FieldValue value={t(ATTACK_TYPE_KEYS[hero.attackType])} /></dd>
            </div>
            <div>
              <dt className="text-muted">{t('hero.damage')}</dt>
              <dd className="mt-1"><FieldValue value={hero.damage ? t(DAMAGE_TYPE_KEYS[hero.damage]) : null} /></dd>
            </div>
          </dl>
        </div>
      </header>

      <Card title={t('hero.stats')}>
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {HERO_STAT_KEYS.map((key) => (
            <div key={key} className="rounded-xl border border-line bg-panel/60 p-4">
              <dt className="text-xs uppercase tracking-wider text-muted">{t(HERO_STAT_LABEL_KEYS[key])}</dt>
              <dd className="mt-2 text-lg"><FieldValue value={hero.stats[key] === null ? null : String(hero.stats[key])} /></dd>
            </div>
          ))}
        </dl>
      </Card>

      <Card title={t('hero.roles')}>
        <p className="text-sm text-ink">
          {hero.roles.length > 0 ? hero.roles.map((role) => t(ROLE_KEYS[role])).join(', ') : <FieldValue value={null} />}
        </p>
      </Card>

      <Card title={t('hero.abilities')}>
        {abilities.length === 0 ? (
          <p className="text-sm text-muted">{t('hero.noAbilities')}</p>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2">
            {abilities.map((ability) => (
              <li key={ability.id} className="rounded-xl border border-line bg-panel/60 p-4 text-sm font-medium text-ink">
                {ability.name}
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card title={t('hero.related')} description={t('hero.relatedBody')}>
        {related.length === 0 ? (
          <p className="text-sm text-muted">{t('hero.noRelated')}</p>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {related.map((other) => (
              <li key={other.id}>
                <a
                  href={heroHref(other.id)}
                  className="flex items-center gap-3 rounded-xl border border-line bg-panel/60 p-3 transition-colors hover:border-gold/50"
                >
                  <HeroEmblem name={other.name} attribute={other.primaryAttribute} />
                  <span className="font-medium text-ink">{other.name}</span>
                </a>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
