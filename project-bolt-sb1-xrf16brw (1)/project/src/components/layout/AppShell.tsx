import { useState, type ReactNode } from 'react';
import type { SectionId } from '@/app/routes';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

export function AppShell({ currentId, children }: { currentId: SectionId; children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-bg text-ink lg:flex">
      <Sidebar currentId={currentId} open={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <TopBar currentId={currentId} onOpenMenu={() => setMenuOpen(true)} />
        <main className="flex-1 px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
          <div key={currentId} className="mx-auto max-w-6xl animate-fade-up">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
