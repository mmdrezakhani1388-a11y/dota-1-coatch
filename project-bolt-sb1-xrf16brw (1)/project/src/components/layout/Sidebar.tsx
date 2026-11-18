import { Swords, X } from 'lucide-react';
import { useT } from '@/i18n/useT';
import { cn } from '@/lib/cn';
import { APP_VERSION } from '@/config/appVersion';
import { SECTIONS } from '@/app/sectionRegistry';
import { sectionHref, type SectionId } from '@/app/routes';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface SidebarProps {
  currentId: SectionId;
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ currentId, open, onClose }: SidebarProps) {
  const t = useT();
  const mainSections = SECTIONS.filter((section) => section.id !== 'settings');
  const settingsSection = SECTIONS.find((section) => section.id === 'settings');

  const renderLink = (section: (typeof SECTIONS)[number]) => {
    const active = section.id === currentId;
    const Icon = section.icon;
    return (
      <a
        key={section.id}
        href={sectionHref(section.id)}
        aria-current={active ? 'page' : undefined}
        onClick={onClose}
        className={cn(
          'group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-arcane/70',
          active ? 'bg-gold/10 font-medium text-gold' : 'text-muted hover:bg-card hover:text-ink',
        )}
      >
        {active && <span aria-hidden="true" className="absolute inset-y-2 start-0 w-0.5 rounded-full bg-gold" />}
        <Icon className="h-4 w-4 shrink-0" />
        <span className="min-w-0 flex-1 truncate">{t(section.labelKey)}</span>
        {!section.available && <Badge className="ms-auto text-[11px]">{t('common.soon')}</Badge>}
      </a>
    );
  };

  return (
    <>
      <div
        aria-hidden="true"
        onClick={onClose}
        className={cn(
          'fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
      />
      <aside
        className={cn(
          'fixed inset-y-0 start-0 z-50 flex w-72 flex-col border-e border-line bg-panel px-4 py-6',
          'transition-[inset-inline-start] duration-300 ease-out lg:sticky lg:top-0 lg:z-10 lg:h-screen lg:w-64 lg:shrink-0 lg:start-0',
          open ? 'start-0' : '-start-72',
        )}
      >
        <div className="flex items-center gap-3 px-2 pb-8">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-gold/40 bg-gold/10 text-gold shadow-[0_0_24px_rgb(var(--c-gold)/0.18)]">
            <Swords className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <p className="font-display text-base font-semibold leading-tight text-ink">{t('app.name')}</p>
            <p className="text-xs leading-snug text-muted">{t('app.tagline')}</p>
          </div>
          <Button variant="ghost" size="sm" className="ms-auto lg:hidden" onClick={onClose} aria-label={t('app.closeMenu')}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto" aria-label={t('app.name')}>
          {mainSections.map(renderLink)}
        </nav>

        {settingsSection && <div className="mt-4 space-y-1 border-t border-line pt-4">{renderLink(settingsSection)}</div>}

        <p className="mt-4 px-3 text-xs text-muted">
          {t('app.version')} {APP_VERSION}
        </p>
      </aside>
    </>
  );
}
