import { useEffect, useState } from 'react';
import { useT } from '@/i18n/useT';
import { PREGAME_TIMER_MS } from '@/types/draft';

function formatCountdown(remainingMs: number): string {
  const totalSeconds = Math.ceil(remainingMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export function MatchTimer({ confirmedAt, onExpire }: { confirmedAt: number; onExpire: () => void }) {
  const t = useT();
  const [now, setNow] = useState(() => Date.now());
  const remainingMs = Math.max(0, PREGAME_TIMER_MS - (now - confirmedAt));
  const expired = remainingMs === 0;

  useEffect(() => {
    if (expired) return;
    const id = window.setInterval(() => setNow(Date.now()), 250);
    return () => window.clearInterval(id);
  }, [expired]);

  useEffect(() => {
    if (expired) onExpire();
  }, [expired, onExpire]);

  const progress = (remainingMs / PREGAME_TIMER_MS) * 100;

  return (
    <section className="rounded-2xl border border-gold/40 bg-card p-6 shadow-[0_0_32px_rgb(var(--c-gold)/0.12)]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted">{t('pregame.timerLabel')}</p>
          <p role="timer" aria-live="off" className="font-display text-5xl font-semibold tabular-nums text-gold">
            {formatCountdown(remainingMs)}
          </p>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-panel sm:w-64" aria-hidden="true">
          <div className="h-full rounded-full bg-gold transition-[width] duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </section>
  );
}
