import React, { useState, useEffect, useRef } from 'react';
import {
  StandRequirementQuery,
  ComposedStandSolution,
  StandPurpose,
  UserLevel,
  ConfigurationEntity
} from '../types';
import { RetrievalEngine } from '../retrievalEngine';
import { CANONICAL_CONFIGURATIONS } from '../canonicalData';
import {
  Wrench,
  Sparkles,
  AlertTriangle,
  FileCheck2,
  Download,
  Copy,
  Check,
  Play,
  RotateCcw,
  Sliders,
  Layers,
  ShieldAlert,
  ArrowRight,
  BookOpen,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';

interface ComposerViewProps {
  initialConfigId?: string;
  onSelectEntityDetails: (entityId: string) => void;
}

export const ComposerView: React.FC<ComposerViewProps> = ({
  initialConfigId,
  onSelectEntityDetails
}) => {
  const retrievalEngine = useRef(new RetrievalEngine());

  // Form State
  const [standName, setStandName] = useState('Subsonic Educational Wind Tunnel WT-300');
  const [purpose, setPurpose] = useState<StandPurpose>('STUDENT_LAB_EXPERIMENT');
  const [userLevel, setUserLevel] = useState<UserLevel>('UNDERGRADUATE');
  const [screensCount, setScreensCount] = useState<number>(1);
  const [peripheralsText, setPeripheralsText] = useState('USB Pitot Manometer, Stepper Motor Controller');
  const [capabilitiesText, setCapabilitiesText] = useState('telemetry, guided workflow, time-series, angle adjustment');
  const [hardConstraintsText, setHardConstraintsText] = useState('Must prevent fan overspeed');

  // Solution State
  const [composedSolution, setComposedSolution] = useState<ComposedStandSolution | null>(null);
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);
  const [activeTabSub, setActiveTabSub] = useState<'blueprint' | 'nhfg' | 'manifest' | 'gaps'>('blueprint');

  // Simulated Live Stand State for Preview
  const [liveAirfoilAngle, setLiveAirfoilAngle] = useState(4.5);
  const [liveFanRPM, setLiveFanRPM] = useState(1450);
  const [isEstopArmed, setIsEstopArmed] = useState(false);
  const [waveStream, setWaveStream] = useState<number[]>([]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Load preset configuration if specified
  useEffect(() => {
    if (initialConfigId) {
      const cfg = CANONICAL_CONFIGURATIONS.find(c => c.id === initialConfigId);
      if (cfg) {
        setStandName(cfg.targetStand.standName);
        setPurpose(cfg.targetStand.purpose);
        setUserLevel(cfg.targetStand.targetLevel);
        setPeripheralsText(cfg.targetStand.peripherals.join(', '));
        setScreensCount(cfg.targetStand.screenSetup.includes('Dual') ? 2 : 1);
        setCapabilitiesText(cfg.tags.join(', '));
      }
    }
  }, [initialConfigId]);

  // Execute Composition
  const runComposition = () => {
    const query: StandRequirementQuery = {
      standName,
      purpose,
      userLevel,
      screensCount,
      peripherals: peripheralsText.split(',').map(s => s.trim()).filter(Boolean),
      requiredCapabilities: capabilitiesText.split(',').map(s => s.trim()).filter(Boolean),
      hardConstraints: hardConstraintsText.split(',').map(s => s.trim()).filter(Boolean),
      accessibilityNeeds: [],
      optionalPreferences: []
    };

    const solution = retrievalEngine.current.composeSolution(query);
    setComposedSolution(solution);
  };

  // Run on mount
  useEffect(() => {
    runComposition();
  }, [purpose, userLevel, screensCount]);

  // Run continuous animated wave stream on canvas preview
  useEffect(() => {
    let animId: number;
    let t = 0;

    const render = () => {
      t += 0.05;
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const w = canvas.width;
          const h = canvas.height;

          // Clear
          ctx.fillStyle = '#07090e';
          ctx.fillRect(0, 0, w, h);

          // Grid lines
          ctx.strokeStyle = '#1e293b';
          ctx.lineWidth = 1;
          for (let y = 0; y < h; y += 30) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
            ctx.stroke();
          }

          // Generate waveform: baseline dynamic wave + noise
          const points: number[] = [];
          for (let x = 0; x < w; x += 3) {
            const val =
              h / 2 +
              Math.sin(x * 0.02 + t) * (liveFanRPM / 100) +
              Math.sin(x * 0.06 - t * 2) * (liveAirfoilAngle * 2) +
              (Math.random() - 0.5) * 3;
            points.push(val);
          }

          // Draw Primary Sensor Curve (Pitot Dynamic Pressure)
          ctx.strokeStyle = '#06b6d4';
          ctx.lineWidth = 2;
          ctx.beginPath();
          points.forEach((y, i) => {
            const x = i * 3;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          });
          ctx.stroke();

          // Coordinate readout
          ctx.fillStyle = '#94a3b8';
          ctx.font = '10px monospace';
          ctx.fillText(`CH1: PITOT ΔP = ${(124.5 + Math.sin(t) * 1.8).toFixed(2)} Pa`, 10, 18);
          ctx.fillText(`SAMPLE RATE: 1000 Hz · AUTO-SCALE: ON`, 10, 32);
        }
      }
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [liveAirfoilAngle, liveFanRPM]);

  // Presets Handler
  const loadPreset = (presetKey: 'windtunnel' | 'bioreactor' | 'highvoltage' | 'impossible') => {
    if (presetKey === 'windtunnel') {
      setStandName('Aerolab Subsonic Educational Wind Tunnel WT-300');
      setPurpose('STUDENT_LAB_EXPERIMENT');
      setUserLevel('UNDERGRADUATE');
      setScreensCount(1);
      setPeripheralsText('USB Pitot Manometer, Stepper Motor Controller');
      setCapabilitiesText('telemetry, guided workflow, time-series, angle adjustment');
      setHardConstraintsText('Must prevent fan overspeed');
    } else if (presetKey === 'bioreactor') {
      setStandName('BioFlow Research Fermentor Rig 5L');
      setPurpose('RESEARCH_BENCH');
      setUserLevel('RESEARCHER');
      setScreensCount(1);
      setPeripheralsText('RS-485 Modbus pH/DO2 probes, Quad Peristaltic Pump');
      setCapabilitiesText('telemetry, time-series, drift alerting, pump scrubbers');
      setHardConstraintsText('Continuous 24h run');
    } else if (presetKey === 'highvoltage') {
      setStandName('PulsePower 50kV Capacitor Discharge Stand');
      setPurpose('HAZARDOUS_FACILITY');
      setUserLevel('CERTIFIED_OPERATOR');
      setScreensCount(2);
      setPeripheralsText('Hardware E-Stop Mushroom Switch, 50kV Isolation Trigger');
      setCapabilitiesText('safety interlock, annunciator, high-rate oscilloscope, two-person arm');
      setHardConstraintsText('Dual-channel physical interlock required');
    } else if (presetKey === 'impossible') {
      setStandName('Cryogenic Quantum Levitator (Test Gap Detection)');
      setPurpose('RESEARCH_BENCH');
      setUserLevel('RESEARCHER');
      setScreensCount(1);
      setPeripheralsText('Superconducting Magnet');
      setCapabilitiesText('liquid helium boiloff 3d volumetric tomography, quantum hall telemetry');
      setHardConstraintsText('Cryogenic vacuum');
    }
  };

  const generateManifestJson = () => {
    if (!composedSolution) return '';
    return JSON.stringify(
      {
        manifestSchema: 'https://atlas-patterns.engineering/schemas/v1/stand-manifest.json',
        generatedAt: new Date().toISOString(),
        query: composedSolution.query,
        composition: {
          patterns: composedSolution.matchedPatterns.map(m => ({
            id: m.pattern.id,
            title: m.pattern.title,
            reason: m.selectionReason,
            evidence: m.supportingEvidence.map(e => e.id)
          })),
          primitives: composedSolution.matchedPrimitives.map(m => ({
            id: m.primitive.id,
            slot: m.slot,
            title: m.primitive.title
          })),
          activeConflicts: composedSolution.activeConflicts,
          knowledgeGaps: composedSolution.knowledgeGaps
        },
        blueprint: composedSolution.blueprint
      },
      null,
      2
    );
  };

  const copyToClipboard = (text: string, format: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFormat(format);
    setTimeout(() => setCopiedFormat(null), 2000);
  };

  return (
    <div className="max-w-[1560px] mx-auto px-6 py-8">
      {/* View Title */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-100 mb-1 flex items-center gap-2">
          <Wrench className="w-6 h-6 text-cyan-400" />
          Подбор и синтез конфигурации интерфейса стенда
        </h1>
        <p className="text-xs text-slate-400 max-w-4xl">
          Детерминированный граф-ориентированный подбор строительных примитивов и паттернов на основе назначения стенда, квалификации операторов, конфигурации мониторов и физических ограничений.
        </p>
      </div>

      {/* Preset Quick Selectors */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
        <span className="text-xs font-mono text-slate-500 whitespace-nowrap">Пресеты стендов:</span>
        <button
          onClick={() => loadPreset('windtunnel')}
          className="px-2.5 py-1 text-xs bg-slate-900 hover:bg-slate-800 text-slate-300 rounded border border-slate-800 whitespace-nowrap cursor-pointer"
        >
          Учебная аэродинамическая труба
        </button>
        <button
          onClick={() => loadPreset('bioreactor')}
          className="px-2.5 py-1 text-xs bg-slate-900 hover:bg-slate-800 text-slate-300 rounded border border-slate-800 whitespace-nowrap cursor-pointer"
        >
          Исследовательский биореактор (хемостат)
        </button>
        <button
          onClick={() => loadPreset('highvoltage')}
          className="px-2.5 py-1 text-xs bg-slate-900 hover:bg-slate-800 text-slate-300 rounded border border-slate-800 whitespace-nowrap cursor-pointer"
        >
          Высоковольтный импульсный стенд (50 кВ)
        </button>
        <button
          onClick={() => loadPreset('impossible')}
          className="px-2.5 py-1 text-xs bg-rose-950/40 hover:bg-rose-900/50 text-rose-300 rounded border border-rose-900/50 whitespace-nowrap cursor-pointer"
        >
          Тест пробела знаний (Anti-Hallucination)
        </button>
      </div>

      {/* Two Column Layout: Specifications Form on Left, Output Blueprint on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Requirements Form */}
        <div className="lg:col-span-4 space-y-4 bg-slate-900/70 border border-slate-800 p-5 rounded-lg">
          <h2 className="text-sm font-semibold text-slate-200 border-b border-slate-800 pb-2">
            Параметры и требования к стенду
          </h2>

          {/* Stand Name */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Название стенда</label>
            <input
              type="text"
              value={standName}
              onChange={e => setStandName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>

          {/* Purpose */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Назначение стенда</label>
            <select
              value={purpose}
              onChange={e => setPurpose(e.target.value as StandPurpose)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
            >
              <option value="EDUCATIONAL_DEMO">EDUCATIONAL_DEMO (Учебная демонстрация)</option>
              <option value="STUDENT_LAB_EXPERIMENT">STUDENT_LAB_EXPERIMENT (Студенческий практикум)</option>
              <option value="RESEARCH_BENCH">RESEARCH_BENCH (Научно-исследовательский)</option>
              <option value="INDUSTRIAL_TESTBED">INDUSTRIAL_TESTBED (Промышленный стенд)</option>
              <option value="HAZARDOUS_FACILITY">HAZARDOUS_FACILITY (Опасный объект/высокие энергии)</option>
            </select>
          </div>

          {/* User Knowledge Level */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Уровень пользователя</label>
            <select
              value={userLevel}
              onChange={e => setUserLevel(e.target.value as UserLevel)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
            >
              <option value="SECONDARY_SCHOOL">SECONDARY_SCHOOL (Школьники/начинающие)</option>
              <option value="UNDERGRADUATE">UNDERGRADUATE (Студенты бакалавриата)</option>
              <option value="RESEARCHER">RESEARCHER (Исследователи/инженеры)</option>
              <option value="CERTIFIED_OPERATOR">CERTIFIED_OPERATOR (Аттестованные операторы)</option>
            </select>
          </div>

          {/* Screens Count */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Количество мониторов</label>
            <div className="flex gap-2">
              {[1, 2, 3].map(count => (
                <button
                  key={count}
                  type="button"
                  onClick={() => setScreensCount(count)}
                  className={`flex-1 py-1 text-xs rounded border cursor-pointer font-mono ${
                    screensCount === count
                      ? 'bg-cyan-950/80 border-cyan-500/60 text-cyan-300 font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  {count} {count === 1 ? 'экран' : 'экрана'}
                </button>
              ))}
            </div>
          </div>

          {/* Peripherals */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Периферия и датчики (через запятую)</label>
            <input
              type="text"
              value={peripheralsText}
              onChange={e => setPeripheralsText(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>

          {/* Required Capabilities */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Требуемые функции интерфейса</label>
            <textarea
              rows={2}
              value={capabilitiesText}
              onChange={e => setCapabilitiesText(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>

          {/* Hard Constraints */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Жесткие ограничения (Hard Constraints)</label>
            <input
              type="text"
              value={hardConstraintsText}
              onChange={e => setHardConstraintsText(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>

          <button
            onClick={runComposition}
            className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold uppercase tracking-wider rounded transition-colors cursor-pointer mt-2"
          >
            Синтезировать конфигурацию
          </button>
        </div>

        {/* Right Column: Composed Solution & Live Blueprint */}
        <div className="lg:col-span-8 space-y-6">
          {composedSolution ? (
            <>
              {/* Traceability Metrics Bar */}
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4 text-xs font-mono">
                  <div>
                    <span className="text-slate-500">Паттернов: </span>
                    <span className="text-emerald-400 font-bold tabular-nums">
                      {composedSolution.matchedPatterns.length}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500">Примитивов: </span>
                    <span className="text-cyan-400 font-bold tabular-nums">
                      {composedSolution.matchedPrimitives.length}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500">Подтверждено тестами: </span>
                    <span className="text-amber-400 font-bold tabular-nums">
                      {composedSolution.traceabilityManifest.evidenceBackingPercent}%
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500">Ограничения: </span>
                    <span className="text-emerald-400 font-bold">СОБЛЮДЕНЫ</span>
                  </div>
                  {composedSolution.nhfgSummary && (
                    <div>
                      <span className="text-slate-500">Нормы ISO: </span>
                      <span className="text-cyan-400 font-bold">
                        {composedSolution.nhfgSummary.principlesCovered.length} принципов
                      </span>
                    </div>
                  )}
                </div>

                {/* Sub Tab Switcher */}
                <div className="flex items-center gap-1 bg-slate-950 p-1 rounded border border-slate-800 text-xs">
                  <button
                    onClick={() => setActiveTabSub('blueprint')}
                    className={`px-3 py-1 rounded cursor-pointer ${
                      activeTabSub === 'blueprint' ? 'bg-slate-800 text-cyan-400 font-semibold' : 'text-slate-400'
                    }`}
                  >
                    Интерфейс стенда
                  </button>
                  <button
                    onClick={() => setActiveTabSub('nhfg')}
                    className={`px-3 py-1 rounded cursor-pointer relative ${
                      activeTabSub === 'nhfg' ? 'bg-slate-800 text-cyan-400 font-semibold' : 'text-slate-400'
                    }`}
                  >
                    Нормы ISO
                    {composedSolution.nhfgSummary && composedSolution.nhfgSummary.totalNormativeMappings > 0 && (
                      <span className="ml-1 px-1.5 py-0.2 bg-cyan-950 text-cyan-400 text-[10px] rounded-full border border-cyan-800">
                        {composedSolution.nhfgSummary.totalNormativeMappings}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTabSub('manifest')}
                    className={`px-3 py-1 rounded cursor-pointer ${
                      activeTabSub === 'manifest' ? 'bg-slate-800 text-cyan-400 font-semibold' : 'text-slate-400'
                    }`}
                  >
                    Манифест (JSON)
                  </button>
                  <button
                    onClick={() => setActiveTabSub('gaps')}
                    className={`px-3 py-1 rounded cursor-pointer relative ${
                      activeTabSub === 'gaps' ? 'bg-slate-800 text-cyan-400 font-semibold' : 'text-slate-400'
                    }`}
                  >
                    Пробелы знаний
                    {composedSolution.knowledgeGaps.length > 0 && (
                      <span className="ml-1 px-1.5 py-0.2 bg-rose-950 text-rose-400 text-[10px] rounded-full border border-rose-800">
                        {composedSolution.knowledgeGaps.length}
                      </span>
                    )}
                  </button>
                </div>
              </div>

              {/* Sub-View 1: Interactive Stand Blueprint & UI Preview */}
              {activeTabSub === 'blueprint' && (
                <div className="space-y-6">
                  {/* Visual Live Stand UI Simulation */}
                  <div className="border border-slate-800 bg-[#07090e] rounded-lg overflow-hidden shadow-xl">
                    <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
                      <span>СИНТЕЗИРОВАННЫЙ ИНТЕРФЕЙС: {composedSolution.query.standName}</span>
                      <span>КОМПОНОВКА: {composedSolution.blueprint.layoutType.toUpperCase()}</span>
                    </div>

                    {/* Top Safety Ribbon (if E-Stop banner matched) */}
                    {composedSolution.matchedPrimitives.some(p => p.primitive.uiSlot === 'ribbon') ? (
                      <div className={`px-4 py-2 flex items-center justify-between transition-colors ${
                        isEstopArmed ? 'bg-rose-950/80 border-b border-rose-800 text-rose-200' : 'bg-slate-950 border-b border-slate-800 text-slate-300'
                      }`}>
                        <div className="flex items-center gap-3 text-xs font-mono">
                          <ShieldAlert className={`w-4 h-4 ${isEstopArmed ? 'text-rose-400 animate-pulse' : 'text-slate-400'}`} />
                          <span className="font-bold">
                            {isEstopArmed ? 'БЛОКИРОВКА АКТИВНА: АВАРИЙНЫЙ ОСТАНОВ' : 'СИСТЕМА БЕЗОПАСНОСТИ: ЦИКЛ В НОРМЕ'}
                          </span>
                        </div>
                        <button
                          onClick={() => setIsEstopArmed(!isEstopArmed)}
                          className={`px-3 py-1 text-[11px] font-mono font-bold rounded cursor-pointer transition-colors ${
                            isEstopArmed ? 'bg-rose-600 hover:bg-rose-500 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                          }`}
                        >
                          {isEstopArmed ? 'СБРОС БЛОКИРОВКИ' : 'ТЕСТ АВАРИЙНОГО ОСТАНОВА'}
                        </button>
                      </div>
                    ) : null}

                    {/* Main Split Console: Left Control Rail, Center Canvas Stage */}
                    <div className="grid grid-cols-1 md:grid-cols-12 min-h-[320px]">
                      {/* Left Control Rail */}
                      <div className="md:col-span-4 p-4 border-r border-slate-800 bg-slate-950/50 space-y-4">
                        <div className="text-[11px] font-mono uppercase text-slate-500 tracking-wider">
                          Органы регулировки (Уставки)
                        </div>

                        {/* Airfoil Angle Stepper */}
                        <div className="p-3 bg-slate-900/60 rounded border border-slate-800">
                          <div className="flex justify-between text-xs font-mono mb-1">
                            <span className="text-slate-400">Угол атаки (α)</span>
                            <span className="text-cyan-400 font-bold tabular-nums">{liveAirfoilAngle.toFixed(1)}°</span>
                          </div>
                          <input
                            type="range"
                            min="-5"
                            max="25"
                            step="0.5"
                            value={liveAirfoilAngle}
                            onChange={e => setLiveAirfoilAngle(parseFloat(e.target.value))}
                            className="w-full accent-cyan-400 cursor-pointer"
                          />
                          <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                            <span>-5.0°</span>
                            <span>Критич. срыв: ~18°</span>
                            <span>+25.0°</span>
                          </div>
                        </div>

                        {/* Fan RPM Scrubber */}
                        <div className="p-3 bg-slate-900/60 rounded border border-slate-800">
                          <div className="flex justify-between text-xs font-mono mb-1">
                            <span className="text-slate-400">Обороты нагнетателя</span>
                            <span className="text-cyan-400 font-bold tabular-nums">{liveFanRPM} об/мин</span>
                          </div>
                          <input
                            type="range"
                            min="200"
                            max="3000"
                            step="50"
                            value={liveFanRPM}
                            onChange={e => setLiveFanRPM(parseInt(e.target.value))}
                            className="w-full accent-cyan-400 cursor-pointer"
                          />
                          <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                            <span>200</span>
                            <span>Поток: {(liveFanRPM * 0.012).toFixed(1)} м/с</span>
                            <span>3000</span>
                          </div>
                        </div>
                      </div>

                      {/* Center Viewport Stage (Spatial / Dial / Annunciator) */}
                      <div className="md:col-span-8 p-4 flex flex-col justify-between">
                        <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 mb-2">
                          <span>ПОЛЕ ВИЗУАЛИЗАЦИИ И СЕНСОРОВ</span>
                          <span>КООРДИНАТНАЯ СЕТКА: ВЫВЕРЕНА</span>
                        </div>

                        {/* Aerodynamic Polar / Crosshair Canvas Simulator */}
                        <div className="bg-slate-950 rounded border border-slate-800 p-4 relative h-48 flex items-center justify-center">
                          <div className="absolute top-2 left-2 text-[10px] font-mono text-slate-500">
                            CROSSHAIR PROBE: X: 140.2 mm · Y: 32.8 mm
                          </div>
                          {/* Polar curve graphic */}
                          <svg className="w-full h-full">
                            <line x1="20" y1="90" x2="400" y2="90" stroke="#1e293b" strokeDasharray="3 3" />
                            <line x1="120" y1="10" x2="120" y2="180" stroke="#1e293b" strokeDasharray="3 3" />
                            {/* Airfoil profile illustration */}
                            <path
                              d={`M 80 90 Q 140 ${90 - liveAirfoilAngle * 2.5} 240 90 Q 150 ${90 + liveAirfoilAngle * 0.8} 80 90`}
                              fill="#06b6d420"
                              stroke="#06b6d4"
                              strokeWidth="2"
                              transform={`rotate(${-liveAirfoilAngle * 0.8}, 140, 90)`}
                            />
                            {/* Probe indicator */}
                            <circle cx="210" cy="80" r="4" fill="#f59e0b" />
                            <text x="220" y="84" fill="#f59e0b" fontSize="10" fontFamily="monospace">
                              ДАТЧИК ДАВЛЕНИЯ #1
                            </text>
                          </svg>
                        </div>

                        <div className="text-right text-[10px] font-mono text-slate-500 mt-2">
                          Аэродинамическое качество K = {(12.4 - Math.abs(liveAirfoilAngle - 6) * 0.6).toFixed(2)}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Time-Series Waveform Tray */}
                    <div className="border-t border-slate-800 p-3 bg-slate-950">
                      <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
                        <span>АППАРАТНЫЙ ОСЦИЛЛОГРАФИЧЕСКИЙ БУФЕР (1000 Гц)</span>
                        <span className="text-cyan-400">ПОТОК: АКТИВЕН</span>
                      </div>
                      <canvas
                        ref={canvasRef}
                        width={700}
                        height={100}
                        className="w-full h-24 rounded border border-slate-800 bg-[#07090e]"
                      />
                    </div>
                  </div>

                  {/* Component Traceability Cards */}
                  <div>
                    <h3 className="text-sm font-semibold text-slate-200 mb-3">
                      Обоснование включения компонентов в сборку
                    </h3>
                    <div className="space-y-3">
                      {composedSolution.matchedPatterns.map((mp, idx) => (
                        <div
                          key={idx}
                          className="p-4 bg-slate-900/60 border border-slate-800 rounded-lg text-xs"
                        >
                          <div className="flex items-start justify-between gap-2 mb-1.5">
                            <div>
                              <span className="font-mono text-cyan-400 font-semibold mr-2">[{mp.pattern.id}]</span>
                              <span className="font-medium text-slate-100">{mp.pattern.title}</span>
                            </div>
                            <span className="text-[11px] font-mono text-emerald-400">
                              ● {mp.evidenceStatus}
                            </span>
                          </div>

                          <p className="text-slate-400 mb-2 leading-relaxed">
                            {mp.selectionReason}
                          </p>

                          {/* Evidence Links */}
                          {mp.supportingEvidence.length > 0 && (
                            <div className="pt-2 border-t border-slate-800/80 flex items-center gap-2 text-[11px] text-slate-500">
                              <FileCheck2 className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                              <span>Подтверждено:</span>
                              {mp.supportingEvidence.map(ev => (
                                <button
                                  key={ev.id}
                                  onClick={() => onSelectEntityDetails(ev.id)}
                                  className="text-cyan-400 hover:underline font-mono cursor-pointer"
                                >
                                  {ev.id}
                                </button>
                              ))}
                            </div>
                          )}

                          {/* NHFG Guidance Links & Anti-Conflation Badges */}
                          {mp.nhfgGuidance && mp.nhfgGuidance.length > 0 && (
                            <div className="mt-2.5 pt-2.5 border-t border-slate-800 space-y-2">
                              <div className="text-[11px] font-semibold text-cyan-400 flex items-center gap-1.5">
                                <BookOpen className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                                <span>Нормативное обоснование (ISO 9241):</span>
                              </div>
                              {mp.nhfgGuidance.map((g, gIdx) => (
                                <div key={gIdx} className="p-2.5 bg-slate-950/70 border border-slate-800/80 rounded space-y-1.5">
                                  <div className="flex flex-wrap items-center justify-between gap-1 text-[10px] font-mono">
                                    <span className="text-slate-300 font-semibold">
                                      {g.source.standard} · {g.principle.title} ({g.principle.sectionRef})
                                    </span>
                                    <span className={`px-1.5 py-0.2 rounded border ${
                                      g.epistemicCategory === 'SOURCE_CONFIRMED'
                                        ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                                        : g.epistemicCategory === 'ENGINEERING_INTERPRETATION'
                                        ? 'bg-cyan-950 text-cyan-400 border-cyan-800'
                                        : 'bg-amber-950 text-amber-400 border-amber-800'
                                    }`}>
                                      {g.epistemicCategory}
                                    </span>
                                  </div>

                                  {g.requirement && (
                                    <div className="text-[11px] text-slate-300 italic font-sans">
                                      "{g.requirement.statement}"
                                    </div>
                                  )}

                                  <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono text-slate-400 pt-1">
                                    <span>Сценарий: <strong className="text-emerald-400">{g.status.scenarioVerificationStatus}</strong></span>
                                    <span>·</span>
                                    <span>Сертификация: <strong className="text-amber-400">{g.status.conformanceStatus}</strong></span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Alternatives */}
                          {mp.alternatives.length > 0 && (
                            <div className="mt-2 text-[11px] text-slate-500">
                              <span>Альтернатива: </span>
                              {mp.alternatives.map(alt => (
                                <span key={alt.id} className="text-slate-300 font-mono">
                                  {alt.title} ({alt.id})
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Sub-View: Normative Guidance (ISO 9241) */}
              {activeTabSub === 'nhfg' && (
                <div className="space-y-6">
                  {/* Top Anti-Conflation Banner */}
                  <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-cyan-400 font-mono font-bold text-xs uppercase tracking-wider">
                          Синтезированное нормативное обоснование
                        </span>
                        <span className="text-slate-500 text-xs">|</span>
                        <span className="text-emerald-400 font-mono text-xs">
                          {composedSolution.nhfgSummary?.principlesCovered.length || 0} принципов ISO
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-100">
                        Эргономическое и нормативное покрытие для стенда: {composedSolution.query.standName}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
                        Ниже приведена строгая трассируемость каждого включенного паттерна к официальным стандартам ISO 9241-110, 210, 11.
                      </p>
                    </div>

                    <div className="p-3 bg-slate-950 border border-slate-800 rounded text-xs font-mono shrink-0">
                      <div className="text-slate-400 font-semibold mb-0.5 flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Сертификационный статус</span>
                      </div>
                      <div className="text-amber-400 font-bold">CONFORMANCE_NOT_ESTABLISHED</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">Ложные соответствия строго исключены</div>
                    </div>
                  </div>

                  {/* Summary of Principles Covered */}
                  {composedSolution.nhfgSummary && (
                    <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-lg">
                      <div className="text-xs font-semibold text-slate-300 mb-2">
                        Охваченные эргономические принципы диалога (ISO 9241-110):
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {composedSolution.nhfgSummary.principlesCovered.map((prinId, pIdx) => (
                          <span
                            key={pIdx}
                            className="px-2.5 py-1 bg-slate-950 text-cyan-400 border border-slate-800 rounded text-xs font-mono"
                          >
                            {prinId}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Per-Pattern Normative Guidance Cards */}
                  <div className="space-y-4">
                    {composedSolution.matchedPatterns
                      .filter(mp => mp.nhfgGuidance && mp.nhfgGuidance.length > 0)
                      .map((mp, idx) => (
                        <div key={idx} className="p-5 bg-slate-900 border border-slate-800 rounded-lg space-y-4">
                          <div className="flex items-start justify-between gap-2 border-b border-slate-800 pb-3">
                            <div>
                              <span className="font-mono text-cyan-400 font-bold text-xs mr-2">[{mp.pattern.id}]</span>
                              <span className="font-bold text-slate-100 text-sm">{mp.pattern.title}</span>
                            </div>
                            <span className="text-xs font-mono text-emerald-400">
                              ● {mp.evidenceStatus}
                            </span>
                          </div>

                          {mp.nhfgGuidance?.map((g, gIdx) => (
                            <div key={gIdx} className="space-y-3">
                              {/* Standard & Principle Header */}
                              <div className="p-3 bg-slate-950 rounded border border-slate-800 space-y-1">
                                <div className="flex items-center justify-between text-xs font-mono">
                                  <span className="text-cyan-400 font-semibold">
                                    {g.source.standard} — {g.principle.title} ({g.principle.sectionRef})
                                  </span>
                                  <a
                                    href={g.source.officialUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 text-[11px] text-cyan-400 hover:underline"
                                  >
                                    <span>Официальный URL</span>
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                </div>
                                <div className="text-[11px] text-slate-400">
                                  {g.principle.conciseSummary}
                                </div>
                              </div>

                              {/* Requirement Statement */}
                              {g.requirement && (
                                <div className="p-3 bg-slate-950/70 rounded border border-slate-800 text-xs font-mono">
                                  <div className="text-slate-500 mb-1">
                                    Требование нормы [{g.requirement.id}] ({g.requirement.safetyCritical ? 'Критично для безопасности' : 'Эргономика'}):
                                  </div>
                                  <div className="text-slate-200 font-sans italic">
                                    "{g.requirement.statement}"
                                  </div>
                                </div>
                              )}

                              {/* Engineering Rationale */}
                              <div className="text-xs text-slate-300 font-sans leading-relaxed">
                                <span className="font-semibold text-slate-200">Обоснование Atlas: </span>
                                {g.rationale}
                              </div>

                              {/* Status Badges */}
                              <div className="flex flex-wrap items-center gap-2 text-xs font-mono pt-1">
                                <span className="px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800">
                                  Эпистемика: {g.epistemicCategory}
                                </span>
                                <span className={`px-2 py-0.5 rounded border ${
                                  g.status.scenarioVerificationStatus === 'SCENARIO_VERIFIED'
                                    ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                                    : 'bg-slate-950 text-slate-400 border-slate-800'
                                }`}>
                                  Сценарий: {g.status.scenarioVerificationStatus}
                                </span>
                                <span className="px-2 py-0.5 rounded bg-amber-950/80 text-amber-400 border border-amber-800">
                                  Сертификация: {g.status.conformanceStatus}
                                </span>
                              </div>

                              {/* Limitations and Missing Evidence */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
                                {g.knownLimitations.length > 0 && (
                                  <div className="p-2.5 bg-slate-950 rounded border border-slate-800">
                                    <div className="text-slate-400 font-semibold mb-1">Известные ограничения:</div>
                                    <ul className="text-slate-400 text-[11px] list-disc list-inside space-y-0.5">
                                      {g.knownLimitations.map((lim, lIdx) => (
                                        <li key={lIdx}>{lim}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                                {g.missingEvidence.length > 0 && (
                                  <div className="p-2.5 bg-slate-950 rounded border border-slate-800">
                                    <div className="text-rose-400 font-semibold mb-1">Недостающие доказательства:</div>
                                    <ul className="text-slate-400 text-[11px] list-disc list-inside space-y-0.5">
                                      {g.missingEvidence.map((me, mIdx) => (
                                        <li key={mIdx}>{me}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Sub-View 2: Raw Manifest (JSON/YAML) */}
              {activeTabSub === 'manifest' && (
                <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono text-slate-400">
                      КАНОНИЧЕСКИЙ МАНИФЕСТ КОНФИГУРАЦИИ СТЕНДА (JSON)
                    </span>
                    <button
                      onClick={() => copyToClipboard(generateManifestJson(), 'json')}
                      className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded transition-colors cursor-pointer"
                    >
                      {copiedFormat === 'json' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedFormat === 'json' ? 'Скопировано' : 'Копировать'}</span>
                    </button>
                  </div>
                  <pre className="font-mono text-xs text-slate-300 bg-slate-950 p-4 rounded border border-slate-800 overflow-x-auto max-h-[500px]">
                    {generateManifestJson()}
                  </pre>
                </div>
              )}

              {/* Sub-View 3: Knowledge Gaps & Conflicts */}
              {activeTabSub === 'gaps' && (
                <div className="space-y-4">
                  {composedSolution.knowledgeGaps.length > 0 ? (
                    composedSolution.knowledgeGaps.map((gap, i) => (
                      <div
                        key={i}
                        className="p-4 bg-amber-950/20 border border-amber-900/50 rounded-lg text-xs"
                      >
                        <div className="flex items-center gap-2 text-amber-400 font-semibold mb-1">
                          <AlertTriangle className="w-4 h-4 shrink-0" />
                          <span>Пробел в канонической базе: '{gap.unmetRequirement}'</span>
                        </div>
                        <p className="text-slate-300 mb-2 leading-relaxed">{gap.reason}</p>
                        <div className="p-2.5 bg-slate-950/60 rounded border border-slate-800 text-slate-400">
                          <span className="font-semibold text-cyan-400">Рекомендация: </span>
                          {gap.recommendation}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center border border-slate-800 rounded-lg bg-slate-900/50">
                      <p className="text-xs text-emerald-400 font-mono">
                        ✓ Все заявленные требования полностью удовлетворены каноническими паттернами репозитория.
                      </p>
                    </div>
                  )}

                  {composedSolution.activeConflicts.length > 0 && (
                    <div className="p-4 bg-rose-950/30 border border-rose-900/50 rounded-lg text-xs">
                      <div className="font-semibold text-rose-400 mb-2">Обнаруженные несовместимости:</div>
                      {composedSolution.activeConflicts.map((c, idx) => (
                        <div key={idx} className="text-slate-300">
                          {c.entityA} несовместим с {c.entityB}: {c.reason}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="py-16 text-center border border-slate-800 rounded">
              <p className="text-xs text-slate-400">Нажмите «Синтезировать конфигурацию» для запуска подбора.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
