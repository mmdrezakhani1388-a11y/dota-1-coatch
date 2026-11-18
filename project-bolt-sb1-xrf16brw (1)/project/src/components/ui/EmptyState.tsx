import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  body?: string;
  action?: ReactNode;
}

export function EmptyState({ icon: Icon, title, body, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-line px-6 py-10 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-gold">
        <Icon className="h-5 w-5" />
      </span>
      <p className="font-medium text-ink">{title}</p>
      {body && <p className="max-w-md text-sm leading-relaxed text-muted">{body}</p>}
      {action}
    </div>
  );
}
