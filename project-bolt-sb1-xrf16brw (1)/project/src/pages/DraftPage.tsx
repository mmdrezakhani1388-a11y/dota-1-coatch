import { useCallback, useState } from 'react';
import { LogOut, Swords } from 'lucide-react';
import { useT } from '@/i18n/useT';
import type { MessageKey } from '@/i18n/en';
import { usePersistentList } from '@/hooks/usePersistentList';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button, buttonClass } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { DraftBoard } from '@/components/draft/DraftBoard';
import { PreGameBoard } from '@/components/draft/PreGameBoard';
import { MatchTimer } from '@/components/draft/MatchTimer';
import { LiveMatchPanel } from '@/components/draft/LiveMatchPanel';
import {
  createDraftMatch,
  DRAFT_MATCHES_STORAGE_KEY,
  isDraftComplete,
  parseDraftMatches,
  UNDO_WINDOW_MS,
  type DraftMatch,
  type DraftStage,
} from '@/types/draft';

const STAGE_TITLE_KEYS: Record<DraftStage, MessageKey> = {
  draft: 'draft.title',
  pregame: 'pregame.title',
  locked: 'pregame.title',
  live: 'live.title',
  exited: 'draft.title',
};

const STAGE_SUBTITLE_KEYS: Record<DraftStage, MessageKey> = {
  draft: 'draft.subtitle',
  pregame: 'pregame.subtitle',
  locked: 'pregame.subtitle',
  live: 'live.subtitle',
  exited: 'draft.subtitle',
};

const EXIT_BUTTON_CLASS =
  'inline-flex h-9 items-center gap-2 rounded-lg border border-danger/40 bg-danger/10 px-3 text-sm font-medium text-danger transition-colors duration-200 hover:bg-danger/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger/60';

