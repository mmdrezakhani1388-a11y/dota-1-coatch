import { Undo2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useT } from '@/i18n/useT';
import { UNDO_WINDOW_MS, type DraftMatch } from '@/types/draft';
import { BattleMap } from './BattleMap';

export function LiveMatchPanel({
  match,
  onUndo,
  onChange,
}: {
  match: DraftMatch;
  onUndo: () => void;
  onChange: (next: DraftMatch) => void;
}) {
  const t = useT();
  const [now, setNow] = useState(() => Date.now());
  const liveEnteredAt = match.liveEnteredAt;
  const remainingMs = liveEnteredAt === null ? 0 : Math.max(0, UNDO_WINDOW_MS - (now - liveEnteredAt));
  const undoOpen = remainingMs > 0;

  useEffect(() => {
    if (!undoOpen) return;
    const id = window.setInterval(() => setNow(Date.now()), 250);
    return () => window.clearInterval(id);
  }, [undoOpen]);

  return (
    <Card
      title={t('live.title')}
      description={t('map.subtitle')}
      actions={
        undoOpen ? (
          <Button variant="secondary" size="sm" onClick={onUndo} className="tabular-nums">
            <Undo2 className="h-4 w-4" />
            {t('live.undo')} ({Math.ceil(remainingMs / 1000)}s)
          </Button>
        ) : undefined
      }
    >
      <div className="space-y-4">
        <Badge tone="gold">{t('live.status')}</Badge>
        <BattleMap match={match} onChange={onChange} />
      </div>
    </Card>
  );
}
