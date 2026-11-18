import type { ReactNode } from 'react';

export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="space-y-3">
      <span aria-hidden="true" className="block h-0.5 w-16 rounded-full bg-gold/70" />
      <h1 className="font-display text-3xl font-semibold leading-tight text-ink sm:text-4xl">{title}</h1>
      {subtitle && <p className="max-w-2xl leading-relaxed text-muted">{subtitle}</p>}
    </header>
  );
}

export function PageSection({ children }: { children: ReactNode }) {
  return <div className="space-y-8">{children}</div>;
}
