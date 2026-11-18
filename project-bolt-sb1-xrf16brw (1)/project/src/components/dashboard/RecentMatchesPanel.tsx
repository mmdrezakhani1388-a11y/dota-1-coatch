import { History, Plus } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { useSettings } from '@/context/useSettings';
import { useT } from '@/i18n/useT';
import { RESULT_KEYS, ROLE_KEYS } from '@/i18n/labels';
import { useGameData } from '@/context/useGameData';
import { ROLES, type Role } from '@/data/gameDatabase/types';
import { MATCH_RESULTS, type MatchDraft, type MatchRecord, type MatchResult } from '@/types/dashboard';
import { formatIsoDate, todayIsoDate } from '@/lib/date';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Modal } from '@/components/ui/Modal';
import { Field, SegmentedControl, inputClass, textareaClass } from '@/components/ui/formControls';

const LATEST_MATCH_COUNT = 6;

export function RecentMatchesPanel({
  matches,
  onAdd,
}: {
  matches: MatchRecord[];
  onAdd: (draft: MatchDraft) => void;
}) {
  const t = useT();
  const { settings } = useSettings();
  const { index } = useGameData();
  const [recording, setRecording] = useState(false);

  const sorted = [...matches].sort(
    (a, b) => b.playedOn.localeCompare(a.playedOn) || b.createdAt - a.createdAt,
  );
  const latest = sorted.slice(0, LATEST_MATCH_COUNT);

  const newButton = (
    <Button variant="primary" size="sm" onClick={() => setRecording(true)}>
      <Plus className="h-4 w-4" />
      {t('matches.new')}
    </Button>
  );

  return (
    <Card title={t('dashboard.recentMatches')} actions={matches.length > 0 ? newButton : undefined}>
      {matches.length === 0 ? (
        <EmptyState
          icon={History}
          title={t('matches.emptyTitle')}
          body={t('matches.emptyBody')}
          action={newButton}
        />
      ) : (
        <>
          <ul className="divide-y divide-line">
            {latest.map((match) => {
              const hero = index.heroById.get(match.heroId);
              return (
                <li key={match.id} className="flex items-start gap-4 py-4 first:pt-0 last:pb-0">
                  <Badge tone={match.result === 'win' ? 'success' : 'danger'} className="mt-0.5 min-w-14 justify-center">
                    {t(RESULT_KEYS[match.result])}
                  </Badge>
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <p className="font-medium text-ink">{hero?.name ?? match.heroId}</p>
                      <span className="text-sm text-muted">· {t(ROLE_KEYS[match.role])}</span>
                    </div>
                    <p className="text-xs text-muted">{formatIsoDate(match.playedOn, settings.language)}</p>
                    <p className="text-sm leading-relaxed text-muted">{match.notes || t('matches.noNotes')}</p>
                  </div>
                </li>
              );
            })}
          </ul>
          {matches.length > latest.length && (
            <p className="mt-4 text-xs text-muted">
              {t('matches.showingLatest', { count: latest.length, total: matches.length })}
            </p>
          )}
        </>
      )}
      <MatchFormModal
        open={recording}
        onClose={() => setRecording(false)}
        onSave={(draft) => {
          onAdd(draft);
          setRecording(false);
        }}
      />
    </Card>
  );
}

function MatchFormModal({
  open,
  onClose,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (draft: MatchDraft) => void;
}) {
  const t = useT();
  return (
    <Modal open={open} title={t('matches.formTitle')} onClose={onClose}>
      <MatchForm onCancel={onClose} onSave={onSave} />
    </Modal>
  );
}

function MatchForm({ onCancel, onSave }: { onCancel: () => void; onSave: (draft: MatchDraft) => void }) {
  const t = useT();
  const { settings } = useSettings();
  const { database, index } = useGameData();
  const [heroId, setHeroId] = useState(settings.favoriteHeroIds[0] ?? '');
  const [role, setRole] = useState<Role>(settings.preferredRoles[0] ?? ROLES[1]);
  const [result, setResult] = useState<MatchResult>('win');
  const [playedOn, setPlayedOn] = useState(todayIsoDate());
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  const resultOptions = MATCH_RESULTS.map((value) => ({ value, label: t(RESULT_KEYS[value]) }));

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!index.heroById.has(heroId)) {
      setError(t('matches.heroRequired'));
      return;
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(playedOn)) {
      setError(t('matches.dateRequired'));
      return;
    }
    onSave({ heroId, role, result, playedOn, notes: notes.trim().slice(0, 500) });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Field label={t('matches.hero')}>
        <select value={heroId} onChange={(event) => setHeroId(event.target.value)} className={inputClass}>
          <option value="" disabled>
            {t('matches.chooseHero')}
          </option>
          {database.heroes.map((hero) => (
            <option key={hero.id} value={hero.id}>
              {hero.name}
            </option>
          ))}
        </select>
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={t('matches.role')}>
          <select value={role} onChange={(event) => setRole(event.target.value as Role)} className={inputClass}>
            {ROLES.map((item) => (
              <option key={item} value={item}>
                {t(ROLE_KEYS[item])}
              </option>
            ))}
          </select>
        </Field>
        <Field label={t('matches.date')}>
          <input type="date" value={playedOn} onChange={(event) => setPlayedOn(event.target.value)} className={inputClass} />
        </Field>
      </div>

      <Field label={t('matches.result')}>
        <SegmentedControl<MatchResult>
          label={t('matches.result')}
          options={resultOptions}
          value={result}
          onChange={setResult}
        />
      </Field>

      <Field label={t('matches.notes')}>
        <textarea
          value={notes}
          rows={3}
          maxLength={500}
          placeholder={t('matches.notesPlaceholder')}
          onChange={(event) => setNotes(event.target.value)}
          className={textareaClass}
        />
      </Field>

      {error && (
        <p role="alert" className="text-sm text-danger">
          {error}
        </p>
      )}

      <div className="flex justify-end gap-2 pt-2">
        <Button variant="ghost" onClick={onCancel}>
          {t('common.cancel')}
        </Button>
        <Button type="submit" variant="primary">
          {t('matches.save')}
        </Button>
      </div>
    </form>
  );
}
