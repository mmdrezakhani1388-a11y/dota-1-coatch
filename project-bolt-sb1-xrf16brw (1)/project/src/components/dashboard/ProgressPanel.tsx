import { Plus, Trash2 } from 'lucide-react';
import { useState, type Dispatch, type FormEvent, type SetStateAction } from 'react';
import { useT } from '@/i18n/useT';
import { cn } from '@/lib/cn';
import { createId } from '@/lib/id';
import type { Goal } from '@/types/dashboard';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { inputClass } from '@/components/ui/formControls';

const GOAL_MAX_LENGTH = 200;

interface ProgressPanelProps {
  matchCount: number;
  goals: Goal[];
  setGoals: Dispatch<SetStateAction<Goal[]>>;
}

export function ProgressPanel({ matchCount, goals, setGoals }: ProgressPanelProps) {
  const t = useT();
  const [draft, setDraft] = useState('');
  const completedCount = goals.filter((goal) => goal.completed).length;
  const progressPercent = goals.length > 0 ? (completedCount / goals.length) * 100 : 0;

  const tiles: { label: string; value: string | null }[] = [
    { label: t('progress.exercises'), value: null },
    { label: t('progress.matches'), value: String(matchCount) },
    { label: t('progress.missions'), value: null },
  ];

  const addGoal = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = draft.trim().slice(0, GOAL_MAX_LENGTH);
    if (!text) return;
    setGoals((current) => [...current, { id: createId(), text, completed: false }]);
    setDraft('');
  };

  const toggleGoal = (id: string) => {
    setGoals((current) => current.map((goal) => (goal.id === id ? { ...goal, completed: !goal.completed } : goal)));
  };

  const removeGoal = (id: string) => {
    setGoals((current) => current.filter((goal) => goal.id !== id));
  };

  return (
    <Card title={t('dashboard.progress')}>
      <div className="grid grid-cols-3 gap-3">
        {tiles.map((tile) => (
          <div key={tile.label} className="rounded-xl border border-line bg-panel/60 p-4">
            <p className="font-display text-2xl font-semibold text-ink">{tile.value ?? '-'}</p>
            <p className="mt-1 text-xs leading-snug text-muted">{tile.label}</p>
            {tile.value === null && <p className="mt-2 text-[11px] leading-snug text-gold/80">{t('progress.comingSoon')}</p>}
          </div>
        ))}
      </div>

      <div className="mt-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-medium text-ink">{t('progress.goals')}</h3>
          {goals.length > 0 && (
            <span className="text-xs text-muted">
              {t('progress.goalsDone', { done: completedCount, total: goals.length })}
            </span>
          )}
        </div>

        {goals.length > 0 && (
          <div className="h-1.5 overflow-hidden rounded-full bg-line">
            <div
              className="h-full rounded-full bg-gold transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        )}

        <form onSubmit={addGoal} className="flex gap-2">
          <input
            type="text"
            value={draft}
            maxLength={GOAL_MAX_LENGTH}
            placeholder={t('progress.goalPlaceholder')}
            aria-label={t('progress.goals')}
            onChange={(event) => setDraft(event.target.value)}
            className={inputClass}
          />
          <Button type="submit" variant="secondary" disabled={!draft.trim()} className="shrink-0">
            <Plus className="h-4 w-4" />
            {t('common.add')}
          </Button>
        </form>

        {goals.length === 0 ? (
          <p className="text-sm leading-relaxed text-muted">{t('progress.goalsEmpty')}</p>
        ) : (
          <ul className="space-y-2">
            {goals.map((goal) => (
              <li
                key={goal.id}
                className="flex items-center gap-3 rounded-lg border border-line bg-panel/50 px-3 py-2.5"
              >
                <input
                  type="checkbox"
                  checked={goal.completed}
                  onChange={() => toggleGoal(goal.id)}
                  aria-label={goal.text}
                  className="h-4 w-4 shrink-0 accent-gold"
                />
                <span
                  className={cn(
                    'min-w-0 flex-1 break-words text-sm',
                    goal.completed ? 'text-muted line-through' : 'text-ink',
                  )}
                >
                  {goal.text}
                </span>
                <button
                  type="button"
                  onClick={() => removeGoal(goal.id)}
                  aria-label={t('progress.goalRemove', { text: goal.text })}
                  className="rounded-md p-1.5 text-muted transition-colors hover:bg-danger/10 hover:text-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-arcane/70"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <p className="mt-6 text-xs leading-relaxed text-muted">{t('dashboard.progressEmpty')}</p>
    </Card>
  );
}
