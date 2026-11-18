import { Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useSettings } from '@/context/useSettings';
import { useT } from '@/i18n/useT';
import { LANGUAGE_NAMES, PERSONALITY_BODY_KEYS, PERSONALITY_KEYS, SKILL_LEVEL_KEYS } from '@/i18n/labels';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { CoachPreferencesModal } from './CoachPreferencesModal';

export function CoachIntroCard() {
  const t = useT();
  const { settings } = useSettings();
  const [editing, setEditing] = useState(false);
  const personality = settings.coachPersonality;

  const details = [
    { label: t('coach.language'), value: LANGUAGE_NAMES[settings.language] },
    { label: t('coach.level'), value: t(SKILL_LEVEL_KEYS[settings.skillLevel]) },
    { label: t('dashboard.coachStyle'), value: t(PERSONALITY_KEYS[personality]) },
  ];

  return (
    <section className="relative overflow-hidden rounded-2xl border border-arcane/30 bg-card p-6">
      <div aria-hidden="true" className="pointer-events-none absolute -end-16 -top-16 h-48 w-48 rounded-full bg-arcane/15 blur-3xl" />
      <div className="relative space-y-5">
        <div className="flex items-center gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-arcane/50 bg-arcane/10 text-arcane shadow-[0_0_24px_rgb(var(--c-arcane)/0.35)]">
            <Sparkles className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <h2 className="font-display text-lg font-semibold text-ink">{t('dashboard.coachTitle')}</h2>
            <p className="text-sm text-muted">{t('dashboard.coachSubtitle')}</p>
          </div>
        </div>

        <p className="leading-relaxed text-ink/90">{t('dashboard.coachIntro')}</p>

        <div className="space-y-2 rounded-xl border border-line bg-panel/70 p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-medium uppercase tracking-wider text-muted">{t('coach.mode')}</p>
            <Badge tone="arcane">{t('coach.localMode')}</Badge>
          </div>
          <p className="text-sm leading-relaxed text-muted">{t('coach.localModeBody')}</p>
        </div>

        <dl className="divide-y divide-line">
          {details.map((detail) => (
            <div key={detail.label} className="flex items-center justify-between gap-3 py-2.5">
              <dt className="text-sm text-muted">{detail.label}</dt>
              <dd className="text-sm font-medium text-ink">{detail.value}</dd>
            </div>
          ))}
        </dl>

        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wider text-muted">{t('coach.behavior')}</p>
          <p className="text-sm leading-relaxed text-ink/90">{t(PERSONALITY_BODY_KEYS[personality])}</p>
        </div>

        <Button variant="secondary" className="w-full" onClick={() => setEditing(true)}>
          {t('dashboard.changeStyle')}
        </Button>
      </div>

      <CoachPreferencesModal open={editing} onClose={() => setEditing(false)} />
    </section>
  );
}
