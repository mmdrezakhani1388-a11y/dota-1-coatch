import { useT } from '@/i18n/useT';
import { FACTION_KEYS } from '@/i18n/labels';
import type { Faction } from '@/data/gameDatabase/types';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import type { TeamSlots } from '@/types/draft';
import { DraftSlot } from './DraftSlot';

const FACTION_TONES: Record<Faction, 'success' | 'danger'> = {
  sentinel: 'success',
  scourge: 'danger',
};

interface DraftTeamPanelProps {
  title: string;
  faction: Faction | null;
  slots: TeamSlots;
  playerSlot?: number;
  highlightedSlot?: number | null;
  onPick?: (slot: number) => void;
  onClear?: (slot: number) => void;
  onActivate?: (slot: number) => void;
}

export function DraftTeamPanel({
  title,
  faction,
  slots,
  playerSlot,
  highlightedSlot,
  onPick,
  onClear,
  onActivate,
}: DraftTeamPanelProps) {
  const t = useT();

  return (
    <Card
      title={title}
      actions={faction ? <Badge tone={FACTION_TONES[faction]}>{t(FACTION_KEYS[faction])}</Badge> : undefined}
    >
      <ol className="space-y-3">
        {slots.map((heroId, slot) => (
          <DraftSlot
            key={slot}
            number={slot + 1}
            heroId={heroId}
            isPlayer={slot === playerSlot}
            highlighted={slot === highlightedSlot}
            onPick={onPick ? () => onPick(slot) : undefined}
            onClear={onClear ? () => onClear(slot) : undefined}
            onActivate={onActivate ? () => onActivate(slot) : undefined}
          />
        ))}
      </ol>
    </Card>
  );
}
