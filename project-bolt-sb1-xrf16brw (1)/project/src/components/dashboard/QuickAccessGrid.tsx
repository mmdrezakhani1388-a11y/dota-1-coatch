import { ChevronRight } from 'lucide-react';
import { useT } from '@/i18n/useT';
import { sectionHref, type SectionId } from '@/app/routes';
import { SECTIONS, type SectionDefinition } from '@/app/sectionRegistry';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';

const QUICK_ACCESS_IDS: SectionId[] = ['draft', 'knowledge', 'liveCoach', 'training'];

export function QuickAccessGrid() {
  const t = useT();
  const sections = QUICK_ACCESS_IDS.map((id) => SECTIONS.find((section) => section.id === id)).filter(
    (section): section is SectionDefinition => section !== undefined,
  );

  return (
    <Card title={t('dashboard.quickAccess')}>
      <div className="grid gap-4 sm:grid-cols-2">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <a
              key={section.id}
              href={sectionHref(section.id)}
              className="group flex items-start gap-4 rounded-xl border border-line bg-panel/60 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-gold/50 hover:shadow-lg hover:shadow-black/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-arcane/70"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-gold/30 bg-gold/10 text-gold transition-colors group-hover:bg-gold/20">
                <Icon className="h-5 w-5" />
              </span>
              <span className="min-w-0 flex-1 space-y-1">
                <span className="flex items-center gap-2">
                  <span className="font-medium text-ink">{t(section.labelKey)}</span>
                  {!section.available && <Badge>{t('common.soon')}</Badge>}
                </span>
                <span className="block text-sm leading-relaxed text-muted">{t(section.bodyKey)}</span>
              </span>
              <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-muted transition-transform duration-300 group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
            </a>
          );
        })}
      </div>
    </Card>
  );
}
