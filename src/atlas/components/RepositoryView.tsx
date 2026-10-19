import React, { useState } from 'react';
import {
  AtlasEntity,
  EntityType,
  LifecycleStatus,
  PrimitiveEntity,
  PatternEntity,
  ConfigurationEntity,
  ImplementationEntity,
  EvidenceEntity
} from '../types';
import {
  Search,
  Filter,
  Layers,
  Sparkles,
  Sliders,
  Cpu,
  FileCheck2,
  ExternalLink,
  ChevronRight,
  ArrowRight
} from 'lucide-react';

interface RepositoryViewProps {
  entities: AtlasEntity[];
  onSelectEntity: (entityId: string) => void;
  onOpenComposerWithConfig?: (configId: string) => void;
}

export const RepositoryView: React.FC<RepositoryViewProps> = ({
  entities,
  onSelectEntity,
  onOpenComposerWithConfig
}) => {
  const [selectedType, setSelectedType] = useState<EntityType | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalEntity, setActiveModalEntity] = useState<AtlasEntity | null>(null);

  const entityTypeCounts = {
    primitive: entities.filter(e => e.type === 'primitive').length,
    pattern: entities.filter(e => e.type === 'pattern').length,
    configuration: entities.filter(e => e.type === 'configuration').length,
    implementation: entities.filter(e => e.type === 'implementation').length,
    evidence: entities.filter(e => e.type === 'evidence').length
  };

  const filteredEntities = entities.filter(e => {
    if (selectedType !== 'all' && e.type !== selectedType) return false;
    if (selectedCategory !== 'all' && e.domainCategory !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = e.title.toLowerCase().includes(q);
      const matchDesc = e.shortDescription.toLowerCase().includes(q) || e.fullDescription.toLowerCase().includes(q);
      const matchId = e.id.toLowerCase().includes(q);
      const matchTags = e.tags.some(t => t.toLowerCase().includes(q));
      if (!matchTitle && !matchDesc && !matchId && !matchTags) return false;
    }
    return true;
  });

  const getEntityIcon = (type: EntityType) => {
    switch (type) {
      case 'primitive':
        return <Sliders className="w-4 h-4 text-cyan-400" />;
      case 'pattern':
        return <Layers className="w-4 h-4 text-emerald-400" />;
      case 'configuration':
        return <Sparkles className="w-4 h-4 text-amber-400" />;
      case 'implementation':
        return <Cpu className="w-4 h-4 text-violet-400" />;
      case 'evidence':
        return <FileCheck2 className="w-4 h-4 text-rose-400" />;
    }
  };

  const renderStatus = (status: LifecycleStatus) => {
    const colorMap: Record<LifecycleStatus, string> = {
      INDEPENDENTLY_VERIFIED: 'text-emerald-400',
      MEASURED: 'text-cyan-400',
      TESTED: 'text-blue-400',
      IMPLEMENTED: 'text-amber-400',
      SPECIFIED: 'text-slate-300',
      PROPOSED: 'text-slate-400',
      DEPRECATED: 'text-rose-500'
    };
    return (
      <span className={`text-xs font-mono font-medium ${colorMap[status] || 'text-slate-400'}`}>
        ● {status.replace('_', ' ')}
      </span>
    );
  };

  return (
    <div className="max-w-[1560px] mx-auto px-6 py-8">
      {/* Top Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-100 mb-2">
          Канонический реестр сущностей интерфейсов стендов
        </h1>
        <p className="text-sm text-slate-400 max-w-4xl">
          Строгое разделение повторно используемых строительных примитивов, паттернов взаимодействия, готовых конфигураций стендов, программно-аппаратных реализаций и эмпирических подтверждений.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-6">
        {/* Search */}
        <div className="lg:col-span-5 relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Поиск по ID (prim-*, pat-*), названию, тегам или описанию..."
            className="w-full bg-slate-900/90 border border-slate-800 rounded px-9 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Entity Type Selector */}
        <div className="lg:col-span-4 flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded">
          <button
            onClick={() => setSelectedType('all')}
            className={`flex-1 py-1.5 px-2 text-xs font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
              selectedType === 'all' ? 'bg-slate-800 text-cyan-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Все ({entities.length})
          </button>
          <button
            onClick={() => setSelectedType('primitive')}
            className={`flex-1 py-1.5 px-2 text-xs font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
              selectedType === 'primitive' ? 'bg-slate-800 text-cyan-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Примитивы ({entityTypeCounts.primitive})
          </button>
          <button
            onClick={() => setSelectedType('pattern')}
            className={`flex-1 py-1.5 px-2 text-xs font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
              selectedType === 'pattern' ? 'bg-slate-800 text-cyan-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Паттерны ({entityTypeCounts.pattern})
          </button>
          <button
            onClick={() => setSelectedType('configuration')}
            className={`flex-1 py-1.5 px-2 text-xs font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
              selectedType === 'configuration' ? 'bg-slate-800 text-cyan-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Стенды ({entityTypeCounts.configuration})
          </button>
        </div>

        {/* Category Selector */}
        <div className="lg:col-span-3 flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-500 shrink-0" />
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">Все доменные категории</option>
            <option value="layout">Компоновка (Layout)</option>
            <option value="telemetry">Телеметрия и сенсоры</option>
            <option value="controls">Органы управления и уставки</option>
            <option value="safety">Безопасность и блокировки</option>
            <option value="guidance">Обучение и пошаговые протоколы</option>
            <option value="multi-screen">Многомониторные консоли</option>
          </select>
        </div>
      </div>

      {/* Grid of Canonical Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredEntities.map(entity => (
          <div
            key={entity.id}
            onClick={() => setActiveModalEntity(entity)}
            className="group p-5 bg-slate-900/60 border border-slate-800 hover:border-slate-700 rounded transition-colors cursor-pointer flex flex-col justify-between"
          >
            <div>
              {/* Header: Title and Type Indicator */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  {getEntityIcon(entity.type)}
                  <span className="text-xs uppercase tracking-wider font-mono text-slate-400">
                    {entity.type}
                  </span>
                </div>
                {renderStatus(entity.lifecycleStatus)}
              </div>

              {/* Title & Stable ID */}
              <h3 className="text-base font-semibold text-slate-100 group-hover:text-cyan-400 transition-colors mb-1">
                {entity.title}
              </h3>
              <div className="text-xs font-mono text-slate-500 mb-3">
                {entity.id}
              </div>

              {/* Short Description */}
              <p className="text-xs text-slate-400 line-clamp-3 mb-4 leading-relaxed">
                {entity.shortDescription}
              </p>
            </div>

            <div>
              {/* Type-Specific Micro Metrics */}
              {entity.type === 'primitive' && (
                <div className="text-xs text-slate-400 flex items-center gap-2 mb-3">
                  <span>Слот: {(entity as PrimitiveEntity).uiSlot}</span>
                  <span aria-hidden="true">·</span>
                  <span>Рендер: {(entity as PrimitiveEntity).renderingTech || 'DOM'}</span>
                  {(entity as PrimitiveEntity).telemetryRateMaxHz && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums">{(entity as PrimitiveEntity).telemetryRateMaxHz} Гц</span>
                    </>
                  )}
                </div>
              )}

              {entity.type === 'pattern' && (
                <div className="text-xs text-slate-400 flex items-center gap-2 mb-3">
                  <span>Примитивов: {(entity as PatternEntity).primitiveIds.length}</span>
                  <span aria-hidden="true">·</span>
                  <span>Экранов: {(entity as PatternEntity).applicability.minScreens}+</span>
                  <span aria-hidden="true">·</span>
                  <span>Доказательства: {entity.evidenceIds.length}</span>
                </div>
              )}

              {entity.type === 'configuration' && (
                <div className="text-xs text-slate-400 flex items-center gap-2 mb-3">
                  <span className="text-amber-400 font-mono">{(entity as ConfigurationEntity).safetyLevel}</span>
                  <span aria-hidden="true">·</span>
                  <span>Паттернов: {(entity as ConfigurationEntity).selectedPatterns.length}</span>
                  <span aria-hidden="true">·</span>
                  <span>Примитивов: {(entity as ConfigurationEntity).selectedPrimitives.length}</span>
                </div>
              )}

              {entity.type === 'evidence' && (
                <div className="text-xs text-slate-400 flex items-center gap-2 mb-3">
                  <span>Тип: {(entity as EvidenceEntity).evidenceType}</span>
                  {(entity as EvidenceEntity).sampleSize && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums">n={(entity as EvidenceEntity).sampleSize}</span>
                    </>
                  )}
                </div>
              )}

              {/* Tags & Action Link */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs">
                <div className="flex items-center gap-1.5 text-slate-500 overflow-hidden text-ellipsis whitespace-nowrap">
                  <span>{entity.domainCategory}</span>
                  <span aria-hidden="true">/</span>
                  <span className="truncate">{entity.tags.slice(0, 2).join(', ')}</span>
                </div>
                <span className="flex items-center gap-1 text-cyan-400 group-hover:translate-x-0.5 transition-transform shrink-0 font-medium">
                  Спецификация <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredEntities.length === 0 && (
        <div className="py-16 text-center border border-dashed border-slate-800 rounded">
          <p className="text-sm text-slate-400">По заданным критериям канонических записей не найдено.</p>
        </div>
      )}

      {/* Detailed Modal Drawer */}
      {activeModalEntity && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-lg max-w-3xl w-full max-h-[85vh] overflow-y-auto p-6 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4 mb-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-1">
                  {getEntityIcon(activeModalEntity.type)}
                  <span className="uppercase">{activeModalEntity.type}</span>
                  <span>·</span>
                  <span className="text-cyan-400">{activeModalEntity.id}</span>
                </div>
                <h2 className="text-xl font-bold text-slate-100">{activeModalEntity.title}</h2>
              </div>
              <button
                onClick={() => setActiveModalEntity(null)}
                className="text-slate-400 hover:text-slate-200 px-2 py-1 text-sm font-mono cursor-pointer"
              >
                ✕ Закрыть
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-5 text-sm">
              {/* Status and Category */}
              <div className="flex items-center gap-4 text-xs text-slate-400">
                <div>
                  <span className="text-slate-500">Статус: </span>
                  {renderStatus(activeModalEntity.lifecycleStatus)}
                </div>
                <div>
                  <span className="text-slate-500">Доменная категория: </span>
                  <span className="text-slate-200">{activeModalEntity.domainCategory}</span>
                </div>
                <div>
                  <span className="text-slate-500">Источник/Автор: </span>
                  <span className="text-slate-200">{activeModalEntity.authorOrSource}</span>
                </div>
              </div>

              {/* Full Description */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Каноническое описание
                </h4>
                <p className="text-slate-300 leading-relaxed bg-slate-950/50 p-3 rounded border border-slate-800">
                  {activeModalEntity.fullDescription}
                </p>
              </div>

              {/* Pattern specifics: Problem & Trade-offs */}
              {activeModalEntity.type === 'pattern' && (
                <>
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                      Формулировка проблемы проектирования
                    </h4>
                    <p className="text-slate-300 text-xs bg-slate-950/40 p-2.5 rounded border border-slate-800/80">
                      {(activeModalEntity as PatternEntity).problemStatement}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                      Решение и инженерные компромиссы (Trade-Offs)
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div className="p-3 bg-emerald-950/20 border border-emerald-900/40 rounded">
                        <span className="font-semibold text-emerald-400 block mb-1.5">Преимущества:</span>
                        <ul className="list-disc pl-4 space-y-1 text-slate-300">
                          {(activeModalEntity as PatternEntity).tradeOffs.advantages.map((adv, i) => (
                            <li key={i}>{adv}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="p-3 bg-rose-950/20 border border-rose-900/40 rounded">
                        <span className="font-semibold text-rose-400 block mb-1.5">Ограничения и затраты:</span>
                        <ul className="list-disc pl-4 space-y-1 text-slate-300">
                          {(activeModalEntity as PatternEntity).tradeOffs.disadvantages.map((dis, i) => (
                            <li key={i}>{dis}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Configuration specifics: Target Stand & Recipe */}
              {activeModalEntity.type === 'configuration' && (
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Спецификация целевого стенда
                  </h4>
                  <div className="bg-slate-950/40 p-3 rounded border border-slate-800 space-y-2 text-xs text-slate-300">
                    <div>
                      <span className="text-slate-500">Стенд: </span>
                      <span className="font-medium text-slate-100">{(activeModalEntity as ConfigurationEntity).targetStand.standName}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Назначение / Уровень: </span>
                      <span>{(activeModalEntity as ConfigurationEntity).targetStand.purpose} · {(activeModalEntity as ConfigurationEntity).targetStand.targetLevel}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Конфигурация экранов: </span>
                      <span>{(activeModalEntity as ConfigurationEntity).targetStand.screenSetup}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Периферия: </span>
                      <span>{(activeModalEntity as ConfigurationEntity).targetStand.peripherals.join(', ')}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Evidence specifics: Methodology & Metrics */}
              {activeModalEntity.type === 'evidence' && (
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Эмпирические измерения и методология
                  </h4>
                  <div className="bg-slate-950/40 p-3 rounded border border-slate-800 space-y-3 text-xs">
                    <p className="text-slate-300">{(activeModalEntity as EvidenceEntity).methodology}</p>
                    <div className="border-t border-slate-800 pt-2 space-y-1">
                      {(activeModalEntity as EvidenceEntity).measuredMetrics.map((m, i) => (
                        <div key={i} className="flex items-center justify-between font-mono">
                          <span className="text-slate-400">{m.metric}</span>
                          <span className="text-cyan-400 font-semibold">{m.value}</span>
                        </div>
                      ))}
                    </div>
                    <div className="text-slate-500 text-[11px] pt-1 border-t border-slate-800/80">
                      Источник: {(activeModalEntity as EvidenceEntity).sourceCitation}
                    </div>
                  </div>
                </div>
              )}

              {/* Implementation specifics: Tech Stack & Code */}
              {activeModalEntity.type === 'implementation' && (
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Стек и образец кода интеграции
                  </h4>
                  <div className="bg-slate-950/60 p-3 rounded border border-slate-800 text-xs">
                    <div className="mb-2 text-slate-400">
                      Стек: {(activeModalEntity as ImplementationEntity).techStack.join(', ')}
                    </div>
                    {(activeModalEntity as ImplementationEntity).codeSample && (
                      <pre className="font-mono text-[11px] text-cyan-300 p-2 bg-black/60 rounded overflow-x-auto">
                        {(activeModalEntity as ImplementationEntity).codeSample}
                      </pre>
                    )}
                  </div>
                </div>
              )}

              {/* Graph Relationships */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Связи в графе знаний ({activeModalEntity.relations.length})
                </h4>
                <div className="space-y-1.5">
                  {activeModalEntity.relations.map((rel, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-2 bg-slate-950/40 rounded border border-slate-800/80 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-cyan-400 font-semibold">[{rel.relation}]</span>
                        <ArrowRight className="w-3 h-3 text-slate-600" />
                        <span className="font-mono text-slate-300">{rel.targetId}</span>
                      </div>
                      <button
                        onClick={() => {
                          setActiveModalEntity(null);
                          onSelectEntity(rel.targetId);
                        }}
                        className="text-xs text-cyan-400 hover:underline cursor-pointer"
                      >
                        Перейти к узлу
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
              {activeModalEntity.type === 'configuration' && onOpenComposerWithConfig && (
                <button
                  onClick={() => {
                    const cfgId = activeModalEntity.id;
                    setActiveModalEntity(null);
                    onOpenComposerWithConfig(cfgId);
                  }}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs rounded transition-colors cursor-pointer"
                >
                  Загрузить в конфигуратор стенда
                </button>
              )}
              <div className="ml-auto">
                <button
                  onClick={() => setActiveModalEntity(null)}
                  className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded transition-colors cursor-pointer"
                >
                  Закрыть
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
