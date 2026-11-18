import { Pencil } from 'lucide-react';
import { useState } from 'react';
import { useSettings } from '@/context/useSettings';
import { useT } from '@/i18n/useT';
import { ROLE_KEYS, SKILL_LEVEL_KEYS } from '@/i18n/labels';
import { useGameData } from '@/context/useGameData';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ProfileEditModal } from './ProfileEditModal';

export function PlayerProfileCard({ matchCount }: { matchCount: number }) {
  const t = useT();
  const { settings } = useSettings();
  const { index } = useGameData();
  const [editing, setEditing] = useState(false);
  const displayName = settings.playerName || t('common.player');
  const favoriteCount = settings.favoriteHeroIds.filter((id) => index.heroById.has(id)).length;

  const stats = [
    { label: t('profile.matches'), value: String(matchCount) },
    { label: t('profile.favorites'), value: String(favoriteCount) },
  ];

  return (
    <Card
      title={t('profile.title')}
      actions={
        <Button variant="secondary" size="sm" onClick={() => setEditing(true)}>
          <Pencil className="h-4 w-4" />
          {t('profile.edit')}
        </Button>
      }
    >
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-gold/60 bg-gold/10 font-display text-2xl font-semibold text-gold shadow-[0_0_28px_rgb(var(--c-gold)/0.18)]">
            {displayName.charAt(0).toUpperCase()}
          </span>
          <div className="min-w-0 space-y-1.5">
            <p className="truncate font-display text-xl font-semibold leading-tight text-ink">{displayName}</p>
            <Badge tone="gold">{t(SKILL_LEVEL_KEYS[settings.skillLevel])}</Badge>
          </div>
        </div>

        <div className="space-y-2 sm:ms-auto sm:text-end">
          <p className="text-xs font-medium uppercase tracking-wider text-muted">{t('profile.roles')}</p>
          {settings.preferredRoles.length > 0 ? (
            <div className="flex flex-wrap gap-2 sm:justify-end">
              {settings.preferredRoles.map((role) => (
                <Badge key={role} tone="arcane">
                  {t(ROLE_KEYS[role])}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted">{t('profile.noRoles')}</p>
          )}
        </div>
      </div>

      <dl className="mt-6 grid grid-cols-3 gap-3">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-line bg-panel/60 p-4">
            <dt className="text-xs leading-snug text-muted">{stat.label}</dt>
            <dd className="mt-1 font-display text-2xl font-semibold text-ink">{stat.value}</dd>
          </div>
        ))}
        <div className="rounded-xl border border-line bg-panel/60 p-4">
          <dt className="text-xs leading-snug text-muted">{t('profile.training')}</dt>
          <dd className="mt-1 text-sm font-medium text-ink">{t('profile.trainingNotStarted')}</dd>
        </div>
      </dl>

      <ProfileEditModal open={editing} onClose={() => setEditing(false)} />
    </Card>
  );
}
