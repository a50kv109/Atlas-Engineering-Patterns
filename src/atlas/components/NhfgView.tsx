import React, { useState, useMemo } from 'react';
import {
  NHFG_SOURCES,
  NHFG_PRINCIPLES,
  NHFG_REQUIREMENTS,
  NHFG_PATTERN_MAPPINGS,
  NHFG_VERIFICATIONS
} from '../nhfgData';
import { NhfgEngine } from '../nhfgEngine';
import { CANONICAL_PATTERNS } from '../canonicalData';
import {
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  ShieldCheck,
  FileCheck2,
  Layers,
  ArrowRight,
  Search,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import {
  SourceRecord,
  PrincipleRecord,
  PatternMapping,
  RequirementRecord,
  VerificationRecord
} from '../types';

interface NhfgViewProps {
  onSelectEntityDetails?: (entityId: string) => void;
  onOpenComposerWithPattern?: (patternId: string) => void;
}

export const NhfgView: React.FC<NhfgViewProps> = ({
  onSelectEntityDetails,
  onOpenComposerWithPattern
}) => {
  const nhfgEngine = useMemo(() => new NhfgEngine(), []);
  const [activeSubTab, setActiveSubTab] = useState<'mappings' | 'principles' | 'sources' | 'scenarios' | 'validation'>('mappings');
  const [selectedSourceId, setSelectedSourceId] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMappingId, setSelectedMappingId] = useState<string | null>(NHFG_PATTERN_MAPPINGS[0]?.id || null);

  // Validation report
  const validationReport = useMemo(() => {
    return nhfgEngine.validateRegistry(CANONICAL_PATTERNS);
  }, [nhfgEngine]);

  // Filtered mappings
  const filteredMappings = useMemo(() => {
    return NHFG_PATTERN_MAPPINGS.filter(mapping => {
      const principle = nhfgEngine.getPrincipleById(mapping.principleId);
      if (selectedSourceId !== 'all' && principle?.sourceId !== selectedSourceId) {
        return false;
      }
      if (selectedCategory !== 'all' && mapping.epistemicCategory !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const pattern = CANONICAL_PATTERNS.find(p => p.id === mapping.patternId);
        const matchesText =
          mapping.patternId.toLowerCase().includes(q) ||
          mapping.rationale.toLowerCase().includes(q) ||
          (pattern && pattern.title.toLowerCase().includes(q)) ||
          (principle && principle.title.toLowerCase().includes(q));
        if (!matchesText) return false;
      }
      return true;
    });
  }, [selectedSourceId, selectedCategory, searchQuery, nhfgEngine]);

  const activeMapping = useMemo(() => {
    return NHFG_PATTERN_MAPPINGS.find(m => m.id === selectedMappingId) || filteredMappings[0] || null;
  }, [selectedMappingId, filteredMappings]);

  const activeChain = useMemo(() => {
    if (!activeMapping) return null;
    const principle = nhfgEngine.getPrincipleById(activeMapping.principleId);
    const source = principle ? nhfgEngine.getSourceById(principle.sourceId) : undefined;
    const requirement = activeMapping.requirementId ? nhfgEngine.getRequirementById(activeMapping.requirementId) : undefined;
    const verification = activeMapping.verificationReference ? nhfgEngine.getVerificationById(activeMapping.verificationReference) : undefined;
    const pattern = CANONICAL_PATTERNS.find(p => p.id === activeMapping.patternId);
    return { principle, source, requirement, verification, pattern };
  }, [activeMapping, nhfgEngine]);

  const totalRegistryEntities =
    validationReport.totalSources +
    validationReport.totalPrinciples +
    validationReport.totalRequirements +
    validationReport.totalMappings +
    validationReport.totalVerifications;

  return (
    <div className="max-w-[1560px] mx-auto px-6 py-8 space-y-8">
      {/* Top Banner & Orientation */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-cyan-950/80 text-cyan-400 border border-cyan-800">
              NHFG v1.0 · ISO 9241 PILOT
            </span>
            <span className="text-slate-500 text-xs">|</span>
            <span className="text-slate-400 text-xs font-mono">
              Нормативное и эргономическое сопровождение интерфейсов стендов
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100 flex items-center gap-2.5">
            <BookOpen className="w-6 h-6 text-cyan-400" />
            Normative & Human Factors Guidance Layer
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
            Слой связывает интерфейсные решения Atlas с международными стандартами ISO (ISO 9241-110, ISO 9241-210, ISO 9241-11).
            Гарантирует проверяемую трассируемость, честное разграничение гипотез и отсутствие ложных заявлений о сертификационном соответствии.
          </p>
        </div>

        {/* Status Guardrails summary pill */}
        <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono shrink-0">
          <div className="text-slate-400 mb-1 flex items-center gap-1.5 font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Анти-конфляционный барьер</span>
          </div>
          <div className="text-[11px] text-slate-500 space-y-0.5">
            <div>Соответствие ISO: <span className="text-amber-400 font-bold">НЕ ЗАЯВЛЯЕТСЯ</span> (честный статус)</div>
            <div>Сценарных тестов: <span className="text-emerald-400 font-bold">{validationReport.totalVerifications} ВЕРИФИЦИРОВАНО</span></div>
          </div>
        </div>
      </div>

      {/* Metric Counters Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3.5 bg-slate-900/70 border border-slate-800 rounded-lg">
          <div className="text-[11px] text-slate-400 font-mono">Стандарты ISO</div>
          <div className="text-xl font-bold font-mono text-cyan-400 mt-0.5">{validationReport.totalSources} источника</div>
          <div className="text-[10px] text-slate-500 mt-1">Официальные URL & даты</div>
        </div>

        <div className="p-3.5 bg-slate-900/70 border border-slate-800 rounded-lg">
          <div className="text-[11px] text-slate-400 font-mono">Принципы диалога</div>
          <div className="text-xl font-bold font-mono text-cyan-400 mt-0.5">{validationReport.totalPrinciples} принципов</div>
          <div className="text-[10px] text-slate-500 mt-1">ISO 9241-110:2020</div>
        </div>

        <div className="p-3.5 bg-slate-900/70 border border-slate-800 rounded-lg">
          <div className="text-[11px] text-slate-400 font-mono">Требования нормы</div>
          <div className="text-xl font-bold font-mono text-cyan-400 mt-0.5">{validationReport.totalRequirements} требований</div>
          <div className="text-[10px] text-slate-500 mt-1">Атомарные формулировки</div>
        </div>

        <div className="p-3.5 bg-slate-900/70 border border-slate-800 rounded-lg">
          <div className="text-[11px] text-slate-400 font-mono">Привязок к паттернам</div>
          <div className="text-xl font-bold font-mono text-emerald-400 mt-0.5">{validationReport.totalMappings} связей</div>
          <div className="text-[10px] text-slate-500 mt-1">Канонические паттерны</div>
        </div>

        <div className="p-3.5 bg-slate-900/70 border border-slate-800 rounded-lg">
          <div className="text-[11px] text-slate-400 font-mono">Сценарии проверки</div>
          <div className="text-xl font-bold font-mono text-amber-400 mt-0.5">{validationReport.totalVerifications} исполняемых</div>
          <div className="text-[10px] text-slate-500 mt-1">Автотесты в CI/CD</div>
        </div>

        <div className="p-3.5 bg-slate-900/70 border border-slate-800 rounded-lg">
          <div className="text-[11px] text-slate-400 font-mono">Ложные заявления</div>
          <div className="text-xl font-bold font-mono text-emerald-400 mt-0.5">0 заявлено</div>
          <div className="text-[10px] text-slate-500 mt-1">Строгий отчёт границ</div>
        </div>
      </div>

      {/* Sub Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveSubTab('mappings')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-t-lg transition-colors cursor-pointer ${
            activeSubTab === 'mappings'
              ? 'bg-slate-800 text-cyan-400 border-b-2 border-cyan-400 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Трассируемость паттернов ({NHFG_PATTERN_MAPPINGS.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('principles')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-t-lg transition-colors cursor-pointer ${
            activeSubTab === 'principles'
              ? 'bg-slate-800 text-cyan-400 border-b-2 border-cyan-400 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Принципы ISO 9241-110 ({NHFG_PRINCIPLES.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('sources')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-t-lg transition-colors cursor-pointer ${
            activeSubTab === 'sources'
              ? 'bg-slate-800 text-cyan-400 border-b-2 border-cyan-400 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Официальные источники ({NHFG_SOURCES.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('scenarios')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-t-lg transition-colors cursor-pointer ${
            activeSubTab === 'scenarios'
              ? 'bg-slate-800 text-cyan-400 border-b-2 border-cyan-400 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileCheck2 className="w-3.5 h-3.5" />
          <span>Исполняемые сценарии ({NHFG_VERIFICATIONS.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('validation')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-t-lg transition-colors cursor-pointer ${
            activeSubTab === 'validation'
              ? 'bg-slate-800 text-cyan-400 border-b-2 border-cyan-400 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Валидация реестра</span>
          {validationReport.isValid ? (
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          ) : (
            <span className="w-2 h-2 rounded-full bg-rose-400"></span>
          )}
        </button>
      </div>

      {/* Sub-View 1: Traceability & Mappings */}
      {activeSubTab === 'mappings' && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Поиск по паттерну или тексту..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded pl-8 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono w-64"
                />
              </div>

              <select
                value={selectedSourceId}
                onChange={e => setSelectedSourceId(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
              >
                <option value="all">Все стандарты (3 источника)</option>
                {NHFG_SOURCES.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.standard}: {s.title}
                  </option>
                ))}
              </select>

              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
              >
                <option value="all">Все эпистемические категории</option>
                <option value="SOURCE_CONFIRMED">SOURCE_CONFIRMED (Прямое соответствие норме)</option>
                <option value="ENGINEERING_INTERPRETATION">ENGINEERING_INTERPRETATION (Инженерный перевод)</option>
                <option value="DESIGN_HYPOTHESIS">DESIGN_HYPOTHESIS (Рабочая гипотеза)</option>
              </select>
            </div>

            <div className="text-xs font-mono text-slate-400">
              Показано: <span className="text-cyan-400 font-bold">{filteredMappings.length}</span> из {NHFG_PATTERN_MAPPINGS.length} связей
            </div>
          </div>

          {/* Master-Detail Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Mappings List */}
            <div className="lg:col-span-5 space-y-3">
              {filteredMappings.map(mapping => {
                const principle = nhfgEngine.getPrincipleById(mapping.principleId);
                const pattern = CANONICAL_PATTERNS.find(p => p.id === mapping.patternId);
                const isSelected = mapping.id === activeMapping?.id;

                return (
                  <div
                    key={mapping.id}
                    onClick={() => setSelectedMappingId(mapping.id)}
                    className={`p-4 rounded-lg border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-slate-900 border-cyan-500/60 shadow-lg shadow-cyan-950/20'
                        : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <span className="font-mono text-cyan-400 text-xs font-semibold">
                        {mapping.patternId}
                      </span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                        mapping.epistemicCategory === 'SOURCE_CONFIRMED'
                          ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800'
                          : mapping.epistemicCategory === 'ENGINEERING_INTERPRETATION'
                          ? 'bg-cyan-950/80 text-cyan-400 border-cyan-800'
                          : 'bg-amber-950/80 text-amber-400 border-amber-800'
                      }`}>
                        {mapping.epistemicCategory}
                      </span>
                    </div>

                    <div className="font-medium text-slate-200 text-xs mb-2">
                      {pattern?.title || mapping.patternId}
                    </div>

                    <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mb-2">
                      <BookOpen className="w-3 h-3 text-slate-500 shrink-0" />
                      <span className="truncate">{principle?.title} ({principle?.sectionRef})</span>
                    </div>

                    {/* Status Pill Indicators */}
                    <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono">
                      <span className="px-1.5 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                        Обоснование: ДА
                      </span>
                      <span className={`px-1.5 py-0.5 rounded border ${
                        mapping.status.scenarioVerificationStatus === 'SCENARIO_VERIFIED'
                          ? 'bg-emerald-950/50 text-emerald-400 border-emerald-800'
                          : 'bg-slate-950 text-slate-500 border-slate-800'
                      }`}>
                        Сценарий: {mapping.status.scenarioVerificationStatus === 'SCENARIO_VERIFIED' ? 'ВЕРИФИЦИРОВАН' : 'НЕ ОЦЕНЕН'}
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-slate-950 text-slate-500 border border-slate-800">
                        Сертификация: НЕТ
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Column: Detailed Traceability Chain Inspector */}
            <div className="lg:col-span-7">
              {activeChain && activeMapping ? (
                <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-6 sticky top-20">
                  {/* Trace Header */}
                  <div className="border-b border-slate-800 pb-4">
                    <div className="flex items-center justify-between gap-4 mb-2">
                      <span className="text-xs font-mono text-slate-500 uppercase">
                        Инспекция сквозной цепочки обоснования
                      </span>
                      <span className="text-xs font-mono text-cyan-400">
                        ID: {activeMapping.id}
                      </span>
                    </div>
                    <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                      <span>{activeChain.pattern?.title}</span>
                      <span className="text-xs font-mono text-cyan-400">({activeMapping.patternId})</span>
                    </h2>
                  </div>

                  {/* Complete 4-Step Chain Flow */}
                  <div className="space-y-3 font-mono text-xs">
                    {/* Step 1: ISO Source */}
                    <div className="p-3 bg-slate-950 rounded border border-slate-800">
                      <div className="flex items-center justify-between text-slate-500 mb-1">
                        <span className="font-semibold text-cyan-400">1. МЕЖДУНАРОДНЫЙ СТАНДАРТ (ИСТОЧНИК)</span>
                        <a
                          href={activeChain.source?.officialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-cyan-400 hover:underline"
                        >
                          <span>Официальный URL</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                      <div className="text-slate-200 font-bold">{activeChain.source?.standard}: {activeChain.source?.title}</div>
                      <div className="text-[11px] text-slate-400 mt-1">
                        Дата публикации: {activeChain.source?.publicationDate}
                        {activeChain.source?.confirmedDate && ` · Подтверждён: ${activeChain.source?.confirmedDate}`}
                        {` · Проверен в Atlas: ${activeChain.source?.atlasVerifiedDate}`}
                      </div>
                    </div>

                    <div className="flex justify-center text-slate-600">
                      <ArrowRight className="w-4 h-4 rotate-90" />
                    </div>

                    {/* Step 2: Principle */}
                    <div className="p-3 bg-slate-950 rounded border border-slate-800">
                      <div className="text-cyan-400 font-semibold mb-1">
                        2. ЭРГОНОМИЧЕСКИЙ ПРИНЦИП ДИАЛОГА ({activeChain.principle?.sectionRef})
                      </div>
                      <div className="text-slate-200 font-bold">{activeChain.principle?.title}</div>
                      <p className="text-slate-400 text-[11px] mt-1 font-sans leading-relaxed">
                        {activeChain.principle?.conciseSummary}
                      </p>
                    </div>

                    {activeChain.requirement && (
                      <>
                        <div className="flex justify-center text-slate-600">
                          <ArrowRight className="w-4 h-4 rotate-90" />
                        </div>

                        {/* Step 3: Requirement */}
                        <div className="p-3 bg-slate-950 rounded border border-slate-800">
                          <div className="flex items-center justify-between text-cyan-400 font-semibold mb-1">
                            <span>3. НОРМАТИВНОЕ ТРЕБОВАНИЕ [{activeChain.requirement.id}]</span>
                            <span className="text-[10px] text-amber-400 font-mono">
                              {activeChain.requirement.safetyCritical ? 'КРИТИЧНО ДЛЯ БЕЗОПАСНОСТИ' : 'ЭРГОНОМИКА'}
                            </span>
                          </div>
                          <div className="text-slate-200 font-medium font-sans text-xs">
                            "{activeChain.requirement.statement}"
                          </div>
                          <div className="text-[11px] text-slate-400 mt-1 font-sans">
                            Тип: <span className="font-mono text-slate-300">{activeChain.requirement.requirementType}</span> · Раздел: {activeChain.requirement.sectionRef}
                          </div>
                        </div>
                      </>
                    )}

                    <div className="flex justify-center text-slate-600">
                      <ArrowRight className="w-4 h-4 rotate-90" />
                    </div>

                    {/* Step 4: Pattern & Rationale */}
                    <div className="p-3 bg-slate-950 rounded border border-slate-800">
                      <div className="text-cyan-400 font-semibold mb-1">
                        4. ИНЖЕНЕРНЫЙ ПАТТЕРН ATLAS & ОБОСНОВАНИЕ
                      </div>
                      <p className="text-slate-200 text-xs font-sans leading-relaxed">
                        {activeMapping.rationale}
                      </p>
                    </div>
                  </div>

                  {/* Applicability & Limitations */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
                    <div className="p-3 bg-slate-950/60 rounded border border-slate-800">
                      <div className="text-emerald-400 font-semibold mb-1.5 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Условия применимости</span>
                      </div>
                      <ul className="text-slate-400 text-xs space-y-1 list-disc list-inside">
                        {activeMapping.applicabilityConditions.map((cond, i) => (
                          <li key={i}>{cond}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3 bg-slate-950/60 rounded border border-slate-800">
                      <div className="text-amber-400 font-semibold mb-1.5 flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Известные ограничения</span>
                      </div>
                      <ul className="text-slate-400 text-xs space-y-1 list-disc list-inside">
                        {activeMapping.knownLimitations.map((lim, i) => (
                          <li key={i}>{lim}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Verification Record & Untested Boundaries */}
                  <div className="p-4 bg-slate-950 rounded border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                        <FileCheck2 className="w-4 h-4 text-cyan-400" />
                        Доказательная база и подтверждение
                      </span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                        activeMapping.status.scenarioVerificationStatus === 'SCENARIO_VERIFIED'
                          ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                          : 'bg-slate-900 text-slate-400 border-slate-800'
                      }`}>
                        Статус: {activeMapping.status.scenarioVerificationStatus}
                      </span>
                    </div>

                    {activeChain.verification ? (
                      <div className="text-xs text-slate-300 space-y-1 font-mono">
                        <div>Тест: <span className="text-cyan-400">{activeChain.verification.testFileRef}</span> · {activeChain.verification.testName}</div>
                        <div className="font-sans text-slate-400">{activeChain.verification.scenarioTitle}</div>
                        {activeChain.verification.untestedBoundaries.length > 0 && (
                          <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 font-sans">
                            <span className="text-rose-400 font-semibold">Непроверенные границы: </span>
                            {activeChain.verification.untestedBoundaries.join('; ')}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-xs text-slate-500 font-sans italic">
                        Автоматизированный сценарий для данной связи находится в очереди проектирования.
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center bg-slate-900/50 border border-slate-800 rounded-lg text-slate-500 text-sm">
                  Выберите привязку из списка для детального анализа.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Sub-View 2: ISO 9241-110 Principles */}
      {activeSubTab === 'principles' && (
        <div className="space-y-4">
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-400 leading-relaxed">
            Стандарт <span className="text-slate-200 font-semibold">ISO 9241-110:2020</span> регламентирует 7 принципов эргономического взаимодействия человека и системы.
            Каждый принцип разбит на атомарные требования и сопоставлен с инженерными шаблонами Atlas.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {NHFG_PRINCIPLES.map(prin => {
              const mapped = nhfgEngine.getPatternsForPrinciple(prin.id);

              return (
                <div
                  key={prin.id}
                  className="p-5 bg-slate-900/70 border border-slate-800 rounded-lg flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs font-mono text-cyan-400 mb-2">
                      <span>{prin.sectionRef}</span>
                      <span className="text-slate-500">{prin.sourceId.replace('src-', '')}</span>
                    </div>

                    <h3 className="text-base font-bold text-slate-100 mb-2">
                      {prin.title}
                    </h3>

                    <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                      {prin.conciseSummary}
                    </p>

                    <div className="p-3 bg-slate-950 rounded border border-slate-800 mb-4 text-xs font-mono">
                      <span className="text-[10px] text-slate-500 uppercase block mb-1">
                        Ограничения интерпретации:
                      </span>
                      <span className="text-slate-300 text-[11px] font-sans">
                        {prin.interpretationLimitations.join('; ')}
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className="pt-3 border-t border-slate-800 text-xs">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-400 font-medium">Связанные паттерны:</span>
                        <span className="font-mono text-cyan-400">{mapped.length}</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {mapped.map(m => (
                          <span
                            key={m.patternId}
                            className="px-2 py-0.5 bg-slate-950 text-cyan-400 border border-slate-800 rounded text-[11px] font-mono"
                          >
                            {m.patternId}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Sub-View 3: Verified ISO Sources */}
      {activeSubTab === 'sources' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {NHFG_SOURCES.map(source => (
            <div
              key={source.id}
              className="p-6 bg-slate-900 border border-slate-800 rounded-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-mono mb-3">
                  <span className="text-cyan-400 font-bold">{source.id}</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800 text-[10px]">
                    {source.verificationStatus}
                  </span>
                </div>

                <div className="text-lg font-bold text-slate-100 mb-1">
                  {source.standard}
                </div>

                <div className="text-xs text-cyan-300 font-medium mb-3">
                  {source.title}
                </div>

                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  {source.scopeSummary}
                </p>

                <div className="space-y-1.5 text-xs font-mono text-slate-500 bg-slate-950 p-3 rounded border border-slate-800">
                  <div>Дата издания: <span className="text-slate-300">{source.publicationDate}</span></div>
                  {source.confirmedDate && (
                    <div>Подтверждение: <span className="text-slate-300">{source.confirmedDate}</span></div>
                  )}
                  <div>Верифицирован: <span className="text-slate-300">{source.atlasVerifiedDate}</span></div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800">
                <a
                  href={source.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-semibold rounded transition-colors"
                >
                  <span>Официальный каталог ISO</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Sub-View 4: Executable Verifications */}
      {activeSubTab === 'scenarios' && (
        <div className="space-y-6">
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-300 leading-relaxed">
            <span className="font-semibold text-cyan-400">Исполняемые сценарии (Executable Verification Records):</span>{' '}
            в отличие от деклараций соответствия, каждый верифицированный паттерн сопровождается воспроизводимым тестом на граничные условия стенда.
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {NHFG_VERIFICATIONS.map(verif => (
              <div key={verif.id} className="p-6 bg-slate-900 border border-slate-800 rounded-lg space-y-4">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-cyan-400 font-bold">{verif.id}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] border ${
                    verif.passed
                      ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800'
                      : 'bg-rose-950/80 text-rose-400 border-rose-800'
                  }`}>
                    {verif.passed ? 'PASSED (CI/CD)' : 'FAILED'}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-100 mb-1">
                    {verif.scenarioTitle}
                  </h3>
                  <div className="text-xs text-cyan-300 font-mono">
                    Требование: {verif.requirementId}
                  </div>
                </div>

                <div className="space-y-2 text-xs font-mono bg-slate-950 p-3.5 rounded border border-slate-800">
                  <div className="text-slate-500">
                    Тестовый файл: <span className="text-slate-300">{verif.testFileRef}</span>
                  </div>
                  <div className="text-slate-500">
                    Тест: <span className="text-slate-300">{verif.testName}</span>
                  </div>
                  <div className="text-slate-500">
                    Дата прогона: <span className="text-slate-300">{verif.executedAt}</span>
                  </div>
                  {verif.untestedBoundaries.length > 0 && (
                    <div className="text-amber-400 pt-1 border-t border-slate-800">
                      Непроверенные границы: <span className="text-slate-400">{verif.untestedBoundaries.join('; ')}</span>
                    </div>
                  )}
                </div>

                {/* Interactive Simulation Sandbox for Scenario 1 */}
                {verif.id === 'verif-req-no-data-scenario-01' && (
                  <div className="mt-4 p-4 bg-slate-950 border border-cyan-500/30 rounded-lg space-y-3">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-cyan-400 font-bold flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                        Интерактивная проверка сценария
                      </span>
                      <span className="text-slate-500 text-[10px]">Телеметрия давления</span>
                    </div>

                    <div className="text-xs text-slate-400">
                      Сравнение двух подходов при обрыве провода датчика (null value):
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                      {/* Naive fallback */}
                      <div className="p-3 bg-rose-950/30 border border-rose-900/60 rounded">
                        <div className="text-rose-400 font-bold text-[11px] mb-1">
                          Наивный UI (Без паттерна)
                        </div>
                        <div className="text-slate-400 text-[10px]">Замена null на 0.0:</div>
                        <div className="text-rose-300 text-sm font-bold my-1">
                          {((101.3 + 101.5 + 0.0) / 3).toFixed(1)} кПа (ИСКАЖЕНО)
                        </div>
                        <div className="text-[10px] text-rose-400">
                          Искажение среднего на 33.3%, ложное срабатывание аварии.
                        </div>
                      </div>

                      {/* Atlas Epistemic Pattern */}
                      <div className="p-3 bg-emerald-950/30 border border-emerald-900/60 rounded">
                        <div className="text-emerald-400 font-bold text-[11px] mb-1">
                          Atlas pat-epistemic-status
                        </div>
                        <div className="text-slate-400 text-[10px]">Изоляция MISSING_SAMPLE:</div>
                        <div className="text-emerald-300 text-sm font-bold my-1">
                          {((101.3 + 101.5) / 2).toFixed(1)} кПа + [NO_DATA]
                        </div>
                        <div className="text-[10px] text-emerald-400">
                          Среднее 101.4 кПа сохранено, статус канала помечен как NO_DATA.
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub-View 5: Registry Validation */}
      {activeSubTab === 'validation' && (
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                Формальный отчёт целостности реестра NHFG
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Проверка отсутствия фантомных ID, корректности статусов и соблюдения анти-конфляционных инвариантов.
              </p>
            </div>
            <div className={`px-3 py-1 rounded text-xs font-mono font-bold border ${
              validationReport.isValid
                ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                : 'bg-rose-950 text-rose-400 border-rose-800'
            }`}>
              {validationReport.isValid ? 'ВЕРДИКТ: ПРИНЯТО (ACCEPTED)' : 'ВЕРДИКТ: ОШИБКИ'}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
            <div className="p-3 bg-slate-950 rounded border border-slate-800">
              <span className="text-slate-500 block">Всего записей NHFG:</span>
              <span className="text-slate-200 text-base font-bold">{totalRegistryEntities}</span>
            </div>
            <div className="p-3 bg-slate-950 rounded border border-slate-800">
              <span className="text-slate-500 block">Ошибок ссылок:</span>
              <span className="text-emerald-400 text-base font-bold">
                {validationReport.unresolvedSourceRefs.length +
                  validationReport.unresolvedPrincipleRefs.length +
                  validationReport.unresolvedRequirementRefs.length}
              </span>
            </div>
            <div className="p-3 bg-slate-950 rounded border border-slate-800">
              <span className="text-slate-500 block">Фантомных паттернов:</span>
              <span className="text-emerald-400 text-base font-bold">{validationReport.unresolvedPatternRefs.length}</span>
            </div>
            <div className="p-3 bg-slate-950 rounded border border-slate-800">
              <span className="text-slate-500 block">Недопустимых статусов:</span>
              <span className="text-emerald-400 text-base font-bold">{validationReport.invalidStatusMappings.length}</span>
            </div>
          </div>

          {validationReport.invalidStatusMappings.length > 0 && (
            <div className="p-4 bg-rose-950/40 border border-rose-800 rounded text-xs space-y-1">
              <div className="font-bold text-rose-300">Найдены критические ошибки:</div>
              {validationReport.invalidStatusMappings.map((err, i) => (
                <div key={i} className="text-rose-400 font-mono">● {err.mappingId}: {err.error}</div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
