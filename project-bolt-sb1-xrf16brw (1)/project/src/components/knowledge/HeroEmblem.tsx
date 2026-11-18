import type { Attribute } from '@/data/gameDatabase/types';
import { cn } from '@/lib/cn';

const ATTRIBUTE_STYLES: Record<Attribute, string> = {
  strength: 'border-danger/50 bg-danger/10 text-danger',
  agility: 'border-success/50 bg-success/10 text-success',
  intelligence: 'border-arcane/50 bg-arcane/10 text-arcane',
};

export function HeroEmblem({
  name,
  attribute,
  size = 'md',
}: {
  name: string;
  attribute: Attribute;
  size?: 'md' | 'lg';
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'flex shrink-0 items-center justify-center rounded-xl border font-display font-semibold',
        ATTRIBUTE_STYLES[attribute],
        size === 'lg' ? 'h-24 w-24 text-4xl' : 'h-14 w-14 text-xl',
      )}
    >
      {name.charAt(0).toUpperCase()}
    </span>
  );
}
