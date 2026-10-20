import React from 'react';
import { Layers, Network, Wrench, PlusCircle, CheckCircle2, BookOpen, ShieldCheck } from 'lucide-react';

export type ActiveTab = 'repository' | 'graph' | 'composer' | 'nhfg' | 'ingestion' | 'audit' | 'contract';

interface HeaderProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onQuickCompose: () => void;
  totalEntities: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  onQuickCompose,
  totalEntities
}) => {
  return (
    <header className="border-b border-slate-800 bg-[#0c0f17] sticky top-0 z-40">
      <div className="max-w-[1560px] mx-auto px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Zone (Single text element wordmark) */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded bg-cyan-950/60 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-mono font-bold text-sm">
            AP
          </div>
          <button
            onClick={() => onSelectTab('repository')}
            className="text-left group cursor-pointer focus:outline-none"
          >
            <span className="text-base font-semibold tracking-tight text-slate-100 group-hover:text-white transition-colors whitespace-nowrap block">
              Atlas инженерных паттернов
            </span>
          </button>
        </div>

        {/* Zone 2: Navigation Links (Clean text links with subtle active states) */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-400">
          <button
            onClick={() => onSelectTab('repository')}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer py-1 ${
              activeTab === 'repository'
                ? 'text-cyan-400 border-b-2 border-cyan-400 font-semibold'
                : 'hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Репозиторий</span>
            <span className="text-xs font-mono text-slate-500 ml-0.5 tabular-nums">({totalEntities})</span>
          </button>

          <button
            onClick={() => onSelectTab('graph')}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer py-1 ${
              activeTab === 'graph'
                ? 'text-cyan-400 border-b-2 border-cyan-400 font-semibold'
                : 'hover:text-slate-200'
            }`}
          >
            <Network className="w-4 h-4" />
            <span>Граф связей</span>
          </button>

          <button
            onClick={() => onSelectTab('composer')}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer py-1 ${
              activeTab === 'composer'
                ? 'text-cyan-400 border-b-2 border-cyan-400 font-semibold'
                : 'hover:text-slate-200'
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>Подбор решений</span>
          </button>

          <button
            onClick={() => onSelectTab('nhfg')}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer py-1 ${
              activeTab === 'nhfg'
                ? 'text-cyan-400 border-b-2 border-cyan-400 font-semibold'
                : 'hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Нормы ISO (NHFG)</span>
          </button>

          <button
            onClick={() => onSelectTab('ingestion')}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer py-1 ${
              activeTab === 'ingestion'
                ? 'text-cyan-400 border-b-2 border-cyan-400 font-semibold'
                : 'hover:text-slate-200'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>Приём паттернов</span>
          </button>

          <button
            onClick={() => onSelectTab('audit')}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer py-1 ${
              activeTab === 'audit'
                ? 'text-cyan-400 border-b-2 border-cyan-400 font-semibold'
                : 'hover:text-slate-200'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Аудит приёмки</span>
          </button>

          <button
            onClick={() => onSelectTab('contract')}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer py-1 ${
              activeTab === 'contract'
                ? 'text-cyan-400 border-b-2 border-cyan-400 font-semibold'
                : 'hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Архитектурный контракт</span>
          </button>
        </nav>

        {/* Zone 3: Single Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onQuickCompose}
            className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-900 bg-cyan-400 hover:bg-cyan-300 rounded transition-colors whitespace-nowrap cursor-pointer shadow-sm"
          >
            Собрать конфигурацию
          </button>
        </div>
      </div>

      {/* Mobile nav bar fallback */}
      <div className="lg:hidden flex items-center justify-between px-4 py-2 border-t border-slate-800/80 overflow-x-auto text-xs gap-3">
        {(['repository', 'graph', 'composer', 'ingestion', 'audit', 'contract'] as ActiveTab[]).map(tab => (
          <button
            key={tab}
            onClick={() => onSelectTab(tab)}
            className={`whitespace-nowrap px-2 py-1 rounded capitalize ${
              activeTab === tab ? 'bg-slate-800 text-cyan-400 font-semibold' : 'text-slate-400'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </header>
  );
};
