import React, { useState, useEffect } from 'react';
import { AcceptanceReport, AuditFinding } from '../types';
import { AuditEngine } from '../auditEngine';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RotateCcw,
  Download,
  Copy,
  Check,
  ShieldCheck,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

export const AuditView: React.FC = () => {
  const [report, setReport] = useState<AcceptanceReport | null>(null);
  const [expandedIndices, setExpandedIndices] = useState<Record<number, boolean>>({});
  const [copied, setCopied] = useState(false);

  const runAudit = () => {
    const engine = new AuditEngine();
    const result = engine.runFullAudit();
    setReport(result);
  };

  useEffect(() => {
    runAudit();
  }, []);

  const toggleExpand = (idx: number) => {
    setExpandedIndices(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const copyReportJson = () => {
    if (!report) return;
    navigator.clipboard.writeText(JSON.stringify(report, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!report) return null;

  return (
    <div className="max-w-[1560px] mx-auto px-6 py-8">
      {/* Title */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100 mb-1 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            Независимый технический аудит репозитория (Prompt 5 Acceptance Audit)
          </h1>
          <p className="text-xs text-slate-400">
            Автоматическая верификация 12 критериев архитектурного контракта, целостности графа, границ предметной области и честной регистрации пробелов.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={copyReportJson}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs rounded border border-slate-800 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Скопировано' : 'Экспорт отчета (JSON)'}</span>
          </button>
          <button
            onClick={runAudit}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Перезапустить аудит</span>
          </button>
        </div>
      </div>

      {/* Formal Acceptance Verdict Banner */}
      <div
        className={`p-6 rounded-lg border mb-8 ${
          report.overallVerdict === 'ACCEPTED'
            ? 'bg-emerald-950/30 border-emerald-800 text-emerald-300'
            : report.overallVerdict === 'ACCEPTED WITH GAPS'
            ? 'bg-amber-950/30 border-amber-800 text-amber-300'
            : 'bg-rose-950/30 border-rose-800 text-rose-300'
        }`}
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {report.overallVerdict === 'ACCEPTED' ? (
              <CheckCircle2 className="w-8 h-8 text-emerald-400 shrink-0" />
            ) : report.overallVerdict === 'ACCEPTED WITH GAPS' ? (
              <AlertTriangle className="w-8 h-8 text-amber-400 shrink-0" />
            ) : (
              <XCircle className="w-8 h-8 text-rose-400 shrink-0" />
            )}
            <div>
              <div className="text-xs font-mono uppercase tracking-wider opacity-80">
                РЕШЕНИЕ ПРИЕМОЧНОГО АУДИТА (FORMAL VERDICT):
              </div>
              <div className="text-2xl font-bold tracking-tight">
                {report.overallVerdict}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 font-mono text-xs">
            <div>
              <span className="opacity-75 block text-[11px]">КРИТЕРИЕВ ПРОВЕРЕНО</span>
              <span className="text-lg font-bold">{report.totalCriteria}</span>
            </div>
            <div>
              <span className="opacity-75 block text-[11px]">УСПЕШНО ПРОЙДЕНО</span>
              <span className="text-lg font-bold text-emerald-400">{report.passedCriteria}</span>
            </div>
            <div>
              <span className="opacity-75 block text-[11px]">КРИТИЧЕСКИХ ОШИБОК</span>
              <span className="text-lg font-bold text-slate-100">
                {report.findings.filter(f => f.severity === 'CRITICAL').length}
              </span>
            </div>
          </div>
        </div>

        <p className="mt-4 pt-3 border-t border-emerald-800/40 text-xs text-slate-300 leading-relaxed">
          {report.summaryNote}
        </p>
      </div>

      {/* Findings List (12 Criteria) */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-slate-200 mb-2">
          Результаты проверки по 12 критериям технической приёмки
        </h2>

        {report.findings.map((finding, idx) => {
          const isExpanded = !!expandedIndices[idx];
          return (
            <div
              key={idx}
              className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden transition-colors"
            >
              {/* Finding Header */}
              <div
                onClick={() => toggleExpand(idx)}
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-800/50"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      finding.severity === 'PASS'
                        ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                        : finding.severity === 'WARNING'
                        ? 'bg-amber-950/80 text-amber-400 border border-amber-800'
                        : 'bg-rose-950/80 text-rose-400 border border-rose-800'
                    }`}
                  >
                    {finding.severity}
                  </span>
                  <div>
                    <span className="text-xs font-mono text-slate-500 mr-2">
                      №{finding.criterionNumber.toString().padStart(2, '0')}.
                    </span>
                    <span className="text-sm font-semibold text-slate-100">
                      {finding.criterionTitle}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-slate-500 hidden sm:inline">
                    {finding.affectedComponent}
                  </span>
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </div>

              {/* Finding Details (Expanded) */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-2 border-t border-slate-800/80 bg-slate-950/40 text-xs space-y-3">
                  <div>
                    <span className="text-slate-500 block mb-0.5 font-medium">Ожидаемое поведение:</span>
                    <p className="text-slate-300">{finding.expectedBehavior}</p>
                  </div>
                  <div>
                    <span className="text-slate-500 block mb-0.5 font-medium">Фактическое наблюдаемое поведение:</span>
                    <p className="text-slate-200">{finding.observedBehavior}</p>
                  </div>
                  <div className="p-2.5 bg-slate-900 rounded border border-slate-800 font-mono text-[11px]">
                    <span className="text-cyan-400 block mb-1 font-semibold">Воспроизводимое подтверждение:</span>
                    <span className="text-slate-400">{finding.reproducibleEvidence}</span>
                  </div>
                  {finding.recommendedCorrection && (
                    <div className="p-2.5 bg-amber-950/20 rounded border border-amber-900/50 text-amber-300">
                      <span className="font-semibold block mb-0.5">Рекомендуемое исправление:</span>
                      {finding.recommendedCorrection}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
