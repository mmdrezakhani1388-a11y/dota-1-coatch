import { ArrowLeft, Database } from 'lucide-react';
import { useT } from '@/i18n/useT';
import { useGameData } from '@/context/useGameData';
import { KNOWLEDGE_TABS, knowledgeTabHref, useKnowledgeRoute, type KnowledgeTab } from '@/app/knowledgeRoute';
import { PageHeader } from '@/components/layout/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { HeroCatalog } from '@/components/knowledge/HeroCatalog';
import { HeroDetail } from '@/components/knowledge/HeroDetail';
import { chipClass } from '@/components/ui/formControls';
import { cn } from '@/lib/cn';
import type { MessageKey } from '@/i18n/en';

const TAB_KEYS: Record<KnowledgeTab, MessageKey> = {
  heroes: 'knowledge.tab.heroes',
  items: 'knowledge.tab.items',
  abilities: 'knowledge.tab.abilities',
  recipes: 'knowledge.tab.recipes',
  data: 'knowledge.tab.data',
};

export function KnowledgePage() {
  const t = useT();
  const route = useKnowledgeRoute();
  const { index } = useGameData();

  if (route.kind === 'hero') {
    const hero = index.heroById.get(route.id);
    return (
      <div className="space-y-8">
        <a href={knowledgeTabHref('heroes')} className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-gold">
          <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
          {t('knowledge.backToHeroes')}
        </a>
        {hero ? (
          <HeroDetail hero={hero} />
        ) : (
          <EmptyState icon={Database} title={t('knowledge.notFound')} body={t('knowledge.notFoundBody')} />
        )}
      </div>
    );
  }

  if (route.kind === 'item') {
    return (
      <div className="space-y-8">
        <a href={knowledgeTabHref('items')} className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-gold">
          <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
          {t('knowledge.tab.items')}
        </a>
        <EmptyState icon={Database} title={t('knowledge.notFound')} body={t('knowledge.notFoundBody')} />
      </div>
    );
  }

  const activeTab = route.tab;

  return (
    <div className="space-y-8">
      <PageHeader title={t('knowledge.title')} subtitle={t('knowledge.subtitle')} />

      <nav aria-label={t('knowledge.title')} className="flex flex-wrap gap-2">
        {KNOWLEDGE_TABS.map((tab) => (
          <a
            key={tab}
            href={knowledgeTabHref(tab)}
            aria-current={tab === activeTab ? 'page' : undefined}
            className={cn(chipClass(tab === activeTab), 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-arcane/70')}
          >
            {t(TAB_KEYS[tab])}
          </a>
        ))}
      </nav>

      {activeTab === 'heroes' && <HeroCatalog />}
      {activeTab !== 'heroes' && (
        <EmptyState icon={Database} title={t(TAB_KEYS[activeTab])} body={t('knowledge.notBuilt')} />
      )}

    </div>
  );
}
