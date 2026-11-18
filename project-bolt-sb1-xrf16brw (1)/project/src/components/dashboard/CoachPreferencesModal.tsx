import { useState, type FormEvent } from 'react';
import { useSettings } from '@/context/useSettings';
import { useT } from '@/i18n/useT';
import { PERSONALITY_BODY_KEYS, PERSONALITY_KEYS } from '@/i18n/labels';
import { COACH_PERSONALITIES, type CoachPersonality } from '@/types/settings';
import { pickOption } from '@/lib/validation';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Field, inputClass } from '@/components/ui/formControls';

export function CoachPreferencesModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const t = useT();
  return (
    <Modal open={open} title={t('coach.preferencesTitle')} onClose={onClose}>
      <CoachPreferencesForm onDone={onClose} />
    </Modal>
  );
}

function CoachPreferencesForm({ onDone }: { onDone: () => void }) {
  const t = useT();
  const { settings, updateSettings } = useSettings();
  const [personality, setPersonality] = useState<CoachPersonality>(settings.coachPersonality);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateSettings({ coachPersonality: personality });
    onDone();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Field label={t('settings.personality')}>
        <select
          value={personality}
          onChange={(event) => setPersonality(pickOption(event.target.value, COACH_PERSONALITIES, personality))}
          className={inputClass}
        >
          {COACH_PERSONALITIES.map((value) => (
            <option key={value} value={value}>
              {t(PERSONALITY_KEYS[value])}
            </option>
          ))}
        </select>
      </Field>

      <div className="rounded-xl border border-line bg-panel/60 p-4">
        <p className="text-sm font-medium text-gold">{t(PERSONALITY_KEYS[personality])}</p>
        <p className="mt-1 text-sm leading-relaxed text-muted">{t(PERSONALITY_BODY_KEYS[personality])}</p>
      </div>

      <p className="text-xs leading-relaxed text-muted">{t('coach.preferencesHint')}</p>

      <div className="flex justify-end gap-2 pt-2">
        <Button variant="ghost" onClick={onDone}>
          {t('common.cancel')}
        </Button>
        <Button type="submit" variant="primary">
          {t('common.save')}
        </Button>
      </div>
    </form>
  );
}
