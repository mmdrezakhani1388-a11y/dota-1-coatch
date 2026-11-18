import { useState } from 'react';
import { APP_VERSION } from '@/config/appVersion';
import { useSettings } from '@/context/useSettings';
import { useT } from '@/i18n/useT';
import { LANGUAGE_NAMES, PERSONALITY_BODY_KEYS, PERSONALITY_KEYS, SKILL_LEVEL_KEYS, THEME_KEYS } from '@/i18n/labels';
import { COACH_PERSONALITIES, LANGUAGES, SKILL_LEVELS, THEMES, type Language, type SkillLevel, type Theme } from '@/types/settings';
import { pickOption } from '@/lib/validation';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Field, SegmentedControl, inputClass } from '@/components/ui/formControls';

export function SettingsPage() {
  const t = useT();
  const { settings, updateSettings, saveFailed } = useSettings();
  const [nameDraft, setNameDraft] = useState(settings.playerName);

  const commitName = () => {
    const trimmed = nameDraft.trim().slice(0, 40);
    setNameDraft(trimmed);
    if (trimmed !== settings.playerName) updateSettings({ playerName: trimmed });
  };

  const languageOptions = LANGUAGES.map((value) => ({ value, label: LANGUAGE_NAMES[value] }));
  const themeOptions = THEMES.map((value) => ({ value, label: t(THEME_KEYS[value]) }));
  const levelOptions = SKILL_LEVELS.map((value) => ({ value, label: t(SKILL_LEVEL_KEYS[value]) }));

  return (
    <div className="space-y-8">
      <PageHeader title={t('settings.title')} subtitle={t('settings.subtitle')} />

      {saveFailed && (
        <p role="alert" className="rounded-xl border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger">
          {t('settings.saveFailed')}
        </p>
      )}

      <div className="grid items-start gap-6 lg:grid-cols-2">
        <Card title={t('settings.appearance')} description={t('settings.autoSave')}>
          <div className="space-y-6">
            <Field label={t('settings.language')}>
              <SegmentedControl<Language>
                label={t('settings.language')}
                options={languageOptions}
                value={settings.language}
                onChange={(language) => updateSettings({ language })}
              />
            </Field>
            <Field label={t('settings.theme')}>
              <SegmentedControl<Theme>
                label={t('settings.theme')}
                options={themeOptions}
                value={settings.theme}
                onChange={(theme) => updateSettings({ theme })}
              />
            </Field>
          </div>
        </Card>

        <Card title={t('settings.profile')}>
          <div className="space-y-6">
            <Field label={t('settings.playerName')}>
              <input
                type="text"
                value={nameDraft}
                maxLength={40}
                placeholder={t('common.player')}
                onChange={(event) => setNameDraft(event.target.value)}
                onBlur={commitName}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') commitName();
                }}
                className={inputClass}
              />
              <span className="text-xs text-muted">{t('settings.playerNameHint')}</span>
            </Field>
            <Field label={t('settings.skillLevel')}>
              <SegmentedControl<SkillLevel>
                label={t('settings.skillLevel')}
                options={levelOptions}
                value={settings.skillLevel}
                onChange={(skillLevel) => updateSettings({ skillLevel })}
              />
            </Field>
          </div>
        </Card>

        <Card title={t('settings.coach')} className="lg:col-span-2">
          <div className="grid gap-6 md:grid-cols-2">
            <Field label={t('settings.personality')}>
              <select
                value={settings.coachPersonality}
                onChange={(event) =>
                  updateSettings({
                    coachPersonality: pickOption(event.target.value, COACH_PERSONALITIES, settings.coachPersonality),
                  })
                }
                className={inputClass}
              >
                {COACH_PERSONALITIES.map((value) => (
                  <option key={value} value={value}>
                    {t(PERSONALITY_KEYS[value])}
                  </option>
                ))}
              </select>
            </Field>
            <div className="flex flex-col justify-end gap-2 rounded-xl border border-line bg-panel/60 p-4">
              <Badge tone="arcane" className="self-start">
                {t(PERSONALITY_KEYS[settings.coachPersonality])}
              </Badge>
              <p className="text-sm leading-relaxed text-muted">
                {t(PERSONALITY_BODY_KEYS[settings.coachPersonality])}
              </p>
            </div>
          </div>
        </Card>

        <Card title={t('settings.about')} className="lg:col-span-2">
          <dl className="divide-y divide-line">
            <div className="flex flex-wrap items-center justify-between gap-2 py-3">
              <dt className="text-sm text-muted">{t('settings.appVersion')}</dt>
              <dd className="font-medium text-ink">{APP_VERSION}</dd>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 py-3">
              <dt className="text-sm text-muted">{t('settings.gameData')}</dt>
              <dd className="text-end text-sm text-ink">{t('settings.gameDataValue')}</dd>
            </div>
            <div className="flex flex-wrap items-start justify-between gap-2 py-3">
              <dt className="text-sm text-muted">{t('settings.updates')}</dt>
              <dd className="max-w-md text-end text-sm leading-relaxed text-muted">{t('settings.updateNotConfigured')}</dd>
            </div>
          </dl>
        </Card>
      </div>
    </div>
  );
}