export function DraftPage() {
  const t = useT();
  const matches = usePersistentList(DRAFT_MATCHES_STORAGE_KEY, parseDraftMatches);
  const activeMatch: DraftMatch | undefined = matches.items[0];
  const setItems = matches.setItems;
  const stage: DraftStage = activeMatch?.stage ?? 'draft';
  const [confirmExit, setConfirmExit] = useState(false);

  const startMatch = () => {
    setItems((current) => [createDraftMatch(), ...current]);
  };

  const updateMatch = useCallback(
    (next: DraftMatch) => {
      setItems((current) => current.map((match) => (match.id === next.id ? next : match)));
    },
    [setItems],
  );

  const goLive = useCallback(() => {
    setItems((current) =>
      current.map((match, index) =>
        index === 0 && match.stage === 'locked' ? { ...match, stage: 'live', liveEnteredAt: Date.now() } : match,
      ),
    );
  }, [setItems]);

  const confirmPicks = () => {
    if (activeMatch?.stage === 'pregame' && activeMatch.confirmedAt === null) {
      updateMatch({ ...activeMatch, stage: 'locked', confirmedAt: Date.now() });
    }
  };

  const undoToPregame = () => {
    if (activeMatch?.stage !== 'live' || activeMatch.liveEnteredAt === null) return;
    if (Date.now() - activeMatch.liveEnteredAt >= UNDO_WINDOW_MS) return;
    updateMatch({ ...activeMatch, stage: 'pregame' });
  };

  const returnToLive = () => {
    if (activeMatch?.stage === 'pregame' && activeMatch.confirmedAt !== null) {
      updateMatch({ ...activeMatch, stage: 'live' });
    }
  };

  const exitMatch = () => {
    if (activeMatch) updateMatch({ ...activeMatch, stage: 'exited' });
    setConfirmExit(false);
    if (window.location.hash !== '#/dashboard') window.location.hash = '#/dashboard';
  };

  const matchActive = activeMatch !== undefined && stage !== 'exited';

  return (
    <div className="space-y-8">
      {matchActive && (
        <div className="flex justify-end">
          <button type="button" onClick={() => setConfirmExit(true)} className={EXIT_BUTTON_CLASS}>
            <LogOut className="h-4 w-4" />
            {t('draft.exitMatch')}
          </button>
        </div>
      )}

      <PageHeader title={t(STAGE_TITLE_KEYS[stage])} subtitle={t(STAGE_SUBTITLE_KEYS[stage])} />

      {matches.saveFailed && (
        <p role="alert" className="rounded-xl border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger">
          {t('draft.saveFailed')}
        </p>
      )}

      {!activeMatch && (
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-8 rounded-2xl border border-line bg-card px-6 py-16 text-center sm:px-10">
          <span className="flex h-16 w-16 items-center justify-center rounded-full border border-gold/40 bg-gold/10 text-gold shadow-[0_0_32px_rgb(var(--c-gold)/0.15)]">
            <Swords className="h-7 w-7" />
          </span>
          <div className="space-y-3">
            <h2 className="font-display text-2xl font-semibold leading-tight text-ink">{t('draft.startTitle')}</h2>
            <p className="leading-relaxed text-muted">{t('draft.startBody')}</p>
          </div>
          <Button
            variant="primary"
            onClick={startMatch}
            className="h-14 px-10 text-base tracking-wide transition-transform duration-200 hover:-translate-y-0.5"
          >
            <Swords className="h-5 w-5" />
            {t('draft.startButton')}
          </Button>
        </div>
      )}

      {activeMatch && stage === 'draft' && (
        <div className="space-y-6">
          <DraftBoard match={activeMatch} onChange={updateMatch} />
          <div className="flex flex-col items-end gap-2">
            <Button
              variant="primary"
              disabled={!isDraftComplete(activeMatch)}
              onClick={() => updateMatch({ ...activeMatch, stage: 'pregame' })}
              className="h-11 px-6"
            >
              {t('draft.toPreGame')}
            </Button>
            {!isDraftComplete(activeMatch) && <p className="text-sm text-muted">{t('draft.toPreGameHint')}</p>}
          </div>
        </div>
      )}

      {activeMatch && (stage === 'pregame' || stage === 'locked') && (
        <div className="space-y-6">
          {stage === 'locked' && activeMatch.confirmedAt !== null && (
            <MatchTimer confirmedAt={activeMatch.confirmedAt} onExpire={goLive} />
          )}
          {stage === 'pregame' && activeMatch.confirmedAt !== null && (
            <div className="flex justify-end">
              <Button variant="primary" onClick={returnToLive} className="h-11 px-6">
                {t('pregame.returnToLive')}
              </Button>
            </div>
          )}
          <PreGameBoard
            match={activeMatch}
            locked={activeMatch.confirmedAt !== null}
            onChange={updateMatch}
            onConfirm={confirmPicks}
          />
        </div>
      )}

      {activeMatch && stage === 'live' && (
        <LiveMatchPanel match={activeMatch} onUndo={undoToPregame} onChange={updateMatch} />
      )}

      {activeMatch && stage === 'exited' && (
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 rounded-2xl border border-line bg-card px-6 py-16 text-center sm:px-10">
          <h2 className="font-display text-2xl font-semibold text-ink">{t('draft.exitTitle')}</h2>
          <p className="text-muted">{t('draft.exitBody')}</p>
          <Button variant="primary" onClick={startMatch} className="h-12 px-8">
            <Swords className="h-5 w-5" />
            {t('draft.startButton')}
          </Button>
        </div>
      )}

      <Modal open={confirmExit} title={t('draft.exitConfirmTitle')} onClose={() => setConfirmExit(false)}>
        <p className="text-muted">{t('draft.exitConfirmBody')}</p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setConfirmExit(false)}>
            {t('draft.exitCancel')}
          </Button>
          <button type="button" onClick={exitMatch} className={buttonClass('danger', 'md')}>
            <LogOut className="h-4 w-4" />
            {t('draft.exitMatch')}
          </button>
        </div>
      </Modal>
    </div>
  );
}
