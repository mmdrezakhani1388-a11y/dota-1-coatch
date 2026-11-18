import { useEffect } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { SettingsProvider } from '@/context/SettingsContext';
import { GameDataProvider } from '@/context/GameDataContext';
import { useCurrentSection } from '@/app/routes';
import { SectionRouter } from '@/app/SectionRouter';

function AppContent() {
  const currentId = useCurrentSection();

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [currentId]);

  return (
    <AppShell currentId={currentId}>
      <SectionRouter id={currentId} />
    </AppShell>
  );
}

export default function App() {
  return (
    <SettingsProvider>
      <GameDataProvider>
        <AppContent />
      </GameDataProvider>
    </SettingsProvider>
  );
}
