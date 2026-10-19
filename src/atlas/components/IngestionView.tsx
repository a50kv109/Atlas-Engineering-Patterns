import React, { useState } from 'react';
import {
  ProposalInput,
  IngestionReviewResult,
  EntityType,
  RelationType,
  LifecycleStatus,
  AtlasEntity
} from '../types';
import { IngestionEngine } from '../ingestionEngine';
import {
  PlusCircle,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileText,
  ArrowRight,
  ShieldAlert,
  RotateCcw
} from 'lucide-react';

interface IngestionViewProps {
  existingEntities: AtlasEntity[];
  onAddNewEntity: (entity: AtlasEntity) => void;
}

export const IngestionView: React.FC<IngestionViewProps> = ({
  existingEntities,
  onAddNewEntity
}) => {
  const [title, setTitle] = useState('');
  const [targetType, setTargetType] = useState<EntityType>('pattern');
  const [domainCategory, setDomainCategory] = useState<'layout' | 'telemetry' | 'controls' | 'safety' | 'guidance' | 'multi-screen'>('telemetry');
  const [problemStatement, setProblemStatement] = useState('');
  const [solutionDescription, setSolutionDescription] = useState('');
  const [author, setAuthor] = useState('');
  const [lifecycleStatus, setLifecycleStatus] = useState<LifecycleStatus>('PROPOSED');
  const [selectedRelationType, setSelectedRelationType] = useState<RelationType>('USES');
  const [selectedTargetId, setSelectedTargetId] = useState<string>(existingEntities[0]?.id || '');

  const [reviewResult, setReviewResult] = useState<IngestionReviewResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addedSuccessMessage, setAddedSuccessMessage] = useState<string | null>(null);

  // Preset Proposals for Testing
  const loadPresetProposal = (type: 'valid' | 'duplicate' | 'outofscope') => {
    setAddedSuccessMessage(null);
    if (type === 'valid') {
      setTitle('Piezoelectric Vibration Spectrogram Canvas');
      setTargetType('primitive');
      setDomainCategory('telemetry');
      setProblemStatement('Acoustic emission and bearing vibration sensors on rotary test stands produce high-frequency bursts that cannot be diagnosed on static dials.');
      setSolutionDescription('Real-time rolling color spectrogram canvas with Viridis colormap and FFT binning, synchronized with the stand tachometer.');
      setAuthor('Acoustics & Vibration Laboratory');
      setLifecycleStatus('PROPOSED');
      setSelectedRelationType('COMPOSES_WITH');
      setSelectedTargetId('prim-time-series-strip');
    } else if (type === 'duplicate') {
      setTitle('Scrolling Time-Series Sensor Waveform Strip');
      setTargetType('primitive');
      setDomainCategory('telemetry');
      setProblemStatement('Stand operators need to observe continuous analog sensor streams over time with auto-ranging axes on a canvas.');
      setSolutionDescription('A scrolling canvas strip chart that renders live sensor waveforms with time-sync and pause buffer.');
      setAuthor('Duplicate Submitter');
      setLifecycleStatus('PROPOSED');
      setSelectedRelationType('COMPOSES_WITH');
      setSelectedTargetId('prim-stepper-scrubber');
    } else if (type === 'outofscope') {
      setTitle('Ethereum Web3 Crypto Payment & Token Staking Widget');
      setTargetType('primitive');
      setDomainCategory('controls');
      setProblemStatement('Students and researchers need to pay for stand beam-time using cryptocurrency wallets and decentralized token staking.');
      setSolutionDescription('Embed a MetaMask Web3 connect button and NFT receipt generator directly into the stand header.');
      setAuthor('Crypto Speculator');
      setLifecycleStatus('PROPOSED');
      setSelectedRelationType('USES');
      setSelectedTargetId('prim-emergency-estop-banner');
    }
  };

  const handleRunPipeline = () => {
    setAddedSuccessMessage(null);
    setIsSubmitting(true);

    const proposal: ProposalInput = {
      title,
      targetType,
      domainCategory,
      problemStatement,
      solutionDescription,
      lifecycleStatus,
      author,
      proposedRelations: selectedTargetId
        ? [{ relation: selectedRelationType, targetId: selectedTargetId, rationale: 'Proposed during ingestion workflow' }]
        : []
    };

    const engine = new IngestionEngine(existingEntities);
    const result = engine.reviewProposal(proposal);
    setReviewResult(result);
    setIsSubmitting(false);
  };

  const handleAcceptIntoRegistry = () => {
    if (!reviewResult) return;

    const newEntity: AtlasEntity = {
      id: reviewResult.generatedId,
      type: targetType,
      title,
      shortDescription: solutionDescription.slice(0, 140) + '...',
      fullDescription: solutionDescription,
      lifecycleStatus: 'PROPOSED',
      domainCategory,
      tags: [domainCategory, targetType, 'candidate-ingested'],
      relations: selectedTargetId
        ? [{ sourceId: reviewResult.generatedId, relation: selectedRelationType, targetId: selectedTargetId }]
        : [],
      evidenceIds: [],
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      authorOrSource: author,
      ...(targetType === 'primitive'
        ? {
            uiSlot: 'viewport',
            renderingTech: 'Canvas',
            minFootprintPixels: { width: 320, height: 200 },
            supportsTouch: true,
            supportsKeyboard: true
          }
        : targetType === 'pattern'
        ? {
            problemStatement,
            solutionSummary: solutionDescription,
            tradeOffs: { advantages: ['Modularity'], disadvantages: ['Requires testing'] },
            applicability: { purposes: ['RESEARCH_BENCH'], targetLevels: ['RESEARCHER'], minScreens: 1 },
            primitiveIds: []
          }
        : {})
    } as any;

    onAddNewEntity(newEntity);
    setAddedSuccessMessage(`Успешно включено в реестр под стабильным идентификатором ${newEntity.id}`);
  };

  return (
    <div className="max-w-[1560px] mx-auto px-6 py-8">
      {/* Title */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-100 mb-1 flex items-center gap-2">
          <PlusCircle className="w-6 h-6 text-cyan-400" />
          Приём и валидация новых паттернов (Ingestion Pipeline)
        </h1>
        <p className="text-xs text-slate-400 max-w-4xl">
          Автоматизированный конвейер проверки предлагаемых идей: фильтрация предметной области (Scope Check), поиск дубликатов и синонимов, генерация стабильного ID, верификация схемы и связей в графе.
        </p>
      </div>

      {/* Preset Buttons for Quick Testing */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
        <span className="text-xs font-mono text-slate-500 whitespace-nowrap">Тестовые сценарии:</span>
        <button
          onClick={() => loadPresetProposal('valid')}
          className="px-2.5 py-1 text-xs bg-emerald-950/40 hover:bg-emerald-900/50 text-emerald-300 rounded border border-emerald-900/50 cursor-pointer"
        >
          ✓ Валидный примитив (Piezo Spectrogram)
        </button>
        <button
          onClick={() => loadPresetProposal('duplicate')}
          className="px-2.5 py-1 text-xs bg-amber-950/40 hover:bg-amber-900/50 text-amber-300 rounded border border-amber-900/50 cursor-pointer"
        >
          ⚠ Дубликат (Time-Series Strip)
        </button>
        <button
          onClick={() => loadPresetProposal('outofscope')}
          className="px-2.5 py-1 text-xs bg-rose-950/40 hover:bg-rose-900/50 text-rose-300 rounded border border-rose-900/50 cursor-pointer"
        >
          ✖ Вне скоупа (Web3 Payment Widget)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Proposal Form */}
        <div className="lg:col-span-5 bg-slate-900/70 border border-slate-800 p-5 rounded-lg space-y-4">
          <h2 className="text-sm font-semibold text-slate-200 border-b border-slate-800 pb-2">
            Форма подачи проектного предложения
          </h2>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Название сущности</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Piezoelectric Vibration Spectrogram Canvas"
              className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Тип сущности</label>
              <select
                value={targetType}
                onChange={e => setTargetType(e.target.value as EntityType)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
              >
                <option value="primitive">primitive (Примитив)</option>
                <option value="pattern">pattern (Паттерн)</option>
                <option value="configuration">configuration (Стенд)</option>
                <option value="implementation">implementation (Реализация)</option>
                <option value="evidence">evidence (Свидетельство)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Категория</label>
              <select
                value={domainCategory}
                onChange={e => setDomainCategory(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
              >
                <option value="telemetry">telemetry</option>
                <option value="controls">controls</option>
                <option value="layout">layout</option>
                <option value="safety">safety</option>
                <option value="guidance">guidance</option>
                <option value="multi-screen">multi-screen</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Проблема проектирования интерфейса (Problem Statement)
            </label>
            <textarea
              rows={3}
              value={problemStatement}
              onChange={e => setProblemStatement(e.target.value)}
              placeholder="Какую проблему взаимодействия, визуализации или безопасности на стенде решает предложение..."
              className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Описание решения и механизма (Solution Description)
            </label>
            <textarea
              rows={3}
              value={solutionDescription}
              onChange={e => setSolutionDescription(e.target.value)}
              placeholder="Как устроен примитив или паттерн, параметры обновления, слоты компоновки..."
              className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Автор / Лаборатория (Author / Source)</label>
            <input
              type="text"
              value={author}
              onChange={e => setAuthor(e.target.value)}
              placeholder="e.g. Acoustics & Vibration Laboratory"
              className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Relation Link Proposal */}
          <div className="pt-2 border-t border-slate-800">
            <label className="block text-xs font-medium text-slate-400 mb-1">Предлагаемая связь в графе</label>
            <div className="grid grid-cols-2 gap-2">
              <select
                value={selectedRelationType}
                onChange={e => setSelectedRelationType(e.target.value as RelationType)}
                className="bg-slate-950 border border-slate-800 rounded px-2 py-1.5 text-xs text-slate-200 font-mono"
              >
                <option value="USES">USES</option>
                <option value="COMPOSES_WITH">COMPOSES_WITH</option>
                <option value="REQUIRES">REQUIRES</option>
                <option value="ALTERNATIVE_TO">ALTERNATIVE_TO</option>
                <option value="CONFLICTS_WITH">CONFLICTS_WITH</option>
              </select>

              <select
                value={selectedTargetId}
                onChange={e => setSelectedTargetId(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded px-2 py-1.5 text-xs text-slate-200 font-mono"
              >
                {existingEntities.map(e => (
                  <option key={e.id} value={e.id}>
                    {e.id} ({e.type})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handleRunPipeline}
            disabled={!title || !problemStatement || !solutionDescription || !author}
            className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 text-xs font-bold uppercase tracking-wider rounded transition-colors cursor-pointer"
          >
            Запустить аудит приёма (Run Ingestion Pipeline)
          </button>
        </div>

        {/* Right Column: Pipeline Review Results */}
        <div className="lg:col-span-7 space-y-6">
          {reviewResult ? (
            <div className="space-y-4">
              {/* Verdict Banner */}
              <div
                className={`p-4 rounded-lg border flex items-center justify-between ${
                  reviewResult.recommendation === 'ACCEPT_CANDIDATE'
                    ? 'bg-emerald-950/30 border-emerald-800 text-emerald-300'
                    : reviewResult.recommendation === 'FLAG_DUPLICATE'
                    ? 'bg-amber-950/30 border-amber-800 text-amber-300'
                    : 'bg-rose-950/30 border-rose-800 text-rose-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  {reviewResult.recommendation === 'ACCEPT_CANDIDATE' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : reviewResult.recommendation === 'FLAG_DUPLICATE' ? (
                    <AlertTriangle className="w-5 h-5 text-amber-400" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-400" />
                  )}
                  <div>
                    <span className="font-bold text-sm block">
                      РЕКОМЕНДАЦИЯ КОНВЕЙЕРА: {reviewResult.recommendation}
                    </span>
                    <span className="text-xs font-mono opacity-80">
                      Назначенный ID: {reviewResult.generatedId}
                    </span>
                  </div>
                </div>

                {reviewResult.recommendation === 'ACCEPT_CANDIDATE' && !addedSuccessMessage && (
                  <button
                    onClick={handleAcceptIntoRegistry}
                    className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded transition-colors cursor-pointer"
                  >
                    Включить в канонический реестр
                  </button>
                )}
              </div>

              {addedSuccessMessage && (
                <div className="p-3 bg-emerald-950/40 border border-emerald-700 text-emerald-300 text-xs rounded">
                  ✓ {addedSuccessMessage}
                </div>
              )}

              {/* Inspection Steps Breakdown */}
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-4 text-xs">
                {/* 1. Scope Boundary */}
                <div className="border-b border-slate-800 pb-3">
                  <div className="flex items-center justify-between font-mono mb-1">
                    <span className="text-slate-400">1. ПРОВЕРКА ГРАНИЦ ПРЕДМЕТНОЙ ОБЛАСТИ (SCOPE):</span>
                    <span className={reviewResult.scopeVerdict === 'IN_SCOPE' ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                      [{reviewResult.scopeVerdict}]
                    </span>
                  </div>
                  <p className="text-slate-300">{reviewResult.scopeReason}</p>
                </div>

                {/* 2. Duplicate Analysis */}
                <div className="border-b border-slate-800 pb-3">
                  <div className="flex items-center justify-between font-mono mb-1">
                    <span className="text-slate-400">2. АНАЛИЗ ДУБЛИКАТОВ И СИНОНИМОВ:</span>
                    <span className={reviewResult.duplicateAnalysis.isDuplicate ? 'text-amber-400 font-bold' : 'text-emerald-400 font-bold'}>
                      {reviewResult.duplicateAnalysis.isDuplicate ? '[ДУБЛИКАТ ОБНАРУЖЕН]' : '[УНИКАЛЕН]'}
                    </span>
                  </div>
                  <p className="text-slate-300">{reviewResult.duplicateAnalysis.explanation}</p>
                </div>

                {/* 3. Schema Integrity */}
                <div className="border-b border-slate-800 pb-3">
                  <div className="flex items-center justify-between font-mono mb-1">
                    <span className="text-slate-400">3. ЦЕЛОСТНОСТЬ СХЕМЫ И ОБЯЗАТЕЛЬНЫХ ПОЛЕЙ:</span>
                    <span className={reviewResult.schemaValid ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                      {reviewResult.schemaValid ? '[ВАЛИДНА]' : '[ОШИБКИ]'}
                    </span>
                  </div>
                  {reviewResult.schemaErrors.length === 0 ? (
                    <p className="text-slate-300">Все обязательные поля и типы данных соответствуют спецификации.</p>
                  ) : (
                    <ul className="list-disc pl-4 text-rose-400 space-y-1">
                      {reviewResult.schemaErrors.map((err, i) => (
                        <li key={i}>{err}</li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* 4. Graph Relation Integrity */}
                <div>
                  <div className="flex items-center justify-between font-mono mb-1">
                    <span className="text-slate-400">4. ВАЛИДНОСТЬ СВЯЗЕЙ В ОНТОЛОГИИ ГРАФА:</span>
                    <span className={reviewResult.relationValidation.valid ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                      {reviewResult.relationValidation.valid ? '[СВЯЗИ ВАЛИДНЫ]' : '[ОШИБКИ]'}
                    </span>
                  </div>
                  {reviewResult.relationValidation.valid ? (
                    <p className="text-slate-300">
                      Целевой узел существует, семантика отношения разрешена правилами RELATION_RULES.
                    </p>
                  ) : (
                    <ul className="list-disc pl-4 text-rose-400 space-y-1">
                      {reviewResult.relationValidation.errors.map((err, i) => (
                        <li key={i}>{err}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {/* Full Ingestion Audit Report Monospace Box */}
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
                <span className="text-xs font-mono text-slate-400 block mb-2">
                  ФОРМАЛЬНЫЙ ОТЧЕТ КОНВЕЙЕРА ПРИЁМА (AUDIT TRAIL):
                </span>
                <pre className="font-mono text-[11px] text-slate-300 bg-slate-950 p-3 rounded border border-slate-800 overflow-x-auto whitespace-pre">
                  {reviewResult.reviewReport}
                </pre>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[380px] flex flex-col items-center justify-center text-center p-8 border border-slate-800 rounded-lg bg-slate-900/40">
              <FileText className="w-10 h-10 text-slate-600 mb-3" />
              <h3 className="text-sm font-semibold text-slate-300 mb-1">Конвейер ожидает предложение</h3>
              <p className="text-xs text-slate-500 max-w-md">
                Заполните форму слева или выберите один из готовых тестовых сценариев («Валидный», «Дубликат», «Вне скоупа») для демонстрации проверки.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
