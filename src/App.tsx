/**
 * Atlas Engineering Patterns — Main Application Entry
 * Structured knowledge repository, graph ontology, and composition engine
 * for designing educational, research, and laboratory stand interfaces.
 */

import React, { useState } from 'react';
import { Header, ActiveTab } from './atlas/components/Header';
import { RepositoryView } from './atlas/components/RepositoryView';
import { GraphView } from './atlas/components/GraphView';
import { ComposerView } from './atlas/components/ComposerView';
import { IngestionView } from './atlas/components/IngestionView';
import { AuditView } from './atlas/components/AuditView';
import { ContractDocView } from './atlas/components/ContractDocView';
import { NhfgView } from './atlas/components/NhfgView';
import { ALL_CANONICAL_ENTITIES } from './atlas/canonicalData';
import { AtlasEntity } from './atlas/types';

export default function App() {
  const [entities, setEntities] = useState<AtlasEntity[]>(ALL_CANONICAL_ENTITIES);
  const [activeTab, setActiveTab] = useState<ActiveTab>('repository');
  const [selectedEntityIdForGraph, setSelectedEntityIdForGraph] = useState<string | undefined>(undefined);
  const [selectedConfigIdForComposer, setSelectedConfigIdForComposer] = useState<string | undefined>(undefined);

  const handleSelectEntityForGraph = (entityId: string) => {
    setSelectedEntityIdForGraph(entityId);
    setActiveTab('graph');
  };

  const handleOpenComposerWithConfig = (configId: string) => {
    setSelectedConfigIdForComposer(configId);
    setActiveTab('composer');
  };

  const handleAddNewEntity = (newEntity: AtlasEntity) => {
    setEntities(prev => [newEntity, ...prev]);
  };

  const handleQuickCompose = () => {
    setSelectedConfigIdForComposer(undefined);
    setActiveTab('composer');
  };

  return (
    <div className="min-h-screen bg-[#0c0f17] text-slate-200 flex flex-col font-sans selection:bg-cyan-500/20 selection:text-cyan-300">
      {/* Top Bar (Complies with Top Bar Contract) */}
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onQuickCompose={handleQuickCompose}
        totalEntities={entities.length}
      />

      {/* Main Workspace Stage */}
      <main className="flex-1 pb-16">
        {activeTab === 'repository' && (
          <RepositoryView
            entities={entities}
            onSelectEntity={handleSelectEntityForGraph}
            onOpenComposerWithConfig={handleOpenComposerWithConfig}
          />
        )}

        {activeTab === 'graph' && (
          <GraphView
            entities={entities}
            initialSelectedId={selectedEntityIdForGraph}
            onSelectEntityDetails={handleSelectEntityForGraph}
          />
        )}

        {activeTab === 'composer' && (
          <ComposerView
            initialConfigId={selectedConfigIdForComposer}
            onSelectEntityDetails={handleSelectEntityForGraph}
          />
        )}

        {activeTab === 'nhfg' && (
          <NhfgView
            onSelectEntityDetails={handleSelectEntityForGraph}
          />
        )}

        {activeTab === 'ingestion' && (
          <IngestionView
            existingEntities={entities}
            onAddNewEntity={handleAddNewEntity}
          />
        )}

        {activeTab === 'audit' && (
          <AuditView />
        )}

        {activeTab === 'contract' && (
          <ContractDocView />
        )}
      </main>

      {/* Lab Console Status Footer (Quiet, uncluttered, authentic) */}
      <footer className="border-t border-slate-900 bg-[#07090e] py-4 text-center text-xs text-slate-500">
        <div className="max-w-[1560px] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">Atlas инженерных паттернов</span>
            <span>·</span>
            <span>Версия 1.0 (Канонический реестр стендовых интерфейсов)</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] font-mono text-slate-600">
            <span>СУЩНОСТЕЙ В РЕЕСТРЕ: {entities.length}</span>
            <span>·</span>
            <span>ГРАФ: СИНХРОНИЗИРОВАН</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
