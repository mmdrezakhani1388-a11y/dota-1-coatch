import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface CardProps {
  title?: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
  children: ReactNode;
}

export function Card({ title, description, actions, className, children }: CardProps) {
  return (
    <section className={cn('rounded-2xl border border-line bg-card p-6 transition-colors', className)}>
      {(title || actions) && (
        <header className="mb-6 flex items-start justify-between gap-4">
          <div className="min-w-0">
            {title && <h2 className="font-display text-lg font-semibold text-ink">{title}</h2>}
            {description && <p className="mt-1 text-sm leading-relaxed text-muted">{description}</p>}
          </div>
          {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
        </header>
      )}
      {children}
    </section>
  );
}
