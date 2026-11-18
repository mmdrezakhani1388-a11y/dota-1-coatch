import { useState, type FormEvent } from 'react';
import { useSettings } from '@/context/useSettings';
import { useT } from '@/i18n/useT';
import { ROLE_KEYS, SKILL_LEVEL_KEYS } from '@/i18n/labels';
import { ROLES, type Role } from '@/data/gameDatabase/types';
import { SKILL_LEVELS, type SkillLevel } from '@/types/settings';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Field, SegmentedControl, chipClass, inputClass } from '@/components/ui/formControls';

export function ProfileEditModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const t = useT();
  return (
    <Modal open={open} title={t('profile.title')} onClose={onClose}>
      <ProfileForm onDone={onClose} />
    </Modal>
  );
}

function ProfileForm({ onDone }: { onDone: () => void }) {
  const t = useT();
  const { settings, updateSettings } = useSettings();
  const [name, setName] = useState(settings.playerName);
  const [level, setLevel] = useState<SkillLevel>(settings.skillLevel);
  const [roles, setRoles] = useState<Role[]>(settings.preferredRoles);

  const levelOptions = SKILL_LEVELS.map((value) => ({ value, label: t(SKILL_LEVEL_KEYS[value]) }));

  const toggleRole = (role: Role) => {
    setRoles((current) =>
      current.includes(role) ? current.filter((item) => item !== role) : [...current, role],
    );
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateSettings({
      playerName: name.trim().slice(0, 40),
      skillLevel: level,
      preferredRoles: ROLES.filter((role) => roles.includes(role)),
    });
    onDone();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Field label={t('profile.name')}>
        <input
          type="text"
          value={name}
          maxLength={40}
          placeholder={t('common.player')}
          onChange={(event) => setName(event.target.value)}
          className={inputClass}
        />
      </Field>

      <Field label={t('profile.level')}>
        <SegmentedControl<SkillLevel>
          label={t('profile.level')}
          options={levelOptions}
          value={level}
          onChange={setLevel}
        />
      </Field>

      <div className="space-y-2">
        <p className="text-sm font-medium text-muted">{t('profile.roles')}</p>
        <p className="text-xs leading-relaxed text-muted">{t('profile.rolesHint')}</p>
        <div className="flex flex-wrap gap-2 pt-1">
          {ROLES.map((role) => {
            const active = roles.includes(role);
            return (
              <button
                key={role}
                type="button"
                aria-pressed={active}
                onClick={() => toggleRole(role)}
                className={chipClass(active)}
              >
                {t(ROLE_KEYS[role])}
              </button>
            );
          })}
        </div>
      </div>

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
