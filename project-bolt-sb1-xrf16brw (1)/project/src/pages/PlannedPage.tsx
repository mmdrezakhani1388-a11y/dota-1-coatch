import { ArrowLeft, Clock } from 'lucide-react';
import { useT } from '@/i18n/useT';
import { sectionHref } from '@/app/routes';
import type { SectionDefinition } from '@/app/sectionRegistry';
import { Badge } from '@/components/ui/Badge';
import { buttonClass } from '@/components/ui/Button';

export function PlannedPage({ section }: { section: SectionDefinition }) {
  const t = useT();
  const Icon = section.icon;

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 rounded-2xl border border-line bg-card px-6 py-16 text-center sm:px-10">
      <span className="flex h-16 w-16 items-center justify-center rounded-full border border-gold/40 bg-gold/10 text-gold shadow-[0_0_32px_rgb(var(--c-gold)/0.15)]">
        <Icon className="h-7 w-7" />
      </span>
      <Badge tone="gold">
        <Clock className="h-3 w-3" />
        {t('common.comingSoon')}
      </Badge>
      <div className="space-y-3">
        <h1 className="font-display text-3xl font-semibold leading-tight text-ink">{t(section.labelKey)}</h1>
        <p className="leading-relaxed text-muted">{t(section.bodyKey)}</p>
        <p className="text-sm leading-relaxed text-muted/80">{t('app.plannedNote')}</p>
      </div>
      <a href={sectionHref('dashboard')} className={buttonClass('secondary')}>
        <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
        {t('app.backToDashboard')}
      </a>
    </div>
  );
}
