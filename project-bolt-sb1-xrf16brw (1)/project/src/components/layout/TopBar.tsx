import { Languages, Menu, Moon, Sun } from 'lucide-react';
import { useSettings } from '@/context/useSettings';
import { useT } from '@/i18n/useT';
import { LANGUAGE_NAMES, SKILL_LEVEL_KEYS } from '@/i18n/labels';
import { getSection } from '@/app/sectionRegistry';
import { sectionHref, type SectionId } from '@/app/routes';
import { Button } from '@/components/ui/Button';

interface TopBarProps {
  currentId: SectionId;
  onOpenMenu: () => void;
}

export function TopBar({ currentId, onOpenMenu }: TopBarProps) {
  const t = useT();
  const { settings, updateSettings } = useSettings();
  const section = getSection(currentId);
  const Icon = section.icon;
  const nextLanguage = settings.language === 'en' ? 'fa' : 'en';
  const nextTheme = settings.theme === 'dark' ? 'light' : 'dark';
  const ThemeIcon = settings.theme === 'dark' ? Sun : Moon;
  const displayName = settings.playerName || t('common.player');

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-line bg-panel/90 px-4 backdrop-blur-md sm:px-6">
      <Button variant="ghost" size="sm" className="lg:hidden" onClick={onOpenMenu} aria-label={t('app.menu')}>
        <Menu className="h-5 w-5" />
      </Button>

      <div className="flex min-w-0 items-center gap-2 text-ink">
        <Icon className="hidden h-4 w-4 shrink-0 text-gold sm:block" />
        <p className="truncate text-sm font-medium">{t(section.labelKey)}</p>
      </div>

      <div className="ms-auto flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => updateSettings({ language: nextLanguage })}
          aria-label={t('common.language')}
        >
          <Languages className="h-4 w-4" />
          <span>{LANGUAGE_NAMES[nextLanguage]}</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => updateSettings({ theme: nextTheme })}
          aria-label={t('common.toggleTheme')}
          title={t('common.toggleTheme')}
        >
          <ThemeIcon className="h-4 w-4" />
        </Button>

        <a
          href={sectionHref('settings')}
          aria-label={t('app.profile')}
          className="flex items-center gap-3 rounded-lg border border-line bg-card/60 py-1.5 ps-1.5 pe-3 transition-colors duration-200 hover:border-gold/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-arcane/70"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-gold/50 bg-gold/10 font-display text-sm font-semibold text-gold">
            {displayName.charAt(0).toUpperCase()}
          </span>
          <span className="hidden text-start sm:block">
            <span className="block text-sm font-medium leading-tight text-ink">{displayName}</span>
            <span className="block text-xs leading-tight text-muted">{t(SKILL_LEVEL_KEYS[settings.skillLevel])}</span>
          </span>
        </a>
      </div>
    </header>
  );
}
