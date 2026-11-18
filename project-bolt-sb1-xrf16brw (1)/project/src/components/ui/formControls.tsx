import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export const inputClass =
  'h-10 w-full rounded-lg border border-line bg-panel px-3 text-sm text-ink placeholder:text-muted/70 transition-colors focus:border-arcane focus:outline-none focus:ring-2 focus:ring-arcane/30';

export function chipClass(active: boolean): string {
  return `rounded-full border px-3 py-1.5 text-sm transition-colors duration-200 ${
    active ? 'border-gold bg-gold/15 text-gold' : 'border-line text-muted hover:border-gold/50 hover:text-ink'
  }`;
}

export const textareaClass =
  'w-full rounded-lg border border-line bg-panel px-3 py-2 text-sm leading-relaxed text-ink placeholder:text-muted/70 transition-colors focus:border-arcane focus:outline-none focus:ring-2 focus:ring-arcane/30';

export function Field({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  return (
    <label className={cn('flex flex-col gap-2', className)}>
      <span className="text-sm font-medium text-muted">{label}</span>
      {children}
    </label>
  );
}

export function SegmentedControl<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex flex-wrap gap-1 rounded-lg border border-line bg-panel p-1">
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(option.value)}
            className={cn(
              'h-8 rounded-md px-3 text-sm transition-colors duration-200',
              active ? 'bg-gold text-on-gold font-semibold' : 'text-muted hover:text-ink',
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
